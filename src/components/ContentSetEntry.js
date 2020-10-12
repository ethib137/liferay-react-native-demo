import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';

import styles from '../styles/main';
import {greys} from '../styles/values';
import HTML from './HTML';
import Image from './Image';
import Map from './Map';

const geolocationField = {
	dataType: 'geolocation',
	render: (field) => (
		<Map
			lat={field.contentFieldValue.geo.latitude}
			long={field.contentFieldValue.geo.longitude}
		/>
	),
};

const htmlField = {
	dataType: 'html',
	render: (field) => <HTML html={field.contentFieldValue.data} />,
};

const textField = {
	dataType: 'string',
	render: (field) => <Text>{field.contentFieldValue.data}</Text>,
};

const imageField = {
	dataType: 'image',
	render: (field) =>
		field.contentFieldValue.image && (
			<Image relativeURL={field.contentFieldValue.image.contentUrl} />
		),
};

const fields = {};

[geolocationField, htmlField, imageField, textField].forEach((input) => {
	fields[input.dataType] = input;
});

const FormField = ({field}) => {
	if (fields[field.dataType]) {
		return (
			<View style={[styles.mx2, styles.my1]}>
				<Text style={componentStyles.label}>{field.label}</Text>

				{fields[field.dataType].render(field)}
			</View>
		);
	} else {
		return null;
	}
};

const ContentSetEntry = (props) => {
	const {params} = props.route;

	const {content, title} = params;

	return (
		<ScrollView>
			<Text style={[styles.m2, styles.h1]}>{title}</Text>

			{content && !!content.description && content.description !== '' && (
				<HTML
					containerStyle={[styles.mx2, styles.h4]}
					html={content.description}
				/>
			)}

			{content &&
				content.contentFields &&
				content.contentFields.map((field) => (
					<FormField field={field} key={field.name} />
				))}
		</ScrollView>
	);
};

const componentStyles = StyleSheet.create({
	label: {
		color: greys[3],
		fontSize: 10,
		textTransform: 'uppercase',
	},
});

export default ContentSetEntry;
