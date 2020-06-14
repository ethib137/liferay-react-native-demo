import {asyncMultiSet} from '../util/async';

export const setChannelAction = (channelId) => (dispatch) => {
	asyncMultiSet({
		accountId: null,
		cartId: null,
		channelId,
	}).then(() => {
		dispatch({
			data: channelId,
			type: 'SET_CHANNEL',
		});
	});
};
