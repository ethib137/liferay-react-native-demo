import React from 'react';
import {
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	TouchableWithoutFeedback,
} from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';

function FormContainer(props) {
	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<ScrollView>
				<KeyboardAvoidingView
					behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
				>
					{props.children}

					<KeyboardSpacer />
				</KeyboardAvoidingView>
			</ScrollView>
		</TouchableWithoutFeedback>
	);
}

export default FormContainer;
