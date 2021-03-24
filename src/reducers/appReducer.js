const initialState = {
	accountId: null,
	authenticationType: 'basic',
	cartId: null,
	channelId: null,
	clientId: 'id-2d52e3e0-6e9f-4d2b-7daf-6371d2eb3213',
	error: undefined,
	isConfigured: false,
	isLoading: true,
	lang: 'en_US',
	liferayURL: 'http://127.0.0.1:8080',
	loggedIn: {
		error: null,
		loading: true,
		value: false,
	},
	siteId: null,
	userId: null,
	username: 'test@liferay.com',
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
				accountId: data.accountId || state.accountId,
				authenticationType:
					data.authenticationType || state.authenticationType,
				cartId: data.cartId || state.cartId,
				channelId: data.channelId || state.channelId,
				clientId: data.clientId || state.clientId,
				isConfigured: data.clientId && data.liferayURL ? true : false,
				isLoading: false,
				liferayURL: data.liferayURL || state.liferayURL,
				loggedIn: {
					error: null,
					loading: false,
					value: data.auth ? true : false,
				},
				siteId: data.siteId || state.siteId,
				userId: data.userId || state.userId,
				username: data.username || state.username,
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
				username: data,
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
				userId: null,
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
				...data,
				isConfigured: true,
			};
		}
		case 'SET_ACCOUNT': {
			return {
				...state,
				accountId: data,
				cartId: null,
			};
		}
		case 'SET_CART': {
			return {
				...state,
				cartId: data,
			};
		}
		case 'SET_CHANNEL': {
			return {
				...state,
				accountId: null,
				cartId: null,
				channelId: data,
			};
		}
		case 'SET_SITE': {
			return {
				...state,
				siteId: data,
			};
		}
		case 'SET_USER_ID': {
			return {
				...state,
				userId: data,
			};
		}
		default:
			return state;
	}
};

export {initialState};

export default appStateReducer;
