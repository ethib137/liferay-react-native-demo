module.exports = {
  env: {
  browser: true,
  es6: true,
  },
  "extends": [
    "liferay/react",
    "plugin:jest/recommended"
  ],
  "globals": {
    "require": "readonly"
  },
  "parser": "babel-eslint",
  "plugins": ["jest"]
};