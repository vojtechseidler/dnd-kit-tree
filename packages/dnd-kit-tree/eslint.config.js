import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import reactPlugin from "eslint-plugin-react";
import tsParser from "@typescript-eslint/parser";
import prettierPlugin from "eslint-plugin-prettier";
import tseslint from "@typescript-eslint/eslint-plugin";
import reactHooksPlugin from "eslint-plugin-react-hooks";

export default [
  {
    ignores: ["dist", "node_modules", "rollup.config.cjs"],
  },
  js.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      globals: {
        window: true,
        console: true,
        document: true,
        navigator: true,
      },
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module",
        ecmaVersion: "latest",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      "react/prop-types": "off",
      "prettier/prettier": "warn",
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
  prettier,
];
