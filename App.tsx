/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  StatusBar,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { TransitionPresets, createStackNavigator } from '@react-navigation/stack';

import Welcome from './src/modules/welcome/Welcome';
import Login from './src/modules/login/Login';
import MainTab from './src/modules/mainTab/MainTab';
import CustomMainTab from './src/modules/mainTab/CustomMainTab';

const Stack = createStackNavigator();

function App(): JSX.Element {
  return (
    <SafeAreaProvider >
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={'white'}
      />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName='Welcome'
          screenOptions={{
            cardStyle: {
              // 控制的view的高度和层级，解决层级冲突
              elevation: 1
            }
          }}
        >
          <Stack.Screen
            name='Welcome'
            component={Welcome}
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen
            name='Login'
            component={Login}
            options={{
              headerShown: false,
              // 从右边拉进来(IOS表示该风格由IOS移植，并不是仅IOS可用)
              ...TransitionPresets.SlideFromRightIOS,
              // ...TransitionPresets.ModalSlideFromBottomIOS
            }}
          />

          <Stack.Screen
            name='MainTab'
            component={CustomMainTab}
            options={{
              headerShown: false,
              // 从右边拉进来(IOS表示该风格由IOS移植，并不是仅IOS可用)
              ...TransitionPresets.SlideFromRightIOS,
              // ...TransitionPresets.ModalSlideFromBottomIOS
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;