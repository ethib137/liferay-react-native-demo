import DateTimePicker from '@react-native-community/datetimepicker';
import {format} from 'date-fns';
import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import styles from '../../styles/main';
import {greys, spacing} from '../../styles/values';
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

	return (
		<View style={[containerStyle, fieldStyles.container, styles.mb1]}>

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

				<Text>{values[name]?format(values[name], 'LLL dd yyyy'):''}</Text>

				{show && (
					<DateTimePicker
						display="default"
						is24Hour={true}
						mode={'date'}
						onChange={(event, date) => {
							setShow(false);

							if (event.type != "dismissed") {
								setFieldValue(name, date);
							}
						}}
						timeZoneOffsetInMinutes={0}
						value={values[name]}
						{...otherProps}
					/>
				)}
			</TouchableOpacity>

			{errors[name] && (
				<Text style={fieldStyles.error}>{errors[name]}</Text>
			)}
		</View>
	);
}

const fieldStyles = StyleSheet.create({
	container: {
		backgroundColor: 'rgba(0,0,0,0.1)',
		color: 'rgba(0,0,0,0.5)',
	},
	header: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: spacing[2],
		paddingBottom: spacing[1],
	},
	error: {
		color: '#F00',
		marginBottom: spacing[1],
		marginLeft: spacing[2],
		marginRight: spacing[2],
	},
	label: {
		color: greys[0],
	},
});

export default FormikDate;
