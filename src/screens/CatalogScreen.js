import {createStackNavigator} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {FlatList, RefreshControl, Text, View} from 'react-native';
import {usePaginatedQuery} from 'react-query';

import Card from '../components/Card';
import ErrorDisplay from '../components/ErrorDisplay';
import NoSiteSelected from '../components/NoSiteSelected';
import Pagination from '../components/Pagination';
import ToggleDrawerButton from '../components/ToggleDrawerButton';
import NoAccountSelected from '../components/commerce/NoAccountSelected';
import Product from '../components/commerce/Product';
import {useAppState} from '../hooks/appState';
import useScrollToTop from '../hooks/useScrollToTop';
import styles from '../styles/main';

const Catalog = ({navigation}) => {
	const [state, , request] = useAppState();

	const {accountId, channelId, siteId} = state;

	const [page, setPage] = useState(1);
	const [error, setError] = useState();

	const {refetch, resolvedData, status} = usePaginatedQuery(
		accountId && channelId && ['products', accountId, channelId, page],
		() => {
			if (accountId && channelId) {
				return request(
					`/o/headless-commerce-delivery-catalog/v1.0/channels/${channelId}/products?page=${page}&accountId=${accountId}`
				).catch((error) => {
					setError(error);
				});
			}
		}
	);

	const flatList = useScrollToTop(resolvedData ? resolvedData.page : null);

	const items = resolvedData ? resolvedData.items : [];

	useEffect(() => {
		if (items.length > 0) {
			setError();
		}
	}, [items.length]);

	const renderItem = ({index, item}) => (
		<Card
			containerStyle={index === items.length - 1 ? styles.mb2 : null}
			imageUrl={item.urlImage}
			onPress={() => navigation.navigate('Product', item)}
			title={item.name}
		>
			{!!item.shortDescription && (
				<Text style={styles.mt2}>{item.shortDescription}</Text>
			)}

			{!!item.commerceChannelId && (
				<Text style={styles.mt2}>{item.commerceChannelId}</Text>
			)}
		</Card>
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
							{error && (
								<ErrorDisplay
									error={error.status}
									onRetry={() => refetch()}
								/>
							)}

							{items &&
								items.length === 0 &&
								status === 'success' && (
									<Text
										style={[styles.m2, styles.textCenter]}
									>
										There are no products to display.
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

const Stack = createStackNavigator();

function CatalogNavigation({navigation}) {
	return (
		<Stack.Navigator
			initialRouteName="Catalog"
			screenOptions={{
				headerRight: () => (
					<ToggleDrawerButton navigation={navigation} />
				),
			}}
		>
			<Stack.Screen
				component={Catalog}
				name="Catalog"
				options={{title: 'Catalog'}}
			/>
			<Stack.Screen
				component={Product}
				name="Product"
				options={({route}) => {
					return {title: `${route.params.name}`};
				}}
			/>
		</Stack.Navigator>
	);
}

export default CatalogNavigation;
