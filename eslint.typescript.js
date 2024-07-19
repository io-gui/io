import js from "@eslint/js";
import tseslint from 'typescript-eslint'
import tsParser from "@typescript-eslint/parser";
import globals from "globals";

export default tseslint.config(
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser,
        'it': true,
        'describe': true,
        'chai': true,
        'mocha': true,
        'hljs': true
      },
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json"
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
      // 'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion' : 'off',
      '@typescript-eslint/consistent-type-assertions': 'error',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-empty-function': 'warn',
      'no-unused-labels': 'off',
      'no-unused-vars': 'warn',
      'no-var': 'error',
      'eqeqeq': 'error',
      'no-trailing-spaces': 'error',
      'semi': 'error',
      'strict': 'error',
      'quotes': ['error', 'single'],
      // 'valid-jsdoc': ['error', {
      //   'requireReturn': false,
      //   'requireReturnType': false,
      //   'requireParamType': false,
      //   'prefer': {
      //     'arg': 'param',
      //     'argument': 'param',
      //     'returns': 'return'
      //   },
      //   'preferType': {
      //     'Boolean': 'boolean',
      //     'Number': 'number',
      //     'String': 'string',
      //     'object': 'Object'
      //   }
      // }]
    }
  },
  {
    files: ['**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-empty-function': 'off',
    }
  },
)