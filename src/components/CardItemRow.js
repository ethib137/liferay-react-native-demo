import React from 'react';
import {Text, View} from 'react-native';

import gStyles from '../styles/main';

function CardItemRow({label, value}) {
	return (
		<View style={[gStyles.spaceBetweenH, gStyles.flexWrap, gStyles.my1]}>
			<Text style={gStyles.textGrey4}>{`${label}: `}</Text>
			<Text style={[gStyles.flexWrap, {flexGrow: 1, textAlign: 'right'}]}>
				{value}
			</Text>
		</View>
	);
}

export default CardItemRow;
