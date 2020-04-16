import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {FlatList, RefreshControl, Text, View} from 'react-native';
import {Button, Card} from 'react-native-elements';

import Blog from '../components/Blog';
import ErrorDisplay from '../components/ErrorDisplay';
import NoSiteSelected from '../components/NoSiteSelected';
import ToggleDrawerButton from '../components/ToggleDrawerButton';
import {useAppState} from '../hooks/appState';
import useFetch from '../hooks/useFetch';
import styles from '../styles/main';
import Liferay from '../util/liferay-config';
import {request} from '../util/request';

function Blogs({navigation}) {
	const [state] = useAppState();

	const {site} = state;

	const siteId = site ? site.id : null;

	const [blogEntries, loading, error, handleRequest] = useFetch(
		() => {
			if (siteId) {
				return request({
					url: `/o/headless-delivery/v1.0/sites/${siteId}/blog-postings`,
				});
			} else {
				return Promise.reject();
			}
		},
		[siteId],
		(res) => res.items
	);

	const renderItem = ({item}) => (
		<Card
			image={
				item.image ? {uri: Liferay.url + item.image.contentUrl} : null
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
			{error && (
				<ErrorDisplay error={error} onRetry={() => handleRequest()} />
			)}

			{blogEntries && blogEntries.length === 0 && !loading && !error && (
				<Text style={[styles.m2, styles.textCenter]}>
					There are no blog entries to display.
				</Text>
			)}

			{blogEntries && (
				<FlatList
					data={blogEntries}
					keyExtractor={({id}) => id.toString()}
					refreshControl={
						<RefreshControl
							onRefresh={() => handleRequest()}
							refreshing={loading}
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
