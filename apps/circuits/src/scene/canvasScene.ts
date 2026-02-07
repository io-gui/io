import { Pad } from '../game/items/pad.js'
import {
  Terminal,
  type TerminalColor,
  TERMINAL_COLORS as COLORS,
} from '../game/items/terminal.js'
import { Line } from '../game/items/line.js'

/**
 * Scene — single HTML5 canvas; renders grid and game state in draw order.
 *
 * Draw order (bottom -> top):
 *   grid background + grid lines
 *   line.layer -1 (underlines)
 *   line.layer 0 + pads + terminals
 *   touch marker (when active)
 */

export class CanvasScene {
  canvas: HTMLCanvasElement | null = null
  ctx: CanvasRenderingContext2D | null = null
  canvasWidth = 0
  canvasHeight = 0
  gridWidth = 0
  gridHeight = 0
  gridUnit = 0
  gridOffsetX = 0
  gridOffsetY = 0
  markerRadius = 0

  init(canvas: HTMLCanvasElement): void {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
  }

  /** Recalculate grid geometry and size the canvas. */
  initGrid(
    gameWidth: number,
    gameHeight: number,
    containerWidth: number,
    containerHeight: number,
  ): void {
    this.canvasWidth = containerWidth
    this.canvasHeight = containerHeight
    const dpr = window.devicePixelRatio || 1

    if (this.canvas) {
      this.canvas.width = this.canvasWidth * dpr
      this.canvas.height = this.canvasHeight * dpr
      this.canvas.style.width = this.canvasWidth + 'px'
      this.canvas.style.height = this.canvasHeight + 'px'
      this.ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    this.gridWidth = gameWidth
    this.gridHeight = gameHeight

    if (
      this.canvasHeight / this.gridHeight >
      this.canvasWidth / this.gridWidth
    ) {
      this.gridUnit = this.canvasWidth / (this.gridWidth + 1)
    } else {
      this.gridUnit = this.canvasHeight / (this.gridHeight + 1)
    }

    this.gridOffsetX = (this.canvasWidth - this.gridUnit * this.gridWidth) / 2
    this.gridOffsetY =
      (this.canvasHeight - this.gridUnit * this.gridHeight) / 2

    this.markerRadius = this.canvasWidth * 0.1
  }

  private _drawGrid(): void {
    const ctx = this.ctx
    if (!ctx) return

    ctx.fillStyle = 'rgba(255,255,255,0.2)'
    ctx.fillRect(
      this.gridOffsetX,
      this.gridOffsetY,
      this.gridWidth * this.gridUnit,
      this.gridHeight * this.gridUnit,
    )

    ctx.strokeStyle = 'rgba(255,255,255,0.5)'
    ctx.lineWidth = 1

    for (let i = 0; i <= this.gridWidth; i++) {
      const x = i * this.gridUnit + this.gridOffsetX
      ctx.beginPath()
      ctx.moveTo(x, this.gridOffsetY)
      ctx.lineTo(x, this.gridHeight * this.gridUnit + this.gridOffsetY)
      ctx.stroke()
    }

    for (let j = 0; j <= this.gridHeight; j++) {
      const y = j * this.gridUnit + this.gridOffsetY
      ctx.beginPath()
      ctx.moveTo(this.gridOffsetX, y)
      ctx.lineTo(this.gridWidth * this.gridUnit + this.gridOffsetX, y)
      ctx.stroke()
    }
  }

  // -- Rendering --

  /** Full re-render: grid, then lines (layer -1, then 0), pads, terminals. */
  render(pads: Pad[], terminals: Terminal[], lines: Line[]): void {
    const ctx = this.ctx
    if (!ctx) return

    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
    this._drawGrid()

    for (const line of lines) this._drawLineStroke(line)
    for (const pad of pads) this._drawPadStroke(pad)
    for (const term of terminals) this._drawTerminalStroke(term)

    for (const line of lines) this._drawLineFill(line, line._color)
    for (const pad of pads) this._drawPadFill(pad, pad._color)
    for (const term of terminals) this._drawTerminalFill(term, term.color)
  }

  // -- Line drawing helpers --

  private _lineParams(line: Line) {
    const isBottom = line.layer === -1
    let radius = this.gridUnit / 4
    let strokeW = 3
    let strokeColor = 'rgba(0,0,0,1)'
    let opacity = 1

    if (isBottom) {
      radius *= 1.4
      strokeW *= 4
      strokeColor = 'rgba(128,128,128,0.25)'
      opacity = 0.25
    }

    return {
      radius,
      strokeW,
      strokeColor,
      opacity,
    }
  }

  private _buildLinePath(
    ctx: CanvasRenderingContext2D,
    positions: [number, number][],
  ): void {
    ctx.beginPath()
    for (let i = 0; i < positions.length; i++) {
      const x = positions[i][0] * this.gridUnit + this.gridOffsetX
      const y = positions[i][1] * this.gridUnit + this.gridOffsetY
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
  }

  private _drawLineStroke(line: Line): void {
    if (line.pos.length < 2 || !this.ctx) return
    const p = this._lineParams(line)
    this.ctx.save()
    this.ctx.globalAlpha = p.opacity
    this.ctx.lineCap = 'round'
    this.ctx.lineJoin = 'round'
    this._buildLinePath(this.ctx, line.pos)
    this.ctx.strokeStyle = p.strokeColor
    this.ctx.lineWidth = p.radius + p.strokeW * 2
    this.ctx.stroke()
    this.ctx.restore()
  }

  private _drawLineFill(line: Line, color: TerminalColor): void {
    if (line.pos.length < 2 || !this.ctx) return
    const p = this._lineParams(line)
    this.ctx.save()
    this.ctx.globalAlpha = p.opacity
    this.ctx.lineCap = 'round'
    this.ctx.lineJoin = 'round'
    this._buildLinePath(this.ctx, line.pos)
    this.ctx.strokeStyle = COLORS[color] ?? '#fff'
    this.ctx.lineWidth = p.radius
    this.ctx.stroke()
    this.ctx.restore()
  }

  // -- Pad drawing helpers (pads are always white circles) --

  private _drawPadStroke(pad: Pad): void {
    if (!this.ctx) return
    const ctx = this.ctx
    const xx = pad.pos[0] * this.gridUnit + this.gridOffsetX
    const yy = pad.pos[1] * this.gridUnit + this.gridOffsetY
    const r = this.gridUnit / 3
    const sw = 3
    ctx.beginPath()
    ctx.arc(xx, yy, r + sw, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(0,0,0,1)'
    ctx.fill()
  }

  private _drawPadFill(pad: Pad, color: TerminalColor): void {
    if (!this.ctx) return
    const ctx = this.ctx
    const xx = pad.pos[0] * this.gridUnit + this.gridOffsetX
    const yy = pad.pos[1] * this.gridUnit + this.gridOffsetY
    const r = this.gridUnit / 3
    ctx.beginPath()
    ctx.arc(xx, yy, r, 0, Math.PI * 2)
    ctx.fillStyle = COLORS[color] ?? '#fff'
    ctx.fill()
  }

  // -- Terminal drawing helpers (terminals are colored squares) --

  private _drawTerminalStroke(terminal: Terminal): void {
    if (!this.ctx) return
    const ctx = this.ctx
    const xx = terminal.pos[0] * this.gridUnit + this.gridOffsetX
    const yy = terminal.pos[1] * this.gridUnit + this.gridOffsetY
    const r = this.gridUnit / 3
    const sw = 3
    ctx.fillStyle = 'rgba(0,0,0,1)'
    ctx.fillRect(xx - r - sw, yy - r - sw, (r + sw) * 2, (r + sw) * 2)
  }

  private _drawTerminalFill(terminal: Terminal, color: TerminalColor): void {
    if (!this.ctx) return
    const ctx = this.ctx
    const xx = terminal.pos[0] * this.gridUnit + this.gridOffsetX
    const yy = terminal.pos[1] * this.gridUnit + this.gridOffsetY
    const r = this.gridUnit / 3
    ctx.fillStyle = COLORS[color] ?? '#fff'
    ctx.fillRect(xx - r, yy - r, r * 2, r * 2)
  }

}