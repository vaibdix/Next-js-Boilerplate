import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  // Files to exclude from Knip analysis
  ignore: [
    'src/libs/I18n.ts',
    'src/types/I18n.ts',
    'src/libs/Logger.ts',
    'src/components/ui/**',
  ],
  // Dependencies to ignore during analysis
  ignoreDependencies: [
    '@commitlint/types',
    '@clerk/shared',
    '@swc/helpers', // Avoid error in CI: "`npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync."
    '@base-ui/react',
    '@hookform/resolvers',
    '@logtape/logtape',
    'class-variance-authority',
    'lucide-react',
    'react-hook-form',
    'postcss',
  ],
  // Binaries to ignore during analysis
  ignoreBinaries: [
    'dotenv',
    'production', // False positive raised with dotenv-cli
  ],
  compilers: {
    css: (text: string) => [...text.matchAll(/(?<=@)import[^;]+/g)].join('\n'),
  },
};

export default config;
