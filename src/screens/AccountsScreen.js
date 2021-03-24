import {createStackNavigator} from '@react-navigation/stack';
import React, {useState} from 'react';
import {FlatList, RefreshControl, StyleSheet, Text, View} from 'react-native';
import {Card} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {usePaginatedQuery} from 'react-query';

import {setAccountAction} from '../actions/account';
import CardImage from '../components/CardImage';
import CardItemRow from '../components/CardItemRow';
import ErrorDisplay from '../components/ErrorDisplay';
import NoSiteSelected from '../components/NoSiteSelected';
import Pagination from '../components/Pagination';
import ToggleDrawerButton from '../components/ToggleDrawerButton';
import {useAppState} from '../hooks/appState';
import useScrollToTop from '../hooks/useScrollToTop';
import styles from '../styles/main';
import {colors} from '../styles/values';

const PAGE_SIZE = 10;

const Accounts = () => {
	const [state, dispatch, request] = useAppState();

	const {accountId, siteId, userId} = state;

	const [page, setPage] = useState(1);

	const {error, refetch, resolvedData, status} = usePaginatedQuery(
		['accounts', siteId, userId, page],
		() => {
			if (siteId) {
				return request(
					`/o/commerce-ui/search-accounts?groupId=${siteId}&page=${page}&pageSize=${PAGE_SIZE}`
				);
			}
		}
	);

	const flatList = useScrollToTop(page);

	const items = resolvedData ? resolvedData.accounts : [];

	const renderItem = ({index, item}) => (
		<TouchableOpacity
			onPress={() => dispatch(setAccountAction(item.accountId))}
		>
			<Card
				containerStyle={[
					accountId === item.accountId
						? accountStyles.selected
						: null,
					index === items.length - 1 ? styles.mb2 : null,
				]}
			>
				<Card.Title>{item.name}</Card.Title>

				{item.thumbnail ? (
					<CardImage contentUrl={item.thumbnail} />
				) : (
					<Card.Divider />
				)}

				<CardItemRow label="Account ID" value={item.accountId} />
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
										There are no accounts to display. Make
										sure your user has an account. If this
										is a B2C site, visit the site in Liferay
										to create an account. If this is a B2B
										site, you will need to create a Business
										Account through the control panel and
										add your user to the account.
									</Text>
								)}
						</>
					}
					data={items}
					keyExtractor={({accountId}) => accountId.toString()}
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
					lastPage={Math.ceil(resolvedData.count / PAGE_SIZE)}
					page={page}
					pageSize={PAGE_SIZE}
					setPage={setPage}
					totalCount={resolvedData.count}
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
