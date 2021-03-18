import {createDrawerNavigator} from '@react-navigation/drawer';
import React, {useEffect} from 'react';
import {LogBox} from 'react-native';

import hydrate from './actions/hydrate';
import CustomDrawerContent from './components/CustomDrawerContent';
import {useAppState} from './hooks/appState';
import AccountsScreen from './screens/AccountsScreen';
import BlogsScreen from './screens/BlogsScreen';
import CartScreen from './screens/CartScreen';
import CatalogScreen from './screens/CatalogScreen';
import ConfigurationsScreen from './screens/ConfigurationsScreen';
import ContentSetsScreen from './screens/ContentSetsScreen';
import DocumentsScreen from './screens/DocumentsScreen';
import FormsScreen from './screens/FormsScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import MyOrdersScreen from './screens/MyOrdersScreen';
import SitesScreen from './screens/SitesScreen';
import SplashScreen from './screens/SplashScreen';

const Drawer = createDrawerNavigator();

const App = () => {
	const [state, dispatch] = useAppState();

	const {channelId, isLoading, loggedIn} = state;

	useEffect(() => {
		LogBox.ignoreLogs(['Setting a timer']);
	});

	useEffect(() => {
		dispatch(hydrate());
	}, [dispatch, loggedIn.value]);

	return (
		<Drawer.Navigator
			drawerContent={(props) => <CustomDrawerContent {...props} />}
			drawerType="back"
			initialRouteName={loggedIn.value ? 'Home' : 'Login'}
		>
			{isLoading && (
				<Drawer.Screen component={SplashScreen} name="Splash" />
			)}

			{!isLoading && loggedIn.value && (
				<>
					<Drawer.Screen
						component={HomeScreen}
						name="Home"
						options={{title: 'Home'}}
					/>
					<Drawer.Screen
						component={BlogsScreen}
						name="Blogs"
						options={{title: 'Blogs'}}
					/>
					<Drawer.Screen
						component={ContentSetsScreen}
						name="ContentSets"
						options={{title: 'Content Sets'}}
					/>
					<Drawer.Screen
						component={DocumentsScreen}
						name="Documents"
						options={{title: 'Documents'}}
					/>
					<Drawer.Screen
						component={FormsScreen}
						name="Forms"
						options={{title: 'Forms'}}
					/>
					{channelId && (
						<>
							<Drawer.Screen
								component={AccountsScreen}
								name="Accounts"
								options={{title: 'Accounts'}}
							/>
							<Drawer.Screen
								component={CatalogScreen}
								name="Catalog"
								options={{title: 'Catalog'}}
							/>
							<Drawer.Screen
								component={MyOrdersScreen}
								name="MyOrders"
								options={{title: 'My Orders'}}
							/>
							<Drawer.Screen
								component={CartScreen}
								name="Cart"
								options={{title: 'Cart'}}
							/>
						</>
					)}
					<Drawer.Screen
						component={SitesScreen}
						name="Sites"
						options={{title: 'Sites'}}
					/>
				</>
			)}

			{!isLoading && !loggedIn.value && (
				<Drawer.Screen component={LoginScreen} name="Login" />
			)}

			<Drawer.Screen
				component={ConfigurationsScreen}
				name="Configurations"
				options={{title: 'Configurations'}}
			/>
		</Drawer.Navigator>
	);
};

export default App;
