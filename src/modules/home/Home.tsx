import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, LogBox, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalStore, observer } from 'mobx-react';
import HomeSotre from './HomeStore';
import FlowList from '../../components/flowlist/FlowList.js';
import ResizeImage from '../../components/ResizeImage';
import Favourable from '../../components/Favourable';
import TitleBar from './components/TitleBar';
import CategotyList from './components/CategotyList';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default observer(() => {

    const store = useLocalStore(() => new HomeSotre());

    const navigation = useNavigation<StackNavigationProp<any>>();

    useEffect(() => {
        store.requestHomeList();
        store.getCategoryList();
    }, [])

    const refreshNewData = () => {
        store.resetPage();
        store.requestHomeList();
    }

    const loadMoreData = () => {
        store.requestHomeList();
    }

    const onArticlePress = useCallback((article: ArticleSimple) => () => {
        navigation.push('ArticleDetail', { id: article.id })
    }, [])

    const renderItem = ({ item, index }: { item: ArticleSimple, index: number }) => {
        if (item.title == 'null') {
            return null
        }
        return (
            <TouchableOpacity 
                style={styles.item}
                onPress={onArticlePress(item)}
            >
                <ResizeImage
                    uri={item.image}
                />
                <Text style={styles.titleText}>{item.title}</Text>
                <View style={styles.nameLayout}>
                    <Image
                        source={{ uri: item.avatarUrl }}
                        style={styles.avatarImg}
                    />
                    <Text style={styles.nameText}>{item.userName}</Text>
                    {/* <Image
                        style={styles.heartImg}
                        source={icon_heart_empty}
                    /> */}
                    <Favourable
                        value={item.isFavorite}
                        onValueChange={(value: boolean) => {
                            console.log("value", value);

                        }}
                        size={20}
                    />
                    <Text style={styles.countText}>{item.favoriteCount}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    const Footer = () => {
        return (
            <Text style={styles.footerText}>没有更多数据</Text>
        )
    }

    const categoryList = store.categoryList.filter(i => i.isAdd)
    return (
        <View style={styles.root}>
            <TitleBar
                tab={1}
                onTabChanged={(tab: number) => {
                    console.log('tab', tab);

                }}
            />
            <FlowList
                keyExtrator={(item: ArticleSimple) => item.id.toString()}
                style={styles.flatList}
                data={store.homeList}
                extraData={[store.refreshing]}
                contentContainerStyle={styles.container}
                renderItem={renderItem}
                numColumns={2}
                refreshing={store.refreshing}
                onRefresh={refreshNewData}
                onEndReachedThreshold={0.1}
                onEndReached={loadMoreData}
                ListFooterComponent={<Footer />}
                ListHeaderComponent={
                    <CategotyList  
                        categoryList={categoryList} 
                        allCategoryList={store.categoryList}
                        onCategoryChanged={(category: Category) => console.log('category', category)}
                />}
            />
            {/* <FlatList
                style={styles.flatList}
                data={store.homeList}
                extraData={[store.refreshing]}
                contentContainerStyle={styles.container}
                renderItem={renderItem}
                numColumns={2}
                refreshing={store.refreshing}
                onRefresh={refreshNewData}
                onEndReachedThreshold={0.1}
                onEndReached={loadMoreData}
                ListFooterComponent={<Footer />}
            /> */}
        </View>
    )
})

const styles = StyleSheet.create({
    root: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',

    },
    flatList: {
        width: '100%',
        height: '100%'
    },
    container: {
        // paddingTop: 6
    },
    item: {
        width: (SCREEN_WIDTH - 18) / 2,   // SCREEN_WIDTH - 18 >> 1往右位移1 按位右移1
        backgroundColor: 'white',
        marginLeft: 6,
        marginBottom: 6,
        borderRadius: 8,
        overflow: 'hidden',
    },
    itemImage: {
        width: '100%',
        height: 250,
        resizeMod: 'cover'
    },
    titleText: {
        fontSize: 14,
        color: '#333',
        marginHorizontal: 10,
        marginVertical: 4,
    },
    nameLayout: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 10,
        marginBottom: 10
    },
    avatarImg: {
        width: 20,
        height: 20,
        resizeMode: 'cover',
        borderRadius: 10
    },
    nameText: {
        fontSize: 12,
        color: '#999',
        marginLeft: 6,
        flex: 1
    },
    heartImg: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    countText: {
        fontSize: 14,
        color: '#999',
        marginLeft: 4
    },
    footerText: {
        width: '100%',
        fontSize: 14,
        color: '#999',
        marginVertical: 12,
        textAlign: 'center',
        textAlignVertical: 'center'
    }
}) 