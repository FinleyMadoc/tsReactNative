package com.tsreactnative;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.tsreactnative.RNActicity;

import android.content.Context;

import com.facebook.react.bridge.Callback;  // 引入 Callback
// 个异常类，它在 React Native 中的原生模块开发中经常被用到。它的作用是在原生模块中捕获可能发生的不合法的视图操作异常。
import com.facebook.react.uimanager.IllegalViewOperationException; // 引入 IllegalViewOperationException

public class RNCallbackModule extends ReactContextBaseJavaModule {
    private Context mContext;
    public RNCallbackModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
    }

    @Override
    public String getName() {
        return "RNCallbackModule";
    }

    @ReactMethod
    public void RNCallbackModule(Callback errorCallback, Callback successCallback) {
        try {
            successCallback.invoke("成功的回调");
        } catch (IllegalViewOperationException e) {
            errorCallback.invoke("失败的回调");
        }
    }
}
