import React from 'react';
import {View} from 'react-native';
import {Button} from 'react-native-elements';

import styles from '../styles/main';
import Alert, {DISPLAY_TYPES} from './Alert';

function ErrorDisplay({error, onRetry}) {
	return (
		<View style={styles.m2}>
			<Alert
				containerStyle={styles.mb2}
				displayType={DISPLAY_TYPES.danger}
				text={error ? error : 'There is an error.'}
			/>

			<Button onPress={onRetry} title="Retry Request" />
		</View>
	);
}

export default ErrorDisplay;
