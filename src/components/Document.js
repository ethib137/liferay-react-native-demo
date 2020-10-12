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

const Document = ({navigation, route}) => {
	const [state, , request] = useAppState();

	const {params} = route;

	const documentId = params.id;

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
			{params.adaptedImages[0] && (
				<Image
					source={
						params.adaptedImages[0]
							? {
									uri:
										state.liferayURL +
										params.adaptedImages[0].contentUrl,
							  }
							: null
					}
					style={{height: 200, width: '100%'}}
				/>
			)}

			<Text style={[styles.mx2, styles.h4]}>{params.description}</Text>

			<View style={styles.m2}>
				<CardItemRow label="ID" value={params.id} />
				<CardItemRow
					label="Date Created"
					value={DateTime.fromISO(params.dateCreated).toRelative()}
				/>
				<CardItemRow
					label="Date Modified"
					value={DateTime.fromISO(params.dateModified).toRelative()}
				/>
				<CardItemRow label="Creator" value={params.creator.name} />

				{params.documentType && (
					<CardItemRow
						label="Document Type"
						value={params.documentType.name}
					/>
				)}

				<CardItemRow label="Size in Bytes" value={params.sizeInBytes} />
			</View>

			<Comments
				addComment={addComment}
				getComments={getComments}
				navigation={navigation}
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
