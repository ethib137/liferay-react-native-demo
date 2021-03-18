import DateTimePicker from '@react-native-community/datetimepicker';
import {format} from 'date-fns';
import React, {useState} from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity} from 'react-native';

import styles from '../../styles/main';
import {greys, spacing} from '../../styles/values';
import {isEmptyString} from '../../util/util';
import CollapsibleField from './CollapsibleField';
import FieldContainer from './FieldContainer';
import FieldError from './FieldError';
import FieldLabel from './FieldLabel';

function FormikDate(props) {
	const {
		containerStyle,
		errors,
		label,
		name,
		required,
		setFieldValue,
		values,
		...otherProps
	} = props;

	const [show, setShow] = useState(false);

	const formattedValue = format(values[name], 'LLL dd yyyy');

	const dateError = errors[name];

	const DatePicker = (
		<DateTimePicker
			display="default"
			is24Hour={true}
			mode={'date'}
			onChange={(event, date) => {
				setShow(false);

				if (event.type != 'dismissed') {
					setFieldValue(name, date);
				}
			}}
			timeZoneOffsetInMinutes={0}
			value={values[name]}
			{...otherProps}
		/>
	);

	if (Platform.OS === 'ios') {
		return (
			<CollapsibleField
				containerStyle={containerStyle}
				error={dateError}
				label={label}
				required={required}
				value={formattedValue}
			>
				{DatePicker}
			</CollapsibleField>
		);
	} else {
		return (
			<FieldContainer containerStyle={containerStyle}>
				<TouchableOpacity
					onPress={() => setShow(true)}
					style={fieldStyles.header}
				>
					{label && (
						<FieldLabel
							label={`${label}:`}
							required={required}
							style={[fieldStyles.label, styles.mr2]}
						/>
					)}

					{isEmptyString(formattedValue) && (
						<Text>{formattedValue}</Text>
					)}

					{show && DatePicker}
				</TouchableOpacity>

				<FieldError error={dateError} />
			</FieldContainer>
		);
	}
}

const fieldStyles = StyleSheet.create({
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

export default FormikDate;
