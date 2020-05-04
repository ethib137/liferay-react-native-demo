import React, {createContext, useContext} from 'react';

import useThunkReducer from './useThunkReducer';

const Context = createContext();

export function AppStateProvider({reducer, initialState = {}, children}) {
	const value = useThunkReducer(reducer, initialState);

	return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useAppState() {
	return useContext(Context);
}
