import PropTypes from 'prop-types';
import React from 'react';
import {FlatList, RefreshControl, Text, View} from 'react-native';
import {Card} from 'react-native-elements';
import {useQuery} from 'react-query';

import {useAppState} from '../hooks/appState';
import styles from '../styles/main';
import ErrorDisplay from './ErrorDisplay';

const ContentSet = ({contentSetId}) => {
	const [, , request] = useAppState();

	const {data, error, refetch, status} = useQuery(
		contentSetId && ['contentSet', contentSetId],
		() => {
			return request(
				`/o/headless-delivery/v1.0/content-sets/${contentSetId}/content-set-elements`
			);
		}
	);

	const items = data ? data.items : [];

	return (
		<View>
			{status === 'error' && (
				<ErrorDisplay error={error.message} onRetry={() => refetch()} />
			)}

			{items && items.length === 0 && status === 'success' && (
				<Text style={[styles.m2, styles.textCenter]}>
					There are no items to display.
				</Text>
			)}

			{items && (
				<FlatList
					data={items}
					keyExtractor={({id}) => id.toString()}
					refreshControl={
						<RefreshControl
							onRefresh={() => refetch()}
							refreshing={status === 'loading'}
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
