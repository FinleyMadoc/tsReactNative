package com.tsreactnative;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Intent;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.util.Log;

import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;

public class ForegroundService extends Service {
    private static final int NOTIFICATION_ID = 1;
    private static final long LOG_INTERVAL = 10000; // 10秒

    private Handler handler = new Handler();
    private Runnable logRunnable = new Runnable() {
        @Override
        public void run() {
            Log.d("这里这里", "onStartCommand: 111111");
            handler.postDelayed(this, LOG_INTERVAL); // 重复任务
        }
    };

    @Override
    public void onCreate() {
        super.onCreate();
        handler.postDelayed(logRunnable, LOG_INTERVAL); // 启动定时任务
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        // 在 Android 版本大于或等于 26 时创建通知渠道
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            String channelId = "your_channel_id";
            String channelName = "Your Channel Name";
            int importance = NotificationManager.IMPORTANCE_DEFAULT;

            NotificationChannel channel = new NotificationChannel(channelId, channelName, importance);

            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }

        // 使用通知渠道
        Notification notification = new Notification.Builder(this, "your_channel_id")
                .setContentTitle("App正在运行")
                .setContentText("点击返回App")
                .setSmallIcon(R.drawable.img1)
                .build();
        startForeground(NOTIFICATION_ID, notification);


        return super.onStartCommand(intent, flags, startId);
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
