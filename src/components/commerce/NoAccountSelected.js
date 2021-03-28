import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Text, View} from 'react-native';
import {Button} from 'react-native-elements';

import gStyles from '../../styles/main';

function NoAccountSelected() {
	const navigation = useNavigation();

	return (
		<View style={gStyles.m2}>
			<Text style={[gStyles.textCenter, gStyles.mb2]}>
				Please select an account in order to view.
			</Text>

			<Button
				onPress={() => navigation.navigate('Accounts')}
				title="Select an Account"
			/>
		</View>
	);
}

export default NoAccountSelected;
