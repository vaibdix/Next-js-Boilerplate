import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  ignore: [
    'src/libs/i18n.ts',
    'src/libs/cached-json.ts',
    'src/libs/cached-json-short.ts',
    'src/utils/fetch-json.ts',
    'src/components/ui/**',
    'src/components/logo.tsx',
    'svgo.config.js',
  ],

  ignoreDependencies: [
    '@swc/helpers',
    'semantic-release',
    '@secretlint/secretlint-rule-preset-recommend',
  ],

  ignoreBinaries: ['heif-convert'],

  compilers: {
    css: (text: string) => [...text.matchAll(/(?<=@)import[^;]+/gu)].join('\n'),
  },

  ignoreExportsUsedInFile: true,
  treatConfigHintsAsErrors: true,
};

export default config;
