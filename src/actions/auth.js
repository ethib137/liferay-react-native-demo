import {asyncRemove} from '../util/async';
import {statefulLogin} from '../util/request';

export const loginAction = (username, password) => (dispatch, getState) => {
	dispatch({type: 'LOGGING_IN'});

	statefulLogin(getState())({
		password,
		username,
	})
		.then(() => {
			dispatch({type: 'LOGGED_IN'});
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
