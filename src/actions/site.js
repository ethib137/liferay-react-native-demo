export const setSiteAction = (siteId) => (dispatch) => {
	dispatch({
		data: siteId,
		type: 'SET_SITE',
	});
};
