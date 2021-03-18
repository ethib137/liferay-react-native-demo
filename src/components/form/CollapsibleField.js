import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import styles from '../../styles/main';
import {greys, spacing} from '../../styles/values';
import {isEmptyString} from '../../util/util';
import Collapsible from '../Collapsible';
import FieldContainer from './FieldContainer';
import FieldError from './FieldError';
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

	return (
		<FieldContainer containerStyle={containerStyle}>
			<Collapsible
				header={
					label && (
						<View style={fieldStyles.header}>
							<FieldLabel
								label={`${label}:`}
								required={required}
								style={fieldStyles.label}
							/>

							{isEmptyString(value) && (
								<Text style={styles.ml2}>{value}</Text>
							)}
						</View>
					)
				}
				headerStyle={styles.mr2}
			>
				<View style={fieldStyles.children}>{children}</View>
			</Collapsible>

			<FieldError error={error} />
		</FieldContainer>
	);
}

const fieldStyles = StyleSheet.create({
	children: {
		backgroundColor: 'rgba(0,0,0,0.1)',
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
