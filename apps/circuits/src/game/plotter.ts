import { ReactiveNode, Register } from '@io-gui/core'
import { Vector2 } from 'three/webgpu'
import { COLORS } from './items/colors.js'
import { Line } from './items/line.js'
import { Pads } from './pads.js'
import { Layer } from './layer.js'

const SQRT_2 = Math.sqrt(2)

/**
 * Plotter — position and geometry only.
 * Intersection checks, adding/removing pads, terminals, and lines.
 * No color, propagation, or completion.
 */
@Register
export class Plotter extends ReactiveNode {
  width = 0
  height = 0
  pads: Pads = new Pads()
  layer0: Layer = new Layer()
  layer1: Layer = new Layer()

  declare private _activeLayer: Layer

  connect(pads: Pads, layer0: Layer, layer1: Layer) {
    this.pads = pads
    this.layer0 = layer0
    this.layer1 = layer1
  }

  finalizeLine(): boolean {
    const lastLine = this._activeLayer.lastLine
    if (!lastLine) return false
    if (lastLine.isFinalized)return false

    const connected = this.isLineCompleated(lastLine)
    if (!connected) this._activeLayer.delete(lastLine)
    else lastLine.finalize()
    return connected
  }

  private isLineCompleated(line: Line): boolean {
    const first = line.pos[0]
    const last = line.lastPt
    const p1 = this.pads.getAt(first.x, first.y)
    const p2 = this.pads.getAt(last.x, last.y)
    return Boolean(p1 && p2 && (first.x !== last.x || first.y !== last.y))
  }

  plotLineTo(point: Vector2, layer: number) {
    this._activeLayer = layer === 0 ? this.layer0 : this.layer1
    const lastLine = this._activeLayer.lastLine
    if (!lastLine) return false
    if (lastLine.isFinalized)return false

    if (lastLine.lastPt.distanceTo(point) > SQRT_2) {
      return false
    }
    return this.extendLineTo(point, layer)
  }

  startLineAt(point: Vector2, layer: number): boolean {
    this._activeLayer = layer === 0 ? this.layer0 : this.layer1

    const {x, y} = point

    // Lookup what's at target cell
    const padAtPoint = this.pads.getAt(x, y)
    const lineAtPointLayer0 = this.layer0.getAt(x, y)
    const lineAtPointLayer1 = this.layer1.getAt(x, y)

    if (!padAtPoint) return false

    const  lineCountAtPoint = (lineAtPointLayer1 ? 1 : 0) + (lineAtPointLayer0 ? 1 : 0)

    // Terminal pads accept 1 connection, normal pads accept 2, empty cells accept 0
    const connectionLimit = padAtPoint ? (padAtPoint.isTerminal ? 1 : 2) : 0

    if (lineCountAtPoint >= connectionLimit) return false

    return this._activeLayer.addAt(x, y, padAtPoint.renderColor)
  }

  extendLineTo(point: Vector2, layer: number): boolean {
    this._activeLayer = layer === 0 ? this.layer0 : this.layer1
    const line = this._activeLayer.lastLine
    if (!line) return false
    if (line.isFinalized) return false
    
    const {x, y} = point
    
    // Lookup what's at target cell
    const padAtPoint = this.pads.getAt(x, y)
    const lineAtPointLayer0 = this.layer0.getAt(x, y)
    const lineAtPointLayer1 = this.layer1.getAt(x, y)
    const lineAtPoint = layer === 0 ? lineAtPointLayer0 : lineAtPointLayer1
    
    const  lineCountAtPoint = (lineAtPointLayer1 ? 1 : 0) + (lineAtPointLayer0 ? 1 : 0)

    // Terminal pads accept 1 connection, normal pads accept 2, empty cells accept 0
    const connectionLimit = padAtPoint ? (padAtPoint.isTerminal ? 1 : 2) : 0

    // Reject if point is already at connection capacity
    if (padAtPoint && lineCountAtPoint >= connectionLimit) return false
    
    
    // Reject if diagonal would cross another diagonal on same layer
    const lastPoint = line.lastPt
    if (point.distanceTo(lastPoint) === SQRT_2) {
      if (this._activeLayer.hasDiagonalCrossing(x, y, lastPoint.x, lastPoint.y)) {
        console.log('diagonal crossing rejected')
        return false
      }
    }
    
    // Reject intersection with other line
    if (!padAtPoint) {
      if (lineAtPoint) {
        if (lineAtPoint !== line) {
          console.log('intersection rejected', this._activeLayer)
          return false
        } else {
          return this._activeLayer.extendAt(x, y)
        }
      } else {
        return this._activeLayer.extendAt(x, y)
      }
    }
    
    // Reached a pad/terminal: snap to it and end drag (color must be compatible)
    if (padAtPoint) {
      if (padAtPoint.renderColor !== COLORS.white && line.renderColor !== COLORS.white && padAtPoint.renderColor !== line.renderColor) {
        console.log('color mismatch rejected')
        return false
      }
      this.dispatch('line-end-drag', undefined, true)
      return this._activeLayer.extendAt(x, y)
    }

    return false
  }
}
