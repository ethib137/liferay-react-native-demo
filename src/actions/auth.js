import {asyncMultiSet, asyncRemove} from '../util/async';
import {statefulLogin, statefulRequest} from '../util/request';

export const loginAction = (username, password) => (dispatch, getState) => {
	dispatch({type: 'LOGGING_IN'});

	statefulLogin(getState())({
		password,
		username,
	})
		.then(() => {
			dispatch({
				data: username,
				type: 'LOGGED_IN',
			});

			statefulRequest(getState())(
				'/o/headless-admin-user/v1.0/my-user-account'
			).then((res) => {
				dispatch(setUserAction(res.id));
			});

			asyncMultiSet({username});
		})
		.catch(() => {
			dispatch({
				data: {
					error: 'There was an error logging in.',
				},
				type: 'LOGGED_OUT',
			});
		});
};

export const logoutAction = () => (dispatch) => {
	dispatch({type: 'LOGGING_OUT'});

	asyncRemove('auth')
		.then(() => {
			dispatch({type: 'LOGGED_OUT'});
		})
		.catch(() => {
			dispatch({
				data: {
					error: 'There was an error while loggin out.',
				},
				type: 'LOGGED_OUT',
			});
		});
};

const setUserAction = (userId) => (dispatch) => {
	asyncMultiSet({userId}).then(() => {
		dispatch({
			data: userId,
			type: 'SET_USER_ID',
		});
	});
};
