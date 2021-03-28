import {logoutAction} from './auth';

export const save = (values) => (dispatch, getState) => {
	const {authenticationType} = getState();

	if (values.authenticationType !== authenticationType) {
		dispatch(logoutAction());
	}

	return dispatch({
		data: values,
		type: 'SAVED_CONFIGURATION',
	});
};
