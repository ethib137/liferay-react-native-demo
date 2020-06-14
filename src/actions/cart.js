import {asyncMultiSet} from '../util/async';

export const setCartAction = (cartId) => (dispatch) => {
	asyncMultiSet({cartId}).then(() => {
		dispatch({
			data: cartId,
			type: 'SET_CART',
		});
	});
};
