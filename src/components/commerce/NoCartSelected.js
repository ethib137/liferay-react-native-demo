import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Text, View} from 'react-native';
import {Button} from 'react-native-elements';

import gStyles from '../../styles/main';

function NoCartSelected() {
	const navigation = useNavigation();

	return (
		<View style={gStyles.m2}>
			<Text style={[gStyles.textCenter, gStyles.mb2]}>
				Please select a cart in order to add products.
			</Text>

			<Button
				onPress={() => navigation.navigate('Cart')}
				title="Select a Cart"
			/>
		</View>
	);
}

export default NoCartSelected;
