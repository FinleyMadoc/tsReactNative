import React, { Component } from "react";
import { PanResponder, View, StyleSheet, Image, PanResponderInstance } from 'react-native'
import DataUtil from '../../utils/DataUtil';
import Icon from "react-native-vector-icons/Ionicons";

import agress from '../../assets/image/agrass.png';



class MoveCircle extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            color: 'rgba(255,255,255,0.7)'
        }
    }

// PanResponder组件解释
// https://blog.csdn.net/zeping891103/article/details/88531344

    _previousLeft: number = DataUtil.size.width / 2 - 40;
    _previousTop: number = DataUtil.size.height / 2 - 50;
    // 画布最大高度
    _maxTop: number = DataUtil.size.height - 110;
    // 画布最大宽度
    _maxLeft: number = DataUtil.size.width - 98;
    _panResponder: PanResponderInstance | null = null;
    _circleStyles = {
        style: {
            left: 0,
            top: 0
        }
    };

    circle: { setNativeProps(props: object): void } | null = null;

    _updatePosition() {
        this.circle && this.circle.setNativeProps(this._circleStyles);
        // setNativeProps直接修改一个组件的底层原生属性，这里是修改了组件的坐标，x，y
    }

    _endMove(evt: any, gestureState: any) {
        this._previousLeft += gestureState.dx;
        this._previousTop += gestureState.dy;
        this.setState({
            color: 'rgba(255,255,255,0.7)'
        })
    }

    UNSAFE_componentWillMount(): void {

        this._panResponder = PanResponder.create({
            // 返回ture时，表示该组件愿意成为触摸事件的响应者
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            // 与onStartShouldSetPanResponder相同，当此组件A里包含了子组件B也为触摸事件响应者时，若此时设为true，则父组件A优先级更高
            onStartShouldSetPanResponderCapture: (e, gestureState) => true,
            // 返回ture时，表示该组件愿意成为触摸(滑屏)事件的响应者
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            // 与onMoveShouldSetPanResponder相同，当此组件A里包含了子组件B也为触摸事件响应者时，若此时设为true，则父组件A优先级更高        
            onMoveShouldSetPanResponderCapture: (e, gestureState) => true,
            // 手势刚开始触摸(即刚接触屏幕时)时，若响应成功则触发该事件
            onPanResponderGrant: (evt, gestureState) => {
                this.setState({
                    color: 'white'
                })
            },

            // onResponderReject： 手势刚开始触摸(即刚接触屏幕时)时，若响应失败则触发该事件，失败原因有可能是其它组件正在响应手势且不肯放权

            // 手势滑动时触发该事件
            onPanResponderMove: (evt, gestureState) => {
                this._circleStyles.style.left = this._previousLeft + gestureState.dx;
                this._circleStyles.style.top = this._previousTop + gestureState.dy;
                if (this._circleStyles.style.left < 0) {
                    this._circleStyles.style.left = 0;
                };
                if (this._circleStyles.style.top < 0) {
                    this._circleStyles.style.top = 5;
                };
                if (this._circleStyles.style.left > this._maxLeft) {
                    this._circleStyles.style.left = this._maxLeft;
                };
                if (this._circleStyles.style.top > this._maxTop) {
                    this._circleStyles.style.top = this._maxTop;
                };
                this._updatePosition();
            },
            // // 当其它组件需要响应手势时，此时为ture则表示本组件愿意放权给其它组件响应；为false时表示不放权，依然由本组件来响应手势事件
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            // 手势松开时触发该事件
            onPanResponderRelease: (evt, gestureState) => this._endMove(evt, gestureState),
            // 当组件响应放权后(即由其它组件拿到了手势响应权)触发该事件
            onPanResponderTerminate: (evt, gestureState) => this._endMove(evt, gestureState),

        });

        this._circleStyles = {
            style: {
                left: this._previousLeft,
                top: this._previousTop,
            },
        };
    }

    componentDidMount(): void {
        this._updatePosition();
    }

    render() {
        return (
            <View ref={(circle) => {this.circle = circle;}} style={styles.MoveableCircle} {...this._panResponder?.panHandlers}>
                <Icon ref="baseball" name="baseball-outline" color={this.state.color} size={120}></Icon>
            </View>
        )
    }
}

export default class PanResponderComponent extends Component {
    render() {
        return (
            <View>
                <Image style={styles.bg} source={agress} />
                <View style={styles.circleContainer}>
                    <MoveCircle></MoveCircle>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    bg: {
        width: DataUtil.size.width,
        resizeMode: 'stretch',
        position: 'absolute'
    },
    circleContainer: {
        height: DataUtil.size.height,
        width: DataUtil.size.width
    },
    MoveableCircle:{
        backgroundColor:"transparent",
        position:"absolute",
        left:0,
        right:0
      },
})