import React from 'react';
import {Keyboard, TouchableWithoutFeedback} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

function FormContainer(props) {
	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<KeyboardAwareScrollView>{props.children}</KeyboardAwareScrollView>
		</TouchableWithoutFeedback>
	);
}

export default FormContainer;
