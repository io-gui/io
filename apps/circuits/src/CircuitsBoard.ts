import {
  IoElement,
  Register,
  ReactiveProperty,
  IoElementProps,
  canvas,
} from '@io-gui/core'
import { Game } from './game/game.js'
import { Pad } from './game/items/pad.js'
import {
  Terminal,
  type TerminalColor,
  TERMINAL_COLORS as COLORS,
} from './game/items/terminal.js'
import { Line } from './game/items/line.js'

/**
 * Scene — manages layered HTML5 canvases and renders the game state.
 *
 * Layer stack (bottom -> top):
 *   grid   – static grid lines (redrawn on initGrid)
 *   layer0 – line.layer -1 (bottom, underlines)
 *   layer1 – line.layer 0 (top) + pads + terminals
 *   top    – touch marker overlay
 */

interface CanvasLayer {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
}

export class Scene {
  layers: Record<string, CanvasLayer> = {}
  canvasWidth = 0
  canvasHeight = 0
  gridWidth = 0
  gridHeight = 0
  gridUnit = 0
  gridOffsetX = 0
  gridOffsetY = 0
  markerRadius = 0

  /** Set up layers from externally provided canvases. */
  init(canvases: Record<string, HTMLCanvasElement>): void {
    this.layers = {}
    for (const name in canvases) {
      const canvas = canvases[name]
      const ctx = canvas.getContext('2d')!
      this.layers[name] = { canvas, ctx }
    }
  }

  /** Recalculate grid geometry and draw the static grid. */
  initGrid(
    gameWidth: number,
    gameHeight: number,
    containerWidth: number,
    containerHeight: number,
  ): void {
    this.canvasWidth = containerWidth
    this.canvasHeight = containerHeight
    const dpr = window.devicePixelRatio || 1

    for (const name in this.layers) {
      const { canvas } = this.layers[name]
      canvas.width = this.canvasWidth * dpr
      canvas.height = this.canvasHeight * dpr
      canvas.style.width = this.canvasWidth + 'px'
      canvas.style.height = this.canvasHeight + 'px'
      this.layers[name].ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    this.gridWidth = gameWidth
    this.gridHeight = gameHeight

    // Calculate unit size so the grid fits with a half-unit margin
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

    // --- Draw static grid ---
    const ctx = this.layers.grid.ctx
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)

    ctx.fillStyle = 'rgba(255,255,255,0.2)'
    ctx.fillRect(
      this.gridOffsetX,
      this.gridOffsetY,
      this.gridWidth * this.gridUnit,
      this.gridHeight * this.gridUnit,
    )

    ctx.strokeStyle = 'rgba(255,255,255,0.5)'
    ctx.lineWidth = 1

    for (let i = 0; i <= gameWidth; i++) {
      const x = i * this.gridUnit + this.gridOffsetX
      ctx.beginPath()
      ctx.moveTo(x, this.gridOffsetY)
      ctx.lineTo(x, this.gridHeight * this.gridUnit + this.gridOffsetY)
      ctx.stroke()
    }

    for (let j = 0; j <= gameHeight; j++) {
      const y = j * this.gridUnit + this.gridOffsetY
      ctx.beginPath()
      ctx.moveTo(this.gridOffsetX, y)
      ctx.lineTo(this.gridWidth * this.gridUnit + this.gridOffsetX, y)
      ctx.stroke()
    }

    this.markerRadius = this.canvasWidth * 0.1
  }

  // -- Rendering --

  /** Full re-render of lines, pads and terminals on the dynamic layers. */
  render(pads: Pad[], terminals: Terminal[], lines: Line[]): void {
    const ctx0 = this.layers.layer0?.ctx
    const ctx1 = this.layers.layer1?.ctx
    if (!ctx0 || !ctx1) return

    ctx0.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
    ctx1.clearRect(0, 0, this.canvasWidth, this.canvasHeight)

    for (const line of lines) this._drawLineStroke(line)
    for (const pad of pads) this._drawPadStroke(pad)
    for (const term of terminals) this._drawTerminalStroke(term)

    for (const line of lines) {
      this._drawLineFill(line, line._color)
    }
    for (const pad of pads)
      this._drawPadFill(pad, pad._color)
    for (const term of terminals)
      this._drawTerminalFill(term, term.color)
  }

  // -- Line drawing helpers --

  private static readonly _layerToCanvas: Record<number, 'layer0' | 'layer1'> =
    {
      [-1]: 'layer0',
      0: 'layer1',
    }

