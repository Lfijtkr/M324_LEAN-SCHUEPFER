import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ["**/*.js"],
    languageOptions: { sourceType: "script" },
    rules: { eqeqeq: "error", "no-console": "error" },
  },
  {
    files: ["Exercise 2/**/*.js"],
    languageOptions: { sourceType: "commonjs", globals: globals.node },
  },
  {
    files: ["Exercise 2/**/*.test.js"],
    languageOptions: { globals: globals.mocha },
  },
]);
