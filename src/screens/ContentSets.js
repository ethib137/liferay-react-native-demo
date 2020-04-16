import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {FlatList, RefreshControl, Text} from 'react-native';
import {Button, Card} from 'react-native-elements';

import ContentSet from '../components/ContentSet';
import ErrorDisplay from '../components/ErrorDisplay';
import NoSiteSelected from '../components/NoSiteSelected';
import ToggleDrawerButton from '../components/ToggleDrawerButton';
import {useAppState} from '../hooks/appState';
import useFetch from '../hooks/useFetch';
import styles from '../styles/main';
import {request} from '../util/request';

function ContentSets({navigation}) {
	const [state] = useAppState();

	const {site} = state;

	const siteId = site ? site.id : null;

	const [contentSets, loading, error, handleRequest] = useFetch(() => {
		if (siteId) {
			return request({
				url: `/api/jsonws/assetlist.assetlistentry/get-asset-list-entries/group-id/${siteId}/start/-1/end/-1/-order-by-comparator`,
			});
		} else {
			return Promise.reject();
		}
	}, [siteId]);

	const renderItem = ({item}) => (
		<Card style={[styles.m1, styles.w100]} title={item.title}>
			<Button
				onPress={() =>
					navigation.navigate('ContentSet', {
						contentSetId: item.assetListEntryId,
						title: item.title,
					})
				}
				title="View Content Set"
			/>
		</Card>
	);

	if (!siteId) {
		return <NoSiteSelected />;
	}

	return (
		<>
			{error && (
				<ErrorDisplay error={error} onRetry={() => handleRequest()} />
			)}

			{contentSets && contentSets.length === 0 && !loading && !error && (
				<Text style={[styles.m2, styles.textCenter]}>
					There are no content sets to display.
				</Text>
			)}

			{contentSets && (
				<FlatList
					data={contentSets}
					keyExtractor={({assetListEntryId}) => assetListEntryId}
					refreshControl={
						<RefreshControl
							onRefresh={() => handleRequest()}
							refreshing={loading}
						/>
					}
					renderItem={(obj) => renderItem(obj)}
				/>
			)}
		</>
	);
}

function ContentSetDisplay({route}) {
	return <ContentSet {...route.params} />;
}

const Stack = createStackNavigator();

function ContentSetsNavigation({navigation}) {
	return (
		<Stack.Navigator
			initialRouteName="ContentSets"
			screenOptions={{
				headerRight: () => (
					<ToggleDrawerButton navigation={navigation} />
				),
			}}
		>
			<Stack.Screen
				component={ContentSets}
				name="ContentSets"
				options={{title: 'Content Sets'}}
			/>

			<Stack.Screen
				component={ContentSetDisplay}
				name="ContentSet"
				options={({route}) => {
					return {title: route.params.title};
				}}
			/>
		</Stack.Navigator>
	);
}

export default ContentSetsNavigation;
