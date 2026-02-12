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
  private _stride = 0
  private _cells: (Line | undefined)[] = []
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
    this._stride = width
    this._cells = new Array(width * height)
    this._lines = []
    this.dispatch('game-update', undefined, true)
  }

  load(width: number, height: number, data: LayerData = []) {
    this._width = width
    this._height = height
    this._stride = width
    this._cells = new Array(width * height)
    this._lines = []
    this._lines = data.map((lineData) => Line.fromJSON(lineData))
    this._lines.forEach((line) => {
      line.pos.forEach((point) => {
        this._cells[this.getIndex(point.x, point.y)] = line
      })
    })
    this.dispatch('game-update', undefined, true)
  }

  forEach(callback: (line: Line) => void) {
    this._lines.forEach((line) => { callback(line) })
  }

  getAt(x: number, y: number) {
    if (!this.inBounds(x, y)) return
    return this._cells[this.getIndex(x, y)]
  }

  addAt(x: number, y: number, renderColor: Color = COLORS.white) {
    if (!this._areIntegers(x, y)) return false
    if (!this.inBounds(x, y)) return false
    if (this.getAt(x, y)) {
      console.log('Line already exists', x, y)
      return false
    }
    const index = this.getIndex(x, y)
    const line = new Line([new Vector2(x, y)], false, renderColor)
    this._lines.push(line)
    this._cells[index] = line
    this.dispatch('game-update', undefined, true)
    return true
  }
  extendAt(x: number, y: number) {
    if (!this._areIntegers(x, y)) return false
    if (!this.inBounds(x, y)) return false

    const index = this.getIndex(x, y)
    const line = this._lines[this._lines.length - 1]
    if (!line) {
      console.log('No line to extend', x, y)
      return false
    }
    if (line.isFinalized) {
      console.log('Line is already finalized', x, y)
      return false
    }
    line.plotSegment(new Vector2(x, y))
    this._cells[index] = line
    this.dispatch('game-update', undefined, true)
    return true
  }

  deleteAt(x: number, y: number) {
    if (!this.inBounds(x, y)) return false
    const index = this.getIndex(x, y)
    const line = this._cells[index]
    if (!line) return false
    const lineIndex = this._lines.indexOf(line)
    if (lineIndex !== -1) this._lines.splice(lineIndex, 1)
    line.pos.forEach((point) => {
      this._cells[this.getIndex(point.x, point.y)] = undefined
    })
    this.dispatch('game-update', undefined, true)
    return true
  }

  delete(index: number) {
    const line = this._lines[index]
    if (!line) return false
    const lineIndex = this._lines.indexOf(line)
    if (lineIndex !== -1) this._lines.splice(lineIndex, 1)
    line.pos.forEach((point) => {
      this._cells[this.getIndex(point.x, point.y)] = undefined
    })
    this.dispatch('game-update', undefined, true)
  }

  toJSON(): LayerData {
    return this._lines.map((line) => line.toJSON())
  }

  static fromJSON(width: number, height: number, data: LayerData) {
    return new Layer(width, height, data)
  }

  getIndex(x: number, y: number) {
    return x + y * this._stride
  }

  inBounds(x: number, y: number) {
    const inBounds = x >= 0 && x < this._width && y >= 0 && y < this._height
    if (!inBounds) console.log('Pad out of bounds', x, y)
    return inBounds
  }

  private _areIntegers(x: number, y: number) {
    if (!Number.isInteger(x) || !Number.isInteger(y)) {
      console.log('Line position must be integer', x, y)
      return false
    }
    return true
  }
}
