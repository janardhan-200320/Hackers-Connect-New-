
module.exports = {
  root: true,
  env: { browser: true, es2022: true },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-refresh'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  },
  ignorePatterns: ['dist', 'node_modules']
}
