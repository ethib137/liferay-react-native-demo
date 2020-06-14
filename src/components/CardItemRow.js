import React from 'react';
import {Text, View} from 'react-native';

import styles from '../styles/main';

function CardItemRow({label, value}) {
	return (
		<View style={[styles.spaceBetweenH, styles.flexWrap, styles.my1]}>
			<Text style={styles.textGrey4}>{`${label}: `}</Text>
			<Text style={[styles.flexWrap, {flexGrow: 1, textAlign: 'right'}]}>
				{value}
			</Text>
		</View>
	);
}

export default CardItemRow;
