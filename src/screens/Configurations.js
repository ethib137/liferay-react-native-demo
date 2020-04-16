import {createStackNavigator} from '@react-navigation/stack';
import {Formik} from 'formik';
import React from 'react';
import {
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	Text,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import {Button} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';

import FormikTextInput from '../components/FormikTextInput';
import ToggleDrawerButton from '../components/ToggleDrawerButton';
import {useAppState} from '../hooks/appState';
import styles from '../styles/main';
import {asyncMultiSet} from '../util/async';

const Configurations = () => {
	const [state, dispatch] = useAppState();

	const {clientId, isConfigured, liferayURL} = state;

	function hasUnsavedChanges(values) {
		let retVal;

		Object.keys(values).forEach((key) => {
			if (values[key] !== state[key]) {
				retVal = true;
			}
		});

		if (!isConfigured) {
			retVal = true;
		}

		return retVal;
	}

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<KeyboardAvoidingView
				behavior={Platform.Os == 'ios' ? 'padding' : 'height'}
				style={{flex: 1}}
			>
				<ScrollView>
					<Formik
						initialValues={{
							clientId,
							liferayURL,
						}}
						onSubmit={(values, {setSubmitting}) => {
							dispatch({
								data: values,
								type: 'SAVE_CONFIGURATION',
							});

							asyncMultiSet(values).then(() => {
								setSubmitting(false);
							});
						}}
						validate={(values) => {
							const errors = {};

							if (!values.clientId) {
								errors.clientId = 'Required';
							}

							if (!values.liferayURL) {
								errors.liferayURL = 'Required';
							}

							return errors;
						}}
					>
						{(formikObj) => (
							<View>
								<Text
									style={[
										configurationStyles.status,
										styles.p2,
									]}
								>
									{hasUnsavedChanges(formikObj.values)
										? 'You have unsaved changes to your configurations.'
										: 'All changes saved.'}

									{formikObj.isSubmitting && 'Saving...'}
								</Text>

								<FormikTextInput
									autoCapitalize="none"
									autoComplete="off"
									autoCorrect={false}
									containerStyle={styles.m2}
									label="OAuth Client ID"
									name={'clientId'}
									required={true}
									spellCheck={false}
									{...formikObj}
								/>

								<FormikTextInput
									autoCapitalize="none"
									autoComplete="off"
									autoCorrect={false}
									containerStyle={styles.m2}
									label="Liferay Server URL"
									name={'liferayURL'}
									required={true}
									spellCheck={false}
									{...formikObj}
								/>

								<Button
									disabled={
										Object.keys(formikObj.errors).length >
											0 ||
										!hasUnsavedChanges(formikObj.values)
									}
									onPress={formikObj.handleSubmit}
									style={styles.m2}
									title="Save Configurations"
								/>
							</View>
						)}
					</Formik>
				</ScrollView>
			</KeyboardAvoidingView>
		</TouchableWithoutFeedback>
	);
};

const configurationStyles = StyleSheet.create({
	status: {
		backgroundColor: '#666',
		color: '#FFF',
	},
});

const Stack = createStackNavigator();

function ConfigurationsNavigator({navigation}) {
	return (
		<Stack.Navigator
			initialRouteName="Configurations"
			screenOptions={{
				headerRight: () => (
					<ToggleDrawerButton navigation={navigation} />
				),
			}}
		>
			<Stack.Screen
				component={Configurations}
				name="Configurations"
				options={{
					headerTitle: 'Configurations',
				}}
			/>
		</Stack.Navigator>
	);
}

export default ConfigurationsNavigator;
