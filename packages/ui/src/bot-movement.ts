export type BotPosition = { x: number; y: number }
export function clampBotPosition(position: BotPosition, width: number, height: number, size = 64): BotPosition {
  return {
    x: Math.max(8, Math.min(position.x, Math.max(8, width - size - 8))),
    y: Math.max(8, Math.min(position.y, Math.max(8, height - size - 8))),
  }
}
export function clampBotSize(size: number, width: number, height: number) {
  return Math.round(Math.max(64, Math.min(size, 192, Math.max(64, width - 16), Math.max(64, height - 16))))
}
