package com.tsreactnative;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import androidx.annotation.Nullable;
import androidx.documentfile.provider.DocumentFile;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import android.content.ContentResolver;
import android.content.ContentUris;
import android.content.Context;
import android.database.Cursor;
import android.provider.OpenableColumns;
import java.io.IOException;
import java.io.InputStream;
import java.io.ByteArrayOutputStream;
import android.util.Base64;
import java.io.File;
import java.text.DecimalFormat;
import android.provider.MediaStore;
import com.facebook.react.bridge.Callback;
import android.util.Log;
import androidx.appcompat.app.AppCompatActivity;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;

public class FilePickerModule extends ReactContextBaseJavaModule {
    private static final int REQUEST_CODE_PICK_FILE = 1;
    private Promise mPickerPromise;
    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
            if (requestCode == REQUEST_CODE_PICK_FILE) {
                if (resultCode == Activity.RESULT_OK && data != null) {
                    Uri uri = data.getData();
                    if (uri != null) {
                        try {
                        DocumentFile documentFile = DocumentFile.fromSingleUri(getReactApplicationContext(), uri);
                        String fileName = getFileName(uri);
                        long fileSize = getFileSize(uri);
                        String FileSize = formatFileSize(fileSize);
                        byte[] fileContent = getFileContent(uri);
                        String uriString = uri.toString();

                        WritableMap fileObject = Arguments.createMap();
                        // fileObject.putString("filePath", filePath);
                        // mPickerPromise.resolve(fileObject);
                        if (documentFile != null && documentFile.isFile()) {
                            // mPickerPromise.resolve(documentFile.getUri().toString());
                            fileObject.putString("url", uriString);
                            fileObject.putString("name", fileName);
                            fileObject.putString("size", FileSize);
                            fileObject.putDouble("realSize", fileSize);
                            fileObject.putString("content", Base64.encodeToString(fileContent, Base64.DEFAULT));
                            // fileObject.putString("path", filePath);
                            mPickerPromise.resolve(fileObject);
                        } else {
                            mPickerPromise.reject("ERROR", "Invalid file selected");
                        }
                        }catch (IOException e) {
                            mPickerPromise.reject("ERROR", e.getMessage());
                         }
                    } else {
                        mPickerPromise.reject("ERROR", "No file selected");
                    }
                } else if (resultCode == Activity.RESULT_CANCELED) {
                    mPickerPromise.reject("ERROR", "File picker canceled");
                } else {
                    mPickerPromise.reject("ERROR", "File picker failed");
                }
                mPickerPromise = null;
            }
        }
    };

    public FilePickerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addActivityEventListener(mActivityEventListener);
    }

    @Override
    public String getName() {
        return "FilePickerModule";
    }

    @ReactMethod
    public void openFilePicker(Promise promise) {
        Activity currentActivity = getCurrentActivity();
        if (currentActivity == null) {
            promise.reject("ERROR", "Activity is null");
            return;
        }
        mPickerPromise = promise;
        // 设置文件类型，这里为任意类型的文件
        String[] mimeTypes = {"application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "image/gif", "application/pdf", "image/png", "image/jpeg", "image/heic"};

        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("*/*");  

        // 设置允许选择的 MIME 类型
        intent.putExtra(Intent.EXTRA_MIME_TYPES, mimeTypes);
        currentActivity.startActivityForResult(intent, REQUEST_CODE_PICK_FILE);
    }

    private String getFileName(Uri fileUri) {
        String fileName = null;
        ContentResolver contentResolver = getCurrentActivity().getContentResolver();
        Cursor cursor = null;
        try {
            cursor = contentResolver.query(fileUri, null, null, null, null);
            if (cursor != null && cursor.moveToFirst()) {
                int nameIndex = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME);
                if (nameIndex != -1) {
                    fileName = cursor.getString(nameIndex);
                }
            }
        } finally {
            if (cursor != null) {
                cursor.close();
            }
        }
        return fileName;
    }

    private byte[] getFileContent(Uri fileUri) throws IOException {
        ContentResolver contentResolver = getCurrentActivity().getContentResolver();
        try (InputStream inputStream = contentResolver.openInputStream(fileUri)) {
            if (inputStream != null) {
                byte[] buffer = new byte[1024];
                int bytesRead;
                ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    outputStream.write(buffer, 0, bytesRead);
                }
                return outputStream.toByteArray();
            }
        }
        return null;
    }

    @ReactMethod
    public void getFileContent(String fileUri, Promise promise) {
        Uri uri = Uri.parse(fileUri);
        try {
            byte[] fileContent = getFileContent(uri);
            if (fileContent != null) {
                String base64Content = Base64.encodeToString(fileContent, Base64.DEFAULT);
                promise.resolve(base64Content);
            } else {
                promise.reject("ERROR", "Failed to read file content");
            }
        } catch (IOException e) {
            promise.reject("ERROR", e.getMessage());
        }
    }

    private long getFileSize(Uri fileUri) {
        ContentResolver contentResolver = getCurrentActivity().getContentResolver();
        Cursor cursor = contentResolver.query(fileUri, null, null, null, null);
        if (cursor != null && cursor.moveToFirst()) {
            int sizeIndex = cursor.getColumnIndex(OpenableColumns.SIZE);
            if (sizeIndex != -1) {
                return cursor.getLong(sizeIndex);
            }
        }
        return 0;
    }


    private String formatFileSize(long size) {
    if (size <= 0) {
        return "0";
    }
    
    final String[] units = new String[]{"B", "KB", "MB", "GB", "TB"};
    int digitGroups = (int) (Math.log10(size) / Math.log10(1024));
    return new DecimalFormat("#,##0.#").format(size / Math.pow(1024, digitGroups)) + " " + units[digitGroups];
}

}
