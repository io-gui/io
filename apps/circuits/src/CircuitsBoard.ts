import {
  Register,
  IoElement,
  IoElementProps,
  ReactiveProperty,
} from '@io-gui/core'
import { Game } from './game/game.js'
import { ThreeScene } from './scene/threeScene.js'
import { IoThreeViewport, ioThreeViewport } from '@io-gui/three'

type CircuitsBoardProps = IoElementProps & {
  game: Game
}

/**
 * CircuitsBoard — 3D game board IoElement.
 * Owns the ThreeScene, hosts io-three-viewport, handles pointer events,
 * and maps viewport coordinates to grid via camera unproject (plotter logic).
 */
@Register
export class CircuitsBoard extends IoElement {

  static get Style() {
    return /* css */`
      :host {
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        max-width: 100%;
        max-height: 100%;
      }
    `
  }

  static get Listeners(): Record<string, string> {
    return {
      'pointerdown': 'onPointerdown',
      'game-init-scene': 'onGameInit',
      'game-update': 'onGameUpdate',
    }
  }

  @ReactiveProperty({type: ThreeScene, init: null})
  declare applet: ThreeScene

  @ReactiveProperty({ type: Game })
  declare game: Game

  private _pointerX = 0
  private _pointerY = 0
  private _gridX = 0
  private _gridY = 0
  private _gridXOld = 0
  private _gridYOld = 0
  private _drag = false
  private _currentID = -1

  constructor(args: CircuitsBoardProps) {
    super(args)
  }

  onGameInit() {
    this.applet.updateGrid(this.game.width, this.game.height)
    this.onGameUpdate()
  };
  onGameUpdate() {
    this.applet.updatePads(this.game.pads)
    this.applet.updateTerminals(this.game.terminals)
    this.applet.updateLines(this.game.lines)
    this.applet.dispatch('three-applet-needs-render', undefined, true)
  };

  ready() {
    this.render([
      ioThreeViewport({applet: this.applet, cameraSelect: 'scene'}),
    ])
  }

  onPointerdown(event: PointerEvent) {
    event.preventDefault()
    this.setPointerCapture(event.pointerId)
    this.addEventListener('pointermove', this.onPointermove)
    this.addEventListener('pointerup', this.onPointerup)
    this.addEventListener('pointercancel', this.onPointerup)

    const viewport = this.querySelector('io-three-viewport')! as IoThreeViewport
    const rect = viewport.getBoundingClientRect()
    this._currentID = Math.floor(Math.random() * 100000)
    this._drag = true
    this._initPosition(event, rect)

    if (this.game.drawMode === 'pad') {
      this.game.plotter.addPad(this._currentID, this._gridX, this._gridY)
    }
    if (this.game.drawMode === 'terminal') {
      this.game.plotter.addTerminal(this._currentID, this._gridX, this._gridY, this.game.drawColor)
    }
    if (this.game.drawMode === 'line') {
      this.game.plotter.addLineSegment(this._currentID, this._gridX, this._gridY, this.game.drawLayer)
    }
    if (this.game.drawMode === 'delete') {
      this.game.plotter.delete(this._gridX, this._gridY)
    }
  }

  onPointermove(event: PointerEvent) {
    event.preventDefault()
    const viewport = this.querySelector('io-three-viewport')! as IoThreeViewport
    this._updatePosition(event, viewport.getBoundingClientRect())

    if (
      this.game.drawMode === 'line' &&
      this._drag &&
      (this._gridX !== this._gridXOld || this._gridY !== this._gridYOld)
    ) {
      const { endDrag } = this.game.plotter.addLineSegment(this._currentID, this._gridX, this._gridY, this.game.drawLayer)
      if (endDrag) this._drag = false
    }
  }

  onPointerup(event: PointerEvent) {
    event.preventDefault()
    this.releasePointerCapture(event.pointerId)
    this.removeEventListener('pointermove', this.onPointermove)
    this.removeEventListener('pointerup', this.onPointerup)
    this.removeEventListener('pointercancel', this.onPointerup)

    this._drag = false

    if (this.game) this.game.finalizeMove(this._currentID)
  }

  private _initPosition(event: PointerEvent, rect: DOMRect): void {
    const { worldX, worldY, gridX, gridY } = this.applet.pointerToGrid(
      event.clientX,
      event.clientY,
      rect.left,
      rect.top,
      rect.width,
      rect.height
    )
    const halfW = this.game.width / 2
    const halfH = this.game.height / 2
    this._pointerX = worldX + halfW
    this._pointerY = worldY + halfH
    this._gridX = gridX
    this._gridY = gridY
    this._gridXOld = this._gridX
    this._gridYOld = this._gridY
  }

  private _updatePosition(event: PointerEvent, rect: DOMRect): void {
    const { worldX, worldY } = this.applet.pointerToGrid(
      event.clientX,
      event.clientY,
      rect.left,
      rect.top,
      rect.width,
      rect.height
    )
    const halfW = this.game.width / 2
    const halfH = this.game.height / 2
    this._pointerX = worldX + halfW
    this._pointerY = worldY + halfH

    const distance = Math.sqrt(
      (this._pointerX - Math.round(this._pointerX)) ** 2 +
      (this._pointerY - Math.round(this._pointerY)) ** 2
    )
    const inBounds =
      this._pointerX <= this.game.width + 0.5 &&
      this._pointerY <= this.game.height + 0.5 &&
      this._pointerX >= -0.5 &&
      this._pointerY >= -0.5

    if (distance < 0.5 && inBounds) {
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

  dispose() {
    this.applet.dispose()
    super.dispose()
  }

}

export const circuitsBoard = function(arg0: CircuitsBoardProps) {
  return CircuitsBoard.vConstructor(arg0)
}