/** @type {import("eslint").ESLint.ConfigData} */
module.exports = {
  env: { node: true, es2020: true },
  extends: ["eslint:recommended", "plugin:import/recommended", "prettier"],
  parserOptions: {
    ecmaVersion: "latest",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    // Warn about console leftovers.
    "no-console": "warn",

    // Insert blank lines between import groups and categorize aliased paths.
    "import/order": [
      "error",
      {
        "newlines-between": "always",
        pathGroups: [
          {
            pattern: "~/**",
            group: "internal",
          },
        ],
      },
    ],
  },
  overrides: [
    {
      files: ["*.tsx"],
      extends: [
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:react-hooks/recommended",
      ],
      rules: {
        // Unecessary.
        "react/no-unescaped-entities": "off",

        // Wrong dependencies cause errors, so it should be an error.
        "react-hooks/exhaustive-deps": "error",
      },
    },
    {
      files: ["*.ts", "*.tsx"],
      extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
      ],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: true,
      },
      settings: {
        "import/resolver": {
          typescript: {},
        },
      },
      rules: {
        // Allow implicit return types.
        "@typescript-eslint/explicit-function-return-type": "off",

        // Allow if(<not a boolean>).
        "@typescript-eslint/strict-boolean-expressions": "off",

        // Unecessary.
        "@typescript-eslint/restrict-template-expressions": "off",

        // Prefer `type` over `interface`.
        "@typescript-eslint/consistent-type-definitions": ["error", "type"],

        // No unused variables.
        "@typescript-eslint/no-unused-vars": "error",
      },
    },
  ],
};
