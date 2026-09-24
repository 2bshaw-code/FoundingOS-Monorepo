import { NativeModule, requireNativeModule } from 'expo';

declare class ApprovalsWidgetBridgeModule extends NativeModule<{}> {
  isSupported(): boolean;
  startOrUpdateActivity(pendingCount: number, topItemTitle: string): boolean;
  endActivity(): void;
}

export default requireNativeModule<ApprovalsWidgetBridgeModule>('ApprovalsWidgetBridge');
