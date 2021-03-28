import {createStackNavigator} from '@react-navigation/stack';
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, RefreshControl, Text, View} from 'react-native';
import {usePaginatedQuery, useQuery} from 'react-query';

import {setChannelAction} from '../actions/channel';
import {setSiteAction} from '../actions/site';
import Alert, {DISPLAY_TYPES} from '../components/Alert';
import Card from '../components/Card';
import CardItemRow from '../components/CardItemRow';
import ErrorDisplay from '../components/ErrorDisplay';
import Pagination from '../components/Pagination';
import ToggleDrawerButton from '../components/ToggleDrawerButton';
import {useAppState} from '../hooks/appState';
import useScrollToTop from '../hooks/useScrollToTop';
import gStyles from '../styles/main';
import {isNotEmptyString} from '../util/util';

const Sites = () => {
	const [state, dispatch, request] = useAppState();

	const {siteId, userId} = state;

	const [page, setPage] = useState(1);

	const [infoMessage, setInfoMessage] = useState();

	const {error, refetch, resolvedData, status} = usePaginatedQuery(
		['sites', page],
		() => {
			return request(
				`/o/headless-admin-user/v1.0/my-user-account/sites?page=${page}&pageSize=20`
			);
		}
	);

	const {data} = useQuery(['channels', userId], () => {
		return request(
			`/o/headless-commerce-admin-channel/v1.0/channels?pageSize=-1`
		).catch(() => {
			setInfoMessage('Commerce APIs do not exist on this instance.');
		});
	});

	const channels = data ? data.items : null;

	const selectChannel = useCallback(
		(id) => {
			if (channels && channels.length > 0) {
				const curChannel = channels.find(
					({siteGroupId}) => parseInt(siteGroupId, 10) === id
				);

				dispatch(setChannelAction(curChannel ? curChannel.id : null));

				if (curChannel) {
					setInfoMessage();
				}
			}
		},
		[channels, dispatch]
	);

	function selectSite(id) {
		dispatch(setSiteAction(id));

		selectChannel(id);
	}

	const flatList = useScrollToTop(resolvedData ? resolvedData.page : null);

	const items = resolvedData ? resolvedData.items : [];

	useEffect(() => {
		if (channels && channels.length == 0) {
			setInfoMessage(
				'If the site you have selected includes Commerce, but the Commerce applications are not showing up in the side menu, please make sure your user has the "Channels > Commerce Channel: View" permission.'
			);
		} else if (siteId) {
			selectChannel(siteId);
		}
	}, [channels, selectChannel, siteId]);

	const renderItem = ({item}) => {
		const selectedSite = siteId === item.id;

		return (
			<Card
				onToggleSelect={() => selectSite(selectedSite ? null : item.id)}
				selected={selectedSite}
				title={item.name}
			>
				<CardItemRow label="Site Id" value={item.id} />

				{isNotEmptyString(item.description) && (
					<Text>{item.description}</Text>
				)}
			</Card>
		);
	};

	const curSite = items.find(({id}) => id === siteId);

	return (
		<View style={{flex: 1}}>
			{items && (
				<FlatList
					ListHeaderComponent={
						<>
							{curSite ? (
								<Text style={[gStyles.textCenter, gStyles.m2]}>
									Current Site: {curSite.name}
								</Text>
							) : (
								<Text style={[gStyles.textCenter, gStyles.m2]}>
									Select a Site.
								</Text>
							)}

							{infoMessage && (
								<Alert
									containerStyle={gStyles.mx2}
									displayType={DISPLAY_TYPES.info}
									text={infoMessage}
								/>
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
										style={[gStyles.m2, gStyles.textCenter]}
									>
										There are no sites to display.
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
