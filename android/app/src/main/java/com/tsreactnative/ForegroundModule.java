package com.tsreactnative;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import android.content.Context;
import android.content.Intent;

import com.tsreactnative.ForegroundService;

public class ForegroundModule extends ReactContextBaseJavaModule{
    private Context mContext;
    public ForegroundModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
    }

    @Override
    public String getName() {
        return "ForegroundModule";
    }

    @ReactMethod
    public void startForegroundService() {
        Intent intent = new Intent(mContext, ForegroundService.class);
        mContext.startService(intent);
    }

    
}
