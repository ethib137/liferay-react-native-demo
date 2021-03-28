export const setCartAction = (cartId) => (dispatch) => {
	dispatch({
		data: cartId,
		type: 'SET_CART',
	});
};
