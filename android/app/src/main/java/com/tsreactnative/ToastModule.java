package com.tsreactnative;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import android.widget.Toast;
import java.util.Map;
import java.util.HashMap;

public class ToastModule extends ReactContextBaseJavaModule {

  private static ReactApplicationContext reactContext;

  private static final String DURATION_SHORT_KEY = "SHORT";
  private static final String DURATION_LONG_KEY = "LONG";

  public ToastModule(ReactApplicationContext context) {
    super(context);
    reactContext = context;
  }

//   这个函数用于返回一个字符串名字，这个名字在 JavaScript 端标记这个模块
  @Override
  public String getName() {
    return "ToastExample";
  }

//   一个可选的方法getContants返回了需要导出给 JavaScript 使用的常量(它并不一定需要实现，但在定义一些可以被 JavaScript 同步访问到的预定义的值时非常有用。)
  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
    constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT);
    constants.put(DURATION_LONG_KEY, Toast.LENGTH_LONG);
    return constants;
  }

  @ReactMethod
  public void show(String message, int duration) {
    Toast.makeText(getReactApplicationContext(), message, duration).show();
  }
//   下面的参数类型在@ReactMethod注明的方法中，会被直接映射到它们对应的 JavaScript 类型。
// Boolean -> Bool
// Integer -> Number
// Double -> Number
// Float -> Number
// String -> String
// Callback -> function
// ReadableMap -> Object
// ReadableArray -> Array

}
