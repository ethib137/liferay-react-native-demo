import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Text, View} from 'react-native';
import {Button} from 'react-native-elements';

import styles from '../../styles/main';

function NoCartSelected() {
	const navigation = useNavigation();

	return (
		<View style={styles.m2}>
			<Text style={[styles.textCenter, styles.mb2]}>
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
