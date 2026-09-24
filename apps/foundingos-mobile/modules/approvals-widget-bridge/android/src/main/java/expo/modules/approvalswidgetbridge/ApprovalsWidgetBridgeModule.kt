package expo.modules.approvalswidgetbridge

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

// Android has no Live Activity / Dynamic Island equivalent, so every function here is a safe
// documented no-op. Home screen widgets on Android use a completely different mechanism
// (AppWidgetProvider + RemoteViews + a manifest-registered widget) that is not implemented yet
// — see the "remaining blockers" note in the mobile app's summary for scope/next steps.
class ApprovalsWidgetBridgeModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ApprovalsWidgetBridge")

    Function("isSupported") { false }
    Function("startOrUpdateActivity") { _: Int, _: String -> false }
    Function("endActivity") { }
  }
}

