import { Pad, type PadData } from './items/pad.js'
import { type ColorName } from './items/colors.js'

export type PadsData = Record<string, PadData>

export class Pads {
  private _width = 0
  private _height = 0
  private _stride = 0
  private _cells: (Pad | undefined)[] = []

  constructor(width: number, height: number, data: PadsData = {}) {
    this.clear(width, height)
    this.load(data)
  }

  clear(width: number, height: number) {
    this._width = width
    this._height = height
    this._stride = width + 1
    this._cells = new Array((width + 1) * (height + 1))
  }

  load(data: PadsData = {}) {
    for (const key in data) {
      const index = Number.parseInt(key, 10)
      if (!Number.isFinite(index)) {
        debug: console.error('Invalid pad index key', key)
        continue
      }
      const y = Math.floor(index / this._stride)
      const x = index - y * this._stride
      const item = data[key]
      this.addAt(x, y, item.color, item.isTerminal)
    }
  }

  forEach(callback: (pad: Pad, x: number, y: number) => void) {
    for (let y = 0; y <= this._height; y++) {
      for (let x = 0; x <= this._width; x++) {
        const pad = this._cells[this._index(x, y)]
        if (pad) callback(pad, x, y)
      }
    }
  }

  getAt(x: number, y: number) {
    if (!this._inBounds(x, y)) return undefined
    return this._cells[this._index(x, y)]
  }

  addAt(x: number, y: number, color?: ColorName, isTerminal: boolean = false) {
    debug: {
      if (!Number.isInteger(x) || !Number.isInteger(y)) {
        console.error('Pad position must be integer', x, y)
      }
      if (!this._inBounds(x, y)) {
        console.error('Pad out of bounds', x, y)
      }
    }
    if (!this._inBounds(x, y)) return false
    const index = this._index(x, y)
    if (this._cells[index]) return false
    const pad = new Pad(isTerminal, color)
    this._cells[index] = pad
    return true
  }

  deleteAt(x: number, y: number) {
    if (!this._inBounds(x, y)) return false
    const index = this._index(x, y)
    const pad = this._cells[index]
    if (!pad) return false
    this._cells[index] = undefined
    return true
  }

  toJSON(): PadsData {
    const data: PadsData = {}
    this.forEach((pad, x, y) => {
      const key = String(this._index(x, y))
      data[key] = pad.toJSON()
    })
    return data
  }

  static fromJSON(width: number, height: number, data: PadsData) {
    return new Pads(width, height, data)
  }

  private _index(x: number, y: number) {
    return x + y * this._stride
  }

  private _inBounds(x: number, y: number) {
    return x >= 0 && x <= this._width && y >= 0 && y <= this._height
  }
}