  private _lineParams(line: Line) {
    const isBottom = line.layer === -1
    const layerName = Scene._layerToCanvas[line.layer] ?? 'layer1'
    const ctx = this.layers[layerName]?.ctx ?? this.layers.layer1.ctx
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
      ctx,
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
    if (line.pos.length < 2) return
    const p = this._lineParams(line)
    p.ctx.save()
    p.ctx.globalAlpha = p.opacity
    p.ctx.lineCap = 'round'
    p.ctx.lineJoin = 'round'
    this._buildLinePath(p.ctx, line.pos)
    p.ctx.strokeStyle = p.strokeColor
    p.ctx.lineWidth = p.radius + p.strokeW * 2
    p.ctx.stroke()
    p.ctx.restore()
  }

  private _drawLineFill(line: Line, color: TerminalColor): void {
    if (line.pos.length < 2) return
    const p = this._lineParams(line)
    p.ctx.save()
    p.ctx.globalAlpha = p.opacity
    p.ctx.lineCap = 'round'
    p.ctx.lineJoin = 'round'
    this._buildLinePath(p.ctx, line.pos)
    p.ctx.strokeStyle = COLORS[color] ?? '#fff'
    p.ctx.lineWidth = p.radius
    p.ctx.stroke()
    p.ctx.restore()
  }

  // -- Pad drawing helpers (pads are always white circles) --

  private _drawPadStroke(pad: Pad): void {
    const ctx = this.layers.layer1.ctx
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
    const ctx = this.layers.layer1.ctx
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
    const ctx = this.layers.layer1.ctx
    const xx = terminal.pos[0] * this.gridUnit + this.gridOffsetX
    const yy = terminal.pos[1] * this.gridUnit + this.gridOffsetY
    const r = this.gridUnit / 3
    const sw = 3
    ctx.fillStyle = 'rgba(0,0,0,1)'
    ctx.fillRect(xx - r - sw, yy - r - sw, (r + sw) * 2, (r + sw) * 2)
  }

  private _drawTerminalFill(terminal: Terminal, color: TerminalColor): void {
    const ctx = this.layers.layer1.ctx
    const xx = terminal.pos[0] * this.gridUnit + this.gridOffsetX
    const yy = terminal.pos[1] * this.gridUnit + this.gridOffsetY
    const r = this.gridUnit / 3
    ctx.fillStyle = COLORS[color] ?? '#fff'
    ctx.fillRect(xx - r, yy - r, r * 2, r * 2)
  }

  // -- Touch marker --

  drawMarker(touchX: number, touchY: number): void {
    const ctx = this.layers.top?.ctx
    if (!ctx) return
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
    const xx = touchX * this.gridUnit + this.gridOffsetX
    const yy = touchY * this.gridUnit + this.gridOffsetY
    ctx.beginPath()
    ctx.arc(xx, yy, this.markerRadius, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255,255,255,0.05)'
    ctx.fill()
  }

  hideMarker(): void {
    const ctx = this.layers.top?.ctx
    if (!ctx) return
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
  }
}

type CircuitsBoardProps = IoElementProps & {
  game?: Game
}

/**
 * CircuitsBoard — canvas-based game board IoElement.
 * Owns the Scene, creates 4 layered canvases, handles pointer events,
 * and translates screen coordinates to grid positions (plotter logic).
 */
export class CircuitsBoard extends IoElement {
  static get Style() {
    return /* css */ `
      :host {
        flex: 1;
        position: relative;
        background: rgba(0, 0, 0, 0.8);
        border: 1px solid #99f;
        border-radius: 12px;
        margin: 2px;
        overflow: hidden;
        touch-action: none;
      }
      :host > canvas {
        position: absolute;
        top: 0;
        left: 0;
      }
    `
  }

  static get Listeners(): Record<string, string> {
    return {
      pointerdown: 'onPointerdown',
      'game-init-scene': 'onGameInitScene',
      'game-render': 'onGameRender',
    }
  }

  @ReactiveProperty({ type: Game })
  declare game: Game

  @ReactiveProperty({ type: Scene, init: null })
  declare scene: Scene

  // Plotter state
  private _touchX = 0
  private _touchY = 0
  private _gridX = 0
  private _gridY = 0
  private _gridXOld = 0
  private _gridYOld = 0
  private _drag = false
  private _randomID = 0

  constructor(args: CircuitsBoardProps = {}) {
    super(args)
  }

  ready() {
    this.changed()
  }

  changed() {
    this.render([
      canvas({ id: 'grid', style: { zIndex: '100' } }),
      canvas({ id: 'layer0', style: { zIndex: '101' } }),
      canvas({ id: 'layer1', style: { zIndex: '102' } }),
      canvas({ id: 'top', style: { zIndex: '105' } }),
    ])
    this._initScene()
  }

  onResized() {
    this._initScene()
  }

