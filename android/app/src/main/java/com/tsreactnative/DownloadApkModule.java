package com.tsreactnative;

import android.os.AsyncTask;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.IOException;
import java.io.InputStream;
import java.io.RandomAccessFile;
import java.net.HttpURLConnection;
import java.net.URL;

import android.net.Uri;
import android.content.Intent;

import java.io.File;

import android.os.Build;

import androidx.core.content.FileProvider;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import com.facebook.react.modules.core.DeviceEventManagerModule;


public class DownloadApkModule extends ReactContextBaseJavaModule implements DownloadProgressListener {
    private static final int THREAD_COUNT = 4; //线程数
    private static double totalProgress = 0; //进度
    private static long apkLength = 0; //apk总长

    private static long contentLength = 0; //平均片长
    private static long finalContentL = 0; //最后一片的长度
    // String url = 'http://app.huali-group.com:8080/MobileApp/file/appversion/getapk?versionnumber=1.5.2';
    // String name = "hualiapp.apk";
    private final ReactApplicationContext reactContext;

    ExecutorService executorService = Executors.newFixedThreadPool(THREAD_COUNT);

    public DownloadApkModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "DownloadApkModule";
    }

    @ReactMethod
    public void downloadFile(String fileUrl, String fileName) {
        android.util.Log.d("下載文件", fileUrl + fileName);
        try {
            download(fileUrl, fileName);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onProgressUpdate(double progressPercentage) {
//        android.util.Log.d("totalProgress开始大小", String.valueOf(totalProgress));
//        android.util.Log.d("传过来的progressPercentage大小1", String.valueOf(progressPercentage));
        totalProgress += progressPercentage;
//        android.util.Log.d("传过来的大小1", String.valueOf(progressPercentage));
//        android.util.Log.d("添加后的大小", String.valueOf(totalProgress));
        // int test = (int) ((totalProgress) / (apkLength + 1));
        sendProgressEvent(totalProgress);
    }

//    传出进度到前端
    private void sendProgressEvent(double progress) {
        int test = (int) progress;
//        android.util.Log.d("传过来的大小2", String.valueOf(progress));
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("DownloadProgressEvent", test);
    }

    private void download(String fileUrl, String fileName) throws IOException {
        URL url = new URL(fileUrl);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        // 获取文件长度
        long fileLength = connection.getContentLength();
        apkLength = fileLength;
//        android.util.Log.d("总文件大小", String.valueOf(fileLength));
        // 判断url是否支持分片下载
        connection.setRequestMethod("HEAD");
        int responseCode = connection.getResponseCode();

        if (responseCode == HttpURLConnection.HTTP_OK) {
            // 检查连接是否支持分片下载
            String acceptRanges = connection.getHeaderField("Accept-Ranges");
            Boolean supportRanges = "bytes".equalsIgnoreCase(acceptRanges);

            // 拿出文件名称
            String contentDisposition = connection.getHeaderField("Content-Disposition");
            if (contentDisposition != null && contentDisposition.indexOf("attachment") != -1) {
                // 从 "Content-Disposition" 中提取文件名
                int index = contentDisposition.indexOf("fileName=");
                if (index != -1) {
                    fileName = contentDisposition.substring(index + 9);
                    // 去除可能存在的引号等字符
                    fileName = fileName.replaceAll("[\"']", "");
                }
            }

            // 支持分片下载
            if (supportRanges) {
                android.util.Log.d("支持分片支持分片支持分片支持分片支持分片支持分片支持分片", "支持分片");
                // 1、查找当前路径下是否存在下载的分片
                File outputDir = reactContext.getFilesDir();
                // 获取目录下的所有文件
                File[] files = outputDir.listFiles();
                if (files != null) {
                    Boolean check = false;
                    ArrayList list = new ArrayList();
                    //  查找是否有分片文件
                    for (File file : files) {
                        //  目录下的文件查找含有下载名的文件(分片)
//                        android.util.Log.d("目录下的文件0", file.getName());
                        if (file.isFile() && file.getName().indexOf(fileName) != -1) {
                            check = true;
//                            android.util.Log.d("目录下的文件1", file.getName());
//                            // 保存结果
                            list.add(file);
                        }
                    }
//                    android.util.Log.d("目录下的文件2", check.toString());

                    if(list.size() == 1) {
                        //  检查list里面是否就是已经合并的apk，如果数据长度无误, 然后直接进行安装
                        File file = (File) list.get(0);
                        if (file.getName().equals(fileName) && file.length() == apkLength) {
                            startInstallActivity(file);
//                            可以直接安装，断掉后面的下载
                            return;
                        }
                    }

//                    android.util.Log.d("run???", "???????");
                    // 断点续传
                    if (check) {
//                        File outputFile = new File(outputDir, fileName);
// rest
//                        // 传入已下载进度
//                        totalProgress = outputFile.length();
//                        android.util.Log.d("totalProgress111111111111", String.valueOf(totalProgress));
                        long partSize = fileLength / THREAD_COUNT;
                        boolean isDownloading = false; //下载状态
                        for (int i = 0; i < THREAD_COUNT; i++) {
                            long startRange = i * partSize;
                            long endRange = (i == THREAD_COUNT - 1) ? fileLength - 1 : (i + 1) * partSize - 1;

//                          记录平均片和最后一片的完整性
                            if(contentLength == 0 && i != THREAD_COUNT - 1) {
                                contentLength = endRange - startRange + 1;
                            }else if(finalContentL == 0 && i == THREAD_COUNT - 1){
                                finalContentL = endRange - startRange + 1;
                            }

//                            android.util.Log.d("test---------", i + "-线程下载的分片为:" + "开始:" + startRange + "， 结束：" + endRange);
                            // 检查分片完整性
                            boolean needDownLoad = checkFragment(startRange, endRange, i, fileName, list);
//                            android.util.Log.d("needDownLoad",  i + "_" + fileName + "_" + needDownLoad);
//                            需要下载
                            if (needDownLoad) {
//                                android.util.Log.d("当前进行下载的是11111111111", i + "_" + fileName);
                                isDownloading = true;
                                DownloadRunnable downloadRunnable = new DownloadRunnable(fileUrl, fileName, startRange, endRange, i, THREAD_COUNT, supportRanges);
                                downloadRunnable.setProgressListener(DownloadApkModule.this);
                                executorService.execute(downloadRunnable);
                            }
                        }

//                        checkFragment已经验证了完整性
//                        如果都是下载完毕的分片
                        if(!isDownloading) {
                            List<String> segmentFilePaths = new ArrayList<>();
                            for (int i = 0; i < THREAD_COUNT; i++) {
                                segmentFilePaths.add(new File(reactContext.getFilesDir(), i + "_" + fileName).getAbsolutePath());
                            }
                            mergeSegmentFiles(segmentFilePaths, fileName);
                        }
                    }
                    //  目录下不存在分片
                    else {
                        // 不存在任何分片则开始下载
                        long partSize = fileLength / THREAD_COUNT;
                        for (int i = 0; i < THREAD_COUNT; i++) {
                            long startRange = i * partSize;
                            long endRange = (i == THREAD_COUNT - 1) ? fileLength - 1 : (i + 1) * partSize - 1;
                            //  记录每片的完整性
                            if(contentLength == 0 && i != THREAD_COUNT - 1) {
                                contentLength = endRange - startRange + 1;
                            }else if(finalContentL == 0 && i == THREAD_COUNT - 1){
                                finalContentL = endRange - startRange + 1;
                            }
//                            String newFileName = i + '-' + fileName;
                            // executorService.execute(new DownloadRunnable(fileUrl, fileName, startRange, endRange, i, THREAD_COUNT - 1));
//                            android.util.Log.d("当前进行下载的是2222222222222222", i + "_" + fileName + "_需要下载的大小：" + (endRange - startRange + 1));
                            DownloadRunnable downloadRunnable = new DownloadRunnable(fileUrl, fileName, startRange, endRange, i, THREAD_COUNT, supportRanges);
                            downloadRunnable.setProgressListener(DownloadApkModule.this);
                            executorService.execute(downloadRunnable);
                        }
                    }
                }

            }
            // 不支持分片。直接下载
            else {
                android.util.Log.d("不支持分片不支持分片不支持分片不支持分片不支持分片不支持分片不支持分片", "不支持分片");
                int INIT_THREAD_COUNT = 1;
                finalContentL = fileLength;

//                检查是否有已经下载好的apk：
                checkDownloadAll(fileName, INIT_THREAD_COUNT);

                DownloadRunnable downloadRunnable = new DownloadRunnable(fileUrl, fileName, 0, fileLength - 1, 0, INIT_THREAD_COUNT, supportRanges);
                downloadRunnable.setProgressListener(DownloadApkModule.this);
                executorService.execute(downloadRunnable);
            }

        } else {
            // 连接异常
            return;
        }
        connection.disconnect();
    }

    private Boolean checkFragment(long startRange, long endRange, int index, String fileName, ArrayList list) {
        String name = index + "_" + fileName;

        for (int i = 0; i < list.size(); i++) {
            File file = (File) list.get(i);
//            android.util.Log.d("测试1", file.getName());
//            android.util.Log.d("测试2", name);
//            android.util.Log.d("测试3", String.valueOf(file.getName().equals(name)));
            if (file.getName().equals(name)) {
//                如果长度完整则不再下载
//                android.util.Log.d("file.length() == (endRange - startRange + 1)", String.valueOf(file.length() == (endRange - startRange + 1)));
//                android.util.Log.d("已经下载的长度", file.getName() + ":  " + file.length());
//                android.util.Log.d("需要下载的长度", "需要下载的长度"+ ":  " + (endRange - startRange + 1));
                if (file.length() == (endRange - startRange + 1)) {
                    boolean res = file.length() == (endRange - startRange + 1);
//                    android.util.Log.d("可以不用下载的分片", file.getName());
                    // 当前分片已经下载完毕，记录进度
//                    android.util.Log.d("totalProgress添加前", String.valueOf(totalProgress));
                    totalProgress+=25;

                    return false;
                } else {
//                    android.util.Log.d("需要删除的分片", file.getName());
//                    如果长度不完整则删除当前文件然后重新下载
                    file.delete();
                    return true;
                }
            }
        }
//        如果不在list内
        return true;
    }

    //  合并分片
    private void mergeSegmentFiles(List<String> segmentFilePaths, String fileName) {
        try {
            File outputDir = reactContext.getFilesDir();
            File outputFile = new File(outputDir, fileName);

            // 如果原件存在就删除原件
            if (outputFile.exists()) {
                outputFile.delete();
            }

            RandomAccessFile outputRandomAccessFile = new RandomAccessFile(outputFile, "rw");

            // 合并分片
            for (String segmentFilePath : segmentFilePaths) {
                File segmentFile = new File(segmentFilePath);
                RandomAccessFile segmentRandomAccessFile = new RandomAccessFile(segmentFile, "r");

                byte[] buffer = new byte[1024];
                int bytesRead;

                while ((bytesRead = segmentRandomAccessFile.read(buffer)) != -1) {
                    outputRandomAccessFile.write(buffer, 0, bytesRead);
                }

                segmentRandomAccessFile.close();
            }
            android.util.Log.d("完成进度", String.valueOf(totalProgress));
            outputRandomAccessFile.close();
            // 打开安装界面
            startInstallActivity(outputFile);
            // 清理分片文件
            cleanUpSegmentFiles(segmentFilePaths);
            // 关闭线程
            executorService.shutdown();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // 清理分片文件
    private void cleanUpSegmentFiles(List<String> segmentFilePaths) {

        for (String segmentFilePath : segmentFilePaths) {
            File segmentFile = new File(segmentFilePath);
            if (segmentFile.exists()) {
                segmentFile.delete();
            }
        }
    }

    private void checkDownloadAll(String fileName, int totalThreads) {

        File outputDir = reactContext.getFilesDir();
        File[] files = outputDir.listFiles();
        if (files != null) {
            ArrayList list = new ArrayList();
            //  查找是否有分片文件
            for (File file : files) {
                //  目录下的文件查找含有下载名的文件(分片)
                if (file.isFile() && file.getName().indexOf(fileName) != -1) {
                    //  check = true;
                    android.util.Log.d("下载后保存进list的文件", file.getName() + "_长度是" + file.length());
                    // 如果下载的文件长度完整则保存结果
                    android.util.Log.d("contentLength", String.valueOf(contentLength));
                    android.util.Log.d("finalContentL", String.valueOf(finalContentL));
                    if(file.length() == contentLength || file.length() == finalContentL) {
                        list.add(file);
                    }
                }
            }
            android.util.Log.d("下载后保存进list的文件数量", String.valueOf(list.size()));
            if (list.size() == totalThreads) {
                //  全部分片下载完毕，进行合并
                List<String> segmentFilePaths = new ArrayList<>();
                for (int i = 0; i < totalThreads; i++) {
                    segmentFilePaths.add(new File(reactContext.getFilesDir(), i + "_" + fileName).getAbsolutePath());
                }
                mergeSegmentFiles(segmentFilePaths, fileName);
            }
        }
    }

    private class DownloadRunnable implements Runnable {
        private final String fileUrl;
        private final String fileName;
        private final long startRange;
        private final long endRange;
        private final int threadId;
        private final int totalThreads;

        private final boolean supportRanges;

        private DownloadProgressListener progressListener;

        public DownloadRunnable(String fileUrl, String fileName, long startRange, long endRange, int threadId, int totalThreads, boolean supportRanges) {
            this.fileUrl = fileUrl;
            this.fileName = fileName;
            this.startRange = startRange;
            this.endRange = endRange;
            this.threadId = threadId;
            this.totalThreads = totalThreads;
            this.supportRanges = supportRanges;
        }

        @Override
        public void run() {
            try {
                URL url = new URL(fileUrl);
                HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                connection.setRequestProperty("Range", "bytes=" + startRange + "-" + endRange);

                InputStream inputStream = connection.getInputStream();
                File outputDir = reactContext.getFilesDir();
//                File outputFile = new File(outputDir, fileName);
//                RandomAccessFile randomAccessFile = new RandomAccessFile(outputFile, "rw");
//                randomAccessFile.seek(startRange);

                // 分片临时文件
//                android.util.Log.d("下载的分片文件名字为", threadId + "_" + fileName);
                File tempSegmentFile = new File(outputDir, threadId + "_" + fileName);
                RandomAccessFile tempSegmentRandomAccessFile = new RandomAccessFile(tempSegmentFile, "rw");

                byte[] buffer = new byte[1024];
                int bytesRead;
                long totalBytesRead = 0;
                long contentLength = endRange - startRange + 1;

                int beforeProgress, progress = 0;

                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    totalBytesRead += bytesRead;
                    // 计算当前线程下载进度
                    beforeProgress = progress;
                    progress = (int) ((totalBytesRead * 100) / (endRange - startRange + 1));
                    double precent = supportRanges ? (double) ((progress - beforeProgress) * 0.25) : (double) (progress - beforeProgress);
//                    Log.d("下载进度：---------", "Thread " + threadId + " " + String.valueOf(progress) + "% ");
//                    如果进度没变化则不刷新
                    if(precent != 0 || precent != 0.0) {
                        updateProgress(precent);
                    }
//                    if(precent == 25.0) {
//                        Log.d("当前计算", "Thread " + threadId + " " + String.valueOf(precent) + "% ");
//                        updateProgress(precent);
//                    }
//                    long progress = totalBytesRead;
//                    Log.d("下载进度1：---------", String.valueOf(progress));
//                    Log.d("下载进度2：---------", String.valueOf(apkLength));
//                    long progressPercentage = (int) (progress) ;
                    // 发布进度更新

//                    randomAccessFile.write(buffer, 0, bytesRead);
                    tempSegmentRandomAccessFile.write(buffer, 0, bytesRead);
                }
//                randomAccessFile. close();
                tempSegmentRandomAccessFile.close();
                inputStream.close();
                Log.d("MultiThreadDownloader", "Thread " + threadId + " finished downloading.");

//                下载完毕后检查是否全部下载完毕
                checkDownloadAll(fileName, totalThreads);

                // ...
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        private void updateProgress(double progress) {
            // Update progress, you can use an event or callback to send progress to React Native
//            Log.d("下载进度", "Thread " + threadId + ": " + progress + "%");
            if (progressListener != null) {
                progressListener.onProgressUpdate(progress);
            }
        }

        public void setProgressListener(DownloadProgressListener listener) {
            this.progressListener = listener;
        }
    }

    private void startInstallActivity(File apkFile) {
        try {
            Intent intent = new Intent(Intent.ACTION_VIEW);
            Uri uri;
            // 在 Android 7.0 及以上版本，需要使用 FileProvider 来获取 Uri
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                uri = FileProvider.getUriForFile(reactContext, reactContext.getApplicationContext().getPackageName() + ".provider", apkFile);
                intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            } else {
                uri = Uri.fromFile(apkFile);
            }

            intent.setDataAndType(uri, "application/vnd.android.package-archive");
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            reactContext.startActivity(intent);
        } catch (Exception e) {
            e.printStackTrace();
            // 处理异常
        }
    }


}
