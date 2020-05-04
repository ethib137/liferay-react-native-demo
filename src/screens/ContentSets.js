import {createStackNavigator} from '@react-navigation/stack';
import React, {useCallback, useEffect} from 'react';
import {FlatList, RefreshControl, Text} from 'react-native';
import {Button, Card} from 'react-native-elements';

import {loadContentSetsAction} from '../actions/content-sets';
import ContentSet from '../components/ContentSet';
import ErrorDisplay from '../components/ErrorDisplay';
import NoSiteSelected from '../components/NoSiteSelected';
import ToggleDrawerButton from '../components/ToggleDrawerButton';
import {useAppState} from '../hooks/appState';
import styles from '../styles/main';

function ContentSets({navigation}) {
	const [state, dispatch] = useAppState();

	const {contentSets, site} = state;

	const siteId = site ? site.id : null;

	const {error, items, loading} = contentSets;

	const dispatchContentSets = useCallback(() => {
		if (!loading) {
			dispatch(loadContentSetsAction());
		}
	}, [dispatch, loading]);

	useEffect(dispatchContentSets, [siteId]);

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
				<ErrorDisplay
					error={error}
					onRetry={() => dispatchContentSets()}
				/>
			)}

			{items && items.length === 0 && !loading && !error && (
				<Text style={[styles.m2, styles.textCenter]}>
					There are no content sets to display.
				</Text>
			)}

			{items && (
				<FlatList
					data={items}
					keyExtractor={({assetListEntryId}) => assetListEntryId}
					refreshControl={
						<RefreshControl
							onRefresh={() => dispatchContentSets()}
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
