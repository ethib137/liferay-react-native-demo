import {asyncGet, asyncSet} from './async';
import configureRequest from './configureRequest';

export const statefulLogin = function (state) {
	const {login} = configureRequest({
		baseURL: state.liferayURL,
		clientId: state.clientId,
		get: asyncGet,
		oauth: state.authenticationType === 'oauth',
		set: asyncSet,
	});

	return login;
};

export const statefulRequest = function (state) {
	const {request} = configureRequest({
		baseURL: state.liferayURL,
		clientId: state.clientId,
		get: asyncGet,
		oauth: state.authenticationType === 'oauth',
		set: asyncSet,
	});

	return request;
};
