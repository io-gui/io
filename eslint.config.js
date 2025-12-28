import js from '@eslint/js'
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin'

const globals = {
  browser: {
    'fetch': true,
    'document': true,
    'window': true,
    'self': true,
    'console': true,
    'setTimeout': true,
    'setInterval': true,
    'clearTimeout': true,
    'clearInterval': true,
    'requestAnimationFrame': true,
    'navigator': true,
    'history': true,
    'localStorage': true
  }
}

export default tseslint.config(
  {
    ignores: ['**/dist/**', '**/bundle/**', '**/node_modules/**'],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        'expect': true,
        'it': true,
        'describe': true,
        'hljs': true
      },
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    extends: [
      js.configs.recommended,
      // tseslint.configs.base
      tseslint.configs.recommended
    ],
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      // Semantic/type-aware rules (require typescript-eslint)
      '@typescript-eslint/consistent-type-assertions': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-unused-vars': ['error', {
        // vars: 'all',
        // args: 'after-used',
        // caughtErrors: 'all',
        // caughtErrorsIgnorePattern: '^error',
        argsIgnorePattern: '^_|^event'
      }],
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off', // TODO: enable this rule
      '@typescript-eslint/no-unused-expressions': 'off', // TODO: enable this rule
      '@typescript-eslint/ban-ts-comment': 'off', // TODO: enable this rule
      // Stylistic rules (migrated to @stylistic)
      '@stylistic/member-delimiter-style': ['error', {
        multiline: {
          delimiter: 'none',
          requireLast: false,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        }
      }],
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/no-trailing-spaces': 'error',

      // Core ESLint rules
      'no-debugger': 'error',
      'no-unused-labels': 'off',
      'no-unused-vars': 'off',
      'no-var': 'error',
      'eqeqeq': 'error',
      'strict': 'error',
    },
  },
  {
    files: ['**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-empty-function': 'off',
    }
  }
);

