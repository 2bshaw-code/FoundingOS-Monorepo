# Evaluated inside `target 'widget' do ... end` by @bacons/apple-targets' Podfile extension.
# This pure Swift module shares the exact ActivityKit type without pulling the Expo bridge
# (and its React Native dependencies) into the widget target.
pod 'ApprovalsActivityAttributes', :path => '../modules/approvals-widget-bridge/ios'
