import { request } from "../utils/Request";
import {action, flow, observable} from 'mobx'
import { save } from "../utils/Storage";
import Loading from "../components/widget/Loading";


class UserStore {

    @observable userInfo: any;

    // requestLogin = (phone: string, pwd: string, callback: (success: boolean) => void) => {
    //     console.log("phone",phone);
        
    //     try {
    //         const params = {
    //             name: phone,
    //             pwd: pwd
    //         }
    //         request('login', params).then(data => {
    //             console.log("data", data);
                
    //             if (data.data) {
    //                 this.userInfo =  data.data;
    //                 callback?.(true)
    //             } else {
    //                 this.userInfo = null;
    //                 callback?.(false)
    //             }

    //         })
    //     } catch (e) {
    //         console.log("e", e);
    //         this.userInfo = null;
    //         callback?.(false)
    //     }
    // }

    @action
    setUserInfo = (info: any) => {
        this.userInfo = info
    }

    // flow yield
    requestLogin = flow(function* (
            this: UserStore, 
            phone: string, 
            pwd: string, 
            callback: (success: boolean) => void) {
                Loading.show();
        try {
            const params = {
                name: phone,
                pwd: pwd
            }
            request('login', params).then(data => {
                console.log("data.data", data);
                
                if (data.data) {  
                    save('userInfo' ,JSON.stringify(data.data))
                    this.userInfo =  data.data;
                    callback?.(true)
                } else {
                    this.userInfo = null;
                    callback?.(false)
                }

            })
        } catch (e) {
            console.log("e", e);
            this.userInfo = null;
            callback?.(false)
        } finally {
            Loading.hide();
        }
    })

}

// ESM的单例导出
export default new UserStore();