import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {View} from 'react-native';

import ToggleDrawerButton from '../components/ToggleDrawerButton';
import Form from '../components/form/Form';

const FormsScreen = () => {
	return (
		<View>
			<Form formId="646775" />
		</View>
	);
};

const Stack = createStackNavigator();

function FormsNavigator({navigation}) {
	return (
		<Stack.Navigator
			initialRouteName="Forms"
			screenOptions={{
				headerRight: () => (
					<ToggleDrawerButton navigation={navigation} />
				),
			}}
		>
			<Stack.Screen
				component={FormsScreen}
				name="Forms"
				options={{
					headerTitle: 'Forms',
				}}
			/>
		</Stack.Navigator>
	);
}

export default FormsNavigator;
