import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Text, View} from 'react-native';
import {Button} from 'react-native-elements';

import styles from '../../styles/main';

function NoAccountSelected() {
	const navigation = useNavigation();

	return (
		<View style={styles.m2}>
			<Text style={[styles.textCenter, styles.mb2]}>
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
