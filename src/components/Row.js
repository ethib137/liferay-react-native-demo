import React from 'react';
import {Text, View} from 'react-native';

import gStyles from '../styles/main';

function Row(props) {
	const {containerStyle, label, value} = props;

	return (
		<View
			style={[
				gStyles.spaceBetweenH,
				gStyles.mx2,
				gStyles.mt3,
				gStyles.mb1,
				containerStyle,
			]}
		>
			<Text style={[gStyles.h4]}>{`${label}: `}</Text>
			<Text style={[gStyles.h4, gStyles.textGrey7]}>{value}</Text>
		</View>
	);
}

export default Row;
