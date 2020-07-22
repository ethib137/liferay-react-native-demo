import 'react-native-url-polyfill/auto';

import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import { ReactQueryConfigProvider } from 'react-query'
import {registerRootComponent} from 'expo';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import {AppStateProvider} from './hooks/appState';
import appStateReducer, {initialState} from './reducers/appReducer';

class Main extends React.Component {
	render() {
		const queryConfig = {
			retry: false
		};
		
		return (
			<SafeAreaProvider>
				<ReactQueryConfigProvider config={queryConfig}>
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
				</ReactQueryConfigProvider>
			</SafeAreaProvider>
		);
	}
}

registerRootComponent(Main);
