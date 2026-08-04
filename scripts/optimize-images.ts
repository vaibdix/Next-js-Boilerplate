import { execSync } from 'node:child_process';
import { existsSync, statSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, extname, join } from 'node:path';
import sharp from 'sharp/lib/index.js';

const MAX_DIMENSION = 2560;
const AVIF_QUALITY = 70;
const AVIF_EFFORT = 4;
const SKIP_IF_SMALLER_THAN = 500_000;
const CONCURRENCY = 4;
const BYTES_PER_KB = 1024;
const BYTES_PER_MB = 1024 * 1024;
const PERCENT_MAX = 100;

interface SharpInstance {
  rotate: () => SharpInstance;
  resize: (
    width: number,
    height: number,
    options: {
      fit: 'inside';
      withoutEnlargement: boolean;
    }
  ) => SharpInstance;
  avif: (options: {
    quality: number;
    effort: number;
    chromaSubsampling: '4:2:0';
  }) => SharpInstance;
  toFile: (output: string) => Promise<unknown>;
}

type SharpLoader = (
  input: string,
  options: {
    failOn: 'none';
  }
) => SharpInstance;

const isSharpLoader = (value: unknown): value is SharpLoader => {
  return typeof value === 'function';
};

if (!isSharpLoader(sharp)) {
  throw new TypeError('sharp loader is unavailable');
}

const createSharp = sharp;

const SUPPORTED_INPUTS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.tiff',
  '.tif',
  '.avif',
  '.heic',
  '.heif',
  '.gif',
]);

interface OptimizedResult {
  file: string;
  status: 'optimized';
  from: number;
  to: number;
  ms: number;
}

interface SkippedResult {
  file: string;
  status: 'skipped';
  reason: string;
}

interface FailedResult {
  file: string;
  status: 'failed';
  reason: string;
}

type Result = OptimizedResult | SkippedResult | FailedResult;

/**
 * Formats a byte count as a human-readable string.
 * @param n - The number of bytes to format.
 * @returns A formatted string like "1.2MB" or "345KB" or "678B".
 */
const formatBytes = (n: number): string => {
  if (n < BYTES_PER_KB) {
    return `${n}B`;
  }
  if (n < BYTES_PER_MB) {
    return `${(n / BYTES_PER_KB).toFixed(1)}KB`;
  }
  return `${(n / BYTES_PER_MB).toFixed(2)}MB`;
};

const errorMessage = (error: unknown): string => {
  return error instanceof Error ? error.message : String(error);
};

const processSrc = async (input: string, output: string): Promise<void> => {
  await createSharp(input, { failOn: 'none' })
    .rotate()
    .resize(MAX_DIMENSION, MAX_DIMENSION, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .avif({
      quality: AVIF_QUALITY,
      effort: AVIF_EFFORT,
      chromaSubsampling: '4:2:0',
    })
    .toFile(output);
};

const finalize = (
  originalFile: string,
  outPath: string,
  originalSize: number,
  start: number
): Result => {
  const newSize = statSync(outPath).size;

  if (
    newSize >= originalSize &&
    extname(originalFile).toLowerCase() !== '.avif'
  ) {
    unlinkSync(outPath);
    return {
      file: originalFile,
      status: 'skipped',
      reason: 'output larger than original',
    };
  }

  if (originalFile !== outPath && existsSync(originalFile)) {
    unlinkSync(originalFile);
  }

  return {
    file: outPath,
    status: 'optimized',
    from: originalSize,
    to: newSize,
    ms: Date.now() - start,
  };
};

const tryHeicFallback = async (
  file: string,
  ext: string,
  outPath: string,
  originalSize: number,
  start: number
): Promise<Result> => {
  try {
    const intermediate = join(
      tmpdir(),
      `${basename(file, ext)}-${Date.now()}.jpg`
    );
    execSync(`heif-convert -q 95 "${file}" "${intermediate}"`, {
      stdio: 'pipe',
    });
    await processSrc(intermediate, outPath);
    unlinkSync(intermediate);
    return finalize(file, outPath, originalSize, start);
  } catch (error) {
    return {
      file,
      status: 'failed',
      reason: `HEIC fallback failed: ${errorMessage(error)}`,
    };
  }
};

const optimize = async (file: string): Promise<Result> => {
  const start = Date.now();
  const ext = extname(file).toLowerCase();

  if (!SUPPORTED_INPUTS.has(ext)) {
    return { file, status: 'skipped', reason: `unsupported extension ${ext}` };
  }

  if (!existsSync(file)) {
    return { file, status: 'failed', reason: 'file not found' };
  }

  const originalSize = statSync(file).size;
  const outPath = join(dirname(file), `${basename(file, ext)}.avif`);

  if (ext === '.avif' && originalSize < SKIP_IF_SMALLER_THAN) {
    return { file, status: 'skipped', reason: 'already optimized' };
  }

  try {
    await processSrc(file, outPath);
    return finalize(file, outPath, originalSize, start);
  } catch (error) {
    const isHeic = ext === '.heic' || ext === '.heif';
    if (isHeic) {
      return tryHeicFallback(file, ext, outPath, originalSize, start);
    }
    return { file, status: 'failed', reason: errorMessage(error) };
  }
};

const printResult = (result: Result): void => {
  if (result.status === 'optimized') {
    const savedPct = (
      PERCENT_MAX -
      (result.to / result.from) * PERCENT_MAX
    ).toFixed(0);
    console.log(
      `  ✓ ${result.file}  ${formatBytes(result.from)} → ${formatBytes(result.to)} (-${savedPct}%, ${result.ms}ms)`
    );
    return;
  }
  if (result.status === 'skipped') {
    console.log(`  − ${result.file}  skipped: ${result.reason}`);
    return;
  }
  console.log(`  ✗ ${result.file}  FAILED: ${result.reason}`);
};

const runBatches = async (files: string[]): Promise<Result[]> => {
  const results: Result[] = [];
  for (let i = 0; i < files.length; i += CONCURRENCY) {
    const batch = files.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(batch.map((file) => optimize(file)));
    for (const result of batchResults) {
      results.push(result);
      printResult(result);
    }
  }
  return results;
};

const main = async (): Promise<void> => {
  const files = process.argv.slice(2);

  if (files.length === 0) {
    console.log('No images to optimize.');
    return;
  }

  console.log(
    `🖼  Optimizing ${files.length} image(s) → AVIF (max ${MAX_DIMENSION}px)...`
  );

  const results = await runBatches(files);
  const failed = results.filter((r) => r.status === 'failed');

  if (failed.length > 0) {
    console.error(`\n${failed.length} image(s) failed to optimize.`);
    process.exit(1);
  }
};

try {
  await main();
} catch (error) {
  console.error(errorMessage(error));
  process.exit(1);
}
