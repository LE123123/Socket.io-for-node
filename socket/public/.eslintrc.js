module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2020,
  },
  env: {
    browser: true,
  },
  extends: ['airbnb-base', 'plugin:node/recommended', 'prettier'],
  rules: {
    'import/prefer-default-export': ['off'],
  },
}
