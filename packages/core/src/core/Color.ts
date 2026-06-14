/**
 * RGBA color with normalized 0–1 channels. Wire format: packed hex via {@link toJSON}/{@link toHex}; CSS via {@link toCss}.
 */
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
  applyJSON(hex: number): Color {
    const u = hex >>> 0
    if (u <= 0xffffff) {
        this.r = ((u >> 16) & 255) / 255
        this.g = ((u >> 8) & 255) / 255
        this.b = (u & 255) / 255
        this.a = 1
        return this
    }
    this.r = ((u >> 16) & 255) / 255
    this.g = ((u >> 8) & 255) / 255
    this.b = (u & 255) / 255
    this.a = ((u >> 24) & 255) / 255
    return this
  }
  toHex(): number {
    const r = Math.round(this.r * 255)
    const g = Math.round(this.g * 255)
    const b = Math.round(this.b * 255)
    const a = Math.round(this.a * 255)
    return ((a << 24) | (r << 16) | (g << 8) | b) >>> 0
  }
  static toHex(r: number, g: number, b: number, a: number = 1): number {
    r = Math.round(r * 255)
    g = Math.round(g * 255)
    b = Math.round(b * 255)
    a = Math.round(a * 255)
    return ((a << 24) | (r << 16) | (g << 8) | b) >>> 0
  }
  toJSON(): number {
    return this.toHex()
  }
  toCss() {
    const r = Math.floor(this.r * 255)
    const g = Math.floor(this.g * 255)
    const b = Math.floor(this.b * 255)
    return `rgba(${r}, ${g}, ${b}, ${this.a})`
  }
}
