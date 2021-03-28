import {Alert} from 'react-native';

export function isEmptyString(string) {
	if (typeof string != 'string') {
		return true;
	}

	string = string.trim();

	return !string || string.length == 0;
}

export function isNotEmptyString(string) {
	return !isEmptyString(string);
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
