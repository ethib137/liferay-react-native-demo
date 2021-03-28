import {statefulLogin} from '../util/request';

export const loginAction = (username, password) => (
	dispatch,
	getState,
	request
) => {
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

			request('/o/headless-admin-user/v1.0/my-user-account').then(
				(res) => {
					dispatch(setUserAction(res.id));
				}
			);
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
	dispatch({type: 'LOGGED_OUT'});
};

const setUserAction = (userId) => (dispatch) => {
	dispatch({
		data: userId,
		type: 'SET_USER_ID',
	});
};
