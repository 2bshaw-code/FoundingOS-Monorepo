import ActivityKit

// Shared between the main app target (which starts/updates/ends the Live Activity via
// ApprovalsWidgetBridgeModule) and the `widget` extension target (which renders it on the
// Lock Screen / Dynamic Island). Lives in this Expo module's own pod so both targets can
// `import ApprovalsWidgetBridge` and get the exact same compiled type — ActivityKit requires
// that, not just a structurally-identical duplicate. The widget extension target links this
// pod via targets/widget/pods.rb (a @bacons/apple-targets extension point for the Podfile).
public struct ApprovalsActivityAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        public var pendingCount: Int
        public var topItemTitle: String

        public init(pendingCount: Int, topItemTitle: String) {
            self.pendingCount = pendingCount
            self.topItemTitle = topItemTitle
        }
    }

    public var queueName: String

    public init(queueName: String) {
        self.queueName = queueName
    }
}
