import PropTypes from 'prop-types';
import React, {useCallback, useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {Button} from 'react-native-elements';

import gStyles from '../styles/main';
import {greys, spacing} from '../styles/values';

function CommentCreator(props) {
	const {addComment, containerStyle} = props;

	const [text, setText] = useState('');

	const handleAddComment = useCallback(() => {
		const prevText = text;

		setText('');

		addComment(text).catch(() => {
			setText(prevText);
		});
	}, [addComment, setText, text]);

	return (
		<View style={[commentStyles.container, containerStyle, gStyles.p2]}>
			<TextInput
				multiline
				onChangeText={(value) => setText(value)}
				style={commentStyles.input}
				value={text}
			/>

			<Button onPress={() => handleAddComment()} title="Reply" />
		</View>
	);
}

const commentStyles = StyleSheet.create({
	container: {},
	input: {
		borderColor: greys[2],
		borderRadius: 4,
		borderWidth: 2,
		marginBottom: spacing[1],
		padding: spacing[1],
		paddingTop: spacing[1],
	},
	lastComment: {
		borderBottomWidth: 1,
	},
});

CommentCreator.propTypes = {
	addComment: PropTypes.func.isRequired,
	containerStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default CommentCreator;
