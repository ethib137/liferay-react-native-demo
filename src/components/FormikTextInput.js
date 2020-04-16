import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';

function FormikTextInput(props) {
	const {
		containerStyle = {},
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
		<View style={[containerStyle]}>
			{label && (
				<View style={inputStyles.label}>
					<Text>{label}</Text>
					{required && (
						<Text style={inputStyles.required}>(Required)</Text>
					)}
				</View>
			)}

			<TextInput
				{...otherProps}
				onBlur={handleBlur(name)}
				onChangeText={handleChange(name)}
				style={[inputStyles.input, style]}
				value={values[name]}
			/>

			{errors[name] && (
				<Text style={inputStyles.error}>{errors[name]}</Text>
			)}
		</View>
	);
}

const inputStyles = StyleSheet.create({
	error: {
		color: '#F00',
		marginTop: 8,
	},
	input: {
		borderColor: '#999',
		borderRadius: 4,
		borderWidth: 2,
		padding: 12,
	},
	label: {
		flexDirection: 'row',
		marginBottom: 8,
	},
	required: {
		color: '#777',
		marginLeft: 4,
	},
});

export default FormikTextInput;
