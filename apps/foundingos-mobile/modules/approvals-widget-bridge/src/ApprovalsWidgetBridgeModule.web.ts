import { registerWebModule, NativeModule } from 'expo';

// Web has no Live Activity / widget concept — every function is a documented no-op so callers
// (lib/live-approvals-widget.ts) can call this unconditionally on every platform.
class ApprovalsWidgetBridgeModule extends NativeModule<{}> {
  isSupported() {
    return false;
  }
  startOrUpdateActivity(_pendingCount: number, _topItemTitle: string) {
    return false;
  }
  endActivity() {}
}

export default registerWebModule(ApprovalsWidgetBridgeModule, 'ApprovalsWidgetBridgeModule');
