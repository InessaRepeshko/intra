// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  {
    ignores: [
      '**/*',
      // 'eslint.config.mjs',
      // 'apps/web/**',
      // '**/node_modules/**',
      // '**/.next/**',
      // '**/dist/**',
      // '**/build/**',
      // '**/.eslintcache',
      // '**/next-env.d.ts',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  // eslintPluginPrettierRecommended,
  // prettier,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      // '@typescript-eslint/no-explicit-any': 'off',
      // '@typescript-eslint/no-floating-promises': 'warn',
      // '@typescript-eslint/no-unsafe-argument': 'warn',
      // "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  },
);
