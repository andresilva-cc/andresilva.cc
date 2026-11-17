import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import stylistic from '@stylistic/eslint-plugin';

const eslintConfig = defineConfig([
  ...nextVitals,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // Velite-generated output:
    '.velite/**',
  ]),
  stylistic.configs.customize({
    arrowParens: true,
    semi: true,
  }),
  // @stylistic v6 enables list-style in the preset; it would reflow every wrapped prop list.
  { rules: { '@stylistic/list-style': 'off' } },
]);

export default eslintConfig;
