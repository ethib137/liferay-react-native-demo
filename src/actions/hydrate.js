import {asyncMultiGet} from '../util/async';

export const asyncKeys = [
	'auth',
	'authenticationType',
	'clientId',
	'liferayURL',
	'site',
];

const hydrate = () => (dispatch) => {
	asyncMultiGet(asyncKeys)
		.then((resObj) => {
			const {
				auth,
				authenticationType,
				clientId,
				liferayURL,
				site,
			} = resObj;

			dispatch({
				data: {auth, authenticationType, clientId, liferayURL, site},
				type: 'HYDRATE',
			});
		})
		.catch(() => {
			dispatch({
				data: {
					error: 'Unable to load user preferences.',
					isLoading: false,
				},
				type: 'ERROR',
			});
		});
};

export default hydrate;