  private _initScene(): void {
    const grid = this.querySelector('#grid') as HTMLCanvasElement
    const layer0 = this.querySelector('#layer0') as HTMLCanvasElement
    const layer1 = this.querySelector('#layer1') as HTMLCanvasElement
    const top = this.querySelector('#top') as HTMLCanvasElement
    if (!grid || !layer0 || !layer1 || !top) return

    this.scene.init({ grid, layer0, layer1, top })

    const rect = this.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return

    if (this.game) {
      this.scene.initGrid(
        this.game.width,
        this.game.height,
        rect.width,
        rect.height,
      )
      this.scene.render(
        this.game.pads,
        this.game.terminals,
        this.game.lines,
      )
    }
  }

  gameChanged() {
    this._initScene()
  }

  onGameInitScene() {
    const rect = this.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return
    this.scene.initGrid(
      this.game.width,
      this.game.height,
      rect.width,
      rect.height,
    )
    this.scene.render(
      this.game.pads,
      this.game.terminals,
      this.game.lines,
    )
  };
  onGameRender() {
    this.scene.render(
      this.game.pads,
      this.game.terminals,
      this.game.lines,
    )
  };

  onPointerdown(event: PointerEvent) {
    event.preventDefault()
    this.setPointerCapture(event.pointerId)
    this.addEventListener('pointermove', this.onPointermove)
    this.addEventListener('pointerup', this.onPointerup)

    this._randomID = Math.floor(Math.random() * 100000)
    this._drag = true
    this._initPosition(event)
    this.scene.drawMarker(this._touchX, this._touchY)

    if (!this.game) return

    if (this.game.drawMode === 'pad') {
      this.game.plotter.addPad(this._randomID, this._gridX, this._gridY)
    }
    if (this.game.drawMode === 'terminal') {
      this.game.plotter.addTerminal(
        this._randomID,
        this._gridX,
        this._gridY,
        this.game.drawColor,
      )
    }
    if (this.game.drawMode === 'line') {
      this.game.plotter.addLineSegment(
        this._randomID,
        this._gridX,
        this._gridY,
        this.game.drawLayer,
      )
    }
    if (this.game.drawMode === 'delete') {
      this.game.plotter.delete(this._gridX, this._gridY)
    }
  }

  onPointermove(event: PointerEvent) {
    event.preventDefault()
    this._updatePosition(event)
    this.scene.drawMarker(this._gridX, this._gridY)

    if (!this.game) return

    if (
      this.game.drawMode === 'line' &&
      this._drag &&
      (this._gridX !== this._gridXOld || this._gridY !== this._gridYOld)
    ) {
      const { endDrag } = this.game.plotter.addLineSegment(
        this._randomID,
        this._gridX,
        this._gridY,
        this.game.drawLayer,
      )
      if (endDrag) this._drag = false
    }
  }

  onPointerup(event: PointerEvent) {
    event.preventDefault()
    this.releasePointerCapture(event.pointerId)
    this.removeEventListener('pointermove', this.onPointermove)
    this.removeEventListener('pointerup', this.onPointerup)

    this._drag = false
    this.scene.hideMarker()

    if (!this.game) return

    this.game.finalizeMove(this._randomID)
  }

  private _initPosition(event: PointerEvent): void {
    const rect = this.getBoundingClientRect()

    this._touchX =
      (event.clientX - rect.left - this.scene.gridOffsetX) /
      this.scene.gridUnit
    this._touchY =
      (event.clientY - rect.top - this.scene.gridOffsetY) / this.scene.gridUnit

    this._gridX = Math.round(this._touchX)
    this._gridY = Math.round(this._touchY)
    this._gridXOld = this._gridX
    this._gridYOld = this._gridY
  }

  private _updatePosition(event: PointerEvent): void {
    const rect = this.getBoundingClientRect()

    this._touchX =
      (event.clientX - rect.left - this.scene.gridOffsetX) /
      this.scene.gridUnit
    this._touchY =
      (event.clientY - rect.top - this.scene.gridOffsetY) / this.scene.gridUnit

    const distance = Math.sqrt(
      Math.pow(this._touchX - Math.round(this._touchX), 2) +
        Math.pow(this._touchY - Math.round(this._touchY), 2),
    )

    if (!this.game) return

    if (
      distance < 0.5 &&
      this._touchX <= this.game.width + 0.5 &&
      this._touchY <= this.game.height + 0.5 &&
      this._touchX >= -0.5 &&
      this._touchY >= -0.5
    ) {
      this._gridXOld = this._gridX
      this._gridYOld = this._gridY

      this._gridX = Math.round(this._touchX)
      this._gridY = Math.round(this._touchY)

      if (this._gridX > this._gridXOld) this._gridX = this._gridXOld + 1
      if (this._gridX < this._gridXOld) this._gridX = this._gridXOld - 1
      if (this._gridY > this._gridYOld) this._gridY = this._gridYOld + 1
      if (this._gridY < this._gridYOld) this._gridY = this._gridYOld - 1
    }
  }
}
Register(CircuitsBoard)
export const circuitsBoard = function (arg0: CircuitsBoardProps) {
  return CircuitsBoard.vConstructor(arg0)
}
