import React, { useEffect, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import { Modal, View, Text, StyleSheet, Dimensions, Image, LayoutAnimation, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { remove } from '../../utils/Storage';

import icon_setting from '../../assets/image/icon_setting.png'
import icon_service from '../../assets/image/icon_service.png'
import icon_scan from '../../assets/image/icon_scan.png'

import icon_find_user from '../../assets/image/icon_find_user.png';
import icon_draft from '../../assets/image/icon_draft.png';
import icon_create_center from '../../assets/image/icon_create_center.png';
import icon_browse_histroy from '../../assets/image/icon_browse_history.png';
import icon_packet from '../../assets/image/icon_packet.png';
import icon_free_net from '../../assets/image/icon_free_net.png';
import icon_nice_goods from '../../assets/image/icon_nice_goods.png';
import icon_orders from '../../assets/image/icon_orders.png';
import icon_shop_car from '../../assets/image/icon_shop_car.png';
import icon_coupon from '../../assets/image/icon_coupon.png';
import icon_wish from '../../assets/image/icon_wish.png';
import icon_red_vip from '../../assets/image/icon_red_vip.png'
import icon_community from '../../assets/image/icon_community.png';
import icon_exit from '../../assets/image/icon_exit.png';



export interface SideMenuRef {
    show: () => void;
    hide: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const ContentWidth = SCREEN_WIDTH * 0.75

const MENUS = [
    [
        { icon: icon_find_user, name: '发现好友' },
    ],
    [
        { icon: icon_draft, name: '我的草稿' },
        { icon: icon_create_center, name: '创作中心' },
        { icon: icon_browse_histroy, name: '浏览记录' },
        { icon: icon_packet, name: '钱包' },
        { icon: icon_free_net, name: '免流量' },
        { icon: icon_nice_goods, name: '好物体验' }
    ],
    [
        { icon: icon_orders, name: '订单' },
        { icon: icon_shop_car, name: '购物车' },
        { icon: icon_coupon, name: '卡券' },
        { icon: icon_wish, name: '心愿单' },
        { icon: icon_red_vip, name: '小红书会员' }
    ],
    [
        { icon: icon_community, name: '社区公约' },
        { icon: icon_exit, name: '退出登录' }
    ]
]

const BOTTOM_MENU = [
    { icon: icon_setting, txt: '设置' },
    { icon: icon_service, txt: '帮助与客服' },
    { icon: icon_scan, txt: '扫一扫' },
]



export default forwardRef((props: any, ref) => {

    const [visable, setVisable] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const navigation = useNavigation<StackNavigationProp<any>>();

    const show = () => {
        setVisable(true)
        setTimeout(() => {
            LayoutAnimation.easeInEaseOut();
            setOpen(true)
        }, 100)

    }

    const hide = () => {
        LayoutAnimation.easeInEaseOut();
        setOpen(false)

        setTimeout(() => {
            setVisable(false)

        }, 300)

    }

    useImperativeHandle(ref, () => {
        return { show, hide }
    })

    const onMenuItemPress = useCallback((item: any) => async () => {
        if (item.name === '退出登录') {
            hide()
            await remove('userInfo');
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }]
            })
        }
    }, [])

    const renderContent = () => {
        return (
            <View style={[styles.content, { marginLeft: open ? 0 : -ContentWidth }]}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollViewContent}
                    showsVerticalScrollIndicator={false}
                >
                    {MENUS.map((item, index) => {
                        return (
                            <View
                                key={`${index}`}
                            >
                                {item.map((subItem, subIndex) => {
                                    return (
                                        <TouchableOpacity
                                            key={`${subIndex}`}
                                            style={styles.menuItem}
                                            onPress={onMenuItemPress(subItem)}
                                        > 
                                            <Image style={styles.menuIcon} source={subItem.icon} />
                                            <Text style={styles.menuTxt}>{subItem.name}</Text>
                                        </TouchableOpacity>
                                    )
                                })}

                                {index !== MENUS.length - 1 && <View style={styles.line} />}
                            </View>
                        )
                    })}
                </ScrollView>
                <View style={styles.bottomLayout}>
                    {BOTTOM_MENU.map(item => {
                        return (
                            <TouchableOpacity
                                key={`${item.txt}`}
                                style={styles.bottomMenuItem}
                            >
                                <View style={styles.bottomIconLayout}>
                                    <Image style={styles.bottomIcon} source={item.icon} />
                                </View>

                                <Text style={styles.bottomTxt}>{item.txt}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </View>
        )
    }

    return (
        <Modal
            transparent={true}
            visible={visable}
            statusBarTranslucent={true}
            animationType='fade'
            onRequestClose={hide}
        >
            <TouchableOpacity activeOpacity={1} style={styles.root} onPress={hide}>
                {renderContent()}
            </TouchableOpacity>
        </Modal>
    )
})

const styles = StyleSheet.create({
    root: {
        width: '100%',
        height: '100%',
        backgroundColor: '#000000C0',
        flexDirection: 'row'
        // backgroundColor: 'green'
    },
    content: {
        height: '100%',
        width: ContentWidth,
        backgroundColor: 'white'
    },
    scrollView: {
        width: '100%',
        flex: 1,
    },
    bottomLayout: {
        width: '100%',
        flexDirection: 'row',
        paddingTop: 12,
        paddingBottom: 20
    },
    bottomMenuItem: {
        flex: 1,
        alignItems: 'center',
    },
    bottomIconLayout: {
        width: 44,
        height: 44,
        backgroundColor: '#f0f0f0',
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center'
    },
    bottomIcon: {
        width: 26,
        height: 26,
    },
    bottomTxt: {
        fontSize: 13,
        color: '#666',
        marginTop: 8
    },
    line: {
        width: '100%',
        height: 1,
        backgroundColor: '#eee'
    },
    menuItem: {
        width: '100%',
        height: 64,
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuIcon: {
        width: 32,
        height: 32,
        resizeMode: 'contain'
    },
    menuTxt: {
        fontSize: 16,
        color: '#333',
        marginLeft: 14
    },
    scrollViewContent: {
        paddingTop: 72,
        paddingHorizontal: 28,
        paddingBottom: 12

    }
})