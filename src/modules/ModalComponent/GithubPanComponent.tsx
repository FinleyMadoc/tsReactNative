import React from "react";
import { View, Image, PanResponderInstance, PanResponder, StyleSheet, TouchableHighlight, Text, ScrollView } from "react-native";
import DataUtil from "../../utils/DataUtil";
import Icon from "react-native-vector-icons/Ionicons";

export default class GithubPanComponent extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            scrollEnable: false,
            scale: 1,
            iconTop: 95,
            bannerTop: 0,
            opacity: 0,
        }
    }

    _scrollEable = false;
    _perviousTop = 0;
    _iconTop = 95;
    _scale = 1;
    _bannerTop = 0;
    _opacity = 0;
    _mainTop = -192;
    _userStyle = {
        style: {
            top: 0
        }
    };
    _panResponder: PanResponderInstance | null = null;
    user: { setNativeProps(props: object): void } | null = null;

    _updatePosition() {
        this.user && this.user.setNativeProps(this._userStyle);
        // setNativeProps直接修改一个组件的底层原生属性，这里是修改了组件的坐标，x，y
    }

    _endMove(evt: any, gestureState: any) {
        this._perviousTop = this._userStyle.style.top;
    }

    UNSAFE_componentWillMount(): void {
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (e, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                return gestureState.dy / gestureState.dx != 0;
            },
            onPanResponderGrant: (evt, gestureState) => {

            },
            onPanResponderMove: (evt, gestureState) => {
                this._userStyle.style.top = this._perviousTop + gestureState.dy;
                this._scale = 1 + this._userStyle.style.top / 162.5;
                this._iconTop = 95 - this._userStyle.style.top / 4.16;
                this._bannerTop = 0;
                this._opacity = 0;
                console.log("this._userStyle.style.top", this._userStyle.style.top);
                if (this._userStyle.style.top < -62.5) {
                    this._scale = 0.6;
                    this._iconTop = 110;
                    this._bannerTop = -this._userStyle.style.top - 62.5;
                    this._opacity = Math.pow((-this._userStyle.style.top - 62.5) / 129.5, 0.5);
                }
                if (this._userStyle.style.top > 0) {
                    this._userStyle.style.top = 0;
                    this._scale = 1;
                    this._iconTop = 95;
                }

                console.log("this._mainTop", this._mainTop);
                if (this._userStyle.style.top < this._mainTop) {
                    this._userStyle.style.top = this._mainTop;
                    this._opacity = 1;
                    this._bannerTop = 129.5;
                }
                console.log("this._bannerTop", this._bannerTop);
                
                this.setState({
                    scale: this._scale,
                    iconTop: this._iconTop,
                    bannerTop: this._bannerTop,
                    opacity: this._opacity
                })

                this._updatePosition();
            },
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => this._endMove(evt, gestureState),
            onPanResponderTerminate: (evt, gestureState) => this._endMove(evt, gestureState),
            onShouldBlockNativeResponder: (event, gestureState) => true,
        })

        this._userStyle = {
            style: {
                top: this._perviousTop,
            }
        }
    }

    componentDidMount(): void {
        this._updatePosition();
    }

    render() {
        let panProps = this.state.scrollEnable ? {} : { ...this._panResponder?.panHandlers };

        return (
            <View style={styles.mainContainer}>
                <View style={styles.userContainer} ref={(user) => this.user = user} {...panProps}>
                    <View style={styles.userPanel}>
                        <Image style={[styles.banner, { top: this.state.bannerTop }]} source={require('../../assets/image/640.jpeg')} />

                        <View style={[styles.iconContainer, { top: this.state.iconTop, transform: [{ scale: this.state.scale }] }]}>
                            <Icon name={'logo-github'} color={'#000'} size={68} />
                        </View>

                        <View style={styles.userControl}>
                            <TouchableHighlight style={styles.controlIcon}>
                                <Icon name={'settings'} color={'#8999a5'} size={20} />
                            </TouchableHighlight>
                            <TouchableHighlight style={styles.controlBtn}>
                                <Icon name={'people'} color={'#8999a5'} size={20} />
                            </TouchableHighlight>
                            <TouchableHighlight style={styles.controlBtn2}>
                                <Text style={styles.controlBtnText}>编辑个人资料</Text>
                            </TouchableHighlight>
                        </View>

                        <View style={styles.userInfo}>
                            <Text style={styles.userInfoName}>Github</Text>
                            <Text style={styles.userInfoAccount}>@Github</Text>
                            <View style={styles.userInfoFollow}>
                                <Text style={styles.userInfoFollowing}><Text style={styles.fontEm}>183</Text> 正在关注</Text>
                                <Text style={styles.userInfoFollower}><Text style={styles.fontEm}>830k</Text> 关注者</Text>
                            </View>
                        </View>
                        {this.state.bannerTop <= 0 ? null : <Image style={[styles.banner, { top: this.state.bannerTop }]} source={require('../../assets/image/640.jpeg')}></Image>}
                        {this.state.bannerTop <= 0 ? null : <Image style={[styles.banner, { top: this.state.bannerTop, opacity: this.state.opacity }]} source={require('../../assets/image/640.jpeg')}></Image>}

                        <Text style={{ position: "absolute", left: DataUtil.size.width / 2 - 30, fontSize: 20, fontWeight: "500", top: this.state.bannerTop + 90, opacity: this.state.opacity, backgroundColor: "transparent", color: "#fff" }}>Github</Text>
                    </View>
                    <ScrollView contentInset={{ top: 0 }} style={styles.detailScroll} scrollEnabled={this.state.scrollEnabled}>
                        <View style={{ width: DataUtil.size.width, backgroundColor: "#f5f8fa" }}>
                            <Image style={{ width: DataUtil.size.width, height: 0.835 * DataUtil.size.width, resizeMode: "contain" }} source={require('../../assets/image/640.jpeg')}></Image>
                        </View>
                    </ScrollView>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: "#f5f8fa",
        width: DataUtil.size.width,
        height: DataUtil.size.height,
    },
    userContainer: {
        width: DataUtil.size.width,
        height: DataUtil.size.height - 50,
        backgroundColor: '#ffffff',
        position: 'absolute',
        top: 0,
        left: 0
    },
    userPanel: {
        flex: 1,
        height: 300
    },
    banner: {
        width: DataUtil.size.width,
        height: 135,
        position: "absolute",
        top: 0,
        left: 0
    },
    iconContainer: {
        position: "absolute",
        left: 10,
        top: 95,
        borderWidth: 5,
        borderColor: "#fff",
        borderRadius: 5,

    },
    userControl: {
        height: 55,
        position: "absolute",
        top: 125,
        width: 200,
        right: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    controlBtn: {
        borderColor: "#8999a5",
        borderWidth: 1,
        paddingTop: 3, paddingLeft: 5, paddingBottom: 3, paddingRight: 5,
        borderRadius: 3,
        width: 40,
        height: 30,
        alignItems: "center",
        justifyContent: "center"
    },
    controlBtn2: {
        borderColor: "#8999a5",
        borderWidth: 1,
        paddingTop: 3, paddingLeft: 5, paddingBottom: 3, paddingRight: 5,
        borderRadius: 3,
        width: 120,
        height: 30,
        alignItems: "center",
        justifyContent: "center"
    },
    controlIcon: {
        width: 30
    },
    controlBtnText: {
        color: "#8999a5",
        fontSize: 14
    },
    userInfo: {
        width: DataUtil.size.width,
        position: "absolute",
        top: 165,
        paddingTop: 15, paddingLeft: 15, paddingBottom: 15,
        left: 0,
        height: 90,
    },
    userInfoName: {
        color: "#292f33",
        fontSize: 20,
        fontWeight: "500",
        paddingBottom: 5
    },
    userInfoAccount: {
        color: "#66757f",
        paddingBottom: 5
    },
    userInfoFollower: {
        color: "#95a4ae",
        width: 110
    },
    userInfoFollowing: {
        color: "#95a4ae",
        width: 110
    },
    userInfoFollow: {
        flexDirection: "row"
    },
    fontEm: {
        color: "#292f33",
        fontWeight: "500"
    },
    detailScroll: {
        position: "absolute",
        top: 300,
        backgroundColor: "#f5f8fa",
        width: DataUtil.size.width,
        height: DataUtil.size.height - 350,
        left: 0,
        borderTopWidth: DataUtil.pixel,
        borderTopColor: "#9eacb6"
    },
})