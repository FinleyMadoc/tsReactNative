import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, LogBox, ScrollView, TouchableOpacity } from 'react-native';
import CategoryModal, { CategoryModalRef } from './CategoryModal';

import icon_arrow from '../../../assets/image/icon_arrow.png'


type Props = {
    categoryList: Category[];
    allCategoryList: Category[];
    onCategoryChanged: (category: Category) => void
}

export default ({ categoryList, allCategoryList, onCategoryChanged }: Props) => {

    const [category, setCategory] = useState<Category>();

    const modalRef = useRef<CategoryModalRef>(null);

    const onCategoryClick = (category: Category) => {
        setCategory(category)
        onCategoryChanged(category)
    }

    useEffect(() => {
        setCategory(categoryList.find(i => i.name === '推荐'))
    }, [])

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} horizontal={true} showsHorizontalScrollIndicator={false}>
                {categoryList.map((item: Category, index: number) => {
                    const isSelect = item.name === category?.name
                    return (
                        <TouchableOpacity
                            key={`${item.name}`}
                            style={styles.tabItem}
                            onPress={() => onCategoryClick(item)}
                        >
                            <Text style={isSelect ? styles.tabItemTxtSelect : styles.tabItemTxt}>{item.name}</Text>
                        </TouchableOpacity>
                    )
                })}

            </ScrollView>
            <TouchableOpacity
                style={styles.openBtn}
                onPress={() => {
                    modalRef.current?.show();
                }}
            >
                <Image style={styles.icon_arrow} source={icon_arrow} />
            </TouchableOpacity>

            <CategoryModal
                ref={modalRef}
                categoryList={allCategoryList}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 35,
        backgroundColor: 'white',
        flexDirection: 'row',
        marginBottom: 6
    },
    scrollView: {
        flex: 1,
        height: '100%',
    },
    openBtn: {
        width: 40,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon_arrow: {
        width: 18,
        height: 18,
        transform: [{ rotate: '-90deg' }]
    },
    tabItem: {
        width: 64,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    tabItemTxt: {
        fontSize: 16,
        color: '#999'
    },
    tabItemTxtSelect: {
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold'
    }
})