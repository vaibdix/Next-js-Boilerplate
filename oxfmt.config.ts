import { defineConfig } from 'oxfmt';

export default defineConfig({
  arrowParens: 'always',
  bracketSameLine: false,
  bracketSpacing: true,
  endOfLine: 'lf',
  experimentalSortImports: {
    ignoreCase: true,
    newlinesBetween: false,
    order: 'asc',
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
