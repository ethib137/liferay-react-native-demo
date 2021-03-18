import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, View} from 'react-native';

import styles from '../../styles/main';

function FieldContainer(props) {
	const {children, containerStyle} = props;

	return (
		<View style={[containerStyle, fieldStyles.container, styles.mb1]}>
			{children}
		</View>
	);
}

const fieldStyles = StyleSheet.create({
	container: {
		backgroundColor: 'rgba(0,0,0,0.1)',
		color: 'rgba(0,0,0,0.5)',
	},
});

FieldContainer.propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.element),
		PropTypes.element,
	]).isRequired,
	containerStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default FieldContainer;
