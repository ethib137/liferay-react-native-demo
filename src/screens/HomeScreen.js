import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

import ToggleDrawerButton from '../components/ToggleDrawerButton';
import gStyles from '../styles/main';
import {greys} from '../styles/values';

const Home = () => {
	return (
		<View style={[gStyles.centerContent]}>
			<Image
				source={require('../../assets/icon.png')}
				style={[homeStyles.image, gStyles.mb4]}
			/>

			<Text style={gStyles.textCenter}>
				Welcome to the Liferay React Native Demo App.
			</Text>

			<Text style={[homeStyles.version, gStyles.textCenter, gStyles.m2]}>
				Version: 0.1.0
			</Text>
			<Text style={[homeStyles.version, gStyles.textCenter, gStyles.m2]}>
				Developed Against:
			</Text>
			<Text style={[homeStyles.version, gStyles.textCenter]}>
				7.4.13 Update 68
			</Text>
			<Text style={[homeStyles.version, gStyles.textCenter]}>
				With Commerce
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
