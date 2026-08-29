/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
declare module 'odometer' {
  export default class Odometer {
    constructor(options: {
      el: HTMLElement
      value?: number
      format?: string
      formatFunction?: (value: number) => string
      theme?: string
      duration?: number
      animation?: string
    })

    update(value: number): void
  }
}
