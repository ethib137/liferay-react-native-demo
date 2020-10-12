import {StyleSheet} from 'react-native';

import {colors, greys, spacing} from './values';

const stylesObj = {};

greys.forEach((grey, i) => {
	stylesObj[`textGrey${i}`] = {
		color: grey,
	};
});

const types = [
	['m', 'margin'],
	['p', 'padding'],
];

types.forEach((type) => {
	spacing.forEach((val, i) => {
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
	flexWrap: {
		flex: 1,
		flexWrap: 'wrap',
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
	link: {
		color: colors.blue,
	},
	pAbsolute: {
		position: 'absolute',
	},
	pRelative: {
		position: 'relative',
	},
	spaceBetween: {
		flex: 1,
		justifyContent: 'space-between',
	},
	spaceBetweenH: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	textCenter: {
		textAlign: 'center',
	},
	textLeft: {
		textAlign: 'left',
	},
	textRight: {
		textAlign: 'right',
	},
	w100: {
		width: '100%',
	},
});

export default styles;
