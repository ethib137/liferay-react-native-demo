import PropTypes from 'prop-types';
import React, {useCallback} from 'react';
import {Text, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import Comments from '../comments';
import {useAppState} from '../hooks/appState';
import styles from '../styles/main';
import AuthImage from './AuthImage';
import HTML from './HTML';

const Blog = ({navigation, route}) => {
	const [, , request] = useAppState();

	const {params} = route;

	const blogId = params.id;

	const getComments = useCallback(
		(key, id, page) => {
			return request(
				`/o/headless-delivery/v1.0/blog-postings/${blogId}/comments?page=${page}&pageSize=3&sort=dateCreated:desc`
			);
		},
		[blogId, request]
	);

	const addComment = useCallback(
		(text) => {
			return request(
				`/o/headless-delivery/v1.0/blog-postings/${blogId}/comments`,
				{
					data: {
						text,
					},
					method: 'POST',
				}
			);
		},
		[blogId, request]
	);

	return (
		<KeyboardAwareScrollView
			extraScrollHeight={20}
			keyboardShouldPersistTaps="handled"
		>
			{params.image && (
				<AuthImage contentValue={params.image.contentValue} />
			)}

			<Text style={[styles.m2, styles.h1]}>{params.headline}</Text>

			<Text style={[styles.mx2, styles.h4]}>
				{params.alternativeHeadline}
			</Text>

			<View style={styles.m2}>
				<HTML html={params.articleBody} />
			</View>

			<Comments
				addComment={addComment}
				getComments={getComments}
				navigation={navigation}
				parentId={blogId}
			/>
		</KeyboardAwareScrollView>
	);
};

Blog.propTypes = {
	alternativeHeadline: PropTypes.string,
	articleBody: PropTypes.string,
	headline: PropTypes.string,
	image: PropTypes.object,
};

export default Blog;
