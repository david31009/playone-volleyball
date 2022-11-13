module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  extends: 'airbnb-base',
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'linebreak-style': ['error', 'windows'],
    'comma-dangle': ['error', 'never'],
    'arrow-body-style': ['error', 'always']
  }
};

