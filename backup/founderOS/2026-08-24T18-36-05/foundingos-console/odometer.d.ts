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
