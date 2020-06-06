import {
	DrawerContentScrollView,
	DrawerItem,
	DrawerItemList,
} from '@react-navigation/drawer';
import React from 'react';
import {Alert, View} from 'react-native';

import {logoutAction} from '../actions/auth';
import {asyncKeys} from '../actions/hydrate';
import {useAppState} from '../hooks/appState';
import styles from '../styles/main';
import {asyncMultiRemove} from '../util/async';

function CustomDrawerContent(props) {
	const [state, dispatch] = useAppState();

	const {loggedIn} = state;

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
			contentContainerStyle={[styles.spaceBetween, styles.mb4]}
		>
			<View>
				<DrawerItemList {...props} />
			</View>

			<View>
				{loggedIn.value && (
					<DrawerItem
						label="Log Out"
						onPress={() => dispatch(logoutAction())}
					/>
				)}

				<DrawerItem
					label="Remove All Local Data"
					onPress={() => handleClearData()}
				/>
			</View>
		</DrawerContentScrollView>
	);
}

export default CustomDrawerContent;
