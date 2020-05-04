import {useCallback, useReducer, useRef} from 'react';

function useThunkReducer(reducer, initialState) {
	const [state, dispatch] = useReducer(reducer, initialState);

	const preState = useRef();

	preState.current = state;

	const dispatchWithThunk = useCallback(
		(action) => {
			if (typeof action === 'function') {
				action(dispatchWithThunk, () => preState.current);
			}

			dispatch(action);

			return Promise.resolve();
		},
		[dispatch]
	);

	return [state, dispatchWithThunk];
}

export default useThunkReducer;
