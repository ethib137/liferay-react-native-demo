import {AsyncStorage, Alert} from 'react-native';
import axios from 'axios';
import liferay from './liferay-config';
import qs from 'qs';

const AUTH_URL = 'http://127.0.0.1:8080/o/oauth2/token';

const getAuth = async () => {
    let authObj;

    try {
        const authString = await AsyncStorage.getItem('auth');

        if (authString) {
            authObj = JSON.parse(authString);
        }
    } catch (error) {
        console.log('getAuth error:', error);
    }

    return authObj;
}

export const removeAuth = async () => {
    try {
        await AsyncStorage.removeItem('auth');

        return Promise.resolve(); 
    }
    catch {
        return Promise.reject();
    }
}

export const isSignedIn = async () => {
    return await getAuth();
}

const handleAuthResponse = async ({data}) => {
    console.log('data', data);

    AsyncStorage.setItem(
        'auth',
        JSON.stringify({
            expire_date: Date.now() + 1000 * data.expires_in,
            ...data,
        }),
        (error, result) => {
            console.log('error', error, 'result', result);
        }
    )
    .catch(error => {
        console.log('error', error);
    });

	return data;
}

const refreshToken = (authObj) => {
	return axios
		.post(
			AUTH_URL,
			qs.stringify({
				client_id: liferay.clientId,
				grant_type: 'refresh_token',
				refresh_token: authObj.refresh_token,
			})
		)
		.then(handleAuthResponse);
}

const requestWithAuth = async () => {
    const authObj = getAuth();

    if (authObj) {
        if (Date.now() > authObj.expire_date) {
            return refreshToken(authObj);
        }

        return Promise.resolve();
    }
    else {
        return Promise.reject();
    }
};

export const request = (requestObj) => {
	return requestWithAuth().then(() => handleFetch(requestObj));
};

const handleFetch = async ({url, method = 'get', data, contentType = 'application/json'}) => {
    const authObj = await getAuth();
    
    const request = {
        method
    };

    const headers = new Headers();
    console.log('Authorization', `${authObj.token_type} ${authObj.access_token}`);
    headers.append('Authorization', `${authObj.token_type} ${authObj.access_token}`);

    if (method === 'post' || method === 'put') {
        if (contentType === 'application/json') {
            request.body = JSON.stringify(data);

            headers.append('Content-Type', contentType);
        }
        else if (contentType === 'multipart/form-data') {
            const formData  = new FormData();

            for(const name in data) {
                formData.append(name, data[name]);
            }

            request.body = formData;
        }
    }

    request.headers = headers;

    return fetch(
        url,
        request
    ).then(
        res => {
            let retVal;

            if (method == 'delete' && res.status == 204) {
                retVal = 'Deleted Successfully';
            }
            else {
                retVal = res.json();
            }

            console.log('response', retVal);

            return retVal;
        }
    ).catch(
        error => {
            console.log('error', error);
        }
    );
}

export function login(username, password) {
	return axios
		.post(
			AUTH_URL,
			qs.stringify({
				client_id: liferay.clientId,
				grant_type: 'password',
				password,
				username,
			})
		)
		.then(res => {
            console.log('login response', res);
            handleAuthResponse(res)
        });
}