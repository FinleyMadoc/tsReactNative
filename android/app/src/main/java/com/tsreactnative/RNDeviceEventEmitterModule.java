package com.tsreactnative;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import android.content.Context;
import com.facebook.react.modules.core.DeviceEventManagerModule;// 引入 DeviceEventManagerModule

public class RNDeviceEventEmitterModule extends ReactContextBaseJavaModule {
    private Context mContext;
    public RNDeviceEventEmitterModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
    }

    @Override
    public String getName() {
        return "RNDeviceEventEmitter";
    }

    @ReactMethod
    public void RNDeviceEvent() {
        sendEventToRn("sendEventToRn");
    }
    // 触发一个自定义的设备事件，并且可以传递附加数据给 JavaScript 事件监听器
    private void sendEventToRn(String eventName) {
        if(getReactApplicationContext() == null) {
            return;
        }
        getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, "data");

    }
}
