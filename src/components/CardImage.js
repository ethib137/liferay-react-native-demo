import React from 'react';
import {Card} from 'react-native-elements';

import {ImageError, useAuthImage} from './AuthImage';

const CardImage = (props) => {
	const {containerStyle, contentUrl, contentValue, ...otherProps} = props;

	const [authImageUri, error] = useAuthImage(contentUrl, contentValue);

	if (error) {
		return (
			<ImageError
				containerStyle={[{height: 160}, containerStyle]}
				error={error}
			/>
		);
	} else {
		return (
			<Card.Image
				containerStyle={containerStyle}
				source={{uri: authImageUri}}
				{...otherProps}
			/>
		);
	}
};

export default CardImage;
