import {createStackNavigator} from '@react-navigation/stack';
import moment from 'moment-timezone';
import React, {useState} from 'react';
import {FlatList, RefreshControl, Text, View} from 'react-native';
import {Card} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {usePaginatedQuery} from 'react-query';

import CardItemRow from '../components/CardItemRow';
import ErrorDisplay from '../components/ErrorDisplay';
import NoSiteSelected from '../components/NoSiteSelected';
import Pagination from '../components/Pagination';
import ToggleDrawerButton from '../components/ToggleDrawerButton';
import NoAccountSelected from '../components/commerce/NoAccountSelected';
import Order from '../components/commerce/Order';
import {useAppState} from '../hooks/appState';
import useScrollToTop from '../hooks/useScrollToTop';
import styles from '../styles/main';

const MyOrders = ({navigation}) => {
	const [state, , request] = useAppState();

	const {accountId, channelId, siteId} = state;

	const [page, setPage] = useState(1);

	const {error, refetch, resolvedData, status} = usePaginatedQuery(
		['orders', accountId, channelId, page],
		() => {
			return request(
				`/o/headless-commerce-admin-order/v1.0/orders?page=${page}&filter=accountId eq ${accountId} and channelId eq ${channelId} and orderStatus eq 1`
			);
		}
	);

	const flatList = useScrollToTop(resolvedData ? resolvedData.page : null);

	const items = resolvedData ? resolvedData.items : [];

	const renderItem = ({index, item}) => (
		<TouchableOpacity
			onPress={() => {
				navigation.navigate('Order', {
					...item,
				});
			}}
		>
			<Card
				containerStyle={[
					index === items.length - 1 ? styles.mb2 : null,
					styles.m2,
				]}
				style={[styles.m1, {width: '100%'}]}
				title={`Order ${item.id}`}
			>
				<View>
					<CardItemRow
						label="Created"
						value={moment(item.createDate).fromNow()}
					/>
					<CardItemRow
						label="Modified"
						value={moment(item.modifiedDate).fromNow()}
					/>
					<CardItemRow label="Total" value={item.totalFormatted} />
				</View>
			</Card>
		</TouchableOpacity>
	);

	if (!channelId || !siteId) {
		return <NoSiteSelected />;
	}

	if (!accountId) {
		return <NoAccountSelected />;
	}

	return (
		<View style={{flex: 1}}>
			{items && (
				<FlatList
					ListHeaderComponent={
						<>
							{status === 'error' && (
								<ErrorDisplay
									error={error.message}
									onRetry={() => refetch()}
								/>
							)}

							{items &&
								items.length === 0 &&
								status === 'success' && (
									<Text
										style={[styles.m2, styles.textCenter]}
									>
										There are no orders to display.
									</Text>
								)}
						</>
					}
					data={items}
					keyExtractor={({id}) => id.toString()}
					ref={flatList}
					refreshControl={
						<RefreshControl
							onRefresh={() => refetch()}
							refreshing={status === 'loading'}
						/>
					}
					renderItem={(obj) => renderItem(obj)}
				/>
			)}

			{resolvedData && (
				<Pagination
					lastPage={resolvedData.lastPage}
					page={resolvedData.page}
					pageSize={resolvedData.pageSize}
					setPage={setPage}
					totalCount={resolvedData.totalCount}
				/>
			)}
		</View>
	);
};

function ViewOrder({route}) {
	return <Order {...route.params} />;
}

const Stack = createStackNavigator();

function MyOrdersNavigation({navigation}) {
	return (
		<Stack.Navigator
			initialRouteName="MyOrders"
			screenOptions={{
				headerRight: () => (
					<ToggleDrawerButton navigation={navigation} />
				),
			}}
		>
			<Stack.Screen
				component={MyOrders}
				name="MyOrders"
				options={{title: 'My Orders'}}
			/>
			<Stack.Screen
				component={ViewOrder}
				name="Order"
				options={({route}) => {
					return {title: `Order ${route.params.id}`};
				}}
			/>
		</Stack.Navigator>
	);
}

export default MyOrdersNavigation;
