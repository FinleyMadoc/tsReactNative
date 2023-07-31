import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../home/Home';
import Shop from '../shop/Shop';
import Message from '../message/Message';
import Mine from '../mine/Mine';

import icon_tab_home_normal from '../../assets/image/icon_tab_home_normal.png';
import icon_tab_home_selected from '../../assets/image/icon_tab_home_selected.png';
import icon_tab_shop_normal from '../../assets/image/icon_tab_shop_normal.png';
import icon_tab_shop_selected from '../../assets/image/icon_tab_shop_selected.png';
import icon_tab_message_normal from '../../assets/image/icon_tab_message_normal.png';
import icon_tab_message_selected from '../../assets/image/icon_tab_message_selected.png';
import icon_tab_mine_normal from '../../assets/image/icon_tab_mine_normal.png';
import icon_tab_mine_selected from '../../assets/image/icon_tab_mine_selected.png';

const Bottom = createBottomTabNavigator();

export default () => {
    return (
        <View style={styles.root}>
            <Bottom.Navigator
                screenOptions={({ route }) => {
                    return {
                        tabBarIcon: ({ focused, color, size }) => {
                            let img;
                            if (route.name === 'Home') {
                                img = focused ? icon_tab_home_selected : icon_tab_home_normal
                            } else if (route.name === 'Shop') {
                                img = focused ? icon_tab_shop_selected : icon_tab_shop_normal
                            } else if (route.name === 'Message') {
                                img = focused ? icon_tab_message_selected : icon_tab_message_normal
                            } else if (route.name === 'Mine') {
                                img = focused ? icon_tab_mine_selected : icon_tab_mine_normal
                            }

                            return <Image style={{
                                width: size,
                                height: size,
                                tintColor: color
                            }} source={img} />
                        },
                        tabBarActiveTintColor: 'ff2442',
                        tabBarInactiveTintColor: '#999',
                    }
                }}
            >
                <Bottom.Screen
                    name="Home"
                    component={Home}
                    options={{
                        title: '首页'
                    }}
                />
                <Bottom.Screen
                    name="Shop"
                    component={Shop}
                    options={{
                        title: '购物'
                    }}
                />
                <Bottom.Screen
                    name="Message"
                    component={Message}
                    options={{
                        title: '消息'
                    }}
                />
                <Bottom.Screen
                    name="Mine"
                    component={Mine}
                    options={{
                        title: '我'
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
    }
})