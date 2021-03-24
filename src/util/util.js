import {Alert} from 'react-native';

export function isEmptyString(string) {
	return !!string && string.length > 0;
}

export function debugAlert(error) {
	let text = '';

	if (typeof error == 'string') {
		text = error;
	} else if (typeof error == 'object') {
		if (error instanceof Error) {
			text = error.message;
		} else {
			text = JSON.stringify(error);
		}
	}

	Alert.alert(
		'Confirm:',
		text,
		[
			{
				style: 'cancel',
				text: 'Cancel',
			},
		],
		{cancelable: true}
	);
}
