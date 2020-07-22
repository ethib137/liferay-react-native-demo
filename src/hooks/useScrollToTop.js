import {useEffect, useRef} from 'react';

function useScrollToTop(deps) {
	const flatList = useRef();

	useEffect(() => {
		flatList.current.scrollToOffset({offset: 0});
	}, [deps]);

	return flatList;
}

export default useScrollToTop;
