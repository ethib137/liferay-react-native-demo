import {createDrawerNavigator} from '@react-navigation/drawer';
import React, {useEffect} from 'react';

import hydrate from './actions/hydrate';
import CustomDrawerContent from './components/CustomDrawerContent';
import {useAppState} from './hooks/appState';
import AccountsScreen from './screens/AccountsScreen';
import Blogs from './screens/Blogs';
import CartScreen from './screens/CartScreen';
import CatalogScreen from './screens/CatalogScreen';
import Configurations from './screens/Configurations';
import ContentSets from './screens/ContentSets';
import Documents from './screens/Documents';
import FormsScreen from './screens/FormsScreen';
import Home from './screens/Home';
import LoginScreen from './screens/LoginScreen';
import MyOrdersScreen from './screens/MyOrdersScreen';
import Sites from './screens/Sites';
import Splash from './screens/Splash';

const Drawer = createDrawerNavigator();

const App = () => {
	const [state, dispatch] = useAppState();

	const {channelId, isLoading, loggedIn} = state;

	useEffect(() => {
		dispatch(hydrate());
	}, [dispatch, loggedIn.value]);

	return (
		<Drawer.Navigator
			drawerContent={(props) => <CustomDrawerContent {...props} />}
			drawerType="back"
			initialRouteName={loggedIn.value ? 'Home' : 'Login'}
		>
			{isLoading && <Drawer.Screen component={Splash} name="Splash" />}

			{!isLoading && loggedIn.value && (
				<>
					<Drawer.Screen
						component={Home}
						name="Home"
						options={{title: 'Home'}}
					/>
					<Drawer.Screen
						component={Blogs}
						name="Blogs"
						options={{title: 'Blogs'}}
					/>
					<Drawer.Screen
						component={ContentSets}
						name="ContentSets"
						options={{title: 'Content Sets'}}
					/>
					<Drawer.Screen
						component={Documents}
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
						component={Sites}
						name="Sites"
						options={{title: 'Sites'}}
					/>
				</>
			)}

			{!isLoading && !loggedIn.value && (
				<Drawer.Screen component={LoginScreen} name="Login" />
			)}

			<Drawer.Screen
				component={Configurations}
				name="Configurations"
				options={{title: 'Configurations'}}
			/>
		</Drawer.Navigator>
	);
};

export default App;
