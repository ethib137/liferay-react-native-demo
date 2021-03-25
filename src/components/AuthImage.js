import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Image as RNEImage} from 'react-native-elements';

import {useAppState} from '../hooks/appState';
import {greys} from '../styles/values';
import {RETURN_TYPES} from '../util/configureRequest';
import {getRelativeURL} from '../util/url';

const ENABLE_AUTH = true;

export function useAuthImage(contentUrl, contentValue) {
	const [state, , request] = useAppState();

	const [uri, setUri] = useState(
		contentValue ? `data:image;base64,${contentValue}` : null
	);

	const [error, setError] = useState();

	const relativeURL = getRelativeURL(contentUrl, state.liferayURL);

	useEffect(() => {
		if (!contentValue && contentUrl) {
			request(relativeURL, {
				contentType: 'image',
				returnType: RETURN_TYPES.blob,
			})
				.then((text) => {
					const objectURL = URL.createObjectURL(text);

					setUri(objectURL);
					setError();
				})
				.catch(() => {
					setError(
						`Unable to load image: ${relativeURL}.\n\nMake sure "System Settings > API Authentication > Basic Auth Header" includes your image's base url.`
					);
				});
		}
	}, [request, contentUrl, contentValue, relativeURL]);

	return [ENABLE_AUTH ? uri : state.liferayURL + relativeURL, error];
}

export function ImageError(props) {
	const {containerStyle, error} = props;

	return (
		<View style={[styles.errorContainer, containerStyle]}>
			<Text style={styles.errorText}>{error}</Text>
		</View>
	);
}

function AuthImage(props) {
	const {containerStyle, contentUrl, contentValue, ...otherProps} = props;

	const [base64, error] = useAuthImage(contentUrl, contentValue);

	if (error) {
		return <ImageError error={error} />;
	} else {
		return (
			<RNEImage
				source={{uri: base64}}
				style={[{height: 200, width: '100%'}, containerStyle]}
				{...otherProps}
			/>
		);
	}
}

const styles = StyleSheet.create({
	errorContainer: {
		alignItems: 'center',
		backgroundColor: greys[0],
		flex: 1,
		height: 200,
		justifyContent: 'center',
	},
	errorText: {
		color: greys[3],
		textAlign: 'center',
	},
});

export default AuthImage;
