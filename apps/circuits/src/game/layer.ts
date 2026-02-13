import { Register, ReactiveNode } from '@io-gui/core'
import { Color } from 'three/webgpu'
import { Line, type LineData } from './items/line.js'
import { Vector2 } from 'three/webgpu'
import { COLORS } from './items/colors.js'

export type LayerData = Array<LineData>

@Register
export class Layer extends ReactiveNode {
  private _width = 0
  private _height = 0
  private _lines: Line[] = []

  get lines() {
    return this._lines
  }

  get lastLine() {
    return this._lines[this._lines.length - 1]
  }

  constructor(width: number = 2, height: number = 2, data: LayerData = []) {
    super()
    this.load(width, height, data)
  }

  clear(width: number, height: number) {
    this._width = width
    this._height = height
    this._lines = []
    this.dispatch('game-update', undefined, true)
  }

  load(width: number, height: number, data: LayerData = []) {
    this._width = width
    this._height = height
    this._lines = data.map((lineData) => Line.fromJSON(lineData))
    this.dispatch('game-update', undefined, true)
  }

  forEach(callback: (line: Line) => void) {
    this._lines.forEach((line) => { callback(line) })
  }

  getLinesAt(x: number, y: number): Line[] {
    if (!this.inBounds(x, y)) return []
    return this._lines.filter((line) => line.pos.some((point) => point.x === x && point.y === y))
  }

  addAt(x: number, y: number, renderColor: Color = COLORS.white) {
    if (!this._areIntegers(x, y)) return false
    if (!this.inBounds(x, y)) return false
    const line = new Line([new Vector2(x, y)], false, renderColor)
    this._lines.push(line)
    this.dispatch('game-update', undefined, true)
    return true
  }
  extendAt(x: number, y: number) {
    if (!this._areIntegers(x, y)) return false
    if (!this.inBounds(x, y)) return false

    const line = this.lastLine
    if (!line) {
      console.log('No line to extend', x, y)
      return false
    }
    if (line.isFinalized) {
      console.log('Line is already finalized', x, y)
      return false
    }
    const added = line.addSegment(new Vector2(x, y))
    if (!added) return false
    this.dispatch('game-update', undefined, true)
    return added
  }

  deleteAt(x: number, y: number) {
    if (!this.inBounds(x, y)) return false
    const lines = this.getLinesAt(x, y)
    if (lines.length === 0) return false
    for (const line of lines) {
      this.delete(line)
    }
    this.dispatch('game-update', undefined, true)
    return true
  }

  delete(line: Line) {
    const index = this._lines.indexOf(line)
    if (index !== -1) this._lines.splice(index, 1)
    this.dispatch('game-update', undefined, true)
    return true
  }

  toJSON(): LayerData {
    return this._lines.map((line) => line.toJSON())
  }

  static fromJSON(width: number, height: number, data: LayerData) {
    return new Layer(width, height, data)
  }

  inBounds(x: number, y: number) {
    const inBounds = x >= 0 && x < this._width && y >= 0 && y < this._height
    if (!inBounds) console.log('Pad out of bounds', x, y)
    return inBounds
  }

  hasDiagonalCrossing(x1: number, y1: number, x2: number, y2: number): boolean {
    for (const line of this._lines) {
      if (line.hasSegmentAt(new Vector2(x1, y2), new Vector2(x2, y1))) {
        return true
      }
    }
    return false
  }

  private _areIntegers(x: number, y: number) {
    if (!Number.isInteger(x) || !Number.isInteger(y)) {
      console.log('Line position must be integer', x, y)
      return false
    }
    return true
  }
}
