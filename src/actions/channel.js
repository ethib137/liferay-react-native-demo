export const setChannelAction = (channelId) => (dispatch) => {
	dispatch({
		data: channelId,
		type: 'SET_CHANNEL',
	});
};
