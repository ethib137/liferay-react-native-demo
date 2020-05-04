import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {Image, StyleSheet, Text} from 'react-native';
import {Button} from 'react-native-elements';

import Login from '../components/Login';
import ToggleDrawerButton from '../components/ToggleDrawerButton';
import {useAppState} from '../hooks/appState';
import styles from '../styles/main';

function LoginScreen({navigation}) {
	const [state] = useAppState();

	const {isConfigured} = state;

	return (
		<>
			{isConfigured ? (
				<Login />
			) : (
				<>
					<Image
						source={require('../../assets/icon.png')}
						style={[loginStyles.image, styles.m4]}
					/>

					<Text style={[styles.m4, styles.textCenter]}>
						Your app is currently not connected to a Liferay
						Instance. You can can connect to a Liferay instance by
						configuring the Client ID and Liferay URL.
					</Text>

					<Button
						onPress={() => navigation.navigate('Configurations')}
						style={styles.mx5}
						title="Configure Now"
					/>
				</>
			)}
		</>
	);
}

const loginStyles = StyleSheet.create({
	image: {
		alignSelf: 'center',
		height: 100,
		width: 100,
	},
});

const Stack = createStackNavigator();

function LoginNavigator({navigation}) {
	return (
		<Stack.Navigator
			initialRouteName="Login"
			screenOptions={{
				headerRight: () => (
					<ToggleDrawerButton navigation={navigation} />
				),
			}}
		>
			<Stack.Screen
				component={LoginScreen}
				name="Login"
				options={{
					headerTitle: 'Login',
				}}
			/>
		</Stack.Navigator>
	);
}

export default LoginNavigator;
