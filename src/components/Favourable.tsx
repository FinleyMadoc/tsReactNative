import React, { useEffect, useState } from "react";
import { 
        Image, 
        TouchableOpacity, 
        StyleSheet 
    } from "react-native";

import icon_heart from '../assets/image/icon_heart.png';
import icon_heart_empty from '../assets/image/icon_heart_empty.png';

export default () => {
    return (
        <TouchableOpacity
            onPress={() => {
                null
            }}
        >
            <Image style={styles.container} source={icon_heart}/>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 20,
        height: 20,
        resizeMode: 'contain'
    }
})