import { defineConfig } from 'oxfmt';
import ultracite from 'ultracite/oxfmt';

export default defineConfig({
  extends: [ultracite],
  arrowParens: 'always',
  bracketSameLine: false,
  bracketSpacing: true,
  endOfLine: 'lf',
  importOrder: ['<THIRD_PARTY_MODULES>', '^\\.'],
  importOrderSortSpecifiers: true,
  importOrderSeparation: true,
  experimentalSortImports: {
    groups: [
      ['value-builtin', 'value-external', 'type-builtin', 'type-external'],
      [
        'value-internal',
        'type-internal',
        'value-parent',
        'type-parent',
        'value-sibling',
        'type-sibling',
        'value-index',
        'type-index',
      ],
      'unknown',
    ],
    ignoreCase: true,
    internalPattern: ['~/', '@/'],
    newlinesBetween: true,
    order: 'asc',
    partitionByComment: false,
    partitionByNewline: false,
    sortSideEffects: false,
  },
  experimentalSortPackageJson: true,
  jsxSingleQuote: false,
  printWidth: 80,
  quoteProps: 'as-needed',
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  useTabs: false,
  ignorePatterns: ['migrations/*', '*.md'],
  sortTailwindcss: {
    stylesheet: 'src/styles/global.css',
  },
  // Keep JSON/JSONC output consistent between the CLI and VS Code
  overrides: [
    {
      files: ['**/*.json', '**/*.jsonc'],
      options: {
        trailingComma: 'none',
      },
    },
  ],
});
