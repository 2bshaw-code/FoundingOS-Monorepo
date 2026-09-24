Pod::Spec.new do |s|
  s.name             = 'ApprovalsActivityAttributes'
  s.version          = '1.0.0'
  s.summary          = 'Shared ActivityKit attributes for FoundingOS approvals.'
  s.description      = 'A dependency-free Swift module shared by the FoundingOS app and widget extension.'
  s.author           = ''
  s.homepage         = 'https://docs.expo.dev/modules/'
  s.platforms        = { :ios => '16.4' }
  s.source           = { git: '' }
  s.static_framework = true

  s.source_files = "activity-attributes/**/*.swift"
end
