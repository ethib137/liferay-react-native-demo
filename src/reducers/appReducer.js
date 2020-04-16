import {asyncMultiGet} from '../util/async';
import Liferay from '../util/liferay-config';

const initialState = {
	clientId: undefined,
	error: undefined,
	isConfigured: false,
	isLoading: true,
	liferayURL: undefined,
	loggedIn: false,
	site: {},
};

export const asyncKeys = ['auth', 'clientId', 'liferayURL', 'site'];

const asyncInit = (dispatch) => {
	asyncMultiGet(asyncKeys)
		.then((resObj) => {
			const {auth, clientId, liferayURL, site} = resObj;

			dispatch({
				data: {
					clientId: clientId || Liferay.clientId,
					isConfigured: clientId && liferayURL ? true : false,
					isLoading: false,
					liferayURL: liferayURL || Liferay.url,
					loggedIn: auth ? true : false,
					site: site || {},
				},
				type: 'ASYNC_INIT',
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

const appStateReducer = (state, action) => {
	const {data = {}, type} = action;

	switch (type) {
		case 'ASYNC_INIT': {
			return {
				...state,
				...data,
			};
		}
		case 'ERROR': {
			return {
				...state,
				...data,
			};
		}
		case 'LOGGED_IN': {
			return {
				...state,
				loggedIn: true,
			};
		}
		case 'LOGGED_OUT': {
			return {
				...state,
				loggedIn: false,
				panelOpen: false,
			};
		}
		case 'RESET': {
			return {
				initialState,
			};
		}
		case 'SAVE_CONFIGURATION': {
			return {
				...state,
				clientId: data.clientId,
				isConfigured: true,
				liferayURL: data.liferayURL,
			};
		}
		case 'SELECT_SITE': {
			return {
				...state,
				site: data.site,
			};
		}
		default:
			return state;
	}
};

export {asyncInit, initialState};

export default appStateReducer;
