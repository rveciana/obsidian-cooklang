import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import type { Linter } from 'eslint';

import tsParser from '@typescript-eslint/parser';

const svelteRecommendedWithRules = svelte.configs.recommended.find(
  (config) => 'rules' in config
);
const svelteRules = (svelteRecommendedWithRules?.rules ?? {}) as Linter.RulesRecord;
export default [
  // ⛔ Ignore files/folders
  {
    ignores: ['node_modules', 'build', 'main.js', 'vite.config.mjs', 'version-bump.mjs'],
  },

  // Base JS rules
  js.configs.recommended,

  // TypeScript rules
  ...tseslint.configs.recommended,

  // Svelte-specific configuration
  {
    files: ['**/*.svelte'],
    plugins: {
      svelte,
    },
    languageOptions: {
        globals: { document: 'readonly',console: 'readonly',
        window: 'readonly', },
      parser: svelteParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 2020,
        sourceType: 'module',
        extraFileExtensions: ['.svelte'],
      },
    },
    rules: {
      ...svelteRules
    },
  },

  // Global rules for all file
  {
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { args: 'none' }],
      '@typescript-eslint/ban-ts-comment': 'off',
      'no-prototype-builtins': 'off',
      '@typescript-eslint/no-empty-function': 'off',
    },
  },

];
