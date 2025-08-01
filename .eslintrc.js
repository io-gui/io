import js from '@eslint/js';
import tseslint from 'typescript-eslint'
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';

export function makeConfig(projectPath) {
  return tseslint.config({
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser,
        'expect': true,
        'it': true,
        'describe': true,
        'mocha': true,
        'hljs': true
      },
      parser: tsParser,
      parserOptions: {
        project: projectPath
      }
    },
    files: ['**/*.ts'],
    extends: [
      js.configs.recommended,
      tseslint.configs.base
    ],
    plugins: {},
    rules: {
      'no-debugger': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion' : 'off',
      '@typescript-eslint/consistent-type-assertions': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['error', {
        'vars': 'all',
        'args': 'after-used',
        'caughtErrors': 'all',
        'argsIgnorePattern': '^event',
        'caughtErrorsIgnorePattern': '^error',
      }],
      '@typescript-eslint/no-empty-function': 'off',
      'no-unused-labels': 'off',
      'no-unused-vars': 'off',
      'no-var': 'error',
      'eqeqeq': 'error',
      'no-trailing-spaces': 'error',
      'semi': 'error',
      'strict': 'error',
      'quotes': ['error', 'single'],
    }
  },
  {
    files: ['**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-empty-function': 'off',
    }
  });
}

export default makeConfig("./tsconfig.json");