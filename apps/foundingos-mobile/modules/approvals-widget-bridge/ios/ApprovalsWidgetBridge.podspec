Pod::Spec.new do |s|
  s.name           = 'ApprovalsWidgetBridge'
  s.version        = '1.0.0'
  s.summary        = 'Bridges the FoundingOS approvals queue to iOS Live Activities and the home screen widget'
  s.description    = 'Starts/updates/ends an ActivityKit Live Activity and writes shared App Group state for the ApprovalsWidget home screen widget.'
  s.author         = ''
  s.homepage       = 'https://docs.expo.dev/modules/'
  s.platforms      = {
    :ios => '16.4',
    :tvos => '16.4'
  }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  # Swift/Objective-C compatibility
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
