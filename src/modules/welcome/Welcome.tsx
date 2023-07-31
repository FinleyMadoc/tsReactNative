import React, { useEffect } from "react";
import { View, Text, Button, StyleSheet, Image } from "react-native";
import { load } from "../../utils/Storage";
// typing.d.ts
import icon_logo_main from '../../assets/image/icon_main_logo.png'
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

export default () => {

    const navigation = useNavigation<StackNavigationProp<any>>();
    
    useEffect(() => {
        setTimeout(() => {
            // startLogin();
            getUserInfo()

        }, 3000)
    }, [])

    const getUserInfo = async () => {
        const cacheUserInfo = await load('userInfo');
        console.log("cacheUserInfo", cacheUserInfo);
        
        if(cacheUserInfo && JSON.parse(cacheUserInfo)) {
            navigation.replace('MainTab')
        }else{
            navigation.replace('Login') 
        }
    }
    

    const startLogin = () => {
        navigation.navigate("Login");
    }

    return ( 
        <View style={styles.root}>
            <Image source={icon_logo_main} style={styles.logo_main} />
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        flexDirection: 'column',
        alignItems: 'center'
    },
    logo_main: {
        width: 200,
        height: 105,
        marginTop: 200,
        resizeMode: 'contain'
    }
})