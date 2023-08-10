import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions, TouchableOpacity, LayoutChangeEvent, RefreshControl } from 'react-native';
import { useLocalStore, observer } from 'mobx-react';
import UserStore from '../../stores/UserStore';
import MineStore from './MineStore';
import Empty from '../../components/Empty';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import icon_mine_bg from '../../assets/image/icon_mine_bg.png'
import icon_menu from '../../assets/image/icon_menu.png'
import icon_shop_car from '../../assets/image/icon_shop_car.png'
import icon_share from '../../assets/image/icon_share.png'
import icon_location_info from '../../assets/image/icon_location_info.png'
import icon_qrcode from '../../assets/image/icon_qrcode.png'
import icon_add from '../../assets/image/icon_add.png'
import icon_male from '../../assets/image/icon_male.png'
import icon_female from '../../assets/image/icon_female.png'
import icon_setting from '../../assets/image/icon_setting.png'
import icon_no_note from '../../assets/image/icon_no_note.webp'
import icon_no_collection from '../../assets/image/icon_no_collection.webp'
import icon_no_favorate from '../../assets/image/icon_no_favorate.webp'
import ResizeImage from '../../components/ResizeImage';
import Favourable from '../../components/Favourable';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const Empty_Config = [
    { icon: icon_no_note, tips: '暂无笔记' },
    { icon: icon_no_collection, tips: '暂无收藏' },
    { icon: icon_no_favorate, tips: '暂无点赞' },
]

