import {DateTime} from 'luxon';
import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import HTML from 'react-native-render-html';

import {useAppState} from '../hooks/appState';
import {colors, greys, spacing} from '../styles/values';

function Comment(props) {
	const [state] = useAppState();

	const {userId} = state;

	const {comment, containerStyle, last, onDelete} = props;

	const html = comment.text.length > 0 ? comment.text : '<p></p>';

	const renderRightActions = () => {
		return (
			<View style={commentStyles.action}>
				<Text style={commentStyles.actionText}>Delete</Text>
			</View>
		);
	};

	const commentElement = (
		<View
			style={[
				commentStyles.container,
				containerStyle,
				last ? commentStyles.lastComment : null,
			]}
		>
			<View style={commentStyles.header}>
				<Text style={commentStyles.creator}>
					{comment.creator.name}
				</Text>

				<Text style={commentStyles.date}>
					{DateTime.fromISO(comment.dateCreated).toRelative()}
				</Text>
			</View>

			<HTML
				html={html}
				tagsStyles={{p: {paddingBottom: 0, paddingTop: 1}}}
			/>
		</View>
	);

	if (userId === comment.creator.id) {
		return (
			<Swipeable
				onSwipeableRightOpen={() => onDelete(comment.id)}
				renderRightActions={renderRightActions}
			>
				{commentElement}
			</Swipeable>
		);
	} else {
		return commentElement;
	}
}

const commentStyles = StyleSheet.create({
	action: {
		alignItems: 'center',
		backgroundColor: colors.danger.text,
		display: 'flex',
		flexDirection: 'row-reverse',
		width: '100%',
	},
	actionText: {
		color: colors.white,
		padding: spacing[2],
	},
	container: {
		backgroundColor: colors.white,
		borderBottomWidth: 1,
		borderColor: greys[2],
		borderStyle: 'solid',
		borderWidth: 1,
		paddingBottom: spacing[1],
		paddingLeft: spacing[2],
		paddingRight: spacing[2],
		paddingTop: spacing[1],
	},
	creator: {
		fontWeight: 'bold',
	},
	date: {
		color: greys[5],
		fontSize: 11,
	},
	header: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	lastComment: {
		borderBottomWidth: 1,
	},
});

Comment.propTypes = {
	comment: PropTypes.object.isRequired,
	containerStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
	onDelete: PropTypes.func,
};

export default Comment;
