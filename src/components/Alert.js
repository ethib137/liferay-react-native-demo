import {Ionicons, MaterialIcons} from '@expo/vector-icons';
import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import styles from '../styles/main';
import {colors} from '../styles/values';

const DISPLAY_TYPES = ['danger', 'info', 'success', 'warning'];

const ICON_DISPLAY_MAP = {
	danger: 'error',
	info: 'md-information-circle',
	success: 'md-checkmark-circle',
	warning: 'md-warning',
};

function Alert(props) {
	const {containerStyle, displayType = DISPLAY_TYPES[1], text} = props;

	return (
		<View
			style={[
				alertStyles.container,
				styles.px2,
				containerStyle,
				alertStyles[displayType],
			]}
		>
			{displayType === 'danger' ? (
				<MaterialIcons
					color={colors[displayType].text}
					name={ICON_DISPLAY_MAP[displayType]}
					size={20}
				/>
			) : (
				<Ionicons
					color={colors[displayType].text}
					name={ICON_DISPLAY_MAP[displayType]}
					size={20}
				/>
			)}

			<Text style={[alertStyles[displayType], styles.ml1]}>{text}</Text>
		</View>
	);
}

const alertStyles = StyleSheet.create({
	container: {
		alignItems: 'center',
		borderRadius: 8,
		borderWidth: 1,
		flexDirection: 'row',
		paddingBottom: 12,
		paddingTop: 12,
	},
	[DISPLAY_TYPES[0]]: {
		backgroundColor: colors.danger.background,
		borderColor: colors.danger.border,
		color: colors.danger.text,
	},
	[DISPLAY_TYPES[1]]: {
		backgroundColor: colors.info.background,
		borderColor: colors.info.border,
		color: colors.info.text,
	},
	[DISPLAY_TYPES[2]]: {
		backgroundColor: colors.success.background,
		borderColor: colors.success.border,
		color: colors.success.text,
	},
	[DISPLAY_TYPES[3]]: {
		backgroundColor: colors.warning.background,
		borderColor: colors.warning.border,
		color: colors.warning.text,
	},
});

Alert.propTypes = {
	containerStyle: PropTypes.object,
	displayType: PropTypes.oneOf(DISPLAY_TYPES),
	text: PropTypes.string.isRequired,
};

export default Alert;
