import {statefulRequest} from '../util/request';

export const loadBlogsAction = () => (dispatch, getState) => {
	dispatch({type: 'LOADING_BLOGS'});

	const state = getState();

	const {site} = state;

	const siteId = site ? site.id : null;

	if (siteId) {
		statefulRequest(state)(
			`/o/headless-delivery/v1.0/sites/${siteId}/blog-postings`
		)
			.then((response) => {
				dispatch({
					data: {
						items: response.items,
					},
					type: 'LOADED_BLOGS',
				});
			})
			.catch(() => {
				dispatch({
					data: {
						error: 'There was an error loading blogs.',
					},
					type: 'LOADED_BLOGS',
				});
			});
	} else {
		dispatch({
			data: {
				error: 'Please select a site to view blogs.',
			},
			type: 'LOADED_BLOGS',
		});
	}
};
