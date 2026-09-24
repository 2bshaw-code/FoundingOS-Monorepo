import WidgetKit
import SwiftUI

// Home screen widget showing the live Approvals queue (pending count + the oldest/top item).
// Data is written from the running React Native app via `@bacons/apple-targets`'s
// ExtensionStorage (see lib/live-approvals-widget.ts), which is the only bridge between the
// JS side and this extension — this file never runs JS and has no other data source.
private let appGroup = "group.com.foundingos.quantum"
private let countKey = "approvalsPendingCount"
private let titleKey = "approvalsTopItemTitle"

struct ApprovalsEntry: TimelineEntry {
    let date: Date
    let pendingCount: Int
    let topItemTitle: String?
}

struct ApprovalsProvider: TimelineProvider {
    func placeholder(in context: Context) -> ApprovalsEntry {
        ApprovalsEntry(date: Date(), pendingCount: 2, topItemTitle: "Bright Harbor Co invoice")
    }

    func getSnapshot(in context: Context, completion: @escaping (ApprovalsEntry) -> Void) {
        completion(readEntry())
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<ApprovalsEntry>) -> Void) {
        // No fixed schedule — the app calls ExtensionStorage.reloadWidget() every time the
        // approvals queue changes, so a single-entry timeline (refreshed on-demand) is correct.
        completion(Timeline(entries: [readEntry()], policy: .never))
    }

    private func readEntry() -> ApprovalsEntry {
        let defaults = UserDefaults(suiteName: appGroup)
        let count = defaults?.integer(forKey: countKey) ?? 0
        let title = defaults?.string(forKey: titleKey)
        return ApprovalsEntry(date: Date(), pendingCount: count, topItemTitle: title)
    }
}

struct ApprovalsWidgetEntryView: View {
    var entry: ApprovalsEntry

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text("APPROVALS")
                .font(.system(size: 11, weight: .bold))
                .foregroundStyle(.secondary)

            Text("\(entry.pendingCount)")
                .font(.system(size: 32, weight: .bold, design: .rounded))
                .foregroundStyle(entry.pendingCount > 0 ? Color(red: 0.30, green: 0.79, blue: 1.0) : .primary)

            Text(entry.pendingCount == 0 ? "All caught up" : (entry.topItemTitle ?? "Needs your attention"))
                .font(.system(size: 13, weight: .medium))
                .foregroundStyle(.secondary)
                .lineLimit(2)
        }
        .padding(16)
        .widgetURL(URL(string: "foundingos://approvals"))
        .containerBackground(Color(red: 0.02, green: 0.024, blue: 0.04), for: .widget)
    }
}

struct ApprovalsWidget: Widget {
    let kind: String = "widget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: ApprovalsProvider()) { entry in
            ApprovalsWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Approvals")
        .description("See how many approvals are waiting without opening the app.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}
