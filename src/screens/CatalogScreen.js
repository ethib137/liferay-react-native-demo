import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {
	FlatList,
	RefreshControl,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import {Card} from 'react-native-elements';
import {useQuery} from 'react-query';

import ErrorDisplay from '../components/ErrorDisplay';
import NoSiteSelected from '../components/NoSiteSelected';
import ToggleDrawerButton from '../components/ToggleDrawerButton';
import Product from '../components/commerce/Product';
import {useAppState} from '../hooks/appState';
import styles from '../styles/main';
import {getRelativeURL} from '../util/url';

const Catalog = ({navigation}) => {
	const [state, , request] = useAppState();

	const {accountId, channelId, siteId, userId} = state;

	const identifier = accountId || userId;

	const {data, error, refetch, status} = useQuery(
		identifier && channelId && ['products', identifier, channelId],
		() => {
			return request(
				`/o/headless-commerce-delivery-catalog/v1.0/channels/${channelId}/products?nestedFields=skus${
					accountId ? '&accountId=' + accountId : ''
				}`
			);
		}
	);

	const items = data ? data.items : [];

	const renderItem = ({item}) => (
		<TouchableOpacity
			onPress={() => {
				navigation.navigate('Product', {
					...item,
				});
			}}
		>
			<Card
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
					data={items}
					keyExtractor={({id}) => id.toString()}
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
										There are no products to display.
									</Text>
								)}
						</>
					}
					refreshControl={
						<RefreshControl
							onRefresh={() => refetch()}
							refreshing={status === 'loading'}
						/>
					}
					renderItem={(obj) => renderItem(obj)}
				/>
			)}
		</View>
	);
};

function ViewProduct({route}) {
	return <Product {...route.params} />;
}

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
				component={ViewProduct}
				name="Product"
				options={({route}) => {
					return {title: `${route.params.name}`};
				}}
			/>
		</Stack.Navigator>
	);
}

export default CatalogNavigation;
