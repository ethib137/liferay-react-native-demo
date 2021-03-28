import React from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

function FormContainer(props) {
	return (
		<KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
			{props.children}
		</KeyboardAwareScrollView>
	);
}

export default FormContainer;
