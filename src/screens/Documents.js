import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {FlatList, RefreshControl, Text, View} from 'react-native';
import {Card} from 'react-native-elements';
import {useQuery} from 'react-query';

import ErrorDisplay from '../components/ErrorDisplay';
import NoSiteSelected from '../components/NoSiteSelected';
import ToggleDrawerButton from '../components/ToggleDrawerButton';
import {useAppState} from '../hooks/appState';
import styles from '../styles/main';
import {statefulRequest} from '../util/request';

const Documents = () => {
	const [state] = useAppState();

	const {site} = state;

	const siteId = site ? site.id : null;

	const {data, error, refetch, status} = useQuery(
		siteId && ['documents', siteId],
		() => {
			return statefulRequest(state)(
				`/o/headless-delivery/v1.0/sites/${siteId}/documents`
			);
		}
	);

	const items = data ? data.items : [];

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
			{error && <ErrorDisplay error={error} onRetry={() => refetch()} />}

			{items && items.length === 0 && status === 'success' && (
				<Text style={[styles.m2, styles.textCenter]}>
					There are no documents to display.
				</Text>
			)}

			{items && (
				<FlatList
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
