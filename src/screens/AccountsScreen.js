import {createStackNavigator} from '@react-navigation/stack';
import React, {useState} from 'react';
import {FlatList, RefreshControl, StyleSheet, Text, View} from 'react-native';
import {Card} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {usePaginatedQuery} from 'react-query';

import {setAccountAction} from '../actions/account';
import CardItemRow from '../components/CardItemRow';
import ErrorDisplay from '../components/ErrorDisplay';
import NoSiteSelected from '../components/NoSiteSelected';
import Pagination from '../components/Pagination';
import ToggleDrawerButton from '../components/ToggleDrawerButton';
import {useAppState} from '../hooks/appState';
import styles from '../styles/main';
import {colors} from '../styles/values';
import {getRelativeURL} from '../util/url';

const ACCOUNT_TYPE_MAP = {
	1: 'Personal',
	2: 'Business',
};

const Accounts = () => {
	const [state, dispatch, request] = useAppState();

	const {accountId, siteId, userId} = state;

	const [page, setPage] = useState(1);

	const {error, refetch, resolvedData, status} = usePaginatedQuery(
		['accounts', userId, page],
		() => {
			return request(
				`/o/headless-commerce-admin-account/v1.0/accounts?page=${page}&pageSize=10`
			);
		}
	);

	const items = resolvedData ? resolvedData.items : [];

	const renderItem = ({index, item}) => (
		<TouchableOpacity onPress={() => dispatch(setAccountAction(item.id))}>
			<Card
				containerStyle={[
					accountId === item.id ? accountStyles.selected : null,
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
					<CardItemRow
						label="Account Type"
						value={ACCOUNT_TYPE_MAP[item.type]}
					/>
					<CardItemRow label="Account ID" value={item.id} />
				</View>
			</Card>
		</TouchableOpacity>
	);

	if (!siteId) {
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
					data={items}
					keyExtractor={({id}) => id.toString()}
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

const accountStyles = StyleSheet.create({
	selected: {
		borderColor: colors.primary,
	},
});

const Stack = createStackNavigator();

function AccountsNavigation({navigation}) {
	return (
		<Stack.Navigator
			initialRouteName="Accounts"
			screenOptions={{
				headerRight: () => (
					<ToggleDrawerButton navigation={navigation} />
				),
			}}
		>
			<Stack.Screen
				component={Accounts}
				name="Accounts"
				options={{title: 'Accounts'}}
			/>
		</Stack.Navigator>
	);
}

export default AccountsNavigation;
