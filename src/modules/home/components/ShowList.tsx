import React, { useRef, useState } from "react"
import Icon from "react-native-vector-icons/Ionicons"
import {
    View,
    Modal,
    Text,
    StyleSheet,
    LayoutAnimation,
    TouchableOpacity
} from 'react-native'
import { StackNavigationProp } from "@react-navigation/stack"
import { useNavigation } from "@react-navigation/native";
import MoreFunctionComponent from "../../ModalComponent/MoreFunctionComponent";

interface ShowListProps {
    cancelShow: () => void;
}

interface MoreFunctionProps {
    show: () => void;
}

export default ({ cancelShow }: ShowListProps) => {
    const [showSelect, setSelect] = useState<String>('0');
    const navigation = useNavigation<StackNavigationProp<any>>();
    const moreFunctionRef = useRef<MoreFunctionProps>(null);

    const changeShowSelect = (num: string) => {
        setSelect(num);
    }

    return (
        <Modal
            transparent={true}
            animationType='slide'
        >
            <TouchableOpacity
                style={styles.mainBackGround}
                onPress={() => cancelShow()}
            >
                {/* 时间 */}
                <TouchableOpacity
                    style={styles.optionItemMT}
                    onPress={async () => {
                        if (showSelect != '1') {
                            LayoutAnimation.spring();
                            changeShowSelect('1');
                        } else {
                            navigation.push('Time');
                            cancelShow();
                        }
                    }}
                >
                    <View
                        style={[
                            styles.optionItemView,
                            showSelect == '1' ?
                                {
                                    width: '50%',
                                    backgroundColor: '#7c8577'
                                }
                                :
                                {
                                    justifyContent: 'center',
                                }
                        ]}>
                        <Icon size={25} name="stopwatch" color="#fff" style={{ padding: 5, }} />
                        {
                            showSelect == '1' ?
                                <Text style={{ color: '#fff', fontSize: 16, paddingRight: 5 }}>Time</Text>
                                :
                                null
                        }
                    </View>
                </TouchableOpacity>

                {/* tennisball-outline */}
                <TouchableOpacity
                    style={styles.optionItemMT}
                    onPress={() => {
                        if (showSelect != '2') {
                            LayoutAnimation.spring();
                            changeShowSelect('2');
                        } else {
                            navigation.push('PanResponder');
                            cancelShow();
                        }
                    }}
                >
                    <View
                        style={[
                            styles.optionItemView,
                            showSelect == '2' ?
                                {
                                    width: '50%',
                                    backgroundColor: '#00a6ac'
                                }
                                :
                                {
                                    justifyContent: 'center',
                                }
                        ]}>
                        <Icon size={25} name="baseball" color="#fff" style={{ padding: 5, }} />
                        {
                            showSelect == '2' ?
                                <Text style={{ color: '#fff', fontSize: 16, paddingRight: 5 }}>baseball</Text>
                                :
                                null
                        }
                    </View>
                </TouchableOpacity>

                {/* MoreFunction */}
                <TouchableOpacity
                    style={styles.optionItemMT}
                    onPress={() => {
                        if (showSelect != '3') {
                            LayoutAnimation.spring();
                            changeShowSelect('3');
                        } else {
                            moreFunctionRef.current?.show();
                        }
                    }}
                >
                    <View
                        style={[
                            styles.optionItemView,
                            showSelect == '3' ?
                                {
                                    width: '50%',
                                    backgroundColor: '#f47920'
                                }
                                :
                                {
                                    justifyContent: 'center',
                                }
                        ]}>
                        <Icon size={25} name="file-tray-full" color="#fff" style={{ padding: 5, }} />
                        {
                            showSelect == '3' ?
                                <Text style={{ color: '#fff', fontSize: 16, paddingRight: 5 }}>More</Text>
                                :
                                null
                        }
                    </View>
                </TouchableOpacity>

                {/* github */}
                <TouchableOpacity
                    style={styles.optionItemMT}
                    onPress={() => {
                        if (showSelect != '4') {
                            LayoutAnimation.spring();
                            changeShowSelect('4');
                        } else {
                            navigation.push('GithubPan');
                            cancelShow();
                        }
                    }}
                >
                    <View
                        style={[
                            styles.optionItemView,
                            showSelect == '4' ?
                                {
                                    width: '50%',
                                    backgroundColor: '#6950a1'
                                }
                                :
                                {
                                    justifyContent: 'center',
                                }
                        ]}>
                        <Icon size={25} name="logo-github" color="#fff" style={{ padding: 5, }} />
                        {
                            showSelect == '4' ?
                                <Text style={{ color: '#fff', fontSize: 16, paddingRight: 5 }}>github</Text>
                                :
                                null
                        }
                    </View>
                </TouchableOpacity>

                {/* card */}
                <TouchableOpacity
                    style={styles.optionItemMT}
                    onPress={() => {
                        if (showSelect != '5') {
                            LayoutAnimation.spring();
                            changeShowSelect('5');
                        } else {
                            navigation.push('Card');
                            cancelShow();
                        }
                    }}
                >
                    <View
                        style={[
                            styles.optionItemView,
                            showSelect == '5' ?
                                {
                                    width: '50%',
                                    backgroundColor: '#000000'
                                }
                                :
                                {
                                    justifyContent: 'center',
                                }
                        ]}>
                        <Icon size={25} name="id-card" color="#fff" style={{ padding: 5, }} />
                        {
                            showSelect == '5' ?
                                <Text style={{ color: '#fff', fontSize: 16, paddingRight: 5 }}>card</Text>
                                :
                                null
                        }
                    </View>
                </TouchableOpacity>


            </TouchableOpacity>
            <MoreFunctionComponent ref={moreFunctionRef} />
        </Modal>
    )
}

const styles = StyleSheet.create({
    mainBackGround: {
        flex: 1,
        backgroundColor: '#999d9c60'
    },
    optionItemMT: {
        marginTop: 30
    },
    optionItemView: {
        backgroundColor: '#464547',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '15%',
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20
    },

})