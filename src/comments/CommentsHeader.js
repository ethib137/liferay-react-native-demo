import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import styles from '../styles/main';
import {greys} from '../styles/values';

function CommentsHeader(props) {
	const {containerStyle} = props;

	return (
		<View style={[commentsHeaderStyles.container, containerStyle]}>
			<Text style={[styles.my1, styles.mx2]}>Comments:</Text>
		</View>
	);
}

const commentsHeaderStyles = StyleSheet.create({
	container: {
		backgroundColor: greys[0],
		borderBottomWidth: 1,
		borderColor: greys[1],
		borderStyle: 'solid',
		borderTopWidth: 1,
	},
});

CommentsHeader.propTypes = {
	containerStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default CommentsHeader;
