export class Color {
  r: number
  g: number
  b: number
  a: number
  constructor(r: number, g: number, b: number, a: number = 1) {
    this.r = r
    this.g = g
    this.b = b
    this.a = a
  }
  toCss() {
    const r = Math.floor(this.r * 255)
    const g = Math.floor(this.g * 255)
    const b = Math.floor(this.b * 255)
    return `rgba(${r}, ${g}, ${b}, ${this.a})`
  }
}