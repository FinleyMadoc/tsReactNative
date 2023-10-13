import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import TimeComponent from "../ModalComponent/TimeComponent";

const Stack = createStackNavigator();

export default function MyStack() {
    return (
        <Stack.Navigator
            initialRouteName="Time"
        >
            <Stack.Screen name="Time" component={TimeComponent} />
        </Stack.Navigator>
    )
}