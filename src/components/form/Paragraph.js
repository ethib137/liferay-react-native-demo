import PropTypes from 'prop-types';
import React from 'react';
import {Dimensions, View} from 'react-native';
import HTML from 'react-native-render-html';

import FieldLabel from './FieldLabel';

function Paragraph(props) {
	const {containerStyle = {}, label, text, ...otherProps} = props;

	return (
		<View style={containerStyle} {...otherProps}>
			<FieldLabel label={label} />

			<HTML html={text} imagesMaxWidth={Dimensions.get('window').width} />
		</View>
	);
}

Paragraph.propTypes = {
	label: PropTypes.string.isRequired,
	required: PropTypes.bool,
};

export default Paragraph;
