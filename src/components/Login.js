import {Formik} from 'formik';
import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Button} from 'react-native-elements';

import {loginAction} from '../actions/auth';
import {useAppState} from '../hooks/appState';
import gStyles from '../styles/main';
import Alert from './Alert';
import Loading from './Loading';
import FormContainer from './form/FormContainer';
import FormikTextInput from './form/FormikTextInput';

function Login() {
	const [state, dispatch] = useAppState();

	const {error, loading} = state.loggedIn;

	const {username} = state;

	return (
		<FormContainer>
			<Formik
				initialValues={{
					email: username,
					password: 'test',
				}}
				onSubmit={(values) => {
					dispatch(loginAction(values.email, values.password));
				}}
				validate={(values) => {
					const errors = {};

					if (!values.email) {
						errors.email = 'Required';
					}

					if (!values.password) {
						errors.password = 'Required';
					}

					return errors;
				}}
			>
				{(formikObj) => (
					<View style={{flex: 1}}>
						<Loading loading={loading}>
							<Image
								source={require('../../assets/icon.png')}
								style={[loginStyles.image, gStyles.m4]}
							/>

							{error && (
								<Alert
									containerStyle={gStyles.m2}
									text={error}
								/>
							)}

							<FormikTextInput
								autoCapitalize="none"
								autoComplete="off"
								autoCorrect={false}
								containerStyle={gStyles.m2}
								label="Email Address or User Name"
								name={'email'}
								required={true}
								spellCheck={false}
								{...formikObj}
							/>

							<FormikTextInput
								autoCapitalize="none"
								autoComplete="off"
								autoCorrect={false}
								containerStyle={gStyles.m2}
								label="Password"
								name={'password'}
								required={true}
								secureTextEntry={true}
								spellCheck={false}
								textContentType="password"
								{...formikObj}
							/>

							<Button
								disabled={
									Object.keys(formikObj.errors).length > 0 &&
									!formikObj.isSubmitting
								}
								onPress={formikObj.handleSubmit}
								style={gStyles.m2}
								title="Login"
							/>
						</Loading>
					</View>
				)}
			</Formik>
		</FormContainer>
	);
}

const loginStyles = StyleSheet.create({
	image: {
		alignSelf: 'center',
		height: 100,
		width: 100,
	},
});

export default Login;
