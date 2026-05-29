import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  ignore: [
    'src/libs/I18n.ts',
    'src/types/I18n.ts',
    'src/libs/cache.ts',
    'src/libs/Logger.ts',
    'src/components/ui/**',
    'src/components/logo.tsx',
    // Shipped for future SVG sprite pipeline (Pierre-style); not yet wired in.
    'svgo.config.js',
  ],

  ignoreDependencies: [
    '@commitlint/types',
    '@clerk/shared',
    '@swc/helpers',
    '@logtape/logtape',
    // Shipped for discoverability; wire up the day a filter/sort/search/pagination UI lands.
    'nuqs',
    // Resolved by secretlint via .secretlintrc.json string ID, not via an import.
    '@secretlint/secretlint-rule-preset-recommend',
    // Transitive via next/image; imported directly by scripts/optimize-images.ts (dev-only).
    'sharp',
  ],

  // tsx is invoked via `pnpm exec tsx` from lefthook and the optimize-images
  // script — present in the pnpm store but not declared as a top-level devDep.
  ignoreBinaries: ['tsx'],

  compilers: {
    css: (text: string) => [...text.matchAll(/(?<=@)import[^;]+/gu)].join('\n'),
  },

  // Exports referenced only within their own file (e.g. response schemas
  // that back a public type alias / parser in the same module) are not
  // dead code. See https://knip.dev/reference/configuration#ignoreexportsusedinfile
  ignoreExportsUsedInFile: true,

  treatConfigHintsAsErrors: true,
};

export default config;
