import PropTypes from 'prop-types';
import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {useQuery} from 'react-query';

import {useAppState} from '../../hooks/appState';
import styles from '../../styles/main';
import ErrorDisplay from '../ErrorDisplay';
import OrderItem from './OrderItem';

const Order = ({route}) => {
	const [, , request] = useAppState();

	const {id, totalFormatted} = route.params;

	const {data, error, refetch, status} = useQuery(['orderItems', id], () => {
		return request(
			`/o/headless-commerce-admin-order/v1.0/orders/${id}/orderItems`
		);
	});

	const items = data ? data.items : [];

	return (
		<ScrollView>
			<View
				style={[
					styles.spaceBetweenH,
					styles.mx2,
					styles.mt3,
					styles.mb1,
				]}
			>
				<Text style={[styles.h4]}>Total Amount: </Text>
				<Text style={[styles.h4, styles.textGrey7]}>
					{totalFormatted}
				</Text>
			</View>

			<Text style={[styles.mx2, styles.mt2, styles.h4]}>Items:</Text>

			{status === 'error' && (
				<ErrorDisplay error={error.message} onRetry={() => refetch()} />
			)}

			{items && items.length === 0 && status === 'success' && (
				<Text style={[styles.m2, styles.textCenter]}>
					There are no items to display.
				</Text>
			)}

			{items.map((item) => (
				<OrderItem item={item} key={id} />
			))}
		</ScrollView>
	);
};

Order.propTypes = {
	id: PropTypes.number,
};

export default Order;
