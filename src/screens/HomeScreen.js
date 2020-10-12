import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

import ToggleDrawerButton from '../components/ToggleDrawerButton';
import styles from '../styles/main';
import {greys} from '../styles/values';

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

			<Text style={[homeStyles.version, styles.textCenter, styles.m2]}>
				Version: 0.0.3
			</Text>
			<Text style={[homeStyles.version, styles.textCenter, styles.m2]}>
				Developed Against:
			</Text>
			<Text style={[homeStyles.version, styles.textCenter]}>
				7.2 FP7, 7.2 FP8, 7.3 GA1 (Unreleased)
			</Text>
			<Text style={[homeStyles.version, styles.textCenter]}>
				Commerce 2.1.2
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
	version: {
		color: greys[2],
		fontSize: 11,
		textTransform: 'uppercase',
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
