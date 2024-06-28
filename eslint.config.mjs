import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["node_modules/", "dist/"], // Add your ignore patterns here
  },
  {
    files: ["/*.ts"], // Specify file extensions to lint
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },

    rules: {
      "@typescript-eslint/no-unused-vars": "error",
      // to enforce using type for object type definitions, can be type or interface
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    },
  },

  { files: ["/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];