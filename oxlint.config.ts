import { defineConfig } from 'oxlint';
import core from 'ultracite/oxlint/core';
import next from 'ultracite/oxlint/next';
import react from 'ultracite/oxlint/react';

export default defineConfig({
  extends: [core, next, react],
  plugins: ['oxc', 'react', 'typescript'],
  rules: {
    // — Project overrides —
    'no-warning-comments': 'off', // Allow TODO and FIXME comments
    'no-inline-comments': 'off',
    'sort-keys': 'off',
    'func-style': 'off',

    'typescript/no-explicit-any': 'error',
    'typescript/no-unsafe-assignment': 'error',
    'typescript/no-unsafe-member-access': 'error',
    'typescript/no-unsafe-call': 'error',
    'typescript/no-unsafe-return': 'error',
    'typescript/no-floating-promises': 'error',
    'typescript/strict-boolean-expressions': 'error',
    'typescript/no-unnecessary-condition': 'error',
    'typescript/consistent-type-definitions': ['error', 'type'],
    'typescript/no-misused-promises': 'error', // If react-hook-form handleSubmit is used, disable per-site
    'typescript/prefer-readonly-parameter-types': 'off',

    'react-perf/jsx-no-new-function-as-prop': 'off',
    'unicorn/filename-case': 'off', // Impossible to enforce consistent filename case due to multiple conventions

    // --- JSDoc Rules ---
    'jsdoc/require-param': 'error',
    'jsdoc/require-param-description': 'error',
    'jsdoc/require-returns': 'error',
    'jsdoc/require-returns-description': 'error',
  },
  overrides: [
    {
      // These files import types from packages without shipped declarations
      files: ['commitlint.config.ts', 'src/utils/AppConfig.ts'],
      rules: {
        'typescript/no-unsafe-assignment': 'off',
        'typescript/no-unsafe-call': 'off',
        'typescript/no-unsafe-member-access': 'off',
        'typescript/no-unsafe-return': 'off',
        'typescript/strict-boolean-expressions': 'off',
        'typescript/prefer-nullish-coalescing': 'off',
      },
    },
  ],
  options: {
    reportUnusedDisableDirectives: 'error',
  },
});
