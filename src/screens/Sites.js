import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {FlatList, RefreshControl, Text, View} from 'react-native';
import {Button, Card} from 'react-native-elements';
import {useQuery} from 'react-query';

import {setChannelAction} from '../actions/channel';
import {setSiteAction} from '../actions/site';
import ErrorDisplay from '../components/ErrorDisplay';
import ToggleDrawerButton from '../components/ToggleDrawerButton';
import {useAppState} from '../hooks/appState';
import styles from '../styles/main';
import {statefulRequest} from '../util/request';

const Sites = () => {
	const [state, dispatch] = useAppState();

	const {siteId} = state;

	const {data, error, refetch, status} = useQuery(['sites'], () => {
		return statefulRequest(state)(
			`/o/headless-admin-user/v1.0/my-user-account/sites`
		);
	});

	const {data: channels} = useQuery(['channels'], () => {
		return statefulRequest(state)(
			`/api/jsonws/commerce.commercechannel/get-commerce-channels/start/-1/end/-1`
		);
	});

	function selectSite(id) {
		dispatch(setSiteAction(id));

		if (channels) {
			const curChannel = channels.find(
				({siteGroupId}) => parseInt(siteGroupId, 10) === id
			);

			dispatch(
				setChannelAction(
					curChannel ? curChannel.commerceChannelId : null
				)
			);
		}
	}

	const items = data ? data.items : [];

	const renderItem = ({item}) => {
		const selectedSite = siteId === item.id;

		return (
			<Card style={[styles.m1, {width: '100%'}]} title={item.name}>
				<View>
					{!!item.description && <Text>{item.description}</Text>}

					<Button
						disabled={selectedSite}
						onPress={() => selectSite(item.id)}
						title={selectedSite ? 'Selected Site' : 'Select Site'}
					/>
				</View>
			</Card>
		);
	};

	const curSite = items.find(({id}) => id === siteId);

	return (
		<View>
			{items && (
				<FlatList
					data={items}
					keyExtractor={({id}) => id.toString()}
					ListHeaderComponent={
						<>
							{curSite ? (
								<Text style={[styles.textCenter, styles.m2]}>
									Current Site: {curSite.name}
								</Text>
							) : (
								<Text style={[styles.textCenter, styles.m2]}>
									Select a Site.
								</Text>
							)}

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
										There are no sites to display.
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
					style={styles.mb5}
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
