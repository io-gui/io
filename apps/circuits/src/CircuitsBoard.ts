import {
  Register,
  IoElement,
  IoElementProps,
  ReactiveProperty,
  div,
} from '@io-gui/core'
import { ioButton } from '@io-gui/inputs'
import { Vector2, Vector3 } from 'three/webgpu'
import { DrawMode, Game } from './game/game.js'
import { ThreeScene } from './scene/threeScene.js'
import { ioThreeViewport, Pointer3D } from '@io-gui/three'
import { PointerTool } from './tools/pointerTool.js'
import { ColorName } from './game/items/colors.js'

const _posRaw = new Vector2()
const _posHitOld = new Vector2()
const _posHit = new Vector2()
let _posChanged = false

const _directionOffset = new Vector3()

/** Intersect pointer ray with the z=0 game plane, write rounded grid coords into `out`. */
function pointerToGrid(pointer: Pointer3D): Vector2 {
  const { origin, direction } = pointer.ray

  // Offset the ray direction for more intuitive gestures on touch devices
  const _newDirectionOffset = pointer.rayMovement.direction.normalize().multiplyScalar(.5)
  _directionOffset.multiplyScalar(10).add(_newDirectionOffset).multiplyScalar(1/11)

  origin.add(_directionOffset)

  const t = -origin.z / direction.z
  return new Vector2().copy(origin).addScaledVector(direction, t)
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
        height: 100%;
        max-width: 100%;
        max-height: 100%;
      }
      :host > .game-toolbar {
        display: flex;
        gap: 2px;
        padding: 2px;
        flex-shrink: 0;
      }
      :host > .game-toolbar > io-button {
        flex: 1 1 auto;
        height: calc(var(--io_fieldHeight) * 1.5);
        display: flex;
        align-items: center;
      }
      :host > .game-toolbar > io-button > io-icon {
        margin-left: auto;
      }
      :host > .game-toolbar > io-button > span {
        margin-right: auto;
      }
    `
  }

  static get Listeners() {
    return {
      'game-init': 'onGameInit',
      '3dpointer-down': 'on3DPointerDown',
      '3dpointer-move': 'on3DPointerMove',
      '3dpointer-up': 'on3DPointerUp',
      'line-end-drag': 'onEndDrag',
    }
  }

  @ReactiveProperty({type: Game, init: null})
  declare game: Game

  @ReactiveProperty({type: ThreeScene, init: {isPlaying: true}})
  declare applet: ThreeScene

  private _dragging: boolean = false

  drawMode: DrawMode = 'line'
  drawColor: ColorName = 'white'
  drawLayer = 1

  _rAF = -1

  constructor(args: IoElementProps) {
    super(args)
    this.applet.game = this.game
  }

  onGameInit() {
    console.log('onGameInit')
    this.drawMode = 'line'
    this.drawColor = 'white'
    this.drawLayer = 1
  };

  ready() {
    this.render([
      ioThreeViewport({applet: this.applet, tool: new PointerTool({}), cameraSelect: 'scene', overscan: 1.2}),
      div({class: 'game-toolbar'}, [
        ioButton({label: 'Undo', icon: 'io:undo', action: this.onUndo}),
        ioButton({label: 'Reset', icon: 'io:reload', action: this.onReset}),
        ioButton({label: 'Redo', icon: 'io:redo', action: this.onRedo}),
      ]),
    ])
  }

  on3DPointerDown(event: CustomEvent<Pointer3D[]>) {
    if (event.detail.length !== 1) return

    this._dragging = true
    _posRaw.copy(pointerToGrid(event.detail[0]))

    _directionOffset.set(0, 0, 0)

    _posHit.copy(_posRaw).round()
    _posHitOld.copy(_posHit)

    this.applet.updateMarkers(_posHit, _posHitOld, _posRaw)

    this.applet.updateDrag(event.detail[0].screen, event.detail[0].screenStart)

    if (this.drawMode === 'pad') {
      this.applet.game.pads.addAt(_posHit.x, _posHit.y)
    }
    if (this.drawMode === 'terminal') {
      this.applet.game.pads.addAt(_posHit.x, _posHit.y, this.drawColor)
    }
    if (this.drawMode === 'line') {
      this.applet.game.plotter.startLineAt(_posHit.clone(), this.drawLayer)
      _posChanged = false
      cancelAnimationFrame(this._rAF)
      this._rAF = requestAnimationFrame(this.onLinePlot)
    }
    if (this.drawMode === 'delete') {
      this.applet.game.pads.deleteAt(_posHit.x, _posHit.y)
      this.applet.game.layer0.deleteAt(_posHit.x, _posHit.y)
      this.applet.game.layer1.deleteAt(_posHit.x, _posHit.y)
    }
  }

  on3DPointerMove(event: CustomEvent<Pointer3D[]>) {
    if (event.detail.length !== 1 || !this._dragging) return
    this.applet.updateDrag(event.detail[0].screen, event.detail[0].screenStart)

    _posRaw.copy(pointerToGrid(event.detail[0]))
    _posHit.copy(_posRaw).round()
    this.applet.updateMarkers(_posHit, _posHitOld, _posRaw)

    if (_posRaw.distanceTo(_posHitOld) < 0.95) {
      return
    }
    _posChanged = true
    _posHitOld.copy(_posHit)

    this.applet.updateMarkers(_posHit, _posHitOld, _posRaw)
  }

  on3DPointerUp(event: PointerEvent) {
    event.preventDefault()
    this.onEndDrag()
    this.applet.updateDrag(new Vector2(0, 0), new Vector2(0, 0))
  }

  onEndDrag() {
    this._dragging = false
    // TODO
    if (this.drawMode === 'line') {
      this.applet.game.finalizeMove()
    }
    cancelAnimationFrame(this._rAF)
    this.applet.updateGrid(this.applet.game)
  }

  onLinePlot() {
    if (this.drawMode === 'line' && _posChanged) {
      this.applet.game.plotter.plotLineTo(_posHit.clone(), this.drawLayer)
      _posChanged = false
    }
    this._rAF = requestAnimationFrame(this.onLinePlot)
  }

  onUndo() {
    this.applet.game.undo()
  }

  onRedo() {
    this.applet.game.redo()
  }

  onReset() {
    this.applet.game.reload()
  }

  onEdit() {
    this.changed()
  }

  dispose() {
    this.applet.dispose()
    super.dispose()
  }

}

export const circuitsBoard = function(arg0: IoElementProps) {
  return CircuitsBoard.vConstructor(arg0)
}