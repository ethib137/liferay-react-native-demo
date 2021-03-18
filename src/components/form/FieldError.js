import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Text} from 'react-native';

import {spacing} from '../../styles/values';
import {isEmptyString} from '../../util/util';

function FieldError({containerStyle, error}) {
	return (
		isEmptyString(error) && (
			<Text style={[fieldStyles.error, containerStyle]}>{error}</Text>
		)
	);
}

const fieldStyles = StyleSheet.create({
	error: {
		color: '#F00',
		marginBottom: spacing[1],
		marginLeft: spacing[2],
		marginRight: spacing[2],
	},
});

FieldError.propTypes = {
	containerStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
	error: PropTypes.string,
};

export default FieldError;
