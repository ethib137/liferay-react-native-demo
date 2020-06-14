import {asyncMultiSet} from '../util/async';

export const setSiteAction = (siteId) => (dispatch) => {
	asyncMultiSet({siteId}).then(() => {
		dispatch({
			data: siteId,
			type: 'SET_SITE',
		});
	});
};
