import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {FlatList, RefreshControl, Text, View} from 'react-native';
import {Button, Card} from 'react-native-elements';

import ErrorDisplay from '../components/ErrorDisplay';
import ToggleDrawerButton from '../components/ToggleDrawerButton';
import {useAppState} from '../hooks/appState';
import useFetch from '../hooks/useFetch';
import styles from '../styles/main';
import {asyncSet} from '../util/async';
import {request} from '../util/request';

const Sites = () => {
	const [state, dispatch] = useAppState();

	const {site} = state;

	const siteId = site ? site.id : null;

	const [sites, loading, error, handleRequest] = useFetch(
		() =>
			request({
				url: `/o/headless-admin-user/v1.0/my-user-account/sites`,
			}),
		[],
		(res) => res.items
	);

	const selectSite = (site) => {
		const siteObj = {
			id: site.id,
			name: site.name,
		};

		asyncSet('site', siteObj);

		dispatch({
			data: {site: siteObj},
			type: 'SELECT_SITE',
		});
	};

	const renderItem = ({item}) => (
		<Card style={[styles.m1, {width: '100%'}]} title={item.name}>
			<View>
				<Text>{item.description}</Text>

				{siteId === item.id && (
					<Text style={styles.textCenter}>
						Currently Selected Site
					</Text>
				)}

				{siteId !== item.id && (
					<Button
						onPress={() => selectSite(item)}
						title="Select Site"
					/>
				)}
			</View>
		</Card>
	);

	return (
		<View>
			{site && site.name ? (
				<Text style={[styles.textCenter, styles.m2]}>
					Current Site: {site.name}
				</Text>
			) : (
				<Text style={[styles.textCenter, styles.m2]}>
					Select a Site.
				</Text>
			)}

			{error && (
				<ErrorDisplay error={error} onRetry={() => handleRequest()} />
			)}

			{sites && sites.length === 0 && !loading && !error && (
				<Text style={[styles.m2, styles.textCenter]}>
					There are no sites to display.
				</Text>
			)}

			{sites && (
				<FlatList
					data={sites}
					keyExtractor={({id}) => id.toString()}
					refreshControl={
						<RefreshControl
							onRefresh={() => handleRequest()}
							refreshing={loading}
						/>
					}
					renderItem={(obj) => renderItem(obj)}
				/>
			)}
		</View>
	);
};

const Stack = createStackNavigator();

function SitesNavigation({navigation}) {
	return (
		<Stack.Navigator
			initialRouteName="Sites"
			screenOptions={{
				headerRight: () => (
					<ToggleDrawerButton navigation={navigation} />
				),
			}}
		>
			<Stack.Screen
				component={Sites}
				name="Sites"
				options={{title: 'Sites'}}
			/>
		</Stack.Navigator>
	);
}

export default SitesNavigation;
