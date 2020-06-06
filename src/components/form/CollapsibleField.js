import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import styles from '../../styles/main';
import {greys, spacing} from '../../styles/values';
import Collapsible from '../Collapsible';
import FieldLabel from './FieldLabel';

function CollapsibleField(props) {
	const {
		children,
		containerStyle,
		error = '',
		label,
		required,
		value = '',
	} = props;

	const showError = !!error && error.length > 0;
	const showValue = !!value && value.length > 0;

	return (
		<View style={[containerStyle, fieldStyles.container, styles.mb1]}>
			<Collapsible
				header={
					label && (
						<View style={fieldStyles.header}>
							<FieldLabel
								label={`${label}:`}
								required={required}
								style={fieldStyles.label}
							/>

							{showValue && (
								<Text style={styles.ml2}>{value}</Text>
							)}
						</View>
					)
				}
				headerStyle={styles.mr2}
			>
				<View style={fieldStyles.children}>{children}</View>
			</Collapsible>

			{showError && <Text style={fieldStyles.error}>{error}</Text>}
		</View>
	);
}

const fieldStyles = StyleSheet.create({
	children: {
		backgroundColor: 'rgba(0,0,0,0.1)',
	},
	container: {
		backgroundColor: 'rgba(0,0,0,0.1)',
		color: 'rgba(0,0,0,0.5)',
	},
	error: {
		color: '#F00',
		marginBottom: spacing[1],
		marginLeft: spacing[2],
		marginRight: spacing[2],
	},
	header: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: spacing[2],
		paddingBottom: spacing[1],
	},
	label: {
		color: greys[0],
	},
});

CollapsibleField.propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.element),
		PropTypes.element,
	]).isRequired,
	containerStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
	error: PropTypes.string,
	label: PropTypes.string.isRequired,
	required: PropTypes.bool,
	value: PropTypes.string,
};

export default CollapsibleField;
