import {createStackNavigator} from '@react-navigation/stack';
import React, {useState} from 'react';
import {FlatList, RefreshControl, Text, View} from 'react-native';
import {Button, Card} from 'react-native-elements';
import {usePaginatedQuery} from 'react-query';

import CommentThread from '../comments/CommentThread';
import Blog from '../components/Blog';
import CardImage from '../components/CardImage';
import ErrorDisplay from '../components/ErrorDisplay';
import NoSiteSelected from '../components/NoSiteSelected';
import Pagination from '../components/Pagination';
import ToggleDrawerButton from '../components/ToggleDrawerButton';
import {useAppState} from '../hooks/appState';
import useScrollToTop from '../hooks/useScrollToTop';
import styles from '../styles/main';

function Blogs({navigation}) {
	const [state, , request] = useAppState();

	const {siteId} = state;

	const [page, setPage] = useState(1);

	const {error, refetch, resolvedData, status} = usePaginatedQuery(
		siteId && ['blogs', siteId, page],
		() => {
			return request(
				`/o/headless-delivery/v1.0/sites/${siteId}/blog-postings?page=${page}&nestedFields=image.contentValue`
			);
		}
	);

	const flatList = useScrollToTop(resolvedData ? resolvedData.page : null);

	const items = resolvedData ? resolvedData.items : [];

	const renderItem = ({index, item}) => (
		<Card containerStyle={[index === items.length - 1 ? styles.mb2 : null]}>
			<Card.Title>{item.headline}</Card.Title>

			{item.image ? (
				<CardImage
					containerStyle={styles.mb2}
					contentValue={item.image.contentValue}
				/>
			) : (
				<Card.Divider />
			)}

			<View>
				<Text style={styles.mb2}>{item.alternativeHeadline}</Text>

				<Button
					onPress={() => navigation.navigate('BlogEntry', item)}
					title="Keep Reading"
				/>
			</View>
		</Card>
	);

	if (!siteId) {
		return <NoSiteSelected />;
	}

	return (
		<View style={{flex: 1}}>
			{items && (
				<FlatList
					ListHeaderComponent={
						<>
							{status === 'error' && (
								<ErrorDisplay
									error={error.message}
									onRetry={() => refetch()}
								/>
							)}

							{items &&
								items.length === 0 &&
								status === 'success' && (
									<Text
										style={[styles.m2, styles.textCenter]}
									>
										There are no blog entries to display.
									</Text>
								)}
						</>
					}
					data={items}
					keyExtractor={({id}) => id.toString()}
					ref={flatList}
					refreshControl={
						<RefreshControl
							onRefresh={() => refetch()}
							refreshing={status === 'loading'}
						/>
					}
					renderItem={(obj) => renderItem(obj)}
				/>
			)}

			{resolvedData && (
				<Pagination
					lastPage={resolvedData.lastPage}
					page={resolvedData.page}
					pageSize={resolvedData.pageSize}
					setPage={setPage}
					totalCount={resolvedData.totalCount}
				/>
			)}
		</View>
	);
}

const Stack = createStackNavigator();

function BlogsNavigator({navigation}) {
	return (
		<Stack.Navigator
			initialRouteName="Blogs"
			screenOptions={{
				headerRight: () => (
					<ToggleDrawerButton navigation={navigation} />
				),
			}}
		>
			<Stack.Screen
				component={Blogs}
				name="Blogs"
				options={{
					headerTitle: 'Blogs',
				}}
			/>
			<Stack.Screen
				component={Blog}
				name="BlogEntry"
				options={({route}) => {
					return {
						title: route.params.headline,
					};
				}}
			/>
			<Stack.Screen
				component={CommentThread}
				name="CommentThread"
				options={{
					headerTitle: 'Comment Thread',
				}}
			/>
		</Stack.Navigator>
	);
}

export default BlogsNavigator;
