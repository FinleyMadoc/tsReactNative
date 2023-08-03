import React, { useEffect, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import { Modal, View, Text, StyleSheet, Dimensions, Image, LayoutAnimation, ScrollView, TouchableOpacity } from 'react-native';
import { save } from '../../../utils/Storage';
import icon_arrow from '../../../assets/image/icon_arrow.png'
import icon_delete from '../../../assets/image/icon_delete.png'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

type Props = {
    categoryList: Category[];
}

export interface CategoryModalRef {
    show: () => void;
    hide: () => void;
}

export default forwardRef((props: Props, ref) => {

    const { categoryList } = props;

    const [myList, setMyList] = useState<Category[]>([]);
    const [otherList, setOtherList] = useState<Category[]>([]);

    const [visable, setVisable] = useState<boolean>(false);

    const [edit, setEdit] = useState<boolean>(false);

    useEffect(() => {
        if (!categoryList) {
            return
        }
        const list1 = categoryList.filter(i => i.isAdd);
        const list2 = categoryList.filter(i => !i.isAdd);
        setMyList(list1);
        setOtherList(list2);
    }, [categoryList])

    useImperativeHandle(ref, () => {
        return { show, hide }
    })

    const show = () => {
        setVisable(true)
    }

    const hide = () => {
        setVisable(false)
    }

    const onMyItemPress = useCallback((item: Category, index: number) => () => {
        if (!edit) {
            return
        }
        const newMyList = myList.filter(i => i.name !== item.name);
        const copy = { ...item, isAdd: false };
        const newOtherList = [...otherList, copy];
        LayoutAnimation.easeInEaseOut();
        setMyList(newMyList);
        setOtherList(newOtherList);
    }, [edit, myList, otherList])

    const onOtherItemPress = useCallback((item: Category, index: number) => () => {
        if (!edit) {
            return
        }
        const copy = { ...item, isAdd: true };
        const newOtherList = otherList.filter(i => i.name !== item.name);
        const newMyList = [...myList, copy];
        LayoutAnimation.easeInEaseOut();
        setMyList(newMyList);
        setOtherList(newOtherList);
    }, [edit, myList, otherList])

    const renderMyList = () => {
        return (
            <>
                <View style={styles.row}>
                    <Text style={styles.titleTxt}>我的频道</Text>
                    <Text style={styles.subTitleTxt}>点击进入频道</Text>
                    <TouchableOpacity
                        style={styles.editBtn}
                        onPress={() => {
                            setEdit((data) => {
                                if (data) {
                                    console.log("myList", myList);
                                    console.log("otherList", otherList);
                                    
                                    save('categoryList', JSON.stringify([...myList, ...otherList]))
                                    return false
                                } else {
                                    return true
                                }

                            })
                        }}
                    >
                        <Text style={styles.editTxt}>
                            {
                                edit ? '完成编辑' : '进入编辑'
                            }

                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.closeBtn}
                        onPress={hide}
                    >
                        <Image style={styles.closeImage} source={icon_arrow} />
                    </TouchableOpacity>
                </View>
                <View style={styles.listContent}>
                    {myList.map((item: Category, index: number) => {
                        return (
                            <TouchableOpacity
                                key={`${item.name}`}
                                style={item.default ? styles.itemLayoutDefault : styles.itemLayout}
                                onPress={onMyItemPress(item, index)}
                            >
                                <Text style={styles.itemTxt}>{item.name}</Text>
                                {edit && !item.default && <Image style={styles.deleteImg} source={icon_delete} />}
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </>
        )
    }

    const renderOtherList = () => {
        return (
            <>
                <View style={[styles.row, { marginTop: 32 }]}>
                    <Text style={styles.titleTxt}>推荐频道</Text>
                    <Text style={styles.subTitleTxt}>点击进入频道</Text>
                </View>
                <View style={styles.listContent}>
                    {otherList.map((item: Category, index: number) => {
                        return (
                            <TouchableOpacity
                                key={`${item.name}`}
                                style={styles.itemLayout}
                                onPress={onOtherItemPress(item, index)}
                            >
                                <Text style={styles.itemTxt}>+ {item.name}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </>
        )
    }

    return (
        <Modal
            animationType="fade"
            visible={visable}
            transparent={true}
            onRequestClose={hide}
        >

            <View style={styles.root}>
                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {renderMyList()}
                    {renderOtherList()}
                    <View style={{ height: 10 }} />
                </ScrollView>
                <View style={styles.mask} />
            </View>
        </Modal>
    )
})

const styles = StyleSheet.create({
    root: {
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent'
        // backgroundColor: 'green'
    },
    content: {
        width: '100%',
        height: '80%',
        backgroundColor: 'white',
        marginTop: 48
    },
    mask: {
        width: '100%',
        flex: 1, //剩多少都给他
        backgroundColor: '#00000060'
    },
    row: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleTxt: {
        fontSize: 16,
        color: '#333',
        fontWeight: "bold",
        marginLeft: 16
    },
    subTitleTxt: {
        fontSize: 13,
        color: '#999',
        marginLeft: 12,
        flex: 1,
    },
    editBtn: {
        paddingHorizontal: 10,
        height: 28,
        backgroundColor: '#EEE',
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editTxt: {
        fontSize: 13,
        color: '#3050ff'
    },
    closeBtn: {
        padding: 12,

    },
    closeImage: {
        width: 16,
        height: 16,
        resizeMode: 'contain',
        transform: [{ rotate: '90deg' }]
    },
    listContent: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    itemLayout: {
        width: (SCREEN_WIDTH - 80) / 4,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 6,
        marginLeft: 16,
        marginTop: 12
    },
    itemLayoutDefault: {
        width: (SCREEN_WIDTH - 80) / 4,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 6,
        marginLeft: 16,
        marginTop: 12,
        backgroundColor: '#EEE'
    },
    itemTxt: {
        fontSize: 16,
        color: '#666'
    },
    deleteImg: {
        width: 14,
        height: 14,
        position: 'absolute',
        top: -6,
        right: -6
    }
})