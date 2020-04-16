import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Text, View} from 'react-native';
import {Button} from 'react-native-elements';

import styles from '../styles/main';

function NoSiteSelected() {
	const navigation = useNavigation();

	return (
		<View style={styles.m2}>
			<Text style={[styles.textCenter, styles.mb2]}>
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
