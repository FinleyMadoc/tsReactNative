import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../home/Home';
import Shop from '../shop/Shop';
import Message from '../message/Message';
import Mine from '../mine/Mine';
import ImagePicker from 'react-native-image-crop-picker';
import { launchImageLibrary, ImageLibraryOptions, ImagePickerResponse } from 'react-native-image-picker'

import icon_tab_home_normal from '../../assets/image/icon_tab_home_normal.png';
import icon_tab_home_selected from '../../assets/image/icon_tab_home_selected.png';
import icon_tab_shop_normal from '../../assets/image/icon_tab_shop_normal.png';
import icon_tab_shop_selected from '../../assets/image/icon_tab_shop_selected.png';
import icon_tab_message_normal from '../../assets/image/icon_tab_message_normal.png';
import icon_tab_message_selected from '../../assets/image/icon_tab_message_selected.png';
import icon_tab_mine_normal from '../../assets/image/icon_tab_mine_normal.png';
import icon_tab_mine_selected from '../../assets/image/icon_tab_mine_selected.png';
import icon_tab_publish from '../../assets/image/icon_tab_publish.png';

const Bottom = createBottomTabNavigator();
// 自定义底部button组件

export default () => {
    const RedBookTabBar = ({ state, descriptors, navigation }: any) => {
        const { routes, index } = state;

        const onPublishPress = () => {
            launchImageLibrary(
                {
                    mediaType: 'photo',
                    quality: 1,
                    includeBase64: true
                },
                (res: any) => {
                    const { assets } = res;
                    if(!assets?.length) {
                        console.log("选择图片失败");
                        return;
                    }
                    const { uri, width, height, fileName, fileSize, type } = assets[0];
                    console.log(uri, width, height, fileName, fileSize, type);
                    
                }
            )
        }

        return (
            <View
                style={
                    styles.tabBarContainer
                }
            >
                {routes.map((route: any, i: number) => {
                    const { options } = descriptors[route.key];
                    const label = options.title;
                    const isFouched = state.index === i;

                    if (i === 2) {
                        return (
                            <TouchableOpacity
                                key={label}
                                style={styles.tabItem}
                                onPress={onPublishPress}
                            >
                                <Image
                                    style={styles.icon_tab_publish}
                                    source={icon_tab_publish} />
                            </TouchableOpacity>
                        )
                    }

                    return (
                        <TouchableOpacity
                            key={label}
                            style={styles.tabItem}
                            onPress={() => {
                                navigation.navigate(route.name)
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: isFouched ? 18 : 16,
                                    color: isFouched ? '#333' : '#999',
                                    fontWeight: isFouched ? 'bold' : 'normal'
                                }}
                            >
                                {label}
                            </Text>
                        </TouchableOpacity>
                    )
                })}
            </View>
        )
    }

    return (
        <View style={styles.root}>
            <Bottom.Navigator
                tabBar={props => <RedBookTabBar {...props} />}
            >
                <Bottom.Screen
                    name="Home"
                    component={Home}
                    options={{
                        title: '首页',
                        headerShown: false
                    }}
                />
                <Bottom.Screen
                    name="Shop"
                    component={Shop}
                    options={{
                        title: '购物',
                        headerShown: false
                    }}
                />
                <Bottom.Screen
                    name="Publish"
                    component={Shop}
                    options={{
                        title: '发布',
                        headerShown: false
                    }}
                />
                <Bottom.Screen
                    name="Message"
                    component={Message}
                    options={{
                        title: '消息',
                        headerShown: false
                    }}
                />
                <Bottom.Screen
                    name="Mine"
                    component={Mine}
                    options={{
                        title: '我',
                        headerShown: false
                    }}
                />
            </Bottom.Navigator>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        width: '100%',
        height: '100%',
    },
    tabBarContainer: {
        width: '100%',
        height: 52,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    tabItem: {
        height: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon_tab_publish: {
        width: 58,
        height: 40,
        resizeMode: 'contain'
    }
})