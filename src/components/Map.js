import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet} from 'react-native';
import MapView, {Marker} from 'react-native-maps';

const Map = (props) => {
	const latLng = {
		latitude: props.lat,
		longitude: props.long,
	};

	const region = {
		...latLng,
		latitudeDelta: 1 / 111,
		longitudeDelta: 1 / 111,
	};

	return (
		<MapView initialRegion={region} style={styles.map}>
			<Marker coordinate={latLng} />
		</MapView>
	);
};

const styles = StyleSheet.create({
	map: {
		height: 200,
		width: '100%',
	},
});

Map.propTypes = {
	lat: PropTypes.number,
	long: PropTypes.number,
};

export default Map;
