import ActivityKit

// Shared between the main app target (which starts/updates/ends the Live Activity via
// ApprovalsWidgetBridgeModule) and the `widget` extension target (which renders it on the
// Lock Screen / Dynamic Island). This stays in a dependency-free pod so the widget does not
// need to link the React Native/Expo bridge just to render the ActivityKit type.
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
