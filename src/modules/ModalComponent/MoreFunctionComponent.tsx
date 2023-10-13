import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Text, Modal, View, StyleSheet, Animated, Easing, Button } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import DataUtil from '../../utils/DataUtil';


export default forwardRef((props: any, ref: any) => {

    const [visible, setVisible] = useState<boolean>(false);
    const [isShow, setIsShow] = useState<boolean>(true);
    const [shift, setShift] = useState<Animated.Value>(new Animated.Value(-120));

    const show = () => {
        setVisible(true);

    }

    useImperativeHandle(ref, () => {
        return {
            show
        }
    })

    const showMenu = () => {
        setIsShow(true);

        Animated.timing(
            shift,
            {
                useNativeDriver: false,
                toValue: 50,
                duration: 1000,
                delay: 100,
                easing: Easing.elastic(1)
            }).start();
    }

    const hideMenu = () => {
        

        Animated.timing(
            shift,
            {
                useNativeDriver: false,
                toValue: -120,
                duration: 1000,
                delay: 100,
                easing: Easing.elastic(1)
            }
        ).start();

        setTimeout(() => {
            setIsShow(false);
        }, 1500)
    }


    return (
        <Modal
            visible={visible}
            transparent={true}
        >
            <View style={{ backgroundColor: '#37465c', flex: 1 }}>
                {
                    isShow
                    &&
                    <View>
                        <Animated.View style={[styles.menuItem1]}>
                            <Icon name="text" size={120} color="#ffffff" />
                            <Text style={styles.txt}>Text</Text>
                        </Animated.View>
                        <Animated.View style={[styles.menuItem2]}>
                            <Icon name="image" size={120} color="#f47920" />
                            <Text style={styles.txt}>Photo</Text>
                        </Animated.View>
                        <Animated.View style={[styles.menuItem3]}>
                            <Icon name="cloudy" size={120} color="#009ad6" />
                            <Text style={styles.txt}>Cloud</Text>
                        </Animated.View>
                        <Animated.View style={[styles.menuItem4]}>
                            <Icon name="globe" size={120} color="#65c294" />
                            <Text style={styles.txt}>Web</Text>
                        </Animated.View>
                        <Animated.View style={[styles.menuItem5]}>
                            <Icon name="mail" size={120} color="#decb00" />
                            <Text style={styles.txt}>Mail</Text>
                        </Animated.View>
                        <Animated.View style={[styles.menuItem6]}>
                            <Icon name="cube" size={120} color="#d93a49" />
                            <Text style={styles.txt}>Collect</Text>
                        </Animated.View>
                    </View>
                }
                <Button onPress={isShow ? hideMenu : showMenu} title={isShow ? 'Hide' : 'Show'}/>
            </View>
        </Modal>
    )
})

const styles = StyleSheet.create({
    iconStyle: {
        width: 50
    },
    txt: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center'
    },
    menuItem1: {
        position: 'absolute',
        left: 50,
        top: 50,
    },
    menuItem2: {
        position: 'absolute',
        right: 50,
        top: 50
    },
    menuItem3: {
        position: 'absolute',
        left: 50,
        top: 250
    },
    menuItem4: {
        position: 'absolute',
        right: 50,
        top: 250
    },
    menuItem5: {
        position: 'absolute',
        left: 50,
        top: 450
    },
    menuItem6: {
        position: 'absolute',
        right: 50,
        top: 450
    }
})