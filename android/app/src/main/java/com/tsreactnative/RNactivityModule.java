package com.tsreactnative;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.tsreactnative.RNActicity;

// 这里引入了 Context 和 Intent 类，它们是 Android 提供的用于处理上下文和活动跳转的类。
import android.content.Context;
import android.content.Intent;

public class RNactivityModule extends ReactContextBaseJavaModule {
    private Context mContext;
    public RNactivityModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
    }

    @Override
    public String getName() {
        return "RNactivityModule";
    }

    //RN调用android Activity
    // 在这个方法中，我们创建一个新的 Intent 对象，用于启动一个名为 RNActicity 的 Android 活动。
    // 然后，我们设置了 Intent 的标志以指定启动新任务。
    // 最后，我们使用上下文的 startActivity 方法来启动该活动
    @ReactMethod
    public void RNActicity() {
        Intent intent = new Intent(mContext, RNActicity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        mContext.startActivity(intent);
    }
}
