//
//  FilePreviewModule.h
//  HUALIAPP
//
//  Created by APP03 on 2024/1/9.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTViewManager.h>
#import <QuickLook/QuickLook.h>

#import <React/RCTEventEmitter.h>
#import <React/RCTLog.h>

//@interface FilePreviewModule : NSObject <RCTBridgeModule, QLPreviewControllerDataSource>

@interface FilePreviewModule : RCTEventEmitter <RCTBridgeModule, QLPreviewControllerDelegate, QLPreviewControllerDataSource, QLPreviewItem, UIAlertViewDelegate>
@property (strong, nonatomic) NSURL* fileUrl;
@property (strong, nonatomic) NSString* optionalFileName;
@property (readonly) NSURL* previewItemURL;
@property (strong, nonatomic) NSData* downloadResumeData;
//@property (strong, nonatomic) UIAlertView* alert;
//@property (strong, nonatomic) UIProgressView* downloadProgressView;

@end

