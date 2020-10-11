import React, {createContext, useContext} from 'react';

const Context = createContext();

export function FormContextProvider({children, scrollView}) {
	return <Context.Provider value={{scrollView}}>{children}</Context.Provider>;
}

export function useFormContext() {
	return useContext(Context);
}
