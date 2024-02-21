// MyDocumentPickerModule.m

#import "MyDocumentPickerModule.h"
#import <React/RCTConvert.h>
#import <React/RCTLog.h>
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>

@interface MyDocumentPickerModule ()

@property (nonatomic, strong) UIDocumentPickerViewController *documentPicker;

@end

@implementation MyDocumentPickerModule

RCT_EXPORT_MODULE();

- (instancetype)init
{
    self = [super init];
    if (self) {
        // 初始化 documentPicker
        self.documentPicker = [[UIDocumentPickerViewController alloc] initWithDocumentTypes:@[@"public.content"]
                                                                                        inMode:UIDocumentPickerModeImport];
        self.documentPicker.delegate = self;
    }
    return self;
}

// 在 JavaScript 端调用该方法来打开文件选择器
RCT_EXPORT_METHOD(showDocumentPicker) {
    dispatch_async(dispatch_get_main_queue(), ^{
        UIViewController *rootViewController = RCTPresentedViewController();
        if (rootViewController != nil) {
            [rootViewController presentViewController:self.documentPicker animated:YES completion:nil];
        }
    });
}

// 实现 UIDocumentPickerDelegate 协议方法来处理选择文件后的操作
- (void)documentPicker:(UIDocumentPickerViewController *)controller didPickDocumentsAtURLs:(NSArray<NSURL *> *)urls {
    if (urls.count > 0) {
        NSURL *selectedURL = urls.firstObject;

        // 获取文件名
        NSString *fileName = [selectedURL lastPathComponent];

        // 获取文件大小（以字节为单位）
        NSError *attributesError;
        NSDictionary *fileAttributes = [[NSFileManager defaultManager] attributesOfItemAtPath:selectedURL.path error:&attributesError];
        NSNumber *fileSize = [fileAttributes objectForKey:NSFileSize];
        NSString *formattedSize = [self formatFileSize:fileSize];
        NSString *base64Content = [self base64StringFromFileURL:selectedURL];
        if (!attributesError) {
            // 处理选择的文件 URL、文件名和文件大小
            // 印出选择的文件信息
            // RCTLogInfo(@"Selected file URL: %@", selectedURL.absoluteString);
            // RCTLogInfo(@"File Name: %@", fileName);
            // RCTLogInfo(@"realSize: %@ bytes", fileSize);
            // RCTLogInfo(@"File Size: %@", formattedSize);
            // RCTLogInfo(@"Base64 Content: %@", base64Content);
            
            // 将文件 URL、文件名和文件大小发送给 JavaScript 端
            [self sendEventWithName:@"DocumentPicked" body:@{@"url": selectedURL.absoluteString, @"name": fileName, @"realSize": fileSize, @"size": formattedSize, @"content": base64Content}];
        } else {
            // 处理获取文件属性时的错误
            RCTLogError(@"Error fetching file attributes: %@", attributesError.localizedDescription);
        }
    }
}

// 处理文件大小
- (NSString *)formatFileSize:(NSNumber *)fileSize {
    double bytes = [fileSize doubleValue];
    NSArray *sizeUnits = @[@"B", @"KB", @"MB", @"GB", @"TB"];

    NSInteger unitIndex = 0;
    while (bytes > 1024 && unitIndex < [sizeUnits count] - 1) {
        bytes /= 1024;
        unitIndex++;
    }

    NSString *formattedSize = [NSString stringWithFormat:@"%.2f %@", bytes, sizeUnits[unitIndex]];
    return formattedSize;
}

// 处理url变成base64
- (NSString *)base64StringFromFileURL:(NSURL *)fileURL {
    NSData *fileData = [NSData dataWithContentsOfURL:fileURL];
    if (fileData) {
        NSString *base64String = [fileData base64EncodedStringWithOptions:0];
        return base64String;
    }
    return nil;
}

// 将自定义事件发送到 JavaScript 端
- (NSArray<NSString *> *)supportedEvents {
    return @[@"DocumentPicked"];
}

@end
