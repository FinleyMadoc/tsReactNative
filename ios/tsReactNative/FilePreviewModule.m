// FilePreviewModule.m

#import "FilePreviewModule.h"
#import <QuickLook/QuickLook.h>

@implementation FilePreviewModule

RCT_EXPORT_MODULE();

// FilePreviewModule.m

- (NSArray<NSString *> *)supportedEvents {
    return @[@"RNDownloaderProgress", @"DoneButtonEvent", @"CancelEvent", @"OKEvent"];
}

- (NSInteger)numberOfPreviewItemsInPreviewController:(QLPreviewController *)controller {
    return 1; // 返回要预览的文件数量
}

- (id<QLPreviewItem>)previewController:(QLPreviewController *)controller previewItemAtIndex:(NSInteger)index {
    return self.fileUrl; // 返回要预览的文件的 NSURL
}

//接受传入的base64，fileName，fileType， 回调
RCT_EXPORT_METHOD(openDocb64:(NSArray *)array callback:(RCTResponseSenderBlock)callback)
{

    __weak FilePreviewModule* weakSelf = self;
    dispatch_queue_t asyncQueue = dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0);
    dispatch_async(asyncQueue, ^{
        NSDictionary* dict = [array objectAtIndex:0];
        NSString* base64String = dict[@"base64"];
        NSString* filename = dict[@"fileName"];
        NSString* filetype = dict[@"fileType"];
//      转成文件url
        NSURL *url = [NSURL URLWithString:[NSString stringWithFormat:@"data:application/octet-stream;base64,%@",base64String]];
        NSData* dat = [NSData dataWithContentsOfURL:url];
        if (dat == nil) {
            if (callback) {
                callback(@[[NSNull null], @"DATA nil"]);
            }
            return;
        }
        NSString* fileName = [NSString stringWithFormat:@"%@%@%@", filename, @".", filetype];
        NSString* fileExt = [fileName pathExtension];
        if([fileExt length] == 0){
            fileName = [NSString stringWithFormat:@"%@%@", fileName, @".pdf"];
        }
        NSString* path = [NSTemporaryDirectory() stringByAppendingPathComponent: fileName];
        NSURL* tmpFileUrl = [NSURL fileURLWithPath:path]; // 使用 fileURLWithPath: 方法创建文件 URL
        [dat writeToURL:tmpFileUrl atomically:YES];
        weakSelf.fileUrl = tmpFileUrl;

        dispatch_async(dispatch_get_main_queue(), ^{
            QLPreviewController* cntr = [[QLPreviewController alloc] init];
            cntr.delegate = weakSelf;
            cntr.dataSource = weakSelf;
            if (callback) {
                callback(@[[NSNull null], @"Data"]);
            }
            UIViewController* root = [[[UIApplication sharedApplication] keyWindow] rootViewController];
            while (root.presentedViewController) {
                root = [root presentedViewController];
            }
            [root presentViewController:cntr animated:YES completion:nil];
        });

    });
}

@end
