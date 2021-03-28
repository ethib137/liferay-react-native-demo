import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Text, View} from 'react-native';
import {Button} from 'react-native-elements';

import gStyles from '../styles/main';

function NoSiteSelected() {
	const navigation = useNavigation();

	return (
		<View style={gStyles.m2}>
			<Text style={[gStyles.textCenter, gStyles.mb2]}>
				Please select a site in order to view.
			</Text>

			<Button
				onPress={() => navigation.navigate('Sites')}
				title="Select a Site"
			/>
		</View>
	);
}

export default NoSiteSelected;
