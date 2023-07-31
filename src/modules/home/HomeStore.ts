import { request } from "../../utils/Request";
import { action, observable } from "mobx";

const SIZE = 10;

export default class HomeSotre {

    @observable page: number = 1
    @observable homeList: ArticleSimple[] = []
    @observable refreshing: boolean = false;

    @action
    resetPage = () => {
        this.page = 1;
    }

    requestHomeList = async () => {
        if (this.refreshing) {
            return;
        }
        try {
            this.refreshing = true;
            const params = {
                page: this.page,
                size: SIZE
            };

            const { data } = await request('homeList', params);
            if (data?.length) {
                if (this.page === 1) {
                    this.homeList = data;
                } else {
                    this.homeList = [...this.homeList, ...data];
                    if(this.homeList.length % 2 != 0) {
                        console.log(11111111);
                        console.log("this.homeList.length", this.homeList.length);
                        
                        this.homeList.push({
                            id: this.homeList.length,
                            title: 'null',
                            userName: 'null',
                            avatarUrl: 'null',
                            favoriteCount: 1,
                            isFavorite: false,
                            image: 'null',
                        })
                    }
                }
                this.page = this.page + 1;
            } else {
                if (this.page === 1) {
                    this.homeList = [];
                } else {
                    // 已经加载完了，没有更多数据
                }
            }

        } catch (error) {
            console.log(error);

        } finally {
            this.refreshing = false;
        }
    }
}