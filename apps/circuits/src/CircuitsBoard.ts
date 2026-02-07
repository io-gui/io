import {
  IoElement,
  Register,
  ReactiveProperty,
  IoElementProps,
  canvas,
} from '@io-gui/core'
import { Game } from './game/game.js'
import { CanvasScene } from './scene/canvasScene.js'

type CircuitsBoardProps = IoElementProps & {
  game?: Game
}

/**
 * CircuitsBoard — canvas-based game board IoElement.
 * Owns the Scene, creates a single canvas, handles pointer events,
 * and translates screen coordinates to grid positions (plotter logic).
 */
@Register
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
      'pointerdown': 'onPointerdown',
      'game-init-scene': 'onGameInitScene',
      'game-render': 'onGameRender',
    }
  }

  @ReactiveProperty({ type: Game })
  declare game: Game

  @ReactiveProperty({ type: CanvasScene, init: null })
  declare scene: CanvasScene

  // Plotter state
  private _pointerX = 0
  private _pointerY = 0
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
    this.render([canvas({ id: 'board' })])
    this._initScene()
  }

  onResized() {
    this._initScene()
  }

  private _initScene(): void {
    const board = this.querySelector('#board') as HTMLCanvasElement
    if (!board) return

    this.scene.init(board)

    const rect = this.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return

    if (this.game) {
      this.scene.initGrid(this.game.width, this.game.height, rect.width, rect.height)
      this.scene.render(this.game.pads, this.game.terminals, this.game.lines)
    }
  }

  gameChanged() {
    this._initScene()
  }

  onGameInitScene() {
    const rect = this.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return
    this.scene.initGrid(this.game.width, this.game.height, rect.width, rect.height)
    this.scene.render(this.game.pads, this.game.terminals, this.game.lines)
  };
  onGameRender() {
    this.scene.render(this.game.pads, this.game.terminals, this.game.lines)
  };

  onPointerdown(event: PointerEvent) {
    event.preventDefault()
    this.setPointerCapture(event.pointerId)
    this.addEventListener('pointermove', this.onPointermove)
    this.addEventListener('pointerup', this.onPointerup)

    this._randomID = Math.floor(Math.random() * 100000)
    this._drag = true
    this._initPosition(event)

    if (!this.game) return

    if (this.game.drawMode === 'pad') {
      this.game.plotter.addPad(this._randomID, this._gridX, this._gridY)
    }
    if (this.game.drawMode === 'terminal') {
      this.game.plotter.addTerminal(this._randomID, this._gridX, this._gridY, this.game.drawColor)
    }
    if (this.game.drawMode === 'line') {
      this.game.plotter.addLineSegment(this._randomID, this._gridX, this._gridY, this.game.drawLayer)
    }
    if (this.game.drawMode === 'delete') {
      this.game.plotter.delete(this._gridX, this._gridY)
    }
  }

  onPointermove(event: PointerEvent) {
    event.preventDefault()
    this._updatePosition(event)

    if (!this.game) return

    if (
      this.game.drawMode === 'line' &&
      this._drag &&
      (this._gridX !== this._gridXOld || this._gridY !== this._gridYOld)
    ) {
      const { endDrag } = this.game.plotter.addLineSegment(this._randomID, this._gridX, this._gridY, this.game.drawLayer)
      if (endDrag) this._drag = false
    }
  }

  onPointerup(event: PointerEvent) {
    event.preventDefault()
    this.releasePointerCapture(event.pointerId)
    this.removeEventListener('pointermove', this.onPointermove)
    this.removeEventListener('pointerup', this.onPointerup)

    this._drag = false

    if (!this.game) return

    this.game.finalizeMove(this._randomID)
  }

  private _initPosition(event: PointerEvent): void {
    const rect = this.getBoundingClientRect()

    this._pointerX =
      (event.clientX - rect.left - this.scene.gridOffsetX) /
      this.scene.gridUnit
    this._pointerY =
      (event.clientY - rect.top - this.scene.gridOffsetY) / this.scene.gridUnit

    this._gridX = Math.round(this._pointerX)
    this._gridY = Math.round(this._pointerY)
    this._gridXOld = this._gridX
    this._gridYOld = this._gridY
  }

  private _updatePosition(event: PointerEvent): void {
    const rect = this.getBoundingClientRect()

    this._pointerX = (event.clientX - rect.left - this.scene.gridOffsetX) / this.scene.gridUnit
    this._pointerY = (event.clientY - rect.top - this.scene.gridOffsetY) / this.scene.gridUnit

    const distance = Math.sqrt(
      Math.pow(this._pointerX - Math.round(this._pointerX), 2) + Math.pow(this._pointerY - Math.round(this._pointerY), 2),
    )

    if (!this.game) return

    if (
      distance < 0.5 &&
      this._pointerX <= this.game.width + 0.5 &&
      this._pointerY <= this.game.height + 0.5 &&
      this._pointerX >= -0.5 &&
      this._pointerY >= -0.5
    ) {
      this._gridXOld = this._gridX
      this._gridYOld = this._gridY

      this._gridX = Math.round(this._pointerX)
      this._gridY = Math.round(this._pointerY)

      if (this._gridX > this._gridXOld) this._gridX = this._gridXOld + 1
      if (this._gridX < this._gridXOld) this._gridX = this._gridXOld - 1
      if (this._gridY > this._gridYOld) this._gridY = this._gridYOld + 1
      if (this._gridY < this._gridYOld) this._gridY = this._gridYOld - 1
    }
  }
}

export const circuitsBoard = function (arg0: CircuitsBoardProps) {
  return CircuitsBoard.vConstructor(arg0)
}
