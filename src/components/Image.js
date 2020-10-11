import PropTypes from 'prop-types';
import React from 'react';
import {Image as RNEImage} from 'react-native-elements';

import {useAppState} from '../hooks/appState';

const Image = (props) => {
	const [state] = useAppState();

	return (
		<RNEImage
			source={{uri: state.liferayURL + props.relativeURL}}
			style={{height: 200, width: '100%'}}
		/>
	);
};

Image.propTypes = {
	relativeURL: PropTypes.string.isRequired,
};

export default Image;
