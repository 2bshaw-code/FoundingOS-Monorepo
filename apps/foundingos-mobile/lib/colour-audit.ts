/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
const HEX_COLOR = /^#([0-9a-f]{6})$/i

function luminance(hexColor: string) {
  const match = HEX_COLOR.exec(hexColor)
  if (!match) return null

  const value = match[1]
  const channels = [value.slice(0, 2), value.slice(2, 4), value.slice(4, 6)].map((channel) => {
    const normalized = parseInt(channel, 16) / 255
    return normalized <= 0.03928 ? normalized / 12.92 : Math.pow((normalized + 0.055) / 1.055, 2.4)
  })

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}

export function contrastRatio(foreground: string, background: string) {
  const foregroundLuminance = luminance(foreground)
  const backgroundLuminance = luminance(background)
  if (foregroundLuminance === null || backgroundLuminance === null) return null

  return (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) / (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
}

export function ensureReadableText(textColor: string, backgroundColor: string, fallbackTextColor: string) {
  const ratio = contrastRatio(textColor, backgroundColor)
  if (ratio === null || ratio >= 4.5) return textColor
  return fallbackTextColor
}
