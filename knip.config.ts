import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  ignore: [
    'src/libs/I18n.ts',
    'src/types/I18n.ts',
    'src/libs/Logger.ts',
    'src/components/ui/**',
    'src/components/logo.tsx',
  ],

  ignoreDependencies: [
    '@commitlint/types',
    '@clerk/shared',
    '@swc/helpers',
    '@logtape/logtape',
    'postcss',
  ],

  ignoreBinaries: ['dotenv', 'production'],

  compilers: {
    css: (text: string) => [...text.matchAll(/(?<=@)import[^;]+/g)].join('\n'),
  },
};

export default config;
