import {statefulRequest} from '../util/request';

export const loadContentSetsAction = () => (dispatch, getState) => {
	dispatch({type: 'LOADING_CONTENT_SETS'});

	const state = getState();

	const {site} = state;

	const siteId = site ? site.id : null;

	if (siteId) {
		statefulRequest(state)(
			`/api/jsonws/assetlist.assetlistentry/get-asset-list-entries/group-id/${siteId}/start/-1/end/-1/-order-by-comparator`
		)
			.then((response) => {
				dispatch({
					data: {
						items: response,
					},
					type: 'LOADED_CONTENT_SETS',
				});
			})
			.catch(() => {
				dispatch({
					data: {
						error: 'There was an error loading content sets.',
					},
					type: 'LOADED_CONTENT_SETS',
				});
			});
	} else {
		dispatch({
			data: {
				error: 'Please select a site to view content sets.',
			},
			type: 'LOADED_CONTENT_SETS',
		});
	}
};
