import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

function FieldLabel(props) {
	const {containerStyle = {}, label, required} = props;

	return (
		<View style={[inputStyles.container, containerStyle]}>
			<Text style={inputStyles.label}>{label}</Text>

			{required && <Text style={inputStyles.required}>(Required)</Text>}
		</View>
	);
}

const inputStyles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		marginBottom: 8,
	},
	label: {
		color: '#777',
	},
	required: {
		color: '#777',
		marginLeft: 4,
	},
});

FieldLabel.propTypes = {
	containerStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
	label: PropTypes.string.isRequired,
	required: PropTypes.bool,
};

export default FieldLabel;
