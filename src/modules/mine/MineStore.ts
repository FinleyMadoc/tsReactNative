import { request } from "../../utils/Request";
import { action, observable } from "mobx";
import { load } from "../../utils/Storage";
import Loading from "../../components/widget/Loading";
import { flow } from "mobx";

const SIZE = 10;

export default class MineStore {

    @observable noteList: ArticleSimple[] = [];
    @observable collectionList: ArticleSimple[] = [];
    @observable favorateList: ArticleSimple[] = [];
    @observable refreshing: boolean = false;
    @observable info: any = {};

    requestAll = async () => {
        Loading.show();
        this.refreshing = true   
        Promise.all([
            this.requestnoteList(),
            this.requestCollectionList(),
            this.requestFavorateList(),
            this.requestInfo()
        ]).then(() => {
            Loading.hide()
            this.refreshing = false
        })
    }


    requestInfo = async () => {
        try {

            const { data } = await request('accountInfo', {});
            console.log("data1111", data);
            
            this.info = data || {}

        } catch (error) {
            console.log(error);

        } 
    }

    requestnoteList = async () => {
        try {

            const { data } = await request('noteList', {});
            console.log("data2222", data);
            
            this.noteList = data || {}

        } catch (error) {
            console.log(error);

        } 
    }

    requestCollectionList = async () => {
        try {

            const { data } = await request('collectionList', {});
            console.log("data33333", data);
            
            this.collectionList = data || {}

        } catch (error) {
            console.log(error);

        } 
    }

    requestFavorateList = async () => {
        try {
            console.log("1316545645");
            
            const { data } = await request('favorateList', {});
            console.log("data4444", data);
            
            this.favorateList = data || {}

        } catch (error) {
            console.log(error);

        } 
    }


}
