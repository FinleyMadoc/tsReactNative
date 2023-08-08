import { request } from "../../utils/Request";
import { action, observable } from "mobx";
import Loading from "../../components/widget/Loading";
import { flow } from "mobx";

const SIZE = 10;

export default class ShopStore {

    @observable page: number = 1
    @observable goodList: GoodsSimple[] = []
    @observable refreshing: boolean = false;
    @observable categoryList: GoodsCategory[] = [];

    @action
    resetPage = () => {
        this.page = 1;
    }

    @action
    requestGoodsList = async () => {
        if (this.refreshing) {
            return;
        }
        Loading.show();
        try {
            this.refreshing = true;
            const params = {
                page: this.page,
                size: SIZE
            };

            const { data } = await request('goodsList', params);
            if (data?.length) {
                if (this.page === 1) {
                    this.goodList = data;
                } else {
                    this.goodList = [...this.goodList, ...data];
                    if(this.goodList.length % 2 != 0) {
                        this.goodList.push({
                            id: this.goodList.length,
                            title: 'null',
                            image: 'null',
                            price: 0,
                            originPrice: 1,
                            promotion: 'null',
                        })
                    }
                }
                this.page = this.page + 1;
            } else {
                if (this.page === 1) {
                    this.goodList = [];
                } else {
                    // 已经加载完了，没有更多数据
                }
            }

        } catch (error) {
            console.log(error);

        } finally {
            this.refreshing = false;
            Loading.hide();
        }
    }

    @action
    topTenCategory = flow(function* (this: ShopStore) {
        try {
            const { data } = yield request('topTenCategory', {});
            this.categoryList = data || [];

        } catch (error) {
            console.log(error);
        }
    })
}
