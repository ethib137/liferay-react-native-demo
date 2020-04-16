import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {registerRootComponent} from 'expo';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import App from './App';
import {AppStateProvider} from './hooks/appState';
import appStateReducer, {initialState} from './reducers/appReducer';

class Main extends React.Component {
	render() {
		return (
			<SafeAreaProvider>
				<NavigationContainer>
					<AppStateProvider
						initialState={initialState}
						reducer={appStateReducer}
					>
						<App />
					</AppStateProvider>
				</NavigationContainer>
			</SafeAreaProvider>
		);
	}
}

registerRootComponent(Main);
