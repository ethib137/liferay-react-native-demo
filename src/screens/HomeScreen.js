import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

import ToggleDrawerButton from '../components/ToggleDrawerButton';
import styles from '../styles/main';

const Home = () => {
	return (
		<View style={[styles.centerContent]}>
			<Image
				source={require('../../assets/icon.png')}
				style={[homeStyles.image, styles.mb4]}
			/>

			<Text style={styles.textCenter}>
				Welcome to the Liferay React Native Demo App.
			</Text>
		</View>
	);
};

const homeStyles = StyleSheet.create({
	image: {
		alignSelf: 'center',
		height: 100,
		width: 100,
	},
});

const Stack = createStackNavigator();

function HomeNavigator({navigation}) {
	return (
		<Stack.Navigator
			initialRouteName="Home"
			screenOptions={{
				headerRight: () => (
					<ToggleDrawerButton navigation={navigation} />
				),
			}}
		>
			<Stack.Screen
				component={Home}
				name="Home"
				options={{
					headerTitle: 'Welcome',
				}}
			/>
		</Stack.Navigator>
	);
}

export default HomeNavigator;
