import React from 'react';
import {View} from 'react-native';
import {Button} from 'react-native-elements';

import gStyles from '../styles/main';
import Alert, {DISPLAY_TYPES} from './Alert';

function ErrorDisplay({error, onRetry}) {
	return (
		<View style={gStyles.m2}>
			<Alert
				containerStyle={gStyles.mb2}
				displayType={DISPLAY_TYPES.danger}
				text={error ? error : 'There is an error.'}
			/>

			<Button onPress={onRetry} title="Retry Request" />
		</View>
	);
}

export default ErrorDisplay;
