package com.tsreactnative;
// 用于传递数据和状态信息，特别是在活动之间传递信息。
import android.os.Bundle;
// 用于处理 UI 元素（视图）的基本类。
import android.view.View;
// 一个支持兼容性的 Android 活动基类，用于创建应用的 UI。
import androidx.appcompat.app.AppCompatActivity;
import com.tsreactnative.R;

public class RNActicity extends AppCompatActivity {
    @Override
    // 这是一个重要的生命周期方法，当活动被创建时调用。
    // Bundle savedInstanceState 是用于存储先前状态的 Bundle 对象。在这个方法内，你通常设置活动的布局和初始化操作。
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // 这行代码设置活动的布局，即在 res/layout 目录中的 activity_rn.xml 布局文件。
        setContentView(R.layout.activity_rn);
    }

    public void onBack(View view) {
        finish();
    }
}