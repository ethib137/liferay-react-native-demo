import React from 'react';
import {Card} from 'react-native-elements';

import {ImageError, useAuthImage} from './AuthImage';

const CardImage = ({contentUrl, contentValue, ...otherProps}) => {
	const [authImageUri, error] = useAuthImage(contentUrl, contentValue);

	if (error) {
		return <ImageError containerStyle={{height: 160}} error={error} />;
	} else {
		return <Card.Image source={{uri: authImageUri}} {...otherProps} />;
	}
};

export default CardImage;
