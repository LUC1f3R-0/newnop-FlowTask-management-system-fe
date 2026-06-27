import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores([
    'dist',
    'build',
    'coverage',
    'node_modules',
    '.route-guard-backup-*',
    'project-structure-analysis.txt',
    'extract-frontend-code.mjs',
    'analyze-structure.mjs',
  ]),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // shadcn/ui and TanStack route modules commonly export helpers/constants
      // beside components. This rule creates noise for generated code.
      'react-refresh/only-export-components': 'off',

      // React 19 compiler lint rules are too strict for generated shadcn files.
      // TypeScript build still catches real compile problems.
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/purity': 'off',

      // Some generated UI files may contain ts comments.
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },
])
