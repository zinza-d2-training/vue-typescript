module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/essential",
    "plugin:prettier/recommended",
    "eslint:recommended",
    "@vue/typescript",
  ],
  parserOptions: {
    parser: "@typescript-eslint/parser",
  },
  rules: {},
};
