import PropTypes from 'prop-types';
import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

function Loading(props) {
	const {
		children,
		color = '#FFF',
		containerStyle,
		loading = false,
		size = 'large',
	} = props;

	if (loading) {
		let loadingIndicator = <ActivityIndicator color={color} size={size} />;

		if (children) {
			loadingIndicator = (
				<View style={loadingStyles.overlay}>{loadingIndicator}</View>
			);
		}

		return (
			<View style={[containerStyle]}>
				{loadingIndicator}

				{children}
			</View>
		);
	} else {
		return children || null;
	}
}

const loadingStyles = StyleSheet.create({
	overlay: {
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,0.3)',
		height: '100%',
		justifyContent: 'center',
		position: 'absolute',
		width: '100%',
		zIndex: 1,
	},
});

Loading.propTypes = {
	color: PropTypes.string,
	containerStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
	loading: PropTypes.bool,
	size: PropTypes.string,
};

export default Loading;
