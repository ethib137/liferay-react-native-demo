# Liferay React Native Demo App

An example app for Liferay utilizing Liferay's headless apis.

## Setup the Code

Please provide feedback for this. If you find anything is missing add an issue to this repo so I can update the steps. Or even better, send a pull request. ;)

This is a JavaScript applicaiton so you will need node and npm installed.

This Liferay React Native App is built using [Expo](https://expo.io/) which simplifies the creation of React Native apps.

` $ npm install expo-cli --global`

` $ npm install`

` $ npm start`

## Authentication

The App can be configured to use either OAuth2 or Basic Auth.

### OAuth2

To set OAuth2 up on Liferay you will need to create a new OAuth application through Liferay's administration. Configure it as shown in the image below.

![Configuration](/dev-assets/OAuthConfiguration.png)

You will then need to enable scopes to give the OAuth application access to Liferay. I've found this to be a little finnicky and thus simply enabled everything. To test any changes you make to scopes, you will need to log out and back in on the app.

![Scopes](/dev-assets/OAuthScopes.png)

At this point it should be working.

## Contributing Guidlines

Before sending a pull request please make sure to run the following formatting commands. Fix any errors you see.

` $ npx eslint src`

` $ npm run prettier`

## Issues & Questions Welcome