import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {RefreshControl, Text, View} from 'react-native';
import {Button, Card} from 'react-native-elements';
import {FlatList} from 'react-native-gesture-handler';
import {useQuery} from 'react-query';

import ErrorDisplay from '../components/ErrorDisplay';
import NoSiteSelected from '../components/NoSiteSelected';
import ToggleDrawerButton from '../components/ToggleDrawerButton';
import Form from '../components/form/Form';
import {useAppState} from '../hooks/appState';
import styles from '../styles/main';
import {statefulRequest} from '../util/request';

const FormsScreen = ({navigation}) => {
	const [state] = useAppState();

	const {siteId} = state;

	const {data, error, refetch, status} = useQuery(
		siteId && ['forms', siteId],
		() => {
			return statefulRequest(state)(
				`/o/headless-form/v1.0/sites/${siteId}/forms`
			);
		}
	);

	const items = data ? data.items : [];

	const renderItem = ({item}) => (
		<Card style={[styles.m1, styles.w100]} title={item.name}>
			<View>
				{item.description.length > 0 && (
					<Text style={styles.mb2}>{item.description}</Text>
				)}

				<Button
					onPress={() =>
						navigation.navigate('FormEntry', {
							formId: item.id,
							name: item.name,
						})
					}
					title="View Form"
				/>
			</View>
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
					keyExtractor={({id}) => id.toString()}
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
										style={[styles.m2, styles.textCenter]}
									>
										There are no forms to display.
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
};

function ViewForm({route}) {
	return <Form formId={route.params.formId} />;
}

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
				component={ViewForm}
				name="FormEntry"
				options={({route}) => {
					return {title: route.params.name};
				}}
			/>
		</Stack.Navigator>
	);
}

export default FormsNavigator;
