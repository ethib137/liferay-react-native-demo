import React, {useCallback} from 'react';
import {View} from 'react-native';

import {useAppState} from '../hooks/appState';
import Comment from './Comment';
import Comments from './index';

const CommentThread = ({navigation, route}) => {
	const [, , request] = useAppState();

	const {comment} = route.params;

	const parentCommentId = comment.id;

	const getComments = useCallback(
		(key, id, page) => {
			return request(
				`/o/headless-delivery/v1.0/comments/${parentCommentId}/comments?page=${page}&pageSize=3&sort=dateCreated:desc`
			);
		},
		[parentCommentId, request]
	);

	const addComment = useCallback(
		(text) => {
			return request(
				`/o/headless-delivery/v1.0/comments/${parentCommentId}/comments`,
				{
					data: {
						text,
					},
					method: 'POST',
				}
			);
		},
		[parentCommentId, request]
	);

	return (
		<View>
			<Comment comment={comment} />

			<Comments
				addComment={addComment}
				getComments={getComments}
				navigation={navigation}
				parentId={parentCommentId}
			/>
		</View>
	);
};

export default CommentThread;
