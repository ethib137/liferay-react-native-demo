import {StyleSheet} from 'react-native';

import {spacing} from './values';

const stylesObj = {};

const types = [
	['m', 'margin'],
	['p', 'padding'],
];

const values = spacing;

types.forEach((type) => {
	values.forEach((val, i) => {
		stylesObj[`${type[0]}${i}`] = {
			[`${type[1]}`]: val,
		};

		stylesObj[`${type[0]}x${i}`] = {
			[`${type[1]}Left`]: val,
			[`${type[1]}Right`]: val,
		};

		stylesObj[`${type[0]}y${i}`] = {
			[`${type[1]}Bottom`]: val,
			[`${type[1]}Top`]: val,
		};

		stylesObj[`${type[0]}t${i}`] = {
			[`${type[1]}Top`]: val,
		};

		stylesObj[`${type[0]}r${i}`] = {
			[`${type[1]}Right`]: val,
		};

		stylesObj[`${type[0]}b${i}`] = {
			[`${type[1]}Bottom`]: val,
		};

		stylesObj[`${type[0]}l${i}`] = {
			[`${type[1]}Left`]: val,
		};
	});
});

const styles = StyleSheet.create({
	...stylesObj,
	centerContent: {
		flex: 1,
		justifyContent: 'center',
	},
	centerH: {
		alignContent: 'center',
	},
	h1: {
		fontSize: 32,
	},
	h2: {
		fontSize: 24,
	},
	h3: {
		fontSize: 20,
	},
	h4: {
		color: '#666',
		fontSize: 20,
	},
	h5: {
		fontSize: 20,
	},
	h6: {
		fontSize: 16,
	},
	spaceBetween: {
		flex: 1,
		justifyContent: 'space-between',
	},
	textCenter: {
		textAlign: 'center',
	},
	w100: {
		width: '100%',
	},
});

export default styles;
