# Evaluated inside `target 'widget' do ... end` by @bacons/apple-targets' Podfile extension
# hook (see with-pod-target-extension.js) — lets the widget extension import
# ApprovalsActivityAttributes from the same compiled module the main app uses to start/update
# the Live Activity, which ActivityKit requires (a structurally-identical duplicate type in a
# separate module does not interoperate).
pod 'ApprovalsWidgetBridge', :path => '../modules/approvals-widget-bridge/ios'
