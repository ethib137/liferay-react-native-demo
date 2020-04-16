import PropTypes from 'prop-types';
import React from 'react';
import {Dimensions, ScrollView, Text, View} from 'react-native';
import {Image} from 'react-native-elements';
import HTML from 'react-native-render-html';

import styles from '../styles/main';
import Liferay from '../util/liferay-config';

const Blog = (props) => {
	return (
		<ScrollView>
			{props.image && (
				<Image
					source={{uri: Liferay.url + props.image.contentUrl}}
					style={{height: 200, width: '100%'}}
				/>
			)}

			<Text style={[styles.m2, styles.h1]}>{props.headline}</Text>

			<Text style={[styles.mx2, styles.h4]}>
				{props.alternativeHeadline}
			</Text>

			<View style={styles.m2}>
				<HTML
					html={props.articleBody}
					imagesMaxWidth={Dimensions.get('window').width}
				/>
			</View>
		</ScrollView>
	);
};

Blog.propTypes = {
	alternativeHeadline: PropTypes.string,
	articleBody: PropTypes.string,
	headline: PropTypes.string,
	image: PropTypes.object,
};

export default Blog;
