import {asyncMultiSet} from '../util/async';
import {logoutAction} from './auth';

export const save = (values) => (dispatch, getState) => {
	const {authenticationType} = getState();

	asyncMultiSet(values).then(() => {
		if (values.authenticationType !== authenticationType) {
			dispatch(logoutAction());
		}

		dispatch({
			data: values,
			type: 'SAVED_CONFIGURATION',
		});
	});
};
