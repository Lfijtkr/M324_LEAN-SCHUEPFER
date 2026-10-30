export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      eqeqeq: "error",
      "no-unused-vars": "error",
      "prefer-const": "error",
    },
  },
];
