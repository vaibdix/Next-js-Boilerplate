import { defineConfig } from 'oxfmt';

export default defineConfig({
  arrowParens: 'always',
  bracketSameLine: false,
  bracketSpacing: true,
  endOfLine: 'lf',
  sortImports: {
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
  sortPackageJson: true,
  jsxSingleQuote: false,
  printWidth: 80,
  quoteProps: 'as-needed',
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  useTabs: false,
  ignorePatterns: ['.agents/**', '**/*.md', 'migrations/*'],
  sortTailwindcss: {
    stylesheet: 'src/styles/global.css',
  },
  overrides: [
    {
      files: ['**/*.json', '**/*.jsonc'],
      options: {
        trailingComma: 'none',
      },
    },
  ],
});
