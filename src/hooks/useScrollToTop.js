import {useEffect, useRef} from 'react';

function useScrollToTop(deps) {
	const flatList = useRef();

	useEffect(() => {
		if (flatList.current) {
			flatList.current.scrollToOffset({offset: 0});
		}
	}, [deps]);

	return flatList;
}

export default useScrollToTop;
