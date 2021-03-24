import React from 'react';
import {Card} from 'react-native-elements';

import {useAuthImage} from './AuthImage';

const CardImage = ({contentUrl, contentValue, ...otherProps}) => {
	const authImageUri = useAuthImage(contentUrl, contentValue);

	return <Card.Image source={{uri: authImageUri}} {...otherProps} />;
};

export default CardImage;
