package com.tsreactnative;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import android.content.Context;

import com.facebook.react.bridge.Promise;
import android.widget.Toast;

public class RNPromiseModule extends ReactContextBaseJavaModule{
    private Context mContext;
    public RNPromiseModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
    }

    @Override
    public String getName() {
        return "RNPromiseModule";
    }

    // RN用promise机制与安卓原生代码通信
    @ReactMethod
    public void RNPromise(String msg, Promise promise) {
        Toast.makeText(mContext, msg, Toast.LENGTH_SHORT).show();

        String componentName = msg;
        promise.resolve(componentName);
    }
}
