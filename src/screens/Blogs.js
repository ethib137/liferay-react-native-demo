import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {FlatList, RefreshControl, Text, View} from 'react-native';
import {Button, Card} from 'react-native-elements';
import {useQuery} from 'react-query';

import Blog from '../components/Blog';
import ErrorDisplay from '../components/ErrorDisplay';
import NoSiteSelected from '../components/NoSiteSelected';
import ToggleDrawerButton from '../components/ToggleDrawerButton';
import {useAppState} from '../hooks/appState';
import styles from '../styles/main';

function Blogs({navigation}) {
	const [state, , request] = useAppState();

	const {siteId} = state;

	const {data, error, refetch, status} = useQuery(
		siteId && ['blogs', siteId],
		() => {
			return request(
				`/o/headless-delivery/v1.0/sites/${siteId}/blog-postings`
			);
		}
	);

	const items = data ? data.items : [];

	const renderItem = ({item}) => (
		<Card
			image={
				item.image
					? {uri: state.liferayURL + item.image.contentUrl}
					: null
			}
			style={[styles.m1, {width: '100%'}]}
			title={item.headline}
		>
			<View>
				<Text style={styles.mb2}>{item.alternativeHeadline}</Text>

				<Button
					onPress={() =>
						navigation.navigate('BlogEntry', {
							...item,
						})
					}
					title="Keep Reading"
				/>
			</View>
		</Card>
	);

	if (!siteId) {
		return <NoSiteSelected />;
	}

	return (
		<>
			{items && (
				<FlatList
					data={items}
					keyExtractor={({id}) => id.toString()}
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
					refreshControl={
						<RefreshControl
							onRefresh={() => refetch()}
							refreshing={status === 'loading'}
						/>
					}
					renderItem={(obj) => renderItem(obj)}
				/>
			)}
		</>
	);
}

function ViewBlog({route}) {
	return <Blog {...route.params} />;
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
				component={ViewBlog}
				name="BlogEntry"
				options={({route}) => {
					return {title: route.params.headline};
				}}
			/>
		</Stack.Navigator>
	);
}

export default BlogsNavigator;
