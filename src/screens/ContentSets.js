import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {FlatList, RefreshControl, Text} from 'react-native';
import {Button, Card} from 'react-native-elements';
import {useQuery} from 'react-query';

import ContentSet from '../components/ContentSet';
import ErrorDisplay from '../components/ErrorDisplay';
import NoSiteSelected from '../components/NoSiteSelected';
import ToggleDrawerButton from '../components/ToggleDrawerButton';
import {useAppState} from '../hooks/appState';
import styles from '../styles/main';

function ContentSets({navigation}) {
	const [state, , request] = useAppState();

	const {siteId} = state;

	const {data, error, refetch, status} = useQuery(
		siteId && ['contentSets', siteId],
		() => {
			return request(
				`/api/jsonws/assetlist.assetlistentry/get-asset-list-entries/group-id/${siteId}/start/-1/end/-1/-order-by-comparator`
			);
		}
	);

	const items = data ? data : [];

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
			{items && (
				<FlatList
					data={items}
					keyExtractor={({assetListEntryId}) => assetListEntryId}
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
										There are no content sets to display.
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
