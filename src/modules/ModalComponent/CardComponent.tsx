import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import SwipeCards from 'react-native-swipe-cards';


export default class CardComponent extends React.Component {
    constructor(props: any) {
        super(props);

        this.state = {

        }
    }

    render() {
        return (
            <View style={{ backgroundColor: '#fff', flex: 1 }}>
                <Text>
                    123456
                </Text>
            </View>
        )
    }
}