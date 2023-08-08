import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalStore, observer } from 'mobx-react';
import { observe } from 'mobx';
import ArticleDetailStore from './ArticleDetailStore';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ImageSlider } from '../../components/slidePager';
import UserStore from '../../stores/UserStore';
import dayjs from 'dayjs'
import Favourable from '../../components/Favourable';

import icon_arrow from '../../assets/image/icon_arrow.png';
import icon_share from '../../assets/image/icon_share.png'
import icon_collection_selected from '../../assets/image/icon_collection_selected.png';
import icon_collection from '../../assets/image/icon_collection.png';
import icon_comment from '../../assets/image/icon_comment.png';
import icon_edit_comment from '../../assets/image/icon_edit_comment.png';

type RouteParams = {
    ArticleDetail: {
        id: number
    }
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default observer(() => {

    const store = useLocalStore(() => new ArticleDetailStore());

    const { params } = useRoute<RouteProp<RouteParams, 'ArticleDetail'>>();

    const navigation = useNavigation<StackNavigationProp<any>>();

    const [height, setHeight] = useState<number>(400);

    useEffect(() => {
        store.requestArticleDetail(params.id)
    }, [])

    useEffect(() => {
        if (!store.details?.images) {
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
        if (!images?.length) {
            return null;
        }
        const data: any = images.map(i => {
            return { img: i }
        })
        return (
            <View style={{ paddingBottom: 30 }}>
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

    const renderInfo = () => {
        const { details } = store;
        const tags = details.tag?.map(i => `# ${i}`).join(" ");
        return (
            <>
                <Text style={styles.articleTitleTxt}>{details.title}</Text>
                <Text style={styles.descTxt}>{details.desc}</Text>
                <Text style={styles.tagsTxt}>{tags}</Text>
                <Text style={styles.timeAndLocation}>{details.dateTime}  {details.location}</Text>
                <View style={styles.line} />
            </>
        );
    }

    const renderComments = () => {
        const { details } = store;
        const count = details.comments?.length || 0
        const { userInfo } = UserStore

        const styles = StyleSheet.create({
            commentsCountTxt: {
                fontSize: 14,
                color: '#666',
                marginTop: 20,
                marginLeft: 16
            },
            inputLayout: {
                width: '100%',
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center'
            },
            userAratarImg: {
                width: 32,
                height: 32,
                borderRadius: 10,
                resizeMode: 'center'
            },
            commentsInput: {
                flex: 1,
                height: 32,
                borderRadius: 16,
                marginLeft: 12,
                backgroundColor: '#f0f0f0',
                fontSize: 14,
                color: '#333',
                textAlignVertical: 'center',
                paddingVertical: 0,
                paddingHorizontal: 12
            },
            commentsContainer: {
                paddingHorizontal: 16,
                paddingTop: 16,
                paddingBottom: 12
            },
            commentItem: {
                width: '100%',
                flexDirection: 'row'
            },
            cAvatarImg: {
                width: 36,
                height: 36,
                resizeMode: 'cover',
                borderRadius: 18
            },
            contentLayout: {
                flex: 1,
                marginHorizontal: 12,
            },
            nameTxt: {
                fontSize: 12,
                color: '#999'
            },
            messageTxt: {
                fontSize: 14,
                color: '#333',
                marginTop: 6,
            },
            timeAndLoaction: {
                fontSize: 12,
                color: '#bbb',
            },
            fLayout: {
                alignItems: 'center'
            },
            fCount: {
                fontSize: 12,
                color: '#999',
                marginTop: 2
            },
            divier: {
                marginLeft: 50,
                marginRight: 0,
                height: StyleSheet.hairlineWidth,
                backgroundColor: '#eee',
                marginVertical: 16
            }
        })

        return (
            <>
                <Text style={styles.commentsCountTxt}>
                    {count ? `共${count}条评论` : '暂无评论'}
                </Text>
                <View style={styles.inputLayout}>
                    <Image style={styles.userAratarImg} source={{ uri: userInfo.avatar }} />
                    <TextInput
                        style={styles.commentsInput}
                        placeholder={'说点什么吧, 万一火了呢'}
                        placeholderTextColor={'#bbb'}
                    />
                </View>

                {!!count && <View style={styles.commentsContainer}>
                    {details.comments?.map((i: ArticleComment, index: number) => {
                        return (
                            <View key={`${index}`} style={{}}>
                                <View style={styles.commentItem}>
                                    <Image
                                        style={styles.cAvatarImg}
                                        source={{ uri: i.avatarUrl }}
                                    />

                                    <View style={styles.contentLayout}>
                                        <Text style={styles.nameTxt}>{i.userName}</Text>
                                        <Text style={styles.messageTxt}>
                                            {i.message}
                                            <Text style={styles.timeAndLoaction}>
                                                {dayjs(i.dateTime).format('MM-DD')}
                                                {i.location}
                                            </Text>
                                        </Text>

                                        {
                                            !!i.children?.length && (
                                                i.children.map((j: ArticleComment, subIndex: number) => {
                                                    return (
                                                        <View
                                                            key={`${index}-${subIndex}`}
                                                            style={[styles.commentItem, { marginTop: 12, width: SCREEN_WIDTH - 80 }]}
                                                        >
                                                            <Image
                                                                style={styles.cAvatarImg}
                                                                source={{ uri: j.avatarUrl }}
                                                            />

                                                            <View style={styles.contentLayout}>
                                                                <Text style={styles.nameTxt}>{i.userName}</Text>
                                                                <Text style={styles.messageTxt}>
                                                                    {j.message}
                                                                    <Text style={styles.timeAndLoaction}>
                                                                        {dayjs(i.dateTime).format('MM-DD')}
                                                                        {j.location}
                                                                    </Text>
                                                                </Text>
                                                            </View>

                                                            <View style={styles.fLayout}>
                                                                <Favourable value={j.isFavorite} size={20} />
                                                                <Text style={styles.fCount}>{j.favoriteCount}</Text>
                                                            </View>
                                                        </View>
                                                    )
                                                })
                                            )
                                        }
                                    </View>

                                    <View style={styles.fLayout}>
                                        <Favourable value={i.isFavorite} size={20} />
                                        <Text style={styles.fCount}>{i.favoriteCount}</Text>
                                    </View>
                                </View>


                                <View style={styles.divier} />
                            </View>
                        )
                    })}
                </View>}
            </>
        )
    }

    const renderBottom = () => {
        const { details } = store;
        return (
            <View style={styles.bottomLayout}>
                <View style={styles.bottomEditLayout}>
                    <Image style={styles.editImg} source={icon_edit_comment}/>
                    <TextInput
                        style={styles.bottomComponentInput}
                        placeholder={'说点什么'}
                        placeholderTextColor={'#333'}
                    />
                </View>

                <Favourable
                    value={details.isFavorite}
                    size={30}
                />
                <Text style={styles.bottomCount}>{details.favoriteCount}</Text>

                <Image style={styles.bottomIcon} source={details.isCollection ? icon_collection_selected : icon_collection} />
                <Text style={styles.bottomCount}>{details.collectionCount}</Text>

                <Image style={styles.bottomIcon} source={icon_comment} />
                <Text style={styles.bottomCount}>
                    {details.comments?.length || 0}
                </Text>
            </View>
        )
    }

    return store.details ? (
        <View style={styles.root}>
            {renderTitle()}
            <ScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
            >
                {renderImages()}
                {renderInfo()}
                {renderComments()}
            </ScrollView>
            {renderBottom()}
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
    },
    articleTitleTxt: {
        fontSize: 18,
        color: '#333',
        fontWeight: 'bold',
        paddingHorizontal: 16
    },
    descTxt: {
        fontSize: 15,
        color: '#333',
        marginTop: 6,
        paddingHorizontal: 16
    },
    tagsTxt: {
        fontSize: 15,
        color: '#305090',
        marginTop: 6,
        paddingHorizontal: 16
    },
    timeAndLocation: {
        fontSize: 12,
        color: '#bbb',
        marginVertical: 16,
        marginLeft: 16
    },
    line: {
        marginHorizontal: 16,
        height: StyleSheet.hairlineWidth, //头发丝宽度
        backgroundColor: '#eee'
    },
    bottomLayout: {
        width: '100%',
        height: 64,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        borderTopColor: '#eee',
        borderTopWidth: 1
    },
    bottomEditLayout: {
        height: 40,
        flex: 1,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 0
    },
    editImg: {
        width: 20,
        height: 20,
        tintColor: '#333'
    },
    bottomComponentInput: {
        height: '100%',
        fontSize: 16,
        color: '#333',
        textAlignVertical: 'center',
        
        marginRight: 12
    },
    bottomCount: {
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold',
        marginLeft: 8,
    },
    bottomIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        marginLeft: 12
    },

}) 