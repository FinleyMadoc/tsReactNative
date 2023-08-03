import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Linking, LayoutAnimation, ToastAndroid } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { formatPhone, replaceBlank } from "../../utils/StringUI";
import { get, request } from "../../utils/Request";
import UserStore from "../../stores/UserStore";
import Toast from "../../components/widget/Toast";


import icon_logo_main from '../../assets/image/icon_main_logo.png'
import icon_unselected from '../../assets/image/icon_unselected.png'
import icon_selected from '../../assets/image/icon_selected.png'
import icon_arrow from '../../assets/image/icon_arrow.png'
import icon_wx_small from '../../assets/image/icon_wx_small.png'
import icon_triangle from '../../assets/image/icon_triangle.png'
import icon_eye_open from '../../assets/image/icon_eye_open.png'
import icon_eye_close from '../../assets/image/icon_eye_close.png'
import icon_exchange from '../../assets/image/icon_exchange.png'
import icon_wx from '../../assets/image/icon_wx.png';
import icon_qq from '../../assets/image/icon_qq.webp'
import icon_close_modal from '../../assets/image/icon_close_modal.png'



export default () => {

    // 联合类型，可选择通过快速登录或者输入登录
    const [loginType, setLoginType] = useState<'quick' | 'input'>('quick');
    const [check, setCheck] = useState<boolean>(false);
    const [eyeOpen, setEyeOpen] = useState<boolean>(true);
    const navigation = useNavigation<StackNavigationProp<any>>();
    const [phone, setPhone] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const onLoginPress = async () => {
        const canLogin = phone?.length === 13 && password?.length === 6;

        if (!canLogin || !check) {
            return
        }

        UserStore.requestLogin(replaceBlank(phone), password, (success: boolean) => {
            if (success) {
                navigation.replace('MainTab')
            } else {
                Toast.show('登陆失败')
            }
        })

    }

    const renderQuckLogin = () => {
        const styles = StyleSheet.create({
            root: {
                width: '100%',
                height: '100%',
                flexDirection: 'column-reverse',
                alignItems: 'center',
                paddingHorizontal: 56
            },
            otherLoginButton: {
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 20,
                paddingHorizontal: 10,
                marginBottom: 100
            },
            otherLoginTxt: {
                fontSize: 16,
                color: '#303080'
            },
            icon_arrow: {
                width: 16,
                height: 16,
                resizeMode: 'contain',
                marginLeft: 6,
                transform: [{
                    rotate: '180deg'
                }]
            },
            wxLoginButton: {
                width: '100%',
                height: 56,
                backgroundColor: '#05c160',
                borderRadius: 28,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row'
            },
            icon_wx: {
                width: 40,
                height: 40
            },
            wxLoginTxt: {
                fontSize: 18,
                color: 'white',
                marginLeft: 6
            },
            oneKeyLoginButton: {
                width: '100%',
                height: 56,
                backgroundColor: '#ff2242',
                borderRadius: 28,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                marginBottom: 20
            },
            oneKeyLoginTxt: {
                fontSize: 18,
                color: 'white',
                marginLeft: 6
            },
            logoMain: {
                width: 180,
                height: 95,
                resizeMode: 'contain',
                position: 'absolute',
                top: 100
            }
        })

        return (
            <View style={styles.root}>
                <View style={allStyles.protocolLayout}>
                    <TouchableOpacity
                        onPress={() => setCheck(!check)}
                    >
                        <Image source={check ? icon_selected : icon_unselected} style={allStyles.radioBtn} />
                    </TouchableOpacity>
                    <Text style={allStyles.labelTxt}>我已阅读并同意</Text>
                    <TouchableOpacity
                        onPress={() => {
                            Linking.openURL('https://www.baidu.com')
                        }}
                    >
                        <Text style={allStyles.protocoTxt}>《用户协议》和《隐私政策》</Text>
                    </TouchableOpacity>
                </View>



                <TouchableOpacity style={styles.otherLoginButton}
                    onPress={() => {
                        LayoutAnimation.easeInEaseOut()
                        setLoginType('input')
                    }}
                >
                    <Text style={styles.otherLoginTxt}>其它登录方式</Text>
                    <Image source={icon_arrow} style={styles.icon_arrow} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.wxLoginButton}
                    activeOpacity={0.7}
                >
                    <Image source={icon_wx_small} style={styles.icon_wx} />
                    <Text style={styles.wxLoginTxt}>微信登录</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.oneKeyLoginButton}
                    activeOpacity={0.7}
                >
                    <Text style={styles.oneKeyLoginTxt}>一键登录</Text>
                </TouchableOpacity>

                <Image source={icon_logo_main} style={styles.logoMain} />
            </View>
        )
    }

    const renderInputLogin = () => {
        const styles = StyleSheet.create({
            root: {
                width: '100%',
                height: '100%',
                flexDirection: 'column',
                alignItems: 'center',
                paddingHorizontal: 48
            },
            pwdLoginTxt: {
                fontSize: 28,
                color: '#333',
                fontWeight: 'bold',
                marginTop: 56
            },
            tip: {
                fontSize: 14,
                color: '#bbb',
                marginTop: 6
            },
            phoneLayout: {
                width: '100%',
                height: 60,
                flexDirection: 'row',
                alignItems: 'center',
                borderBottomWidth: 1,
                borderBottomColor: '#ddd',
                marginTop: 28
            },
            pre86: {
                fontSize: 24,
                color: '#bbb'
            },
            triangle: {
                width: 12,
                height: 6,
                marginLeft: 6
            },
            phoneInput: {
                flex: 1,
                height: 60,
                backgroundColor: 'transparent',
                textAlign: 'left',
                textAlignVertical: 'center',
                fontSize: 24,
                color: '#333',
                marginLeft: 16
            },
            pwdLayout: {
                width: '100%',
                height: 60,
                flexDirection: 'row',
                alignItems: 'center',
                borderBottomWidth: 1,
                borderBottomColor: '#ddd',
                marginTop: 8
            },
            pwdInput: {
                marginLeft: 0,
                marginRight: 16
            },
            iconEye: {
                width: 30,
                height: 30,

            },
            changeLayout: {
                width: '100%',
                marginTop: 10,
                flexDirection: 'row',
                alignItems: 'center'
            },
            exchangeIcon: {
                width: 16,
                height: 16,
                resizeMode: 'contain',
            },
            codeLoginTxt: {
                fontSize: 14,
                color: '#303080',
                flex: 1,
                marginLeft: 4
            },
            // 自然到右边，因为剩余部分被上面的codeLoginTxt的flex：1占据
            forgetPwdTxt: {
                fontSize: 14,
                color: '#303080',
            },
            loginButton: {
                width: '100%',
                height: 56,
                backgroundColor: '#ff2442',
                // backgroundColor: '#DDD',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 28,
                marginTop: 20
            },
            loginButtonDisable: {
                width: '100%',
                height: 56,
                // backgroundColor: '#ff2442',
                backgroundColor: '#DDD',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 28,
                marginTop: 20
            },
            loginTxt: {
                fontSize: 18,
                color: 'white'
            },
            wxqqLayout: {
                width: '100%',
                flexDirection: 'row',
                marginTop: 40,
                justifyContent: 'center'
            },
            iconWx: {
                width: 50,
                height: 50,
                marginRight: 70
            },
            iconQQ: {
                width: 50,
                height: 50,
                marginLeft: 70
            },
            closeBtn: {
                position: 'absolute',
                left: 36,
                top: 24,
            },
            closeImg: {
                width: 28,
                height: 28
            }
        })

        const canLogin = phone?.length === 13 && password?.length === 6;
        return (
            <View style={styles.root}>
                <Text style={styles.pwdLoginTxt}>密码登录</Text>
                <Text style={styles.tip}>未注册的手机号登录后将自动注册</Text>

                <View style={styles.phoneLayout}>
                    <Text style={styles.pre86}>+86</Text>
                    <Image source={icon_triangle} style={styles.triangle} />
                    <TextInput
                        style={styles.phoneInput}
                        placeholderTextColor="#999"
                        placeholder="请输入手机号码"
                        autoFocus={false}
                        keyboardType="number-pad"
                        maxLength={13}
                        value={phone}
                        onChangeText={(text: string) => {
                            setPhone(formatPhone(text))
                        }}
                    />
                </View>

                <View style={styles.pwdLayout}>
                    <TextInput
                        style={[styles.phoneInput, styles.pwdInput]}
                        placeholderTextColor="#bbb"
                        placeholder="请输入密码"
                        autoFocus={false}
                        keyboardType="number-pad"
                        maxLength={6}
                        secureTextEntry={eyeOpen}
                        // value={eyeOpen ? password : '******'}
                        value={password}
                        onChangeText={(text: string) => {
                            setPassword(text)
                        }}
                    />
                    <TouchableOpacity
                        onPress={() => {
                            setEyeOpen(!eyeOpen)
                        }}
                    >
                        <Image source={eyeOpen ? icon_eye_open : icon_eye_close} style={styles.iconEye} />
                    </TouchableOpacity>
                </View>

                <View style={styles.changeLayout}>
                    <Image source={icon_exchange} style={styles.exchangeIcon} />
                    <Text style={styles.codeLoginTxt}>验证码登录</Text>
                    <Text style={styles.forgetPwdTxt}>忘记密码？</Text>
                </View>

                <TouchableOpacity
                    activeOpacity={canLogin ? 0.7 : 1}
                    style={canLogin ? styles.loginButton : styles.loginButtonDisable}
                    onPress={() => onLoginPress()}
                >
                    <Text style={styles.loginTxt}>登录</Text>
                </TouchableOpacity>

                <View style={allStyles.protocolLayout}>
                    <TouchableOpacity
                        onPress={() => setCheck(!check)}
                    >
                        <Image source={check ? icon_selected : icon_unselected} style={allStyles.radioBtn} />
                    </TouchableOpacity>
                    <Text style={allStyles.labelTxt}>我已阅读并同意</Text>
                    <TouchableOpacity
                        onPress={() => {
                            Linking.openURL('https://www.baidu.com')
                        }}
                    >
                        <Text style={allStyles.protocoTxt}>《用户协议》和《隐私政策》</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.wxqqLayout}>
                    <Image style={styles.iconWx} source={icon_wx} />
                    <Image style={styles.iconQQ} source={icon_qq} />
                </View>

                <TouchableOpacity
                    style={styles.closeBtn}
                    onPress={() => {
                        LayoutAnimation.easeInEaseOut()
                        setLoginType('quick')
                    }}
                >
                    <Image source={icon_close_modal} style={styles.closeImg} />
                </TouchableOpacity>
            </View>
        )
    }


    return (
        <View style={allStyles.root}>
            {
                loginType === 'quick' ?
                    renderQuckLogin()
                    :
                    renderInputLogin()
            }
        </View>
    )
}

const allStyles = StyleSheet.create({
    root: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        flexDirection: 'column',
        alignItems: 'center'
    },
    logo_main: {
        width: 200,
        height: 100,
        marginTop: 300
    },
    protocolLayout: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 12
    },
    radioBtn: {
        width: 20,
        height: 20
    },
    labelTxt: {
        fontSize: 12,
        color: '#999',
        marginLeft: 6
    },
    protocoTxt: {
        fontSize: 12,
        color: '#1020ff'
    },
})