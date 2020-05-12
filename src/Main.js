import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {registerRootComponent} from 'expo';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import {AppStateProvider} from './hooks/appState';
import appStateReducer, {initialState} from './reducers/appReducer';

class Main extends React.Component {
	render() {
		return (
			<SafeAreaProvider>
				<ErrorBoundary>
					<NavigationContainer>
						<AppStateProvider
							initialState={initialState}
							reducer={appStateReducer}
						>
							<App />
						</AppStateProvider>
					</NavigationContainer>
				</ErrorBoundary>
			</SafeAreaProvider>
		);
	}
}

registerRootComponent(Main);
