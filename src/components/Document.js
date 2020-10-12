import {DateTime} from 'luxon';
import PropTypes from 'prop-types';
import React, {useCallback} from 'react';
import {Text, View} from 'react-native';
import {Image} from 'react-native-elements';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import Comments from '../comments';
import {useAppState} from '../hooks/appState';
import styles from '../styles/main';
import CardItemRow from './CardItemRow';

const Document = (props) => {
	const [state, , request] = useAppState();

	const documentId = props.id;

	const getComments = useCallback(
		(key, id, page) => {
			return request(
				`/o/headless-delivery/v1.0/documents/${documentId}/comments?page=${page}&pageSize=3&sort=dateCreated:desc`
			);
		},
		[documentId, request]
	);

	const addComment = useCallback(
		(text) => {
			return request(
				`/o/headless-delivery/v1.0/documents/${documentId}/comments`,
				{
					data: {
						text,
					},
					method: 'POST',
				}
			);
		},
		[documentId, request]
	);

	return (
		<KeyboardAwareScrollView extraScrollHeight={20}>
			{props.adaptedImages[0] && (
				<Image
					source={
						props.adaptedImages[0]
							? {
									uri:
										state.liferayURL +
										props.adaptedImages[0].contentUrl,
							  }
							: null
					}
					style={{height: 200, width: '100%'}}
				/>
			)}

			<Text style={[styles.mx2, styles.h4]}>{props.description}</Text>

			<View style={styles.m2}>
				<CardItemRow label="ID" value={props.id} />
				<CardItemRow
					label="Date Created"
					value={DateTime.fromISO(props.dateCreated).toRelative()}
				/>
				<CardItemRow
					label="Date Modified"
					value={DateTime.fromISO(props.dateModified).toRelative()}
				/>
				<CardItemRow label="Creator" value={props.creator.name} />

				{props.documentType && (
					<CardItemRow
						label="Document Type"
						value={props.documentType.name}
					/>
				)}

				<CardItemRow label="Size in Bytes" value={props.sizeInBytes} />
			</View>

			<Comments
				addComment={addComment}
				getComments={getComments}
				parentId={documentId}
			/>
		</KeyboardAwareScrollView>
	);
};

Document.propTypes = {
	alternativeHeadline: PropTypes.string,
	articleBody: PropTypes.string,
	headline: PropTypes.string,
	image: PropTypes.object,
};

export default Document;
