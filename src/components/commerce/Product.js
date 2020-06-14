import {Ionicons} from '@expo/vector-icons';
import PropTypes from 'prop-types';
import React, {useEffect, useMemo, useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {Button, CheckBox, Image} from 'react-native-elements';

import {useAppState} from '../../hooks/appState';
import styles from '../../styles/main';
import {colors} from '../../styles/values';
import {statefulRequest} from '../../util/request';
import {getRelativeURL} from '../../util/url';
import NoCartSelected from './NoCartSelected';

const Product = (item) => {
	const [state] = useAppState();

	const {cartId} = state;

	const [loading, setLoading] = useState(false);
	const [skuId, setSkuId] = useState();

	const {productId, skus, urlImage} = item;

	const items = useMemo(() => (skus ? skus : []), [skus]);

	useEffect(() => {
		if (items.length) {
			setSkuId(items[0].id);
		}
	}, [items]);

	function addToCart() {
		setLoading(true);

		statefulRequest(state)(
			`/o/headless-commerce-delivery-cart/v1.0/carts/${cartId}/items`,
			{
				data: {
					productId,
					quantity: 1,
					skuId,
				},
				method: 'POST',
			}
		).then(() => {
			setLoading(false);
		});
	}

	return (
		<ScrollView>
			{urlImage && (
				<Image
					source={{
						uri:
							state.liferayURL +
							getRelativeURL(item.urlImage, state.liferayURL),
					}}
					style={{height: 200, width: '100%'}}
				/>
			)}

			{item.shortDescription.length > 0 && (
				<View style={styles.m2}>
					<Text>{item.shortDescription}</Text>
				</View>
			)}

			{items.map((item) => (
				<CheckBox
					checked={skuId === item.id}
					checkedIcon={
						<Ionicons
							color={colors.primary}
							name="ios-radio-button-on"
							size={24}
						/>
					}
					key={item.id}
					name={item.sku}
					onPress={() => setSkuId(item.id)}
					title={`${item.sku}: ${item.price.priceFormatted}`}
					uncheckedIcon={
						<Ionicons
							color={colors.secondary}
							name="ios-radio-button-off"
							size={24}
						/>
					}
				/>
			))}

			{cartId ? (
				<Button
					loading={loading}
					onPress={() => addToCart()}
					style={styles.m2}
					title="Add to Cart"
				/>
			) : (
				<NoCartSelected />
			)}
		</ScrollView>
	);
};

Product.propTypes = {
	id: PropTypes.number,
};

export default Product;
