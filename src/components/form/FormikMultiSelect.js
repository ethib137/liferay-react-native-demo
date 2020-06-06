import {Ionicons} from '@expo/vector-icons';
import React from 'react';
import {View} from 'react-native';
import {CheckBox} from 'react-native-elements';

import {colors} from '../../styles/values';
import CollapsibleField from './CollapsibleField';
import {getSelectedOption} from './form-util';

function FormikMultiSelect(props) {
	const {
		containerStyle,
		errors,
		handleBlur,
		label,
		name,
		options,
		required,
		setFieldValue,
		values,
		...otherProps
	} = props;

	const value = values[name];

	return (
		<CollapsibleField
			containerStyle={containerStyle}
			error={errors[name]}
			label={label}
			required={required}
			value={getSelectedOption(value, options)}
		>
			<View>
				{options.map((option) => (
					<CheckBox
						{...otherProps}
						checked={value.includes(option.value)}
						checkedIcon={
							<Ionicons
								color={colors.primary}
								name="md-checkbox-outline"
								size={24}
							/>
						}
						iconType="ionicon"
						key={option.value}
						name={name}
						onBlur={handleBlur(name)}
						onPress={() => {
							const newValue = [];

							options.forEach((opt) => {
								if (
									(!value.includes(opt.value) &&
										option.value === opt.value) ||
									(value.includes(opt.value) &&
										option.value !== opt.value)
								) {
									newValue.push(opt.value);
								}
							});

							setFieldValue(name, newValue);
						}}
						title={option.label}
						uncheckedIcon={
							<Ionicons
								color={colors.secondary}
								name="md-square-outline"
								size={24}
							/>
						}
					/>
				))}
			</View>
		</CollapsibleField>
	);
}

export default FormikMultiSelect;
