import React from 'react';

import {useAppState} from '../../hooks/appState';
import Card from '../Card';
import CardItemRow from '../CardItemRow';

function OrderItem({item}) {
	const [state] = useAppState();

	const {lang} = state;

	const {customFields} = item;

	return (
		<Card title={item.name[lang]}>
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
		</Card>
	);
}

OrderItem.propTypes = {};

export default OrderItem;
