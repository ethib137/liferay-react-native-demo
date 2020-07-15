import {asyncMultiSet} from '../util/async';
import {logoutAction} from './auth';

export const save = (values) => (dispatch, getState) => {
	const {authenticationType} = getState();

	values = {
		...values,
		accountId: null,
		cartId: null,
		channelId: null,
		siteId: null,
		userId: null,
	};

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
