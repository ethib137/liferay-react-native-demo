import {Ionicons} from '@expo/vector-icons';
import React from 'react';
import {View} from 'react-native';
import {CheckBox} from 'react-native-elements';

import {colors} from '../../styles/values';
import CollapsibleField from './CollapsibleField';

function FormikMultiSelect(props) {
	const {
		containerStyle,
		errors,
		handleBlur,
		items,
		label,
		name,
		required,
		setFieldValue,
		values,
		...otherProps
	} = props;

	const value = values[name];

	const stringValue = Object.keys(value)
		.filter((key) => value[key])
		.join(', ');

	return (
		<CollapsibleField
			containerStyle={containerStyle}
			error={errors[name]}
			label={label}
			required={required}
			value={stringValue}
		>
			<View>
				{items.map((item) => (
					<CheckBox
						{...otherProps}
						checked={value[item.value]}
						checkedIcon={
							<Ionicons
								color={colors.primary}
								name="md-checkbox-outline"
								size={24}
							/>
						}
						iconType="ionicon"
						key={item.value}
						name={name}
						onBlur={handleBlur(name)}
						onPress={() =>
							setFieldValue(name, {
								...value,
								[item.value]: !value[item.value],
							})
						}
						title={item.label}
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
