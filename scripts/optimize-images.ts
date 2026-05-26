#!/usr/bin/env tsx
/**
 * Optimizes images to AVIF format with a max long-edge of 2560px.
 *
 * Usage:
 *   pnpm optimize-images <file1> <file2> ...
 *
 * Behavior:
 *   - Skips files already AVIF under the size threshold (idempotent).
 *   - Handles HEIC/HEIF via libheif fallback if sharp can't decode.
 *   - Preserves filename, swaps extension to .avif.
 *   - Removes original after successful conversion.
 *   - Strips EXIF (including GPS).
 *   - Auto-rotates based on EXIF orientation.
 */

import { execSync } from 'node:child_process';
import { existsSync, statSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, extname, join } from 'node:path';
import sharp from 'sharp/lib/index.js';

const MAX_DIMENSION = 2560;
const AVIF_QUALITY = 70; // AVIF q70 ≈ JPEG q85 visually
const AVIF_EFFORT = 4; // 0–9, higher = smaller but slower
const SKIP_IF_SMALLER_THAN = 500_000; // 500KB — already small, skip
const CONCURRENCY = 4;
const BYTES_PER_KB = 1024;
const BYTES_PER_MB = 1024 * 1024;
const PERCENT_MAX = 100;

type SharpInstance = {
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
};

type SharpLoader = (
  input: string,
  options: {
    failOn: 'none';
  }
) => SharpInstance;

function isSharpLoader(value: unknown): value is SharpLoader {
  return typeof value === 'function';
}

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

type OptimizedResult = {
  file: string;
  status: 'optimized';
  from: number;
  to: number;
  ms: number;
};

type SkippedResult = {
  file: string;
  status: 'skipped';
  reason: string;
};

type FailedResult = {
  file: string;
  status: 'failed';
  reason: string;
};

type Result = OptimizedResult | SkippedResult | FailedResult;

/**
 * Formats a byte count as a human-readable string.
 * @param n - The number of bytes to format.
 * @returns A formatted string like "1.2MB" or "345KB" or "678B".
 */
function formatBytes(n: number): string {
  if (n < BYTES_PER_KB) {
    return `${n}B`;
  }
  if (n < BYTES_PER_MB) {
    return `${(n / BYTES_PER_KB).toFixed(1)}KB`;
  }
  return `${(n / BYTES_PER_MB).toFixed(2)}MB`;
}

/**
 * Extracts a message string from an unknown thrown value.
 * @param error - The caught error value of unknown type.
 * @returns The error's message, or its string coercion as a fallback.
 */
function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Reads an image, resizes/rotates/strips metadata, writes as AVIF.
 * @param input - Absolute or relative path to the source image.
 * @param output - Absolute or relative path for the output AVIF file.
 * @returns A promise that resolves when the output file has been written.
 */
async function processSrc(input: string, output: string): Promise<void> {
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
}

/**
 * Decides what to do once an AVIF output exists: keep it (and delete the
 * original) or discard it if it grew larger than the source.
 * @param originalFile - Path to the original image file.
 * @param outPath - Path to the freshly written AVIF file.
 * @param originalSize - Size in bytes of the original image.
 * @param start - Timestamp (ms) marking when optimization began.
 * @returns A Result describing whether the file was optimized or skipped.
 */
function finalize(
  originalFile: string,
  outPath: string,
  originalSize: number,
  start: number
): Result {
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
}

/**
 * Falls back to `heif-convert` for HEIC/HEIF inputs that sharp's prebuilt
 * binary cannot decode. Converts to a temporary JPEG, then processes normally.
 * @param file - Path to the HEIC/HEIF source file.
 * @param ext - The lowercased file extension (including dot).
 * @param outPath - Target AVIF output path.
 * @param originalSize - Size in bytes of the original file.
 * @param start - Timestamp (ms) marking when optimization began.
 * @returns A Result describing the outcome of the fallback attempt.
 */
async function tryHeicFallback(
  file: string,
  ext: string,
  outPath: string,
  originalSize: number,
  start: number
): Promise<Result> {
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
}

/**
 * Optimizes a single image file, with HEIC fallback if needed.
 * @param file - Path to the image file to optimize.
 * @returns A Result describing the outcome (optimized, skipped, or failed).
 */
async function optimize(file: string): Promise<Result> {
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
      return await tryHeicFallback(file, ext, outPath, originalSize, start);
    }
    return { file, status: 'failed', reason: errorMessage(error) };
  }
}

/**
 * Prints a single result line to stdout in a human-friendly format.
 * @param result - The Result to print.
 * @returns Nothing.
 */
function printResult(result: Result): void {
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
}

/**
 * Processes an array of file paths in concurrency-limited batches.
 * @param files - The list of file paths to process.
 * @returns An array of Results, one per input file, in input order.
 */
async function runBatches(files: string[]): Promise<Result[]> {
  const results: Result[] = [];
  for (let i = 0; i < files.length; i += CONCURRENCY) {
    const batch = files.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(batch.map(optimize));
    for (const result of batchResults) {
      results.push(result);
      printResult(result);
    }
  }
  return results;
}

/**
 * Entry point. Reads file paths from argv, optimizes each, exits non-zero on
 * any failure.
 * @returns A promise that resolves when all files have been processed.
 */
async function main(): Promise<void> {
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
}

try {
  await main();
} catch (error) {
  console.error(errorMessage(error));
  process.exit(1);
}
