import React from "react"
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
} from 'react-native'

let timeCalculate: NodeJS.Timeout;
export default class TimeComponent extends React.Component<any, any> {

    constructor(props: any) {
        super(props)
        this.state = {
            // 时间字符显示
            secondTime: '00:00.00' as string,
            firstTime: '00:00.00' as string,
            // 计次数据
            data: [],
            // 开始or停止
            start: false,
            // 累加时间
            firstTimeStamp: 0,
            // 计算时间
            secondTimeStamp: 0,
            // 当前时间
            currentTime: 0,
            // 初始化时间
            initalTime: (new Date()).getTime(),
            // 左按钮参数
            letBtnTxt: '计次',
            letBtnId: 1,
            noRun: false
        }
    }

    watchTime = () => {
        return (
            <View style={styles.watchTimeBg}>
                <Text style={styles.runTimeStyle}>{this.state.secondTime}</Text>
                <Text style={styles.totalTimeStyle}>{this.state.firstTime}</Text>
            </View>
        )
    }

    watchControl = () => {
        return (
            <View style={styles.watchControlMain}>
                <TouchableOpacity
                    activeOpacity={1}
                    style={[styles.watchControlBtn, { marginLeft: 30 }]}
                    onPress={() => this.leftBtnControl(this.state.letBtnId)}
                >
                    <Text>{this.state.letBtnTxt}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={1}
                    style={[styles.watchControlBtn, { marginRight: 30 }]}
                    onPress={() => this.controlWatch()}
                >
                    {this.state.start ? <Text>停止</Text> : <Text>开始</Text>}
                </TouchableOpacity>
            </View>
        )
    }

    controlWatch = () => {


        // 初始时间
        if (!this.state.start) {
            this.setState({
                initalTime: (new Date()).getTime(),
                letBtnTxt: '计次',
                letBtnId: 1,
                noRun: false
            });
        } else {
            this.setState({
                letBtnTxt: '复位',
                letBtnId: 2
            });
        }
        this.setState({ start: !this.state.start });
        let countTime = 0;
        let secondMin, secondSec, secondMs;
        clearInterval(timeCalculate);
        timeCalculate = setInterval(() => {
            this.setState({
                currentTime: (new Date()).getTime(),
            }, () => {
                if (this.state.noRun) {
                    return;
                }
                countTime = this.state.secondTimeStamp + this.state.currentTime - this.state.initalTime;

                secondMin = Math.floor((countTime) / (1000 * 60));
                secondSec = Math.floor((countTime - 6000 * secondMin) / 1000);
                secondMs = Math.floor((countTime % 1000) / 10);

                this.setState({
                    secondTime: (secondMin < 10 ? "0" + secondMin : secondMin) + ":" + (secondSec < 10 ? "0" + secondSec : secondSec) + "." + (secondMs < 10 ? "0" + secondMs : secondMs),
                })
                if (!this.state.start) {
                    this.setState({ secondTimeStamp: countTime, noRun: true });

                    let record = this.state.firstTimeStamp + countTime;
                    let recordMin = Math.floor((record) / (1000 * 60));
                    let recordSec = Math.floor((record - 6000 * recordMin) / 1000);
                    let recordMs = Math.floor((record % 1000) / 10);

                    this.setState({
                        firstTimeStamp: record,
                        firstTime: (recordMin < 10 ? "0" + recordMin : recordMin) + ":" + (recordSec < 10 ? "0" + recordSec : recordSec) + "." + (recordMs < 10 ? "0" + recordMs : recordMs),
                    })

                    clearInterval(timeCalculate);
                    return;
                }
            })


        }, 10);

    }

    leftBtnControl = (id: number) => {
        if (id == 1) {
            let timeArray = this.state.data;
            let length = timeArray.length;
            let record = {
                name: `计数${length + 1}`,
                time: this.state.secondTime
            }
            timeArray.push(record);
            this.setState({ data: timeArray });
        } else if (id == 2) {
            this.setState({
                secondTime: '00:00.00',
                firstTime: '00:00.00',
                data: [],
                start: false,
                firstTimeStamp: 0,
                secondTimeStamp: 0,
                currentTime: 0,
                initalTime: (new Date()).getTime(),
                letBtnTxt: '计次',
                letBtnId: 1,
                noRun: false
            })
        }
    }

    watchList = () => {
        return (
            <>
                <FlatList
                    style={{ marginTop: 30 }}
                    data={this.state.data}
                    renderItem={this.renderItem}
                    extraData={this.state.data}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={() => {
                        return (
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 16, color: '#ffffff' }}>暂无数据</Text>
                            </View>
                        )
                    }}
                    ItemSeparatorComponent={() => {
                        return (
                            <View style={{ borderWidth: 1, borderColor: '#ffffff' }}></View>
                        )
                    }}
                />
            </>
        )
    }

    renderItem = ({ item }: any) => {

        const styles = StyleSheet.create({
            mainView: {
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
            },
            itemText: {
                marginTop: 10,
                fontSize: 16,
                color: '#ffffff'
            }
        })

        return (
            <View style={styles.mainView}>
                <Text style={[styles.itemText, { marginLeft: 15 }]}>{item.name}</Text>
                <Text style={[styles.itemText, { marginRight: 15 }]}>{item.time}</Text>
            </View>
        )
    }

    render(): React.ReactNode {
        return (
            <View style={styles.mainBg}>
                {this.watchTime()}
                {this.watchControl()}
                {this.watchList()}
            </View>
        )
    }

}

const styles = StyleSheet.create({
    mainBg: {
        backgroundColor: '#6b473c',
        flex: 1
    },
    watchTimeBg: {
        marginTop: 50,
        backgroundColor: '#ffffff',
        padding: 40,
        alignItems: 'flex-end'
    },
    runTimeStyle: {
        fontSize: 20
    },
    totalTimeStyle: {
        fontSize: 60
    },
    watchControlMain: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    },
    watchControlBtn: {
        marginTop: 10,
        backgroundColor: '#ffffff',
        borderRadius: 100,
        borderWidth: 1,
        borderColor: '#ffffff',
        padding: 25,
        alignSelf: 'center'
    }
})