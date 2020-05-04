import React from 'react';
import {Picker} from 'react-native';

import CollapsibleField from './CollapsibleField';

function FormikPicker(props) {
	const {
		containerStyle,
		errors,
		label,
		name,
		options = [],
		required,
		setFieldValue,
		values,
		...otherProps
	} = props;

	const selectedOption = options.find(
		(option) => option.value === values[name]
	);

	return (
		<CollapsibleField
			containerStyle={containerStyle}
			error={errors[name]}
			label={label}
			required={required}
			value={selectedOption ? selectedOption.label : ''}
		>
			<Picker
				{...otherProps}
				onValueChange={(itemValue) => setFieldValue(name, itemValue)}
				selectedValue={values[name]}
			>
				{options.map(({label, value}) => (
					<Picker.Item key={value} label={label} value={value} />
				))}
			</Picker>
		</CollapsibleField>
	);
}

export default FormikPicker;
