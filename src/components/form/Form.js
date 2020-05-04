import {Formik} from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import {Text, View} from 'react-native';
import {Button} from 'react-native-elements';

import {useAppState} from '../../hooks/appState';
import useFetch from '../../hooks/useFetch';
import styles from '../../styles/main';
import {statefulRequest} from '../../util/request';
import ErrorDisplay from '../ErrorDisplay';
import FormContainer from './FormContainer';
import FormikDate from './FormikDate';
import FormikMultiSelect from './FormikMultiSelect';
import FormikPicker from './FormikPicker';
import FormikRadio from './FormikRadio';
import FormikTextInput from './FormikTextInput';
import Paragraph from './Paragraph';

function FormField({autoFocus, field, formikObj}) {
	switch (field.inputControl) {
		case 'checkbox_multiple': {
			return (
				<FormikMultiSelect
					items={field.formFieldOptions}
					label={field.label}
					name={field.name}
					required={field.required}
					{...formikObj}
				/>
			);
		}
		case 'date': {
			return (
				<FormikDate
					label={field.label}
					name={field.name}
					required={field.required}
					{...formikObj}
				/>
			);
		}
		case 'paragraph': {
			return (
				<Paragraph
					containerStyle={[styles.mx2, styles.mb1]}
					label={field.label}
					text={field.text}
				/>
			);
		}
		case 'select': {
			return (
				<FormikPicker
					label={field.label}
					name={field.name}
					options={field.formFieldOptions}
					required={field.required}
					{...formikObj}
				/>
			);
		}
		case 'text': {
			return (
				<FormikTextInput
					autoFocus={autoFocus}
					containerStyle={[
						styles.mb1,
						{backgroundColor: 'rgba(0,0,0,0.1)'},
					]}
					multiline={field.displayStyle === 'multiline'}
					name={field.name}
					placeholder={field.label}
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
			);
		}
		case 'radio': {
			return (
				<FormikRadio
					items={field.formFieldOptions}
					label={field.label}
					name={field.name}
					required={field.required}
					{...formikObj}
				/>
			);
		}
		default:
			return null;
	}
}

function Form({formId}) {
	const [state] = useAppState();

	const [form, loading, error, handleRequest] = useFetch(
		() => statefulRequest(state)(`/o/headless-form/v1.0/forms/${formId}`),
		[formId],
		(res) => res
	);

	const initialValues = {};

	if (form) {
		form.structure.formPages.map((formPage) => {
			formPage.formFields.map((formField) => {
				let initialValue = '';

				const {inputControl} = formField;

				if (inputControl === 'date') {
					initialValue = new Date();
				} else if (inputControl === 'checkbox_multiple') {
					initialValue = {};

					formField.formFieldOptions.map(({value}) => {
						initialValue[value] = false;
					});
				}

				initialValues[formField.name] = initialValue;
			});
		});
	}

	return (
		<View>
			{error && (
				<ErrorDisplay error={error} onRetry={() => handleRequest()} />
			)}

			{form && (
				<FormContainer>
					<Formik
						initialValues={initialValues}
						onSubmit={() => {}}
						validate={() => {
							const errors = {};

							return errors;
						}}
					>
						{(formikObj) => (
							<>
								<Text style={[styles.m2, styles.mb0]}>
									{form.name}
								</Text>

								<Text style={[styles.mb2]}>
									{form.description}
								</Text>

								{form.structure.formPages.map((formPage, i) => (
									<View key={i}>
										{formPage.headline.length > 0 && (
											<Text
												style={[
													styles.m2,
													styles.textCenter,
												]}
											>
												{formPage.headline}
											</Text>
										)}
										{formPage.text.length > 0 && (
											<Text
												style={[
													styles.m2,
													styles.textCenter,
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
													formikObj={formikObj}
													key={formField.name}
												/>
											)
										)}
									</View>
								))}

								<Button
									disabled={
										Object.keys(formikObj.errors).length >
											0 && !formikObj.isSubmitting
									}
									loading={loading}
									onPress={formikObj.handleSubmit}
									style={styles.m2}
									title="Submit"
								/>
							</>
						)}
					</Formik>
				</FormContainer>
			)}
		</View>
	);
}

Form.propTypes = {
	formId: PropTypes.string,
};

export default Form;
