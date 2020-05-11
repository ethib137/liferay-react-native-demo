import {createStackNavigator} from '@react-navigation/stack';
import React, {useCallback, useEffect} from 'react';
import {FlatList, RefreshControl, Text, View} from 'react-native';
import {Button, Card} from 'react-native-elements';

import {loadBlogsAction} from '../actions/blogs';
import Blog from '../components/Blog';
import ErrorDisplay from '../components/ErrorDisplay';
import NoSiteSelected from '../components/NoSiteSelected';
import ToggleDrawerButton from '../components/ToggleDrawerButton';
import {useAppState} from '../hooks/appState';
import styles from '../styles/main';

function Blogs({navigation}) {
	const [state, dispatch] = useAppState();

	const {blogs, site} = state;

	const siteId = site ? site.id : null;

	const {error, items, loading} = blogs;

	const dispatchBlogs = useCallback(() => {
		if (!loading) {
			dispatch(loadBlogsAction());
		}
	}, [dispatch, loading]);

	useEffect(dispatchBlogs, [siteId]);

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
			{error && (
				<ErrorDisplay error={error} onRetry={() => dispatchBlogs()} />
			)}

			{items && items.length === 0 && !loading && !error && (
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
							onRefresh={() => dispatchBlogs()}
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
