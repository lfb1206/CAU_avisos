import js from '@eslint/js';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import nextPlugin from '@next/eslint-plugin-next';

export default [
  js.configs.recommended,
  {
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      '@next/next': nextPlugin,
      // Registered (not activated via `recommended`) so existing inline
      // `// eslint-disable-next-line @typescript-eslint/...` comments resolve
      // instead of erroring with "rule not found".
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // not needed with Next.js JSX transform
      'react/prop-types': 'off',          // will be replaced by TypeScript types
      // styled-jsx's special attributes aren't standard DOM properties.
      'react/no-unknown-property': ['error', { ignore: ['jsx', 'global'] }],
      // The base rule doesn't understand TS function-type signatures (interface/type
      // method parameter names aren't real bindings) and false-positives on every one
      // of them — use the TS-aware version instead, which still catches genuinely
      // unused real variables correctly.
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['error'] }],
    },
    settings: {
      react: { version: 'detect' },
    },
    languageOptions: {
      // Without this, TS syntax (types, `interface`, `as`, generics, ...) fails to
      // parse at all — every .ts/.tsx file was erroring out before it ever reached
      // the rule set below.
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      // The hand-picked globals this used to list (window, document, console, ...)
      // only covered a handful of browser APIs and missed fetch/URL/File/DOM types
      // entirely, plus every Node global (process, ...) used in API routes/server
      // code — both of which only became visible once TS parsing itself was fixed.
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    ignores: ['node_modules/**', '.next/**', 'out/**'],
  },
];
