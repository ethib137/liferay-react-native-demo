import PropTypes from 'prop-types';
import React, {useCallback} from 'react';
import {Text, View} from 'react-native';
import {Button} from 'react-native-elements';
import {useInfiniteQuery, useMutation, useQueryCache} from 'react-query';

import ErrorDisplay from '../components/ErrorDisplay';
import Loading from '../components/Loading';
import {useAppState} from '../hooks/appState';
import styles from '../styles/main';
import CommentCreator from './CommentCreator';
import CommentsHeader from './CommentsHeader';
import CommentsList from './CommentsList';

export const COMMENTS_QUERY_KEY = 'comments';

const LATEST_COMMENT_ID = 1234567;

function Comments(props) {
	const [, , request] = useAppState();

	const {addComment, containerStyle, getComments, parentId} = props;

	const queryCache = useQueryCache();

	const {
		status,
		data = [],
		error,
		isFetching,
		isFetchingMore,
		fetchMore,
		canFetchMore,
	} = useInfiniteQuery([COMMENTS_QUERY_KEY, parentId], getComments, {
		getFetchMore: (lastGroup) => {
			if (lastGroup.lastPage === lastGroup.page) {
				return 0;
			}

			return lastGroup.page + 1;
		},
	});

	const [mutateAddComment] = useMutation(addComment, {
		onError: (err, newComment, rollback) => rollback(),
		onMutate: (commentText) => {
			queryCache.cancelQueries([COMMENTS_QUERY_KEY, parentId]);

			const previousComments = queryCache.getQueryData([
				COMMENTS_QUERY_KEY,
				parentId,
			]);

			const date = new Date();

			const dateISO = date.toISOString();

			const newComment = {
				creator: {
					additionalName: '',
					contentType: 'UserAccount',
					familyName: 'Test',
					givenName: 'Test',
					id: 20130,
					name: 'Test Test',
				},
				dateCreated: dateISO,
				dateModified: dateISO,
				id: LATEST_COMMENT_ID,
				numberOfComments: 0,
				text: commentText,
			};

			queryCache.setQueryData([COMMENTS_QUERY_KEY, parentId], (old) => {
				const firstPage = old.shift();

				return [
					{
						...firstPage,
						items: [newComment, ...firstPage.items],
					},
					...old,
				];
			});

			return () =>
				queryCache.setQueryData(
					[COMMENTS_QUERY_KEY, parentId],
					previousComments
				);
		},
		onSettled: () => {
			queryCache.invalidateQueries([COMMENTS_QUERY_KEY, parentId]);
		},
		onSuccess: (newComment) => {
			queryCache.setQueryData(
				[COMMENTS_QUERY_KEY, parentId],
				(oldData) => {
					return oldData.map((page) => ({
						...page,
						items: page.items.map((comment) =>
							comment.id === LATEST_COMMENT_ID
								? newComment
								: comment
						),
					}));
				}
			);
		},
	});

	const deleteComment = useCallback(
		(commentId) => {
			return request(`/o/headless-delivery/v1.0/comments/${commentId}`, {
				method: 'DELETE',
			});
		},
		[request]
	);

	const [mutateDeleteComment] = useMutation(deleteComment, {
		onError: (err, newComment, rollback) => rollback(),
		onMutate: (commentId) => {
			queryCache.cancelQueries([COMMENTS_QUERY_KEY, parentId]);

			const previousComments = queryCache.getQueryData([
				COMMENTS_QUERY_KEY,
				parentId,
			]);

			queryCache.setQueryData(
				[COMMENTS_QUERY_KEY, parentId],
				(oldData) => {
					return oldData.map((page) => {
						return {
							...page,
							items: page.items.filter(
								(comment) => comment.id !== commentId
							),
						};
					});
				}
			);

			return () =>
				queryCache.setQueryData(
					[COMMENTS_QUERY_KEY, parentId],
					previousComments
				);
		},
		onSettled: () => {
			queryCache.invalidateQueries([COMMENTS_QUERY_KEY, parentId]);
		},
	});

	return (
		<View style={[containerStyle]}>
			<CommentsHeader />

			{status === 'error' && (
				<ErrorDisplay
					error={error.message}
					onRetry={() =>
						queryCache.invalidateQueries([
							COMMENTS_QUERY_KEY,
							parentId,
						])
					}
				/>
			)}

			{data && data.length === 0 && status === 'success' && (
				<Text style={[styles.m2, styles.textCenter]}>
					There are no comments to display.
				</Text>
			)}

			<Loading loading={isFetching}>
				<CommentCreator
					addComment={mutateAddComment}
					parentId={parentId}
				/>

				<CommentsList
					comments={data}
					onDelete={mutateDeleteComment}
					parentId={parentId}
				/>

				<Button
					onPress={() => fetchMore()}
					title={
						isFetchingMore
							? 'Loading more...'
							: canFetchMore
							? 'Load More Comments'
							: 'Nothing more to load'
					}
				/>
			</Loading>
		</View>
	);
}

Comments.propTypes = {
	addComment: PropTypes.func.isRequired,
	containerStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
	getComments: PropTypes.func.isRequired,
	parentId: PropTypes.number.isRequired,
};

export default Comments;
