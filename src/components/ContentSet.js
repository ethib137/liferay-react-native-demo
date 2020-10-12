import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {FlatList, RefreshControl, Text, View} from 'react-native';
import {Button, Card} from 'react-native-elements';
import {usePaginatedQuery} from 'react-query';

import {useAppState} from '../hooks/appState';
import useScrollToTop from '../hooks/useScrollToTop';
import styles from '../styles/main';
import ErrorDisplay from './ErrorDisplay';
import HTML from './HTML';
import Pagination from './Pagination';

const ContentSet = ({navigation, route}) => {
	const [, , request] = useAppState();

	const {contentSetId} = route.params;

	const [page, setPage] = useState(1);

	const {error, refetch, resolvedData, status} = usePaginatedQuery(
		contentSetId && ['contentSet', contentSetId, page],
		() => {
			return request(
				`/o/headless-delivery/v1.0/content-sets/${contentSetId}/content-set-elements?page=${page}&pageSize=20`
			);
		}
	);

	const flatList = useScrollToTop(resolvedData ? resolvedData.page : null);

	const items = resolvedData ? resolvedData.items : [];

	return (
		<View style={{flex: 1}}>
			{items && (
				<FlatList
					ListHeaderComponent={
						<>
							{status === 'error' && (
								<ErrorDisplay
									error={error.message}
									onRetry={() => refetch()}
								/>
							)}

							{items &&
								items.length === 0 &&
								status === 'success' && (
									<Text
										style={[styles.m2, styles.textCenter]}
									>
										There are no items to display.
									</Text>
								)}
						</>
					}
					data={items}
					keyExtractor={({id}) => id.toString()}
					ref={flatList}
					refreshControl={
						<RefreshControl
							onRefresh={() => refetch()}
							refreshing={status === 'loading'}
						/>
					}
					renderItem={({item}) => (
						<Card
							key={item.id}
							style={styles.m2}
							title={item.title}
						>
							<View>
								{item.content &&
									!!item.content.description &&
									item.content.description !== '' && (
										<HTML html={item.content.description} />
									)}

								<Button
									onPress={() =>
										navigation.navigate(
											'ContentSetEntry',
											item
										)
									}
									title="View Entry"
								/>
							</View>
						</Card>
					)}
				/>
			)}

			{resolvedData && (
				<Pagination
					lastPage={resolvedData.lastPage}
					page={resolvedData.page}
					pageSize={resolvedData.pageSize}
					setPage={setPage}
					totalCount={resolvedData.totalCount}
				/>
			)}
		</View>
	);
};

ContentSet.propTypes = {
	contentSetId: PropTypes.string,
};

export default ContentSet;
