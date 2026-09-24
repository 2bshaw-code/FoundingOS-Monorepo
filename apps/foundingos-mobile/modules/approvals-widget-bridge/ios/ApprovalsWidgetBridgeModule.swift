import ExpoModulesCore
import ActivityKit
import WidgetKit

// Bridges the JS approvals-queue facade to iOS Live Activities (Lock Screen / Dynamic Island)
// and the ApprovalsWidget home screen widget. `ApprovalsActivityAttributes` (this pod's own
// public type — see ApprovalsActivityAttributes.swift) is imported by the `widget` extension
// target via targets/widget/pods.rb, so both processes share the exact same compiled type.
// Android has no Live Activity/Dynamic Island equivalent, so this module is iOS-only; see
// ApprovalsWidgetBridgeModule.kt for the (no-op, documented) Android stub.
public class ApprovalsWidgetBridgeModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ApprovalsWidgetBridge")

    Function("isSupported") { () -> Bool in
      if #available(iOS 16.2, *) {
        return ActivityAuthorizationInfo().areActivitiesEnabled
      }
      return false
    }

    Function("startOrUpdateActivity") { (pendingCount: Int, topItemTitle: String) -> Bool in
      guard #available(iOS 16.2, *) else { return false }
      let state = ApprovalsActivityAttributes.ContentState(pendingCount: pendingCount, topItemTitle: topItemTitle)

      if let existing = Activity<ApprovalsActivityAttributes>.activities.first {
        Task {
          await existing.update(ActivityContent(state: state, staleDate: nil))
        }
        return true
      }

      guard ActivityAuthorizationInfo().areActivitiesEnabled else { return false }
      do {
        _ = try Activity<ApprovalsActivityAttributes>.request(
          attributes: ApprovalsActivityAttributes(queueName: "approvals"),
          content: ActivityContent(state: state, staleDate: nil)
        )
        return true
      } catch {
        return false
      }
    }

    Function("endActivity") { () -> Void in
      guard #available(iOS 16.2, *) else { return }
      for activity in Activity<ApprovalsActivityAttributes>.activities {
        Task {
          await activity.end(nil, dismissalPolicy: .immediate)
        }
      }
    }
  }
}
