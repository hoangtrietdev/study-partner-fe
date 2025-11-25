module.exports = {
  extends: ['next/core-web-vitals', 'next/typescript', 'plugin:prettier/recommended'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'all',
        tabWidth: 2,
        semi: true,
        printWidth: 100,
        arrowParens: 'always',
      },
    ],
  },
};
