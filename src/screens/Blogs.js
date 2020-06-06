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
import {statefulRequest} from '../util/request';

function Blogs({navigation}) {
	const [state] = useAppState();

	const {site} = state;

	const siteId = site ? site.id : null;

	const {data, error, refetch, status} = useQuery(
		siteId && ['blogs', siteId],
		() => {
			return statefulRequest(state)(
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
			{error && <ErrorDisplay error={error} onRetry={() => refetch()} />}

			{items && items.length === 0 && status === 'success' && (
				<Text style={[styles.m2, styles.textCenter]}>
					There are no blog entries to display.
				</Text>
			)}

			{items && (
				<FlatList
					data={items}
					keyExtractor={({id}) => id.toString()}
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
