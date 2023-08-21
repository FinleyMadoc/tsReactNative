package com.tsreactnative;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.tsreactnative.RNActicity;

import android.content.Context;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import android.util.Log; 

public class MultithreadingEventEmitterModule extends ReactContextBaseJavaModule {
    private Context mContext;
    public MultithreadingEventEmitterModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
    }

    @Override
    public String getName() {
        return "MultithreadingEventEmitter";
    }

    private int i ;
    
    @ReactMethod
    public void RNThreadDeviceEvent() {
        new Thread(new Runnable() {
            @Override
            public void run() {
                for( i=0 ; i<=10; i++) {
                    try {
                        Thread.sleep(1000); //模拟耗时操作
                    } catch(InterruptedException e) {
                        e.printStackTrace();
                    }
                    Log.e("线程输出值", i + "");
                    if(i == 10) {
                        getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("sendThreadDeviceEvent",i);
                    }
                }
            }
        }).start();
    }
}
