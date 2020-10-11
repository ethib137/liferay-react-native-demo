import PropTypes from 'prop-types';
import React from 'react';
import {Dimensions} from 'react-native';
import RenderHTML from 'react-native-render-html';

import {useAppState} from '../hooks/appState';
import {spacing} from '../styles/values';
import {getFullURL} from '../util/url';

const HTML = (props) => {
	const [state] = useAppState();

	return (
		<RenderHTML
			alterNode={(node) => {
				const {name} = node;

				if (name === 'img') {
					node.attribs = {
						...(node.attribs || {}),
						src: getFullURL(node.attribs.src, state.liferayURL),
					};
				}

				return node;
			}}
			html={props.html}
			imagesMaxWidth={Dimensions.get('window').width - 2 * spacing[2]}
		/>
	);
};

HTML.propTypes = {
	html: PropTypes.string.isRequired,
};

export default HTML;
