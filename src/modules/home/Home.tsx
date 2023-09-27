import React, { useEffect, useCallback } from 'react';
import { DeviceEventEmitter, View, Text, StyleSheet, Dimensions, Image, NativeModules, Button, TouchableOpacity, Alert } from 'react-native';
import { useLocalStore, observer } from 'mobx-react';
import HomeSotre from './HomeStore';
import FlowList from '../../components/flowlist/FlowList.js';
import ResizeImage from '../../components/ResizeImage';
import Favourable from '../../components/Favourable';
import TitleBar from './components/TitleBar';
import CategotyList from './components/CategotyList';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import _updateConfig from '../../../update.json'
import { save } from '../../utils/Storage';
import {
    checkUpdate,
    downloadUpdate,
    switchVersion,
    isFirstTime,
    isRolledBack,
    markSuccess,
    switchVersionLater
} from 'react-native-update';
const { appKey } = _updateConfig[Platform.OS]
const { ToastExample } = NativeModules;


const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default observer(() => {

    const store = useLocalStore(() => new HomeSotre());

    const navigation = useNavigation<StackNavigationProp<any>>();

    useEffect(() => {
//      原生start
        // NativeModules.ForegroundModule.startForegroundService()
        //注册扫描监听
        // DeviceEventEmitter.addListener('sendEventToRn', (value) => { console.log('DeviceEventEmitter -->', value) });
        // DeviceEventEmitter.addListener('sendThreadDeviceEvent', (value) => { console.log('DeviceEventEmitter -->', value) });
        // NativeModules.ToastExample.show('Awesome', ToastExample.LONG);
//      原生end

        store.requestHomeList();
        store.getCategoryList();

        checkPatch();

        if (isFirstTime) {
            markSuccess();
            // 补丁成功，上报服务器信息
            // 补丁安装成功率：99.5% ~ 99.7%
        } else if (isRolledBack) {
            // 补丁回滚，上报服务器信息
        }
    }, [])

    // 检查补丁更新
    const checkPatch = async () => {
        const info: any = await checkUpdate(appKey);
        const { update, name, description, metaInfo } = info;
        Alert.alert(
            "info",
            info,
            [
                { text: '取消' },
            ]
        )
        const metaJson = JSON.parse(metaInfo);
        save('patchVersion', name);
        const { forceUpdate } = metaJson;
        if (forceUpdate) {
            // 弹窗提示用户
        } else {
            // 不弹窗默默操作
        }
        if (update) {
            const hash = await downloadUpdate(
                info,
                {
                    onDownloadProgress: ({ received, total }) => { },
                },
            );
            if (hash) {
                if (forceUpdate) {
                    switchVersion(hash);
                } else {
                    switchVersionLater(hash);
                }
            }
        }
    }

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
{/* 原生start */}
            {/* <Button
                title='原生Activity跳转'
                onPress={() => { NativeModules.RNactivityModule.RNActicity(); }}
            />
            <Button
                title='RN用Promise机制调用安卓原生代码'
                onPress={() => {
                    NativeModules.RNPromiseModule.RNPromise('promise调用原生').then(
                        (msg: any) => {
                            console.log("promise接收的消息是", msg);
                        }
                    ).catch((err: any) => {
                        console.log(err);

                    })
                }}
            />
            <Button
                title='RN用Callback回调方式与调用安卓原生代码'
                onPress={() => {
                    NativeModules.RNCallbackModule.RNCallbackModule(
                        (errorCallback: any) => {
                            console.log("回调->", errorCallback);
                        },
                        (successCallback: any) => {
                            console.log("回调->", successCallback);

                        }
                    )
                }}
            />
            <Button
                title='RNDeviceEventEmitter方式实现与android原生模块交互'
                onPress={() => {
                    NativeModules.RNDeviceEventEmitter.RNDeviceEvent();
                }}
            />
            <Button
                title='多线程RNDeviceEventEmitter方式实现与android原生模块交互'
                onPress={() => {
                    NativeModules.MultithreadingEventEmitter.RNThreadDeviceEvent();
                }}
            />
            <Button
                title="RN获取Activity相关的回调"
                onPress={() => {
                    NativeModules.ActivityCallback.RNActivityResult({ strData: 'RN向Android传输的数据' }, (onDone: any) => { console.log('onDone-->', onDone.result) }, (onCancel: any) => { console.log('onCancel-->', onCancel) });
                }}
            /> */}
            {/* <Button
                title="启动前台服务保活"
                onPress={() => {
                    ;
                }}
            /> */}
{/* 原生end */}
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