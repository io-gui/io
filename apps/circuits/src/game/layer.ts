import { Line, type LineData } from './items/line.js'
import { Vector2 } from 'three/webgpu'

export type LayerData = Array<LineData>

export class Layer {
  private _width = 0
  private _height = 0
  private _stride = 0
  private _cells: (Line | undefined)[] = []
  private _lines: Line[] = []

  get lines() {
    return this._lines
  }

  constructor(width: number = 2, height: number = 2, data: LayerData = []) {
    this.clear(width, height)
    this.load(data)
  }

  clear(width: number, height: number) {
    this._width = width
    this._height = height
    this._stride = width
    this._cells = new Array(width * height)
    this._lines = []
  }

  load(data: LayerData = []) {
    this._lines = data.map((lineData) => Line.fromJSON(lineData))
    this._lines.forEach((line) => {
      line.pos.forEach((point) => {
        this._cells[this._index(point.x, point.y)] = line
      })
    })
  }

  getAt(x: number, y: number) {
    if (!this._inBounds(x, y)) return
    return this._cells[this._index(x, y)]
  }

  addAt(x: number, y: number) {
    if (!this._areIntegers(x, y)) return false
    if (!this._inBounds(x, y)) return false
    if (this.getAt(x, y)) {
      console.log('Line already exists', x, y)
      return false
    }
    const index = this._index(x, y)
    const line = new Line([new Vector2(x, y)])
    this._lines.push(line)
    this._cells[index] = line
    return true
  }
  extendAt(x: number, y: number) {
    if (!this._areIntegers(x, y)) return false
    if (!this._inBounds(x, y)) return false
    if (this.getAt(x, y)) {
      console.log('Line already exists', x, y)
      return false
    }
    const index = this._index(x, y)
    const line = this._lines[this._lines.length - 1]
    if (!line) {
      console.log('No line to extend', x, y)
      return false
    }
    if (line.isFinalized) {
      console.log('Line is already finalized', x, y)
      return false
    }
    line.pos.push(new Vector2(x, y))
    this._cells[index] = line
    return true
  }

  finalize() {
    this._lines.forEach((line) => {
      line.finalize()
    })
  }

  deleteAt(x: number, y: number) {
    if (!this._inBounds(x, y)) return false
    const index = this._index(x, y)
    const line = this._cells[index]
    if (!line) return false
    const lineIndex = this._lines.indexOf(line)
    if (lineIndex !== -1) this._lines.splice(lineIndex, 1)
    line.pos.forEach((point) => {
      this._cells[this._index(point.x, point.y)] = undefined
    })
    return true
  }

  toJSON(): LayerData {
    return this._lines.map((line) => line.toJSON())
  }

  static fromJSON(width: number, height: number, data: LayerData) {
    return new Layer(width, height, data)
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
      console.log('Line position must be integer', x, y)
      return false
    }
    return true
  }
}
