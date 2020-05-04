import {Ionicons} from '@expo/vector-icons';
import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import RNCollapsible from 'react-native-collapsible';

function Collapsible(props) {
	const {children, containerStyle, header, headerStyle} = props;

	const [collapsed, setCollapsed] = useState(true);

	return (
		<View style={containerStyle}>
			<TouchableOpacity
				onPress={() => setCollapsed(!collapsed)}
				style={[collapsibleStyles.header, headerStyle]}
			>
				{header}

				<Ionicons
					name={collapsed ? 'ios-arrow-down' : 'ios-arrow-up'}
					size={20}
				/>
			</TouchableOpacity>

			<RNCollapsible collapsed={collapsed}>{children}</RNCollapsible>
		</View>
	);
}

const collapsibleStyles = StyleSheet.create({
	header: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
});

export default Collapsible;
