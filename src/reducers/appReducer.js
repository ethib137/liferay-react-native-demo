import Liferay from '../util/liferay-config';

const initialState = {
	authenticationType: 'basic',
	clientId: undefined,
	error: undefined,
	isConfigured: false,
	isLoading: true,
	liferayURL: undefined,
	loggedIn: {
		error: null,
		loading: true,
		value: false,
	},
	site: {},
};

const appStateReducer = (state, action) => {
	const {data = {}, type} = action;

	switch (type) {
		case 'ERROR': {
			return {
				...state,
				...data,
			};
		}
		case 'HYDRATE': {
			return {
				...state,
				authenticationType:
					data.authenticationType || state.authenticationType,
				clientId: data.clientId || Liferay.clientId,
				isConfigured: data.clientId && data.liferayURL ? true : false,
				isLoading: false,
				liferayURL: data.liferayURL || Liferay.url,
				loggedIn: {
					error: null,
					loading: false,
					value: data.auth ? true : false,
				},
				site: data.site || state.site,
			};
		}
		case 'LOGGED_IN': {
			return {
				...state,
				loggedIn: {
					error: null,
					loading: false,
					value: true,
				},
			};
		}
		case 'LOGGED_OUT': {
			return {
				...state,
				loggedIn: {
					error: data.error,
					loading: false,
					value: false,
				},
				panelOpen: false,
			};
		}
		case 'LOGGING_IN': {
			return {
				...state,
				loggedIn: {
					...state.loggedIn,
					error: null,
					loading: true,
				},
			};
		}
		case 'LOGGING_OUT': {
			return {
				...state,
				loggedIn: {
					...state.loggedIn,
					loading: true,
				},
			};
		}
		case 'RESET': {
			return {
				...initialState,
			};
		}
		case 'SAVED_CONFIGURATION': {
			return {
				...state,
				authenticationType: data.authenticationType,
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

export {initialState};

export default appStateReducer;
