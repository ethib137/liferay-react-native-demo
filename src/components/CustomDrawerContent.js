import {Ionicons} from '@expo/vector-icons';
import {
	DrawerContentScrollView,
	DrawerItem,
	DrawerItemList,
} from '@react-navigation/drawer';
import React from 'react';
import {Alert, ScrollView, View} from 'react-native';
import {colors} from 'react-native-elements';

import {logoutAction} from '../actions/auth';
import {asyncKeys} from '../actions/hydrate';
import {useAppState} from '../hooks/appState';
import gStyles from '../styles/main';
import {asyncMultiRemove} from '../util/async';

function CustomDrawerContent(props) {
	const [state, dispatch] = useAppState();

	const {loggedIn, username} = state;

	function handleClearData() {
		Alert.alert(
			'Confirm:',
			'Are you sure you want to delete all of your local data? This will log you out and remove your connection to Liferay.',
			[
				{
					style: 'cancel',
					text: 'Cancel',
				},
				{
					onPress: () => {
						asyncMultiRemove(asyncKeys);

						dispatch({type: 'RESET'});
					},
					text: 'Yes, Delete It All',
				},
			],
			{cancelable: false}
		);
	}

	return (
		<DrawerContentScrollView
			{...props}
			contentContainerStyle={{minHeight: '100%'}}
		>
			<ScrollView
				contentContainerStyle={[gStyles.spaceBetween, gStyles.mb4]}
			>
				<View>
					<DrawerItem
						icon={() => (
							<Ionicons
								color={colors.white}
								name="ios-person"
								size={24}
							/>
						)}
						label={username}
						labelStyle={{color: colors.white}}
						pressColor="1"
						pressOpacity="1"
						style={{backgroundColor: colors.primary}}
					/>

					<DrawerItemList {...props} />
				</View>

				<View>
					{loggedIn.value && (
						<DrawerItem
							label="Log Out"
							onPress={() => {
								props.navigation.closeDrawer();

								dispatch(logoutAction());
							}}
						/>
					)}

					<DrawerItem
						label="Remove All Local Data"
						onPress={() => handleClearData()}
					/>
				</View>
			</ScrollView>
		</DrawerContentScrollView>
	);
}

export default CustomDrawerContent;
