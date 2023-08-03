import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, LogBox, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalStore, observer } from 'mobx-react';
import { observe } from 'mobx';
import ArticleDetailStore from './ArticleDetailStore';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ImageSlider } from '../../components/slidePager';

import icon_arrow from '../../assets/image/icon_arrow.png';
import icon_share from '../../assets/image/icon_share.png'

type RouteParams = {
    ArticleDetail: {
        id: number
    }
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');;

export default observer(() => {

    const store = useLocalStore(() => new ArticleDetailStore());

    const { params } = useRoute<RouteProp<RouteParams, 'ArticleDetail'>>();

    const navigation = useNavigation<StackNavigationProp<any>>();

    const [height, setHeight] = useState<number>(400);

    useEffect(() => {
        store.requestArticleDetail(params.id)
    }, [])

    useEffect(() => {
        if( !store.details?.images ){
            return;
        }
        const firstImg = store.details?.images[0]

        Image.getSize(firstImg, (width: number, height: number) => {
            const showHeight = SCREEN_WIDTH * height / width;
            setHeight(showHeight);
        })
    }, [store.details?.images]);


    const renderTitle = () => {

        const { details } = store;
        return (
            <View style={styles.titleLayout}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={
                        () => {
                            navigation.pop()
                        }
                    }
                >
                    <Image style={styles.backImg} source={icon_arrow} />
                </TouchableOpacity>
                <Image style={styles.avatarImg} source={{ uri: details.avatarUrl }} />
                <Text style={styles.useNameTxt}>{details.userName}</Text>
                <Text style={styles.followTxt}>关注</Text>
                <Image source={icon_share} style={styles.shareImg} />
            </View>
        )
    }

    const renderImages = () => {
        const { details } = store;
        const { images } = details;
        if(!images?.length) {
            return null;
        }
        const data: any = images.map(i => {
            return {img: i}
        })
        return (
            <View style={{paddingBottom: 30}}>
                <ImageSlider 
                    data={data}
                    autoPlay={false}
                    closeIconColor='white'
                    caroselImageStyle={{
                        height
                    }}
                    indicatorContainerStyle={{
                         bottom: -40
                    }}
                    activeIndicatorStyle={styles.activeDot}
                    inActiveIndicatorStyle={styles.inActiveDot}
                />
            </View>
        )
    }

    return store.details ? (
        <View style={styles.root}>
            {renderTitle()}
            <ScrollView
                style={{flex: 1}}
                showsVerticalScrollIndicator={false}
            >
                {renderImages()}
            </ScrollView>
        </View>
    ) : null
})

const styles = StyleSheet.create({
    root: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white'
    },
    titleLayout: {
        width: '100%',
        height: 56,
        flexDirection: 'row',
        alignItems: 'center'
    },
    backBtn: {
        paddingHorizontal: 16,
        height: '100%',
        justifyContent: 'center'
    },
    backImg: {
        width: 20,
        height: 20
    },
    avatarImg: {
        width: 40,
        height: 40,
        resizeMode: 'cover',
        borderRadius: 20
    },
    useNameTxt: {
        fontSize: 15,
        flex: 1,
        color: '#333',
        marginLeft: 16
    },
    followTxt: {
        paddingHorizontal: 16,
        height: 30,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#ff2442',
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 12,
        color: '#ff2442'
    },
    shareImg: {
        width: 28,
        height: 28,
        marginHorizontal: 16
    },
    activeDot: {
        width: 6,
        height: 6,
        backgroundColor: '#ff2442',
        borderRadius: 3
    },
    inActiveDot: {
        width: 6,
        height: 6,
        backgroundColor: '#C0C0C0',
        borderRadius: 3
    }
}) 