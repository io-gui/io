import js from "@eslint/js";
import tseslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin";

const globals = {
  browser: {
    fetch: true,
    document: true,
    window: true,
    self: true,
    console: true,
    setTimeout: true,
    setInterval: true,
    clearTimeout: true,
    clearInterval: true,
    requestAnimationFrame: true,
    navigator: true,
    history: true,
    localStorage: true,
  },
};

export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/bundle/**",
      "**/node_modules/**",
      "docs/generated/**",
      "**/*.d.ts",
      "**/packages/*/src/**/*.js",
      "**/packages/*/src/**/*.js.map",
      "vite.config.ts",
      "vite.bundle.config.ts",
      "vitest.config.ts",
      "bundle.js",
    ],
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      globals: {
        ...globals.browser,
        expect: true,
        it: true,
        describe: true,
        hljs: true,
      },
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
    ],
    plugins: {
      "@stylistic": stylistic,
    },
    rules: {
      "@typescript-eslint/consistent-type-assertions": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_|^event" },
      ],
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-expressions": [
        "warn",
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true,
        },
      ],
      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          "ts-expect-error": "allow-with-description",
          "ts-ignore": true,
          "ts-nocheck": true,
          "ts-check": false,
          minimumDescriptionLength: 3,
        },
      ],
      "@stylistic/member-delimiter-style": [
        "error",
        {
          multiline: { delimiter: "none", requireLast: false },
          singleline: { delimiter: "semi", requireLast: false },
        },
      ],
      "@stylistic/semi": ["error", "never"],
      "@stylistic/quotes": ["error", "single"],
      "@stylistic/no-trailing-spaces": "error",
      "@stylistic/max-len": ["warn", { code: 360 }],

      "no-debugger": "error",
      "no-unused-labels": "off",
      "no-unused-vars": "off",
      "no-var": "error",
      eqeqeq: "error",
      strict: "error",
    },
  },
  {
    files: ["**/*.test.ts", "**/*.bench.ts"],
    extends: [tseslint.configs.disableTypeChecked],
    rules: {
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "off",
    },
  },
  {
    files: ["**/demos/**/*.ts"],
    rules: {
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          "ts-expect-error": "allow-with-description",
          "ts-ignore": false,
          "ts-nocheck": false,
          "ts-check": false,
          minimumDescriptionLength: 3,
        },
      ],
    },
  },
);
