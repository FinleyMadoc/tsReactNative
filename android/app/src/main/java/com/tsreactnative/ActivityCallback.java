package com.tsreactnative;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

public class ActivityCallback extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 进行操作

        Intent returnIntent = new Intent();
        returnIntent.putExtra("result", "RNActivity返回的数据");

        // 设置结果结束Activity;
        setResult(Activity.RESULT_OK, returnIntent);
        finish();
    }
}
