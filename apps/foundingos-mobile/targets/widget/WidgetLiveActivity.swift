import ActivityKit
import WidgetKit
import SwiftUI
import ApprovalsWidgetBridge

// Lock Screen / Dynamic Island presentation for the Approvals queue. `ApprovalsActivityAttributes`
// lives in the ApprovalsWidgetBridge pod (imported here and by the main app target) so both
// processes share the exact same compiled type — see targets/widget/pods.rb.
struct ApprovalsLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: ApprovalsActivityAttributes.self) { context in
            HStack(spacing: 12) {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Approvals")
                        .font(.system(size: 12, weight: .bold))
                        .foregroundStyle(.secondary)
                    Text(context.state.topItemTitle)
                        .font(.system(size: 15, weight: .semibold))
                        .lineLimit(1)
                }
                Spacer()
                Text("\(context.state.pendingCount)")
                    .font(.system(size: 22, weight: .bold, design: .rounded))
                    .foregroundStyle(Color(red: 0.30, green: 0.79, blue: 1.0))
            }
            .padding(16)
            .activityBackgroundTint(Color(red: 0.02, green: 0.024, blue: 0.04))
            .activitySystemActionForegroundColor(.white)

        } dynamicIsland: { context in
            DynamicIsland {
                DynamicIslandExpandedRegion(.leading) {
                    Text("Approvals")
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                }
                DynamicIslandExpandedRegion(.trailing) {
                    Text("\(context.state.pendingCount) pending")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundStyle(Color(red: 0.30, green: 0.79, blue: 1.0))
                }
                DynamicIslandExpandedRegion(.bottom) {
                    Text(context.state.topItemTitle)
                        .font(.system(size: 13, weight: .medium))
                        .lineLimit(1)
                }
            } compactLeading: {
                Image(systemName: "checkmark.circle")
                    .foregroundStyle(Color(red: 0.30, green: 0.79, blue: 1.0))
            } compactTrailing: {
                Text("\(context.state.pendingCount)")
                    .font(.system(size: 13, weight: .bold))
            } minimal: {
                Text("\(context.state.pendingCount)")
                    .font(.system(size: 12, weight: .bold))
            }
            .widgetURL(URL(string: "foundingos://approvals"))
        }
    }
}
