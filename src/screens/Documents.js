import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {FlatList, RefreshControl, Text, View} from 'react-native';
import {Card} from 'react-native-elements';

import ErrorDisplay from '../components/ErrorDisplay';
import NoSiteSelected from '../components/NoSiteSelected';
import ToggleDrawerButton from '../components/ToggleDrawerButton';
import {useAppState} from '../hooks/appState';
import useFetch from '../hooks/useFetch';
import styles from '../styles/main';
import {statefulRequest} from '../util/request';

const Documents = () => {
	const [state] = useAppState();

	const {site} = state;

	const siteId = site ? site.id : null;

	const [documents, loading, error, handleRequest] = useFetch(
		() => {
			if (siteId) {
				return statefulRequest(state)(
					`/o/headless-delivery/v1.0/sites/${siteId}/documents`
				);
			} else {
				return Promise.reject();
			}
		},
		[siteId],
		(res) => res.items
	);

	const renderItem = ({item}) => (
		<Card
			image={
				item.adaptedImages[0]
					? {uri: state.liferayURL + item.adaptedImages[0].contentUrl}
					: null
			}
			style={[styles.m1, {width: '100%'}]}
			title={item.title}
		>
			<View>
				<Text>{item.description}</Text>
			</View>
		</Card>
	);

	if (!siteId) {
		return <NoSiteSelected />;
	}

	return (
		<View style={{flex: 1}}>
			{error && (
				<ErrorDisplay error={error} onRetry={() => handleRequest()} />
			)}

			{documents && documents.length === 0 && !loading && !error && (
				<Text style={[styles.m2, styles.textCenter]}>
					There are no documents to display.
				</Text>
			)}

			{documents && (
				<FlatList
					data={documents}
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

function DocumentsNavigation({navigation}) {
	return (
		<Stack.Navigator
			initialRouteName="Documents"
			screenOptions={{
				headerRight: () => (
					<ToggleDrawerButton navigation={navigation} />
				),
			}}
		>
			<Stack.Screen
				component={Documents}
				name="Documents"
				options={{title: 'Documents'}}
			/>
		</Stack.Navigator>
	);
}

export default DocumentsNavigation;
