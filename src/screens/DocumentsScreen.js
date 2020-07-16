import {createStackNavigator} from '@react-navigation/stack';
import React, {useState} from 'react';
import {FlatList, RefreshControl, Text, View} from 'react-native';
import {Card} from 'react-native-elements';
import {usePaginatedQuery} from 'react-query';

import ErrorDisplay from '../components/ErrorDisplay';
import NoSiteSelected from '../components/NoSiteSelected';
import Pagination from '../components/Pagination';
import ToggleDrawerButton from '../components/ToggleDrawerButton';
import {useAppState} from '../hooks/appState';
import styles from '../styles/main';

const Documents = () => {
	const [state, , request] = useAppState();

	const {siteId} = state;

	const [page, setPage] = useState(1);

	const {error, refetch, resolvedData, status} = usePaginatedQuery(
		siteId && ['documents', siteId, page],
		() => {
			return request(
				`/o/headless-delivery/v1.0/sites/${siteId}/documents?flatten=true&page=${page}&pageSize=20`
			);
		}
	);

	const items = resolvedData ? resolvedData.items : [];

	const renderItem = ({index, item}) => (
		<Card
			containerStyle={[
				styles.m2,
				index === items.length - 1 ? styles.mb2 : null,
			]}
			image={
				item.adaptedImages[0]
					? {uri: state.liferayURL + item.adaptedImages[0].contentUrl}
					: null
			}
			title={item.title}
		>
			<View>
				<Text>{item.description}</Text>
				<Text selectable={true}>{item.id}</Text>
			</View>
		</Card>
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
										There are no documents to display.
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
