import React, {useState} from 'react';
import {Image, StyleSheet, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import useInterval from '../hooks/useInterval';
import gStyles from '../styles/main';

function Splash() {
	const [dotNumber, setDotNumber] = useState(1);

	const dots = '.'.repeat(dotNumber);

	useInterval(() => {
		setDotNumber(dotNumber < 3 ? dotNumber + 1 : 1);
	}, 1000);

	return (
		<SafeAreaView style={[gStyles.centerContent]}>
			<Image
				source={require('../../assets/splash.png')}
				style={splashStyles.image}
			/>

			<Text style={gStyles.textCenter}>Loading {dots}</Text>
		</SafeAreaView>
	);
}

const splashStyles = StyleSheet.create({
	image: {
		height: 200,
		width: '100%',
	},
});

export default Splash;
