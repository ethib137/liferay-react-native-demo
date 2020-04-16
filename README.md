# Liferay React Native Demo App

An example app for Liferay utilizing Liferay's headless apis.

## Usage

Download the "Expo Client" app for Android or IOS. 

Then go to https://expo.io/@ethib137/liferay-demo and scan the QR code.

You will then be able to configure your app to connect to a local or remote instance of Liferay. If connecting to a local instance make sure your phone and laptop running Lifeary are on the same wifi network. In this case you will need to use your laptops IP address as part of the Liferay URL.

### OAuth2

The app is setup to authenticate using OAuth2. To set this up on Liferay you will need to create a new OAuth application through Liferay's administration. Configure it as shown in the image below.

![Configuration](/dev-assets/OAuthConfiguration.png)

You will then need to enable scopes to give the OAuth application access to Liferay. I've found this to be a little finnicky and thus simply enabled everything. To test any changes you make to scopes, you will need to log out and back in on the app.

![Scopes](/dev-assets/OAuthScopes.png)

At this point it should be working.

## Setup the Code

Please provide feedback for this. If you find anything is missing add an issue to this repo so I can update the steps. Or even better, send a pull request. ;)

This is a JavaScript applicaiton so you will need node and npm installed.

This Liferay React Native App is built using [Expo](https://expo.io/) which simplifies the creation of React Native apps.

` $ npm install expo-cli --global`
` $ npm install`
` $ npm start`

## Issues & Questions Welcome