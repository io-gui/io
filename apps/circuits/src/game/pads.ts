import { Pad, type PadData } from './items/pad.js'
import { type ColorName } from './items/colors.js'
import { Register, ReactiveNode } from '@io-gui/core'
import { DataTexture, NearestFilter, RGBAFormat, UnsignedByteType } from 'three'

export type PadsData = Record<string, PadData>

@Register
export class Pads extends ReactiveNode {
  private _width = 0
  private _height = 0
  private _stride = 0
  private _cells: (Pad | undefined)[] = []

  private _texture: DataTexture

  get texture() {
    return this._texture
  }

  constructor(width: number = 2, height: number = 2, data: PadsData = {}) {
    super()
    this.clear(width, height)
    this.load(data)

    this._texture = this._createTexture(new Uint8Array(width * height * 4), width, height)
  }

  private _createTexture(data: Uint8Array, width: number, height: number) {
    const texture = new DataTexture(data, width, height, RGBAFormat, UnsignedByteType)
    texture.magFilter = NearestFilter
    texture.minFilter = NearestFilter
    texture.generateMipmaps = false
    texture.needsUpdate = true
    return texture
  }

  updateTexture(width: number, height: number) {

    let data = this._texture.image!.data!
    const textureSize = width * height * 4
    if (this._texture.image!.data!.length !== textureSize) {
      this._texture.dispose()
      this._texture = this._createTexture(new Uint8Array(textureSize), width, height)
    }

    data = this._texture.image!.data!
    data.fill(0)

    this.forEach((pad, x, y) => {
      if (x < 0 || x >= width || y < 0 || y >= height) return
      const color = pad.renderColor
      const index = (x + y * width) * 4
      data[index] = Math.max(0, Math.min(255, Math.round(color.r * 255)))
      data[index + 1] = Math.max(0, Math.min(255, Math.round(color.g * 255)))
      data[index + 2] = Math.max(0, Math.min(255, Math.round(color.b * 255)))
      data[index + 3] = pad.isTerminal ? 255 : 0
    })

    this._texture.needsUpdate = true
  }

  clear(width: number, height: number) {
    this._width = width
    this._height = height
    this._stride = width
    this._cells = new Array(width * height)
    this.dispatch('game-update', undefined, true)
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
      this.addAt(x, y, item.color)
    }
    this.dispatch('game-update', undefined, true)
  }

  forEach(callback: (pad: Pad, x: number, y: number) => void) {
    for (let y = 0; y < this._height; y++) {
      for (let x = 0; x < this._width; x++) {
        const pad = this._cells[this._index(x, y)]
        if (pad) callback(pad, x, y)
      }
    }
  }

  getAt(x: number, y: number) {
    if (!this._inBounds(x, y)) return undefined
    return this._cells[this._index(x, y)]
  }

  addAt(x: number, y: number, color?: ColorName) {
    if (!this._areIntegers(x, y)) return false
    if (!this._inBounds(x, y)) return false
    const index = this._index(x, y)
    if (this._cells[index]) {
      console.log('Pad already exists', x, y)
      return false
    }
    this._cells[index] = new Pad(color)
    this.dispatch('game-update', undefined, true)
    return true
  }

  deleteAt(x: number, y: number) {
    if (!this._inBounds(x, y)) return false
    const index = this._index(x, y)
    if (!this._cells[index]) return false
    this._cells[index] = undefined
    this.dispatch('game-update', undefined, true)
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
    const inBounds = x >= 0 && x < this._width && y >= 0 && y < this._height
    if (!inBounds) console.log('Pad out of bounds', x, y)
    return inBounds
  }

  private _areIntegers(x: number, y: number) {
    if (!Number.isInteger(x) || !Number.isInteger(y)) {
      console.log('Pad position must be integer', x, y)
      return false
    }
    return true
  }
}
