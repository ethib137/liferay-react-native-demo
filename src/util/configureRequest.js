import base64 from 'base-64';
import qs from 'qs';

const AUTH_URL = '/o/oauth2/token';
const BASE_URL = 'http://localhost:8080';

export const RETURN_TYPES = {
	blob: 'blob',
	json: 'json',
	text: 'text',
};

export default function (options = {}) {
	const {
		authURL = AUTH_URL,
		baseURL = BASE_URL,
		clientId,
		get,
		oauth,
		set,
	} = options;

	function login({password, username}) {
		return oauth
			? loginOAuth({password, username})
			: loginBasic({password, username});
	}

	function loginBasic({password, username}) {
		const access_token = base64.encode(`${username}:${password}`);

		return request(
			'/o/headless-admin-user/v1.0/my-user-account',
			{
				headers: {
					Authorization: `Basic ${access_token}`,
				},
			},
			false
		).then(() => {
			setAuth({
				access_token,
				token_type: 'Basic',
			});
		});
	}

	function loginOAuth({password, username}) {
		return request(
			authURL,
			{
				body: qs.stringify({
					client_id: clientId,
					grant_type: 'password',
					password,
					username,
				}),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				method: 'POST',
			},
			false
		).then(setAuth);
	}

	function setAuth(data) {
		set('auth', {
			access_token: data.access_token,
			expire_date: data.expires_in
				? Date.now() + 1000 * data.expires_in
				: null,
			refresh_token: data.refresh_token || null,
			token_type: data.token_type,
		});

		return data;
	}

	function refreshToken(auth) {
		return request(authURL, {
			body: qs.stringify({
				client_id: clientId,
				grant_type: 'refresh_token',
				refresh_token: auth.refresh_token,
			}),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			method: 'POST',
		}).then(setAuth);
	}

	async function request(url, options = {}, checkAuth = true) {
		const {
			body,
			contentType = 'application/json',
			data = {},
			headers,
			method = 'GET',
			returnType = RETURN_TYPES.json,
			...otherOptions
		} = options;

		const request = {method};

		if (method === 'POST') {
			request.body = body || JSON.stringify(data);
		}

		const requestHeaders = {
			'Content-Type': contentType,
		};

		if (checkAuth) {
			const auth = await getAuth();

			if (!auth) {
				throw new Error('Unable to make request. Please log in.');
			}

			requestHeaders.Authorization = `${auth.token_type} ${auth.access_token}`;
		}

		request.headers = {
			...requestHeaders,
			...headers,
		};

		const response = await fetch(baseURL + url, {
			...request,
			...otherOptions,
		});

		if (response.ok) {
			if (method === 'DELETE') {
				return Promise.resolve('deleted-successfully');
			} else {
				if (returnType == RETURN_TYPES.blob) {
					const text = await response.blob();

					return text;
				} else {
					return response.json();
				}
			}
		} else {
			const text = await response.text();

			let error;

			try {
				error = JSON.parse(text);
			} catch (e) {
				error = text;
			}

			return Promise.reject(error);
		}
	}

	async function getAuth() {
		let auth = await get('auth');

		if (!auth) {
			return null;
		}

		if (auth.expire_date && Date.now() > auth.expire_date) {
			auth = await refreshToken(auth);
		}

		return auth;
	}

	return {
		getAuth,
		login,
		request,
	};
}
