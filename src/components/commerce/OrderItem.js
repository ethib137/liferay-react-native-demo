import React from 'react';
import {View} from 'react-native';
import {Card} from 'react-native-elements';

import {useAppState} from '../../hooks/appState';
import CardItemRow from '../CardItemRow';

function OrderItem({item}) {
	const [state] = useAppState();

	const {lang} = state;

	const {customFields} = item;

	return (
		<Card>
			<Card.Title>{item.name[lang]}</Card.Title>
			<Card.Divider />

			<View>
				<CardItemRow label="Item Id" value={item.id} />
				<CardItemRow label="Quantity" value={item.quantity} />
				<CardItemRow label="SKU" value={item.sku} />

				{customFields &&
					Object.keys(customFields).map((key) => (
						<CardItemRow
							key={key}
							label={key}
							value={customFields[key]}
						/>
					))}

				<CardItemRow label="Unit Price" value={item.unitPrice} />
				<CardItemRow label="Final Price" value={item.finalPrice} />
			</View>
		</Card>
	);
}

OrderItem.propTypes = {};

export default OrderItem;
