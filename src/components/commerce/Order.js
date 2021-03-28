import PropTypes from 'prop-types';
import React from 'react';
import {ScrollView, Text} from 'react-native';
import {useQuery} from 'react-query';

import {useAppState} from '../../hooks/appState';
import gStyles from '../../styles/main';
import ErrorDisplay from '../ErrorDisplay';
import Row from '../Row';
import OrderItem from './OrderItem';

const Order = ({route}) => {
	const [, , request] = useAppState();

	const {id, orderStatusInfo, totalFormatted} = route.params;

	const {data, error, refetch, status} = useQuery(['orderItems', id], () => {
		return request(
			`/o/headless-commerce-admin-order/v1.0/orders/${id}/orderItems`
		);
	});

	const items = data ? data.items : [];

	return (
		<ScrollView>
			<Row label="Total Amount" value={totalFormatted} />
			<Row label="Status" value={orderStatusInfo.label_i18n} />

			<Text style={[gStyles.mx2, gStyles.mt2, gStyles.h4]}>Items:</Text>

			{status === 'error' && (
				<ErrorDisplay error={error.message} onRetry={() => refetch()} />
			)}

			{items && items.length === 0 && status === 'success' && (
				<Text style={[gStyles.m2, gStyles.textCenter]}>
					There are no items to display.
				</Text>
			)}

			{items.map((item) => (
				<OrderItem item={item} key={item.id} />
			))}
		</ScrollView>
	);
};

Order.propTypes = {
	id: PropTypes.number,
};

export default Order;
