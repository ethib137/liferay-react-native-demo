export const setAccountAction = (accountId) => (dispatch) => {
	dispatch({
		data: accountId,
		type: 'SET_ACCOUNT',
	});
};
