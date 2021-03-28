import {Ionicons} from '@expo/vector-icons';
import PropTypes from 'prop-types';
import React from 'react';
import {Button} from 'react-native-elements';

import gStyles from '../styles/main';

function ToggleDrawerButton({navigation}) {
	return (
		<Button
			buttonStyle={gStyles.px2}
			color="#fff"
			icon={<Ionicons name="ios-menu" size={32} />}
			onPress={() => navigation.toggleDrawer()}
			type="clear"
		/>
	);
}

ToggleDrawerButton.propTypes = {
	navigation: PropTypes.object,
};

export default ToggleDrawerButton;
