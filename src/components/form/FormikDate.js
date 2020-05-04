import DateTimePicker from '@react-native-community/datetimepicker';
import {format} from 'date-fns';
import React from 'react';

import CollapsibleField from './CollapsibleField';

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

	return (
		<CollapsibleField
			containerStyle={containerStyle}
			error={errors[name]}
			label={label}
			required={required}
			value={format(values[name], 'LLL dd yyyy')}
		>
			<DateTimePicker
				display="default"
				is24Hour={true}
				onChange={(event, date) => setFieldValue(name, date)}
				timeZoneOffsetInMinutes={0}
				value={values[name]}
				{...otherProps}
			/>
		</CollapsibleField>
	);
}

export default FormikDate;
