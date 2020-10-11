import PropTypes from 'prop-types';
import React, {useCallback} from 'react';
import {Text, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import Comments from '../comments';
import {useAppState} from '../hooks/appState';
import styles from '../styles/main';
import HTML from './HTML';
import Image from './Image';

const Blog = (props) => {
	const [, , request] = useAppState();

	const blogId = props.id;

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
		<KeyboardAwareScrollView extraScrollHeight={20}>
			{props.image && <Image relativeURL={props.image.contentUrl} />}

			<Text style={[styles.m2, styles.h1]}>{props.headline}</Text>

			<Text style={[styles.mx2, styles.h4]}>
				{props.alternativeHeadline}
			</Text>

			<View style={styles.m2}>
				<HTML html={props.articleBody} />
			</View>

			<Comments
				addComment={addComment}
				getComments={getComments}
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
