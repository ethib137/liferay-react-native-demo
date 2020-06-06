import {Ionicons} from '@expo/vector-icons';
import React from 'react';
import {View} from 'react-native';
import {CheckBox} from 'react-native-elements';

import {colors} from '../../styles/values';
import CollapsibleField from './CollapsibleField';
import {getSelectedOption} from './form-util';

function FormikRadio(props) {
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

	return (
		<CollapsibleField
			containerStyle={containerStyle}
			error={errors[name]}
			label={label}
			required={required}
			value={getSelectedOption([values[name]], options)}
		>
			<View>
				{options.map((item) => (
					<CheckBox
						{...otherProps}
						checked={values[name] === item.value}
						checkedIcon={
							<Ionicons
								color={colors.primary}
								name="ios-radio-button-on"
								size={24}
							/>
						}
						key={item.value}
						name={name}
						onBlur={handleBlur(name)}
						onPress={() => setFieldValue(name, item.value)}
						title={item.label}
						uncheckedIcon={
							<Ionicons
								color={colors.secondary}
								name="ios-radio-button-off"
								size={24}
							/>
						}
					/>
				))}
			</View>
		</CollapsibleField>
	);
}

export default FormikRadio;
