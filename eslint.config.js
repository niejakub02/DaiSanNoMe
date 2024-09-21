import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    rules: {
      'no-unused-vars': 'warn',
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },
  {
    ignores: ['dist/**/*'],
  },
  { languageOptions: { globals: globals.browser } },
];
