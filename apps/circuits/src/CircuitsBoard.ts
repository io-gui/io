import {
  Register,
  IoElement,
  IoElementProps,
  ReactiveProperty,
  div,
} from '@io-gui/core'
import { ioButton } from '@io-gui/inputs'
import { Vector2 } from 'three/webgpu'
import { Game } from './game/game.js'
import { ThreeScene } from './scene/threeScene.js'
import { ioThreeViewport, Pointer3D } from '@io-gui/three'
import { PointerTool } from './tools/pointerTool.js'

let _posRaw = new Vector2()
const _posHitOld = new Vector2()
const _posHit = new Vector2()

/** Intersect pointer ray with the z=0 game plane, write rounded grid coords into `out`. */
function pointerToGrid(pointer: Pointer3D): Vector2 {
  const ray = pointer.ray
  const t = -ray.origin.z / ray.direction.z
  return new Vector2().copy(ray.origin).addScaledVector(ray.direction, t)
}

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

  static get Listeners(): Record<string, string> {
    return {
      '3dpointer-down': 'on3DPointerDown',
      '3dpointer-move': 'on3DPointerMove',
      '3dpointer-up': 'on3DPointerUp',

      'game-init-scene': 'onGameInit',
      'game-update': 'onGameUpdate',
      'line-end-drag': 'onEndDrag',
    }
  }

  // TODO: Move applet to CircuitsApp
  @ReactiveProperty({type: ThreeScene, init: {isPlaying: true}})
  declare applet: ThreeScene

  @ReactiveProperty({ type: Game })
  declare game: Game

  private _currentID: number = 0
  private _dragging: boolean = false

  constructor(args: CircuitsBoardProps) {
    super(args)
  }

  onGameInit() {
    this.onGameUpdate()
    this.applet.initGrid(this.game.width, this.game.height)
  };
  onGameUpdate() {
    this.applet.updateGrid(this.game.width, this.game.height, this.game.lines, this.game.pads, this.game.terminals)
    this.applet.updatePads(this.game.pads)
    this.applet.updateTerminals(this.game.terminals)
    this.applet.updateLines(this.game.lines)
    // TODO: hmm?
    this.applet.dispatch('three-applet-needs-render', undefined, true)
  };

  gameChanged() {
    this.onGameInit()
  }

  ready() {
    this.onGameUpdate()
    this.applet.initGrid(this.game.width, this.game.height)
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
    _posRaw = pointerToGrid(event.detail[0])

    _posHit.copy(_posRaw).round()
    _posHitOld.copy(_posHit)

    this.applet.updateDrag(event.detail[0].screen, event.detail[0].screenStart)

    this._currentID = Math.floor(Math.random() * 100000)

    if (this.game.drawMode === 'pad') {
      this.game.plotter.addPad(this._currentID, [_posHit.x, _posHit.y])
    }
    if (this.game.drawMode === 'terminal') {
      this.game.plotter.addTerminal(this._currentID, [_posHit.x, _posHit.y], this.game.drawColor)
    }
    if (this.game.drawMode === 'line') {
      this.game.plotter.addLineSegment(this._currentID, [_posHit.x, _posHit.y], this.game.drawLayer)
    }
    if (this.game.drawMode === 'delete') {
      this.game.plotter.delete([_posHit.x, _posHit.y])
    }
  }

  on3DPointerMove(event: CustomEvent<Pointer3D[]>) {
    if (event.detail.length !== 1 || !this._dragging) return
    this.applet.updateDrag(event.detail[0].screen, event.detail[0].screenStart)

    _posRaw = pointerToGrid(event.detail[0])
    _posHit.copy(_posRaw).round()
    if (_posRaw.distanceTo(_posHitOld) < .95) {
      return
    }
    _posHitOld.copy(_posHit)

    if (this.game.drawMode === 'line' && _posRaw.distanceTo(_posHitOld) > 0) {
      this.game.plotter.addLineSegment(this._currentID, [_posHit.x, _posHit.y], this.game.drawLayer)
    }
  }

  on3DPointerUp(event: PointerEvent) {
    event.preventDefault()
    this.onEndDrag()
    this.applet.updateDrag(new Vector2(0, 0), new Vector2(0, 0))
  }

  onEndDrag() {
    this._dragging = false
    if (this.game) this.game.finalizeMove(this._currentID)
    this.applet.updateGrid(this.game.width, this.game.height, this.game.lines, this.game.pads, this.game.terminals)
  }

  onUndo() {
    this.game.undo()
  }

  onRedo() {
    this.game.redo()
  }

  onReset() {
    this.game.reload()
  }

  onEdit() {
    this.changed()
  }

  dispose() {
    this.applet.dispose()
    super.dispose()
  }

}

export const circuitsBoard = function(arg0: CircuitsBoardProps) {
  return CircuitsBoard.vConstructor(arg0)
}