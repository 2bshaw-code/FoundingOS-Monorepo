export type BotPosition = { x: number; y: number }
export function clampBotPosition(position: BotPosition, width: number, height: number): BotPosition {
  return {
    x: Math.max(8, Math.min(position.x, Math.max(8, width - 72))),
    y: Math.max(8, Math.min(position.y, Math.max(8, height - 72))),
  }
}
