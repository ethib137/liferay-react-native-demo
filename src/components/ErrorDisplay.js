import React from 'react';
import {Text, View} from 'react-native';
import {Button} from 'react-native-elements';

import styles from '../styles/main';

function ErrorDisplay({error, onRetry}) {
	return (
		<View style={styles.m2}>
			<Text style={[styles.mb2, styles.textCenter]}>
				{error ? error : 'There is an error.'}
			</Text>

			<Button onPress={onRetry} title="Retry Request" />
		</View>
	);
}

export default ErrorDisplay;
