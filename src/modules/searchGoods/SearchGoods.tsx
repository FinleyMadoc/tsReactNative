import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, LayoutAnimation, TextInput} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import icon_search from '../../assets/image/icon_search.png';
import icon_arrow from '../../assets/image/icon_arrow.png';
import icon_shop_car from '../../assets/image/icon_shop_car.png';
import icon_orders from '../../assets/image/icon_orders.png';
import icon_menu from '../../assets/image/icon_menu_more.png';

export default () => {

    const inputRef = useRef<TextInput>(null)

    const navigation = useNavigation<StackNavigationProp<any>>();

    const [showBack, setShowBack] = useState<boolean>(false)

    useEffect(() => {
        setTimeout(() => {
            LayoutAnimation.easeInEaseOut();
            setShowBack(true);
            inputRef.current?.focus();
        }, 100);
    }, [])

    const onBackPress = () => {
        LayoutAnimation.easeInEaseOut();
        setShowBack(false);
        inputRef.current?.blur();
        setTimeout(() => {
            navigation.pop()
        }, 300)
        navigation.pop();
    }

    const renderTitle = () => {
        return (
            <View style={styles.titleLayout}>
                {showBack && <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => {
                        navigation.pop()
                    }}
                >
                    <Image style={styles.backImg} source={icon_arrow} />
                </TouchableOpacity>}
                <View
                    style={styles.searchLayout}
                >
                    <Image style={styles.searchIcon} source={icon_search} />
                    {/* <Text style={styles.searchTxt}>......</Text> */}
                    <TextInput 
                        ref={inputRef}
                        style={styles.searchTxt}
                        placeholder='搜索内容'
                        placeholderTextColor={'#bbb'}
                    />
                </View>

                <Text style={styles.searchBottom}>搜索</Text>
            </View>
        )
    }

    return (
        <View style={styles.root}>
            {renderTitle()}
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent'
    },
    titleLayout: {
        width: '100%',
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    searchLayout: {
        height: 32,
        flex: 1,
        backgroundColor: '#f0f0f0',
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginLeft: 16,
    },
    searchIcon: {
        width: 18,
        height: 18,
    },
    searchTxt: {
        fontSize: 14,
        color: '#bbb',
        marginLeft: 6,
        paddingHorizontal: 8,
        paddingVertical: 0,
    },
    menuIcon: {
        width: 22,
        height: 22,
        marginHorizontal: 6
    },
    searchBottom: {
        fontSize: 16,
        color: '#666',
        paddingHorizontal: 12
    },
    backBtn: {
        height: '100%',
        paddingLeft: 16,
        justifyContent: 'center'
    },
    backImg: {
        width: 20,
        height: 20,
    }
})