package com.tsreactnative;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.ReadableMap;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

public class ActivityCallbackModule extends ReactContextBaseJavaModule {
    private Context mContext;
    private static final int REQUEST_CODE = 1234; // 用于 startActivityForResult 的请求码

    private Callback mDoneCallback;
    private Callback mCancelCallback;

    public ActivityCallbackModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
        reactContext.addActivityEventListener(mActivityEventListener);
    }

    @Override
    public String getName() {
        return "ActivityCallback";
    }

    private final ActivityEventListener mActivityEventListener = new ActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent intent) {
            if (requestCode == REQUEST_CODE) {
                if (mDoneCallback != null) {
                    if (resultCode == Activity.RESULT_CANCELED) {
                        mCancelCallback.invoke("取消");
                    } else {
                        WritableMap map = Arguments.createMap();
                        map.putString("result", intent.getExtras().getString("result"));
                        mDoneCallback.invoke(map);
                    }

                    mCancelCallback = null;
                    mDoneCallback = null;
                }
            }
        }

        @Override
        public void onNewIntent(Intent intent) {
            // 空实现
        }
    };

    @ReactMethod
    public void RNActivityResult(final ReadableMap map, final Callback onDone, final Callback onCancel) {
        String strData = map.hasKey("strData") ? map.getString("strData") : "0";
        Log.e("RN传来的数据", strData);
        Intent intent = new Intent(getCurrentActivity(), ActivityCallback.class);
        mCancelCallback = onCancel;
        mDoneCallback = onDone;
        intent.putExtra("strData", strData);
        getCurrentActivity().startActivityForResult(intent, REQUEST_CODE);
    }
}
