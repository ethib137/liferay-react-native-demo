import {Picker} from '@react-native-picker/picker';
import React from 'react';

import CollapsibleField from './CollapsibleField';
import {getSelectedOption} from './form-util';

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

	return (
		<CollapsibleField
			containerStyle={containerStyle}
			error={errors[name]}
			label={label}
			required={required}
			value={getSelectedOption([values[name]], options)}
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
