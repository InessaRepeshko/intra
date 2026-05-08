import { defineConfig } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
// import prettier from 'eslint-plugin-prettier/recommended';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // prettier,
  {
    ignores: [
      '**/*',
      // 'eslint.config.mjs',
      // 'postcss.config.mjs',
      // '.next/**',
      // 'out/**',
      // 'build/**',
      // '.eslintcache',
      // 'next-env.d.ts',
    ],
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.config.mjs', 'eslint.config.mjs'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      // '@typescript-eslint/no-explicit-any': 'off',
      // '@typescript-eslint/no-floating-promises': 'warn',
      // '@typescript-eslint/no-unsafe-argument': 'warn',
      // 'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
  // {
  //   files: ["src/shared/ui/**/*.tsx"],
  //   rules: {
  //     "react-hooks/purity": "off",
  //     "@typescript-eslint/no-unsafe-argument": "off",
  //     "@typescript-eslint/no-unused-vars": "off"
  //   }
  // }
]);

export default eslintConfig;