export default observer(() => {

    const { userInfo } = UserStore

    const store = useLocalStore(() => new MineStore())

    const [tabIndex, setTabIndex] = useState<number>(0);
    const [bgImgheight, setBgImgHeight] = useState<number>(400);
    const navigation = useNavigation<StackNavigationProp<any>>();


    useEffect(() => {
        store.requestAll()
    }, [])

    const renderTitle = () => {
        const styles = StyleSheet.create({
            titleLayout: {
                width: '100%',
                height: 48,
                flexDirection: 'row',
                alignItems: 'center'
            },
            menuBtn: {
                height: '100%',
                paddingHorizontal: 16,
                justifyContent: 'center'
            },
            menuIcon: {
                width: 28,
                height: 28,
                resizeMode: 'contain'
            },
            rightMenuImg: {
                paddingHorizontal: 26,
                tintColor: 'white'
            }
        })

        return (
            <View style={styles.titleLayout}>
                <TouchableOpacity
                    style={styles.menuBtn}
                >
                    <Image style={styles.menuIcon} source={icon_menu} />
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
                <Image source={icon_shop_car} style={[styles.menuIcon, styles.rightMenuImg]} />
                <Image source={icon_share} style={[styles.menuIcon, styles.rightMenuImg]} />
            </View>
        )
    }

    const renderInfo = () => {
        const { avatar, nickName, redBookId, desc, sex } = userInfo
        const styles = StyleSheet.create({
            avatarLayout: {
                width: '100%',
                flexDirection: 'row',
                alignItems: 'flex-end',
                padding: 16
            },
            avatarImg: {
                width: 96,
                height: 96,
                resizeMode: 'cover',
                borderRadius: 48,
            },
            addImg: {
                width: 20,
                height: 20,
                marginLeft: -28,
                marginBottom: 2
            },
            nameLayout: {
                marginLeft: 20
            },
            nameTxt: {
                fontSize: 20,
                color: 'white',
                fontWeight: 'bold',

            },
            idLayout: {
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 16,
                marginBottom: 20
            },
            idTxt: {
                fontSize: 12,
                color: '#bbb'
            },
            iconQrcode: {
                width: 12,
                height: 12,
                mariginLeft: 6,
                tintColor: 'white'
            },
            descTxt: {
                fontSize: 14,
                color: 'white',
                paddingHorizontal: 16
            },
            sexLayout: {
                width: 32,
                height: 24,
                paddingHorizontal: 16,
                backgroundColor: '#ffffff50',
                borderRadius: 12,
                marginTop: 12,
                marginLeft: 16,
                justifyContent: 'center',
                alignItems: 'center'
            },
            sexImg: {
                width: 12,
                height: 12,
                resizeMode: 'contain'
            },
            infoLayout: {
                width: '100%',
                paddingRight: 16,
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20,
                marginBottom: 28
            },
            infoItem: {
                alignItems: 'center',
                paddingHorizontal: 16,
            },
            infoValue: {
                fontSize: 18,
                color: 'white'
            },
            infoLabel: {
                fontSize: 12,
                color: '#ddd',
                marginTop: 6
            },
            infoBtn: {
                height: 32,
                paddingHorizontal: 16,
                borderColor: 'white',
                borderWidth: 1,
                borderRadius: 16,
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 16
            },
            settingTxt: {
                fontSize: 14,
                color: '#ffffff'
            },
            settingBtn: {
                width: 20,
                height: 20,
                tintColor: '#ffffff'
            }
        })

        const { info } = store

        return (
            <View onLayout={(e: LayoutChangeEvent) => {
                const { height } = e.nativeEvent.layout
                setBgImgHeight(height)

            }}>
                <View style={styles.avatarLayout}>
                    <Image source={{ uri: avatar }} style={styles.avatarImg} />
                    <Image source={icon_add} style={styles.addImg} />
                    <View style={styles.nameLayout}>
                        <Text style={styles.nameTxt}>{nickName}</Text>
                        <View style={styles.idLayout}>
                            <Text style={styles.idTxt}>小红书号：{redBookId}</Text>
                            <Image source={icon_qrcode} style={styles.iconQrcode} />
                        </View>
                    </View>

                </View>
                <Text style={styles.descTxt}>{desc}</Text>
                <View style={styles.sexLayout}>
                    <Image source={sex === 'male' ? icon_male : icon_female} style={styles.sexImg} />
                </View>
                <View style={styles.infoLayout}>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoValue}>{info.followCount}</Text>
                        <Text style={styles.infoLabel}>关注</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoValue}>{info.fans}</Text>
                        <Text style={styles.infoLabel}>粉丝</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoValue}>{info.favorateCount}</Text>
                        <Text style={styles.infoLabel}>获赞与收藏</Text>
                    </View>

                    <View style={{ flex: 1 }} />

                    <TouchableOpacity
                        style={styles.infoBtn}
                    >
                        <Text style={styles.settingTxt}>
                            编辑资料
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.infoBtn}
                    >
                        <Image style={styles.settingBtn} source={icon_setting} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    const renderTabs = () => {

        const styles = StyleSheet.create({
            titleLayout: {
                width: '100%',
                height: 48,
                flexDirection: 'row',
                backgroundColor: 'white',
                paddingHorizontal: 16,
                alignItems: 'center',
                justifyContent: 'center',
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                borderBottomWidth: 1,
                borderBottomColor: '#eee',
            },
            tabButton: {
                height: '100%',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 14
            },
            tabTxt: {
                fontSize: 17,
                color: '#999'
            },
            tabTxtSelected: {
                fontSize: 17,
                color: '#333'
            },
            line: {
                width: 28,
                height: 2,
                backgroundColor: '#ff2442',
                borderRadius: 1,
                position: 'absolute',
                bottom: 6
            },
        })

        return (
            <View style={styles.titleLayout}>
                <TouchableOpacity
                    style={styles.tabButton}
                    onPress={() => {
                        setTabIndex(0)
                    }}
                >
                    <Text style={tabIndex === 0 ? styles.tabTxtSelected : styles.tabTxt}>笔记</Text>
                    {tabIndex === 0 && <View style={styles.line}></View>}
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.tabButton}
                    onPress={() => {
                        setTabIndex(1)
                    }}
                >
                    <Text style={tabIndex === 1 ? styles.tabTxtSelected : styles.tabTxt}>收藏</Text>
                    {tabIndex === 1 && <View style={styles.line}></View>}
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.tabButton}
                    onPress={() => {
                        setTabIndex(2)
                    }}
                >
                    <Text style={tabIndex === 2 ? styles.tabTxtSelected : styles.tabTxt}>赞过</Text>
                    {tabIndex === 2 && <View style={styles.line}></View>}
                </TouchableOpacity>
            </View>
        )
    }

    const onArticlePress = useCallback((article: ArticleSimple) => () => {
        navigation.push('ArticleDetail', { id: article.id })
    }, [])

    const renderList = () => {
        const { noteList, collectionList, favorateList } = store;
        const currentList = [noteList, collectionList, favorateList][tabIndex];
        console.log("currentList", currentList);

        if (!currentList?.length) {
            const config = Empty_Config[tabIndex]
            return <Empty icon={config.icon} tips={config.tips} />
        }

        const styles = StyleSheet.create({
            listContent: {
                width: '100%',
                flexDirection: 'row',
                flexWrap: 'wrap',

                backgroundColor: 'white'
            },
            item: {
                width: (SCREEN_WIDTH - 18) / 2,   // SCREEN_WIDTH - 18 >> 1往右位移1 按位右移1
                backgroundColor: 'white',
                marginLeft: 6,
                marginBottom: 6,
                borderRadius: 8,
                overflow: 'hidden',
                marginTop: 8
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
            itemImg: {
                width: SCREEN_WIDTH - 18 >> 1,
                height: 240,
            },
        })

        return (
            <View style={styles.listContent}>
                {currentList.map((item, index) => {
                    return (
                        <TouchableOpacity
                            key={`${item}-${index}`}
                            style={styles.item}
                            onPress={onArticlePress(item)}
                        >
                            <Image style={styles.itemImg} source={{ uri: item.image }} />
                            <Text style={styles.titleText}>{item.title}</Text>
                            <View style={styles.nameLayout}>
                                <Image style={styles.avatarImg} source={{ uri: item.avatarUrl }} />
                                <Text style={styles.nameText}>{item.userName}</Text>
                                <Favourable
                                    value={item.isFavorite}
                                    onValueChange={(value: boolean) => {
                                        console.log(value);

                                    }}
                                />
                                <Text style={styles.countText}>{item.favoriteCount}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                })}
            </View>
        )
    }


    return (
        <View style={styles.root}>
            <Image source={icon_mine_bg} style={[styles.bgImg, { height: bgImgheight + 64 }]} />
            {renderTitle()}
            <ScrollView
                style={styles.scrollView}
                refreshControl={
                    <RefreshControl
                        refreshing={store.refreshing}
                    />
                }
            >
                {renderInfo()}
                {renderTabs()}
                {renderList()}
            </ScrollView>
        </View>
    )
})

const styles = StyleSheet.create({
    root: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white'
    },
    bgImg: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: 400
    },
    scrollView: {
        width: '100%',
        flex: 1
    }
})