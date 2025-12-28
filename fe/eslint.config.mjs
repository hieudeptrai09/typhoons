import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import importPlugin from "eslint-plugin-import";
import unusedImportsPlugin from "eslint-plugin-unused-imports";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  prettier,
  {
    plugins: {
      prettier: prettierPlugin,
      import: importPlugin,
      "unused-imports": unusedImportsPlugin,
    },
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    rules: {
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "parent", "sibling", "type"],
          pathGroups: [
            {
              pattern: "{react,react-dom,react-dom/**,react-router-dom}",
              group: "builtin",
              position: "before",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin", "type"],
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
          "newlines-between": "never",
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: ["@/*"],
        },
      ],
      "unused-imports/no-unused-imports": "error",
      "no-console": "error",
    },
  },
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
