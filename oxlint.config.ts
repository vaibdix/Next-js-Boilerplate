import { defineConfig } from 'oxlint';

export default defineConfig({
  categories: {
    correctness: 'error',
    suspicious: 'error',
    pedantic: 'error',
    perf: 'error',
    style: 'error',
  },
  plugins: [
    'import',
    'jsdoc',
    'jsx-a11y',
    'nextjs',
    'node',
    'oxc',
    'promise',
    'react',
    'react-perf',
    'typescript',
    'unicorn',
  ],
  rules: {
    // — Project overrides —
    'arrow-body-style': 'off',
    'capitalized-comments': 'off',
    'id-length': 'off',
    'max-lines-per-function': 'off',
    'max-params': 'off',
    'max-statements': 'off',
    'max-nested-calls': 'off',
    'new-cap': 'off', // Framework factories and variant builders intentionally use PascalCase names
    'no-continue': 'off',
    'no-duplicate-imports': 'off',
    'no-inline-comments': 'off',
    'no-magic-numbers': 'off',
    'no-ternary': 'off',
    'no-shadow': 'off', // Nested component slots conventionally reuse prop names
    'one-var': 'off', // One declaration per const; exports cannot be combined anyway
    'no-warning-comments': 'off', // Allow TODO and FIXME comments
    'prefer-named-capture-group': 'off', // Short validation regexes do not consume captures by name
    'prefer-destructuring': 'off', // React components intentionally access props through one object
    'sort-imports': 'off', // Oxfmt owns import ordering
    'sort-keys': 'off',
    'func-style': ['error', 'expression'],
    'prefer-arrow-callback': 'error',

    'import/exports-last': 'off', // Next.js metadata exports stay beside their declarations
    'import/group-exports': 'off',
    'import/max-dependencies': 'off',
    'import/namespace': 'off', // Conditional package exports produce false positives for Sentry
    'import/no-anonymous-default-export': 'off', // Configuration files export object literals
    'import/no-named-export': 'off', // Named exports are the project default
    'import/no-namespace': 'off', // Zod schemas use the documented namespace import
    'import/no-nodejs-modules': 'off', // Build scripts and configuration run on Node.js
    'import/no-unassigned-import': 'off', // Global CSS and instrumentation imports are intentional
    'import/prefer-default-export': 'off',

    'jsdoc/require-param-type': 'off', // TypeScript declarations already provide the types
    'jsdoc/require-returns-type': 'off',

    'node/no-sync': 'off', // One-shot build and codemod scripts use synchronous filesystem APIs

    'react/function-component-definition': 'off', // The repository enforces arrow components
    'react/capitalized-calls': 'off', // Variant builders intentionally use PascalCase names
    'react/jsx-max-depth': 'off',
    'react/jsx-props-no-spreading': 'off', // Primitive wrappers must forward library and DOM props
    'react/hook-use-state': 'off', // Providers may intentionally retain only a lazily initialized value
    'react/no-unstable-nested-components': 'off', // Library component slots may close over render state
    'react/react-in-jsx-scope': 'off', // Next.js uses the automatic JSX runtime

    'react-perf/jsx-no-jsx-as-prop': 'off', // Component APIs intentionally accept JSX slots
    'react-perf/jsx-no-new-array-as-prop': 'off', // React Compiler handles stable render values
    'react-perf/jsx-no-new-object-as-prop': 'off',

    'typescript/no-explicit-any': 'error',
    'typescript/no-unsafe-assignment': 'error',
    'typescript/no-unsafe-member-access': 'error',
    'typescript/no-unsafe-call': 'error',
    'typescript/no-unsafe-return': 'error',
    'typescript/no-floating-promises': 'error',
    'typescript/strict-boolean-expressions': 'error',
    'typescript/no-unnecessary-condition': 'error',
    'typescript/consistent-type-definitions': ['error', 'interface'],
    'typescript/no-misused-promises': 'error', // If react-hook-form handleSubmit is used, disable per-site
    'typescript/prefer-readonly-parameter-types': 'off',

    'react-perf/jsx-no-new-function-as-prop': 'off',
    'unicorn/filename-case': 'off', // Impossible to enforce consistent filename case due to multiple conventions
    'unicorn/no-null': 'off', // React and browser APIs use null as a meaningful value
    'unicorn/prefer-global-this': 'off', // Explicit browser globals make client-only code clearer
    'unicorn/prefer-string-raw': 'off', // String.raw currently prevents React Compiler optimization

    // --- JSDoc Rules ---
    'jsdoc/require-param': 'off',
    'jsdoc/require-param-description': 'off',
    'jsdoc/require-returns': 'off',
    'jsdoc/require-returns-description': 'off',
  },
  overrides: [
    {
      // These files import types from packages without shipped declarations
      files: ['commitlint.config.ts', 'src/utils/clerk-localizations.ts'],
      rules: {
        'typescript/no-unsafe-assignment': 'off',
        'typescript/no-unsafe-call': 'off',
        'typescript/no-unsafe-member-access': 'off',
        'typescript/no-unsafe-return': 'off',
        'typescript/strict-boolean-expressions': 'off',
        'typescript/prefer-nullish-coalescing': 'off',
      },
    },
    {
      files: ['**/*.d.ts'],
      rules: {
        'typescript/consistent-type-definitions': 'off', // Global augmentation requires declaration merging
      },
    },
    {
      files: ['scripts/optimize-images.ts'],
      rules: {
        'no-await-in-loop': 'off', // Batches are intentionally processed sequentially
      },
    },
    {
      files: ['src/components/footer.tsx'],
      rules: {
        'require-await': 'off',
        'typescript/require-await': 'off', // Next.js cache scopes must remain async
      },
    },
  ],
  options: {
    reportUnusedDisableDirectives: 'error',
    typeAware: true,
    typeCheck: true,
  },
});
