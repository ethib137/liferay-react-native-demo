import {createStackNavigator} from '@react-navigation/stack';
import React, {useState} from 'react';
import {
	FlatList,
	RefreshControl,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import {Card} from 'react-native-elements';
import {usePaginatedQuery} from 'react-query';

import ErrorDisplay from '../components/ErrorDisplay';
import NoSiteSelected from '../components/NoSiteSelected';
import Pagination from '../components/Pagination';
import ToggleDrawerButton from '../components/ToggleDrawerButton';
import Product from '../components/commerce/Product';
import {useAppState} from '../hooks/appState';
import useScrollToTop from '../hooks/useScrollToTop';
import styles from '../styles/main';
import {getRelativeURL} from '../util/url';

const Catalog = ({navigation}) => {
	const [state, , request] = useAppState();

	const {accountId, channelId, siteId, userId} = state;

	const [page, setPage] = useState(1);

	const identifier = accountId || userId;

	const {error, refetch, resolvedData, status} = usePaginatedQuery(
		identifier && channelId && ['products', identifier, channelId, page],
		() => {
			return request(
				`/o/headless-commerce-delivery-catalog/v1.0/channels/${channelId}/products?page=${page}&nestedFields=skus${
					accountId ? '&accountId=' + accountId : ''
				}`
			);
		}
	);

	const flatList = useScrollToTop(resolvedData ? resolvedData.page : null);

	const items = resolvedData ? resolvedData.items : [];

	const renderItem = ({index, item}) => (
		<TouchableOpacity
			onPress={() => {
				navigation.navigate('Product', item);
			}}
		>
			<Card
				containerStyle={[
					index === items.length - 1 ? styles.mb2 : null,
					styles.m2,
				]}
				image={
					item.urlImage
						? {
								uri:
									state.liferayURL +
									getRelativeURL(
										item.urlImage,
										state.liferayURL
									),
						  }
						: null
				}
				style={[styles.m1, {width: '100%'}]}
				title={item.name}
			>
				<View>
					<Text>{item.shortDescription}</Text>
					<Text>{item.commerceChannelId}</Text>
				</View>
			</Card>
		</TouchableOpacity>
	);

	if (!channelId || !siteId) {
		return <NoSiteSelected />;
	}

	return (
		<View style={{flex: 1}}>
			{items && (
				<FlatList
					ListHeaderComponent={
						<>
							{status === 'error' && (
								<ErrorDisplay
									error={error.title}
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
