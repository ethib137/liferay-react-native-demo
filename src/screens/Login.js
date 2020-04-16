import {createStackNavigator} from '@react-navigation/stack';
import React, {useState} from 'react';
import {
	Image,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	Text,
} from 'react-native';
import {Button, Input} from 'react-native-elements';

import ToggleDrawerButton from '../components/ToggleDrawerButton';
import {useAppState} from '../hooks/appState';
import styles from '../styles/main';
import {login} from '../util/request';

function Login({navigation}) {
	const [state, dispatch] = useAppState();

	const {isConfigured} = state;

	const {loggedIn} = state;

	const [email, setEmail] = useState('test@liferay.com');
	const [password, setPassword] = useState('test');

	const handleLogin = () => {
		login(email, password)
			.then(() => {
				dispatch({type: 'LOGGED_IN'});
			})
			.catch(() => {
				dispatch({type: 'LOGGED_OUT'});
			});
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.Os == 'ios' ? 'padding' : 'height'}
			style={[styles.centerContent, styles.m3]}
		>
			<Image
				source={require('../../assets/icon.png')}
				style={[loginStyles.image, styles.mb4]}
			/>

			{loggedIn && (
				<Text style={styles.mb3}>You are already logged in.</Text>
			)}

			{isConfigured ? (
				<>
					<Input
						autoCapitalize="none"
						autoComplete="off"
						autoCorrect={false}
						containerStyle={styles.mb3}
						keyboardType="email-address"
						label="Email Address or User Name"
						onChangeText={(val) => setEmail(val)}
						placeholder="test@liferay.com"
						spellCheck={false}
						textContentType="emailAddress"
						value={email}
					/>

					<Input
						autoCapitalize="none"
						autoComplete="off"
						autoCorrect={false}
						containerStyle={styles.mb3}
						label="Password"
						onChangeText={(val) => setPassword(val)}
						placeholder="test"
						secureTextEntry={true}
						spellCheck={false}
						textContentType="password"
						value={password}
					/>

					<Button
						onPress={() => handleLogin()}
						style={styles.m2}
						title="Login"
					/>
				</>
			) : (
				<>
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
		</KeyboardAvoidingView>
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
				component={Login}
				name="Login"
				options={{
					headerTitle: 'Login',
				}}
			/>
		</Stack.Navigator>
	);
}

export default LoginNavigator;
