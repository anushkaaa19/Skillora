module.exports = {
    root: true,
    env: {
      browser: true,
      node: true,
      es2021: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
    ],
    parserOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
    },
    plugins: ['react', 'react-hooks'],
    settings: {
      react: {
        version: 'detect',
      },
    },
  }
  