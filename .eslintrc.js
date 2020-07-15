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
  "plugins": ["jest"]
};