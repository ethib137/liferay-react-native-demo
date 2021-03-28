import {createStackNavigator} from '@react-navigation/stack';
import React, {useState} from 'react';
import {FlatList, RefreshControl, Text, View} from 'react-native';
import {usePaginatedQuery} from 'react-query';

import {setAccountAction} from '../actions/account';
import Card from '../components/Card';
import CardItemRow from '../components/CardItemRow';
import ErrorDisplay from '../components/ErrorDisplay';
import NoSiteSelected from '../components/NoSiteSelected';
import Pagination from '../components/Pagination';
import ToggleDrawerButton from '../components/ToggleDrawerButton';
import {useAppState} from '../hooks/appState';
import useScrollToTop from '../hooks/useScrollToTop';
import gStyles from '../styles/main';

const PAGE_SIZE = 10;

const Accounts = () => {
	const [state, dispatch, request] = useAppState();

	const {accountId, siteId, userId} = state;

	const [page, setPage] = useState(1);

	const {error, refetch, resolvedData, status} = usePaginatedQuery(
		siteId && ['accounts', siteId, userId, page],
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

	const renderItem = ({index, item}) => {
		const selected = accountId === item.accountId;

		return (
			<Card
				containerStyle={index === items.length - 1 ? gStyles.mb2 : null}
				imageUrl={item.thumbnail}
				onToggleSelect={() =>
					dispatch(setAccountAction(selected ? null : item.accountId))
				}
				selected={selected}
				title={item.name}
			>
				<CardItemRow label="Account ID" value={item.accountId} />
			</Card>
		);
	};

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
										style={[gStyles.m2, gStyles.textCenter]}
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
