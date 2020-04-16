import {createDrawerNavigator} from '@react-navigation/drawer';
import React, {useEffect} from 'react';

import CustomDrawerContent from './components/CustomDrawerContent';
import {useAppState} from './hooks/appState';
import {asyncInit} from './reducers/appReducer';
import Blogs from './screens/Blogs';
import Configurations from './screens/Configurations';
import ContentSets from './screens/ContentSets';
import Documents from './screens/Documents';
import Home from './screens/Home';
import Login from './screens/Login';
import Sites from './screens/Sites';
import Splash from './screens/Splash';

const Drawer = createDrawerNavigator();

const App = () => {
	const [state, dispatch] = useAppState();

	const {isLoading, loggedIn} = state;

	useEffect(() => {
		asyncInit(dispatch);
	}, [dispatch]);

	return (
		<Drawer.Navigator
			drawerContent={(props) => <CustomDrawerContent {...props} />}
			drawerType="back"
			initialRouteName={loggedIn ? 'Home' : 'Home'}
		>
			{isLoading && <Drawer.Screen component={Splash} name="Splash" />}

			{!isLoading && loggedIn && (
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
						component={Sites}
						name="Sites"
						options={{title: 'Select a Site'}}
					/>
				</>
			)}

			{!isLoading && !loggedIn && (
				<Drawer.Screen component={Login} name="Login" />
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
