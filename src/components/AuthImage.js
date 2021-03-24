import React, {useEffect, useState} from 'react';
import {Image as RNEImage} from 'react-native-elements';

import {useAppState} from '../hooks/appState';
import {RETURN_TYPES} from '../util/configureRequest';
import {getRelativeURL} from '../util/url';

const ENABLE_AUTH = true;

export function useAuthImage(contentUrl, contentValue) {
	const [state, , request] = useAppState();

	const [uri, setUri] = useState(
		contentValue ? `data:;base64,${contentValue}` : null
	);

	const relativeURL = getRelativeURL(contentUrl, state.liferayURL);

	useEffect(() => {
		if (!contentValue && contentUrl) {
			request(relativeURL, {
				contentType: 'text/xml',
				returnType: RETURN_TYPES.blob,
			})
				.then((text) => {
					const objectURL = URL.createObjectURL(text);

					setUri(objectURL);
				})
				.catch(() => {});
		}
	}, [request, contentUrl, contentValue, relativeURL]);

	return ENABLE_AUTH ? uri : state.liferayURL + relativeURL;
}

function AuthImage(props) {
	const {containerStyle, contentUrl, contentValue, ...otherProps} = props;

	const base64 = useAuthImage(contentUrl, contentValue);

	return (
		<RNEImage
			source={{uri: base64}}
			style={[{height: 200, width: '100%'}, containerStyle]}
			{...otherProps}
		/>
	);
}

export default AuthImage;
