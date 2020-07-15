import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {FlatList, RefreshControl, StyleSheet, Text, View} from 'react-native';
import {Card} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useQuery} from 'react-query';

import {setAccountAction} from '../actions/account';
import CardItemRow from '../components/CardItemRow';
import ErrorDisplay from '../components/ErrorDisplay';
import NoSiteSelected from '../components/NoSiteSelected';
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

	const {data, error, refetch, status} = useQuery(
		['accounts', userId],
		() => {
			return request(`/o/headless-commerce-admin-account/v1.0/accounts`);
		}
	);

	const items = data ? data.items : [];

	const renderItem = ({item}) => (
		<TouchableOpacity onPress={() => dispatch(setAccountAction(item.id))}>
			<Card
				containerStyle={
					accountId === item.id ? accountStyles.selected : {}
				}
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
