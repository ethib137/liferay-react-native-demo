import {createStackNavigator} from '@react-navigation/stack';
import React, {useState} from 'react';
import {RefreshControl, Text} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {usePaginatedQuery} from 'react-query';

import Card from '../components/Card';
import ErrorDisplay from '../components/ErrorDisplay';
import NoSiteSelected from '../components/NoSiteSelected';
import Pagination from '../components/Pagination';
import ToggleDrawerButton from '../components/ToggleDrawerButton';
import Form from '../components/form/Form';
import {useAppState} from '../hooks/appState';
import useScrollToTop from '../hooks/useScrollToTop';
import gStyles from '../styles/main';
import {isNotEmptyString} from '../util/util';

const FormsScreen = ({navigation}) => {
	const [state, , request] = useAppState();

	const {siteId} = state;

	const [page, setPage] = useState(1);

	const {error, refetch, resolvedData, status} = usePaginatedQuery(
		siteId && ['forms', siteId, page],
		() => {
			if (siteId) {
				return request(
					`/o/headless-form/v1.0/sites/${siteId}/forms?page=${page}`
				);
			}
		}
	);

	const flatList = useScrollToTop(resolvedData ? resolvedData.page : null);

	const items = resolvedData ? resolvedData.items : [];

	const renderItem = ({item}) => (
		<Card
			onPress={() =>
				navigation.navigate('FormEntry', {
					formId: item.id,
					name: item.name,
				})
			}
			title={item.name}
		>
			{isNotEmptyString(item.description) && (
				<Text style={gStyles.mb2}>{item.description}</Text>
			)}
		</Card>
	);

	if (!siteId) {
		return <NoSiteSelected />;
	}

	return (
		<>
			{items && (
				<FlatList
					ListHeaderComponent={
						<>
							{error && (
								<ErrorDisplay
									error={status === 'error'}
									onRetry={() => refetch()}
								/>
							)}

							{items &&
								items.length === 0 &&
								status === 'success' && (
									<Text
										style={[gStyles.m2, gStyles.textCenter]}
									>
										There are no forms to display.
									</Text>
								)}
						</>
					}
					data={items}
					keyExtractor={({id}) => id.toString()}
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
					lastPage={resolvedData.lastPage}
					page={resolvedData.page}
					pageSize={resolvedData.pageSize}
					setPage={setPage}
					totalCount={resolvedData.totalCount}
				/>
			)}
		</>
	);
};

const Stack = createStackNavigator();

function FormsNavigator({navigation}) {
	return (
		<Stack.Navigator
			initialRouteName="Forms"
			screenOptions={{
				headerRight: () => (
					<ToggleDrawerButton navigation={navigation} />
				),
			}}
		>
			<Stack.Screen
				component={FormsScreen}
				name="Forms"
				options={{
					headerTitle: 'Forms',
				}}
			/>

			<Stack.Screen
				component={Form}
				name="FormEntry"
				options={({route}) => {
					return {title: route.params.name};
				}}
			/>
		</Stack.Navigator>
	);
}

export default FormsNavigator;
