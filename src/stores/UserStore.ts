import { request } from "../utils/Request";
import {flow} from 'mobx'
import { save } from "../utils/Storage";


class UserStore {

    userInfo: any;

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


    // flow yield
    requestLogin = flow(function* (
            this: UserStore, 
            phone: string, 
            pwd: string, 
            callback: (success: boolean) => void) {
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
        }
    })

}

// ESM的单例导出
export default new UserStore();