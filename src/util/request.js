import axios from 'axios';
import qs from 'qs';
import {AsyncStorage} from 'react-native';

import {asyncMultiGet} from './async';

const AUTH_URL = '/o/oauth2/token';

export const removeAuth = async () => {
	try {
		await AsyncStorage.removeItem('auth');

		return Promise.resolve();
	} catch (error) {
		return Promise.reject();
	}
};

const handleAuthResponse = async ({data}) => {
	AsyncStorage.setItem(
		'auth',
		JSON.stringify({
			expire_date: Date.now() + 1000 * data.expires_in,
			...data,
		})
	).catch((error) => {
		throw new Error(error);
	});

	return data;
};

const refreshToken = (authObj, clientId, liferayURL) => {
	return axios
		.post(
			liferayURL + AUTH_URL,
			qs.stringify({
				client_id: clientId,
				grant_type: 'refresh_token',
				refresh_token: authObj.refresh_token,
			})
		)
		.then(handleAuthResponse);
};

const getAuth = async () => {
	let asyncObj = {};

	try {
		asyncObj = await asyncMultiGet(['auth', 'clientId', 'liferayURL']);

		const auth = asyncObj.auth;

		if (auth && Date.now() > auth.expire_date) {
			asyncObj.auth = await refreshToken(
				auth,
				asyncObj.clientId,
				asyncObj.liferayURL
			);
		}
	} catch (error) {
		throw new Error(error);
	}

	return asyncObj;
};

const requestWithAuth = async () => {
	const {auth} = await getAuth();

	if (auth) {
		return Promise.resolve();
	} else {
		return Promise.reject();
	}
};

export const request = (requestObj) => {
	return requestWithAuth(requestObj).then(() => handleFetch(requestObj));
};

const handleFetch = async ({
	contentType = 'application/json',
	data,
	method = 'get',
	url,
}) => {
	const {auth, liferayURL} = await getAuth();

	if (!auth) {
		return Promise.reject();
	}

	const request = {
		method,
	};

	const headers = new Headers();

	headers.append('Authorization', `${auth.token_type} ${auth.access_token}`);

	if (method === 'post' || method === 'put') {
		if (contentType === 'application/json') {
			request.body = JSON.stringify(data);

			headers.append('Content-Type', contentType);
		} else if (contentType === 'multipart/form-data') {
			const formData = new FormData();

			for (const name in data) {
				formData.append(name, data[name]);
			}

			request.body = formData;
		}
	}

	request.headers = headers;

	return fetch(`${liferayURL}${url}`, request)
		.then((res) => {
			let retVal;

			if (!res.ok) {
				return Promise.reject(res.status);
			}

			if (method == 'delete' && res.status == 204) {
				retVal = 'Deleted Successfully';
			} else {
				retVal = res.json();
			}

			return retVal;
		})
		.catch((error) => {
			return Promise.reject(error);
		});
};

export function login(username, password) {
	return asyncMultiGet(['clientId', 'liferayURL']).then(
		({clientId, liferayURL}) => {
			return axios
				.post(
					liferayURL + AUTH_URL,
					qs.stringify({
						client_id: clientId,
						grant_type: 'password',
						password,
						username,
					})
				)
				.then((res) => {
					handleAuthResponse(res);
				});
		}
	);
}
