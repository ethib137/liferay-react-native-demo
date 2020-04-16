import PropTypes from 'prop-types';
import React from 'react';
import {FlatList, RefreshControl, Text, View} from 'react-native';
import {Card} from 'react-native-elements';

import useFetch from '../hooks/useFetch';
import styles from '../styles/main';
import {request} from '../util/request';
import ErrorDisplay from './ErrorDisplay';

const ContentSet = ({contentSetId}) => {
	const [elements, loading, error, handleRequest] = useFetch(
		() =>
			request({
				url: `/o/headless-delivery/v1.0/content-sets/${contentSetId}/content-set-elements`,
			}),
		[contentSetId],
		(res) => res.items
	);

	return (
		<View>
			{error && (
				<ErrorDisplay error={error} onRetry={() => handleRequest()} />
			)}

			{elements && elements.length === 0 && !loading && !error && (
				<Text style={[styles.m2, styles.textCenter]}>
					There are no items to display.
				</Text>
			)}

			{elements && (
				<FlatList
					data={elements}
					keyExtractor={({id}) => id.toString()}
					refreshControl={
						<RefreshControl
							onRefresh={() => handleRequest()}
							refreshing={loading}
						/>
					}
					renderItem={({item}) => (
						<Card
							key={item.id}
							style={styles.m1}
							title={item.title}
						>
							{item.description && item.description !== '' && (
								<Text>{item.description}</Text>
							)}
						</Card>
					)}
				/>
			)}
		</View>
	);
};

ContentSet.propTypes = {
	contentSetId: PropTypes.string,
};

export default ContentSet;
