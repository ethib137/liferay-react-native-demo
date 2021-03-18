import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';

import {greys, spacing} from '../../styles/values';
import FieldError from './FieldError';
import FieldLabel from './FieldLabel';

function FormikTextInput(props) {
	const {
		containerStyle = {},
		display,
		errors = {},
		handleBlur,
		handleChange,
		label,
		name,
		required = false,
		style = {},
		values = {},
		...otherProps
	} = props;

	return (
		<View style={[inputStyles[`${display}Container`], containerStyle]}>
			{label && (
				<FieldLabel
					containerStyle={[inputStyles[`${display}Label`]]}
					label={label}
					required={required}
				/>
			)}

			<TextInput
				{...otherProps}
				onBlur={handleBlur(name)}
				onChangeText={handleChange(name)}
				style={[
					inputStyles.input,
					inputStyles[`${display}Input`],
					style,
				]}
				textContentType="password"
				value={values[name]}
			/>

			<FieldError error={errors[name]} />
		</View>
	);
}

const inputStyles = StyleSheet.create({
	input: {
		borderColor: '#999',
		borderRadius: 4,
		borderWidth: 2,
		padding: 12,
	},
	iosContainer: {
		backgroundColor: greys[0],
		marginBottom: 8,
	},
	iosInput: {
		backgroundColor: greys[1],
		borderRadius: 0,
		borderWidth: 0,
		marginTop: spacing[1],
		padding: spacing[2],
		paddingTop: spacing[2],
	},
	iosLabel: {
		marginLeft: spacing[2],
		marginRight: spacing[2],
		marginTop: spacing[2],
	},
});

export default FormikTextInput;
