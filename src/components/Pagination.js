import {Ionicons} from '@expo/vector-icons';
import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Button} from 'react-native-elements';

import gStyles from '../styles/main';
import {greys} from '../styles/values';

function Pagination(props) {
	const {
		containerStyle = {},
		lastPage,
		page,
		pageSize,
		setPage,
		totalCount,
	} = props;

	const start = (page - 1) * pageSize + 1;

	const end = page === lastPage ? totalCount : start + pageSize - 1;

	return (
		<View style={[gStyles.p1, paginationStyles.container, containerStyle]}>
			<Button
				buttonStyle={gStyles.px2}
				disabled={page <= 1}
				icon={
					<Ionicons
						color={page > 1 ? greys[7] : greys[3]}
						name="ios-arrow-back"
						size={20}
					/>
				}
				onPress={() => setPage(page - 1)}
				type="clear"
			/>

			<Text>{`Showing ${start} to ${end} of ${totalCount}`}</Text>

			<Button
				buttonStyle={gStyles.px2}
				disabled={page >= lastPage}
				icon={
					<Ionicons
						color={page < lastPage ? greys[7] : greys[3]}
						name="ios-arrow-forward"
						size={20}
					/>
				}
				onPress={() => setPage(page + 1)}
				type="clear"
			/>
		</View>
	);
}

const paginationStyles = StyleSheet.create({
	container: {
		alignItems: 'center',
		borderColor: greys[1],
		borderTopWidth: 1,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
});

Pagination.propTypes = {
	containerStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default Pagination;
