import {useEffect, useRef, useState} from 'react';

const useFetch = (
	request,
	deps = [],
	parseResult = (res) => res,
	defaultResult
) => {
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState(defaultResult);

	const handleRequest = () => {
		if (!loading) {
			setLoading(true);
			setError(false);

			request()
				.then((res) => {
					setLoading(false);
					setResult(parseResult(res));
				})
				.catch((err) => {
					setError(err.status);
					setLoading(false);
				});
		}
	};

	const savedCallback = useRef();

	useEffect(() => {
		savedCallback.current = handleRequest;
	});

	useEffect(
		() => {
			savedCallback.current();
			// eslint-disable-next-line react-hooks/exhaustive-deps
		},
		deps ? [savedCallback, ...deps] : [savedCallback]
	);

	return [result, loading, error, () => savedCallback.current()];
};

export default useFetch;
