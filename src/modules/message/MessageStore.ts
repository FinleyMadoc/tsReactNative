import { request } from "../../utils/Request";
import { action, observable } from "mobx";
import { load } from "../../utils/Storage";
import Loading from "../../components/widget/Loading";
import { flow } from "mobx";

const SIZE = 10;

export default class MessageStroe {

    @observable page: number = 1
    @observable messagelist: MessageListItem[] = []
    @observable refreshing: boolean = false;
    @observable unread: UnRead = {} as UnRead;


    @action
    resetPage = () => {
        this.page = 1;
    }

    requestMessageList = async () => {
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

            const { data } = await request('messageList', params);
            if (data?.length) {
                if (this.page === 1) {
                    this.messagelist = data;
                } else {
                    this.messagelist = [...this.messagelist, ...data];
                    if(this.messagelist.length % 2 != 0) {
                        this.messagelist.push({
                            id: this.messagelist.length,
                            name: 'null',
                            avatarUrl: 'null',
                            lastMessage: 'null',
                            lastMessageTime: 'null'
                        })
                    }
                }
                this.page = this.page + 1;
            } else {
                if (this.page === 1) {
                    this.messagelist = [];
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
    requestUnRead = flow(function* (this: MessageStroe) {
        try {
            const { data } = yield request('unread', {});
            this.unread = data || {};

        } catch (error) {
            console.log(error);
        }
    })
}
