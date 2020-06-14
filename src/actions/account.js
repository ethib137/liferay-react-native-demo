import {asyncMultiSet} from '../util/async';

export const setAccountAction = (accountId) => (dispatch) => {
	asyncMultiSet({
		accountId,
		cartId: null,
	}).then(() => {
		dispatch({
			data: accountId,
			type: 'SET_ACCOUNT',
		});
	});
};
