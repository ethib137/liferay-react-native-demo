import {Formik} from 'formik';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {Button} from 'react-native-elements';
import {useQuery} from 'react-query';

import {useAppState} from '../../hooks/appState';
import gStyles from '../../styles/main';
import ErrorDisplay from '../ErrorDisplay';
import Loading from '../Loading';
import FormContainer from './FormContainer';
import FormikDate from './FormikDate';
import FormikMultiSelect from './FormikMultiSelect';
import FormikPicker from './FormikPicker';
import FormikRadio from './FormikRadio';
import FormikTextInput from './FormikTextInput';
import Paragraph from './Paragraph';

const checkboxMultipleInput = {
	getPredefinedValue: (formField) => {
		return JSON.parse(formField.predefinedValue);
	},
	getValueForSubmit: (value) => JSON.stringify(value),
	inputControl: 'checkbox_multiple',
	render: (field, formikObj) => (
		<FormikMultiSelect
			key={field.name}
			label={field.label}
			name={field.name}
			options={field.formFieldOptions}
			required={field.required}
			{...formikObj}
		/>
	),
};

const dateInput = {
	getPredefinedValue: (formField) => {
		const {predefinedValue} = formField;

		return predefinedValue ? new Date(predefinedValue) : new Date();
	},
	getValueForSubmit: (value) => value.toISOString(),
	inputControl: 'date',
	render: (field, formikObj) => (
		<FormikDate
			key={field.name}
			label={field.label}
			name={field.name}
			required={field.required}
			{...formikObj}
		/>
	),
};

const paragraph = {
	inputControl: 'paragraph',
	render: (field) => (
		<Paragraph
			containerStyle={[gStyles.mx2, gStyles.mb1]}
			key={field.name}
			label={field.label}
			text={field.text}
		/>
	),
};

const radioInput = {
	getPredefinedValue: (formField) => {
		return JSON.parse(formField.predefinedValue)[0];
	},
	getValueForSubmit: (value) => value,
	inputControl: 'radio',
	render: (field, formikObj) => (
		<FormikRadio
			key={field.name}
			label={field.label}
			name={field.name}
			options={field.formFieldOptions}
			required={field.required}
			{...formikObj}
		/>
	),
};

const selectInput = {
	getPredefinedValue: (formField) => {
		return JSON.parse(formField.predefinedValue)[0];
	},
	getValueForSubmit: (value) => JSON.stringify([value]),
	inputControl: 'select',
	render: (field, formikObj) => (
		<FormikPicker
			key={field.name}
			label={field.label}
			name={field.name}
			options={field.formFieldOptions}
			required={field.required}
			{...formikObj}
		/>
	),
};

const textInput = {
	getPredefinedValue: (formField) => formField.predefinedValue,
	getValueForSubmit: (value) => value,
	inputControl: 'text',
	render: (field, formikObj) => (
		<FormikTextInput
			containerStyle={[gStyles.mb1, {backgroundColor: 'rgba(0,0,0,0.1)'}]}
			key={field.name}
			multiline={field.displayStyle === 'multiline'}
			name={field.name}
			placeholder={field.label + (field.required ? ' (Required)' : '')}
			required={field.required}
			style={{
				borderRadius: 0,
				borderWidth: 0,
				marginTop: 8,
				padding: 16,
				paddingTop: 8,
			}}
			{...formikObj}
		/>
	),
};

const fields = {};

[
	checkboxMultipleInput,
	dateInput,
	paragraph,
	radioInput,
	selectInput,
	textInput,
].forEach((input) => {
	fields[input.inputControl] = input;
});

function FormField({field, formikObj}) {
	if (fields[field.inputControl]) {
		return fields[field.inputControl].render(field, formikObj);
	} else {
		return null;
	}
}

function getInitialValues(form) {
	const initialValues = {};

	if (form) {
		form.structure.formPages.forEach((formPage) => {
			formPage.formFields.forEach((formField) => {
				if (fields[formField.inputControl]) {
					const {getPredefinedValue} = fields[formField.inputControl];

					if (getPredefinedValue) {
						initialValues[formField.name] = getPredefinedValue(
							formField
						);
					}
				}
			});
		});
	}

	return initialValues;
}

function prepareValuesForSubmit(values, formPages) {
	const formFieldValues = [];

	formPages.forEach((formPage) => {
		formPage.formFields.forEach(({inputControl, name}) => {
			if (fields[inputControl]) {
				const {getValueForSubmit} = fields[inputControl];

				const value = values[name];

				if (getValueForSubmit && value) {
					formFieldValues.push({
						name,
						value: getValueForSubmit(value),
					});
				}
			}
		});
	});

	return formFieldValues;
}

function Form({route}) {
	const [, , request] = useAppState();

	const {formId} = route.params;

	const {data, error, refetch, status} = useQuery(
		formId && ['form', formId],
		() => {
			return request(`/o/headless-form/v1.0/forms/${formId}`);
		}
	);

	const form = data;

	const [loading, setLoading] = useState(false);

	return (
		<View>
			{status === 'error' && (
				<ErrorDisplay error={error.message} onRetry={() => refetch()} />
			)}

			<Loading loading={status === 'loading'}>
				{form && (
					<FormContainer>
						<Formik
							initialValues={getInitialValues(form)}
							onSubmit={(values, {resetForm, setSubmitting}) => {
								if (form) {
									setLoading(true);

									request(
										`/o/headless-form/v1.0/forms/${formId}/form-records`,
										{
											data: {
												draft: false,
												formFieldValues: prepareValuesForSubmit(
													values,
													form.structure.formPages
												),
											},
											method: 'POST',
										}
									).then(() => {
										resetForm();
										setSubmitting(false);
										setLoading(false);
									});
								}
							}}
							validate={(values) => {
								const errors = {};

								form.structure.formPages.forEach((formPage) => {
									formPage.formFields.forEach(
										({name, required}) => {
											if (required && !values[name]) {
												errors[name] = 'Required';
											}
										}
									);
								});

								return errors;
							}}
						>
							{(formikObj) => (
								<>
									<Text style={[gStyles.m2]}>
										{form.name}
									</Text>

									{form.description.length > 0 && (
										<Text
											style={[gStyles.mb2, gStyles.mx2]}
										>
											{form.description}
										</Text>
									)}

									{form.structure.formPages.map(
										(formPage, i) => (
											<View key={i}>
												{formPage.headline.length >
													0 && (
													<Text
														style={[
															gStyles.m2,
															gStyles.textCenter,
														]}
													>
														{formPage.headline}
													</Text>
												)}
												{formPage.text.length > 0 && (
													<Text
														style={[
															gStyles.m2,
															gStyles.textCenter,
														]}
													>
														{formPage.text}
													</Text>
												)}

												{formPage.formFields.map(
													(formField, i) => (
														<FormField
															autoFocus={i === 0}
															field={formField}
															formikObj={
																formikObj
															}
															key={formField.name}
														/>
													)
												)}
											</View>
										)
									)}

									<Button
										disabled={
											Object.keys(formikObj.errors)
												.length > 0 &&
											!formikObj.isSubmitting
										}
										loading={loading}
										onPress={formikObj.handleSubmit}
										style={gStyles.m2}
										title="Submit"
									/>
								</>
							)}
						</Formik>
					</FormContainer>
				)}
			</Loading>
		</View>
	);
}

Form.propTypes = {
	formId: PropTypes.number,
};

export default Form;
