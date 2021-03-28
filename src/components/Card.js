import {Ionicons} from '@expo/vector-icons';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button, Card as RNECard, colors} from 'react-native-elements';

import gStyles from '../styles/main';
import CardImage from './CardImage';

function Card(props) {
	const {
		children,
		containerStyle,
		imageUrl,
		imageValue,
		onDelete,
		onPress,
		onToggleSelect,
		selected,
		title,
	} = props;

	return (
		<TouchableOpacity onPress={onPress}>
			<RNECard
				containerStyle={[
					selected ? cardStyles.selected : {},
					gStyles.m2,
					gStyles.pRelative,
					containerStyle,
				]}
			>
				<View style={cardStyles.header}>
					<RNECard.Title style={gStyles.mb0}>{title}</RNECard.Title>

					{onDelete && (
						<TouchableOpacity
							onPress={onDelete}
							style={cardStyles.closeButton}
						>
							<Ionicons
								color={colors.grey3}
								name="md-close-circle-outline"
								size={24}
							/>
						</TouchableOpacity>
					)}
				</View>

				{imageValue || imageUrl ? (
					<CardImage
						containerStyle={gStyles.mt2}
						contentUrl={imageUrl}
						contentValue={imageValue}
					/>
				) : (
					(children || onToggleSelect) && (
						<RNECard.Divider style={[gStyles.mb0, gStyles.mt2]} />
					)
				)}

				{children && <View style={gStyles.mt2}>{children}</View>}

				{onToggleSelect && (
					<Button
						buttonStyle={
							selected
								? cardStyles.selectbuttonSelected
								: cardStyles.selectbuttonDefault
						}
						onPress={onToggleSelect}
						style={gStyles.mt2}
						title={selected ? 'Selected' : 'Select'}
						titleStyle={
							selected
								? cardStyles.selectbuttonSelected
								: cardStyles.selectbuttonDefault
						}
						type={selected ? 'solid' : 'outline'}
					/>
				)}
			</RNECard>
		</TouchableOpacity>
	);
}

const cardStyles = StyleSheet.create({
	header: {
		alignItems: 'center',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	selectbuttonDefault: {
		borderColor: colors.grey3,
		color: colors.grey3,
	},
	selectbuttonSelected: {
		backgroundColor: colors.grey4,
	},
	selected: {
		borderColor: colors.primary,
	},
});

export default Card;
