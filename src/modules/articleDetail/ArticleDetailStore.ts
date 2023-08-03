import { request } from "../../utils/Request";
import { action, observable } from "mobx";
import { load } from "../../utils/Storage";
import Loading from "../../components/widget/Loading";

const SIZE = 10;

export default class ArticleDetailStore {

    @observable details: Article = {} as Article;

    requestArticleDetail = async (id: number) => {
        Loading.show();
        try {
            const params = {
                id: id
            };
            console.log("params", params);
            
            const { data } = await request('articleDetail', params);
            console.log("detail", data);
            
            this.details = data || {};

        } catch (error) {
            console.log(error);
        } finally {
            Loading.hide();
        }
    }

}