/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry, Platform, UIManager} from 'react-native';
import App from './App';
// import App from './src/module/app'
import {name as appName} from './app.json';

if(Platform.OS === 'android'){
    if(UIManager.setLayoutAnimationEnabledExperimental) {
        console.log("enable...");
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

AppRegistry.registerComponent(appName, () => App);
