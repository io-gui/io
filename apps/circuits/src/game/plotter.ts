import { ReactiveNode, Register } from '@io-gui/core'
import { Vector2 } from 'three/webgpu'
import { COLORS } from './items/colors.js'
import { Line } from './items/line.js'
import { Pads } from './pads.js'
import { Layer } from './layer.js'

const SQRT_2 = Math.sqrt(2)
const _vec2_1 = new Vector2()
const _vec2_2 = new Vector2()

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
  declare activeLayer: Layer

  get lines(): Line[] {
    return [...this.layer0.lines, ...this.layer1.lines]
  }

  connect(pads: Pads, layer0: Layer, layer1: Layer, width: number, height: number) {
    this.width = width
    this.height = height
    this.pads = pads
    this.layer0 = layer0
    this.layer1 = layer1
  }

  getLinesAtPoint(point: Vector2): Line[] {
    const line0 = this.layer0.getAt(point.x, point.y)
    const line1 = this.layer1.getAt(point.x, point.y)
    return [line0, line1].filter((line) => line !== undefined)
  }

  checkDiagonalCrossing(point: Vector2, lastPoint: Vector2): boolean {
    for (const other of this.activeLayer.lines) {
      if (
        other.hasSegmentAt(new Vector2(point.x, lastPoint.y)) &&
        other.hasSegmentAt(new Vector2(lastPoint.x, point.y))
      ) return false
    }
    return true
  }

  finalizeLine(): boolean {
    const lastLine = this.activeLayer.lastLine
    if (!lastLine) return false
    const connected = this.isLineConnected(lastLine)
    if (!connected) {
      this.activeLayer.delete(this.activeLayer.lines.length - 1)
    }
    else lastLine.finalize()
    return connected
  }

  private isLineConnected(line: Line): boolean {
    const first = line.pos[0]
    const last = line.lastPt
    const p1 = this.pads.getAt(first.x, first.y)
    const p2 = this.pads.getAt(last.x, last.y)
    return Boolean(p1 && p2 && (first.x !== last.x || first.y !== last.y))
  }

  addLineSegment(point: Vector2, layer: number): { added: boolean; endDrag: boolean } {
    this.activeLayer = layer === 0 ? this.layer0 : this.layer1
   
    if (!this.activeLayer.inBounds(point.x, point.y)) return { added: false, endDrag: false }
    
    const x = point.x
    const y = point.y
    const activeLines = layer === 0 ? this.layer0.lines : this.layer1.lines
    
    // Lookup what's at target cell
    const padAtPoint = this.pads.getAt(point.x, point.y)
    const lineAtPointLayer0 = this.layer0.getAt(x, y)
    const lineAtPointLayer1 = this.layer1.getAt(x, y)
    const lineAtPoint = layer === 0 ? lineAtPointLayer0 : lineAtPointLayer1
    
    let lineCountAtPoint = 0;
    if (lineAtPointLayer1) lineCountAtPoint++
    if (lineAtPointLayer0) lineCountAtPoint++

    // Terminal pads accept 1 connection, normal pads accept 2, empty cells accept 0
    const connectionLimit = padAtPoint ? (padAtPoint.isTerminal ? 1 : 2) : 0

    let added = false
    let endDrag = false

    // Reject if point is already at connection capacity
    if (padAtPoint && lineCountAtPoint >= connectionLimit) {
      return { added, endDrag }
    }

    const lastLine = activeLines[activeLines.length - 1]
    const line = lastLine && !lastLine.isFinalized ? lastLine : undefined

    if (line) {
      // Extending existing line

      // Reject if diagonal would cross another diagonal on same layer
      const lastPoint = line.lastPt
      if (point.distanceTo(lastPoint) === SQRT_2) {
        if (!this.checkDiagonalCrossing(point, lastPoint)) {
          return { added, endDrag }
        }
      }

      // Reject intersection with other line
      if (!padAtPoint) {
        if (lineAtPoint) {
          if (lineAtPoint !== line) {
            added = false
          } else {
            added = this.activeLayer.extendAt(x, y)
          }
        } else {
          added = this.activeLayer.extendAt(x, y)
        }
      }

      // Reached a pad/terminal: snap to it and end drag (color must be compatible)
      if (padAtPoint) {
        if (padAtPoint.renderColor !== COLORS.white && line.renderColor !== COLORS.white && padAtPoint.renderColor !== line.renderColor) {
          return { added: false, endDrag: false }
        }
        added = this.activeLayer.extendAt(x, y)
        endDrag = true
      }

    } else {

      
      // Starting new line: must begin on a pad
      if (!padAtPoint) return { added: false, endDrag: false }
      added = this.activeLayer.addAt(x, y, padAtPoint.renderColor)

    }

    if (endDrag) {
      this.dispatch('line-end-drag', undefined, true)
    }

    this.dispatch('game-update', undefined, true)
    return { added, endDrag }
  }
}
