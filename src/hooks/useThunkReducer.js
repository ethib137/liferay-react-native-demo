import {useCallback, useReducer, useRef} from 'react';

import {statefulRequest} from '../util/request';

function useThunkReducer(reducer, initialState) {
	const [state, dispatch] = useReducer(reducer, initialState);

	const preState = useRef();

	preState.current = state;

	const request = useCallback(
		(...args) => statefulRequest(preState.current)(...args),
		[]
	);

	const dispatchWithThunk = useCallback(
		(action) => {
			if (typeof action === 'function') {
				return action(
					dispatchWithThunk,
					() => preState.current,
					request
				);
			}

			dispatch(action);

			return Promise.resolve();
		},
		[dispatch, request]
	);

	return [state, dispatchWithThunk, request];
}

export default useThunkReducer;
