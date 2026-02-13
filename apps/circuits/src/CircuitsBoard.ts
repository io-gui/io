import {
  Register,
  IoElement,
  IoElementProps,
  ReactiveProperty,
  div,
} from '@io-gui/core'
import { ioButton } from '@io-gui/inputs'
import { Vector2 } from 'three/webgpu'
import { DrawMode, Game } from './game/game.js'
import { ThreeScene } from './scene/threeScene.js'
import { ioThreeViewport, Pointer3D } from '@io-gui/three'
import { PointerTool } from './tools/pointerTool.js'
import { ColorName } from './game/items/colors.js'

const _posRaw = new Vector2()
const _posHitOld = new Vector2()
const _posHit = new Vector2()
let _posChanged = false

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

  @ReactiveProperty({type: ThreeScene, init: {isPlaying: true}})
  declare applet: ThreeScene

  @ReactiveProperty({ type: Game })
  declare game: Game

  private _dragging: boolean = false

  drawMode: DrawMode = 'line'
  drawColor: ColorName = 'white'
  drawLayer = 1

  _rAF = -1

  constructor(args: CircuitsBoardProps) {
    super(args)
  }

  onGameInit() {
    this.onGameUpdate()
    this.applet.initGrid(this.game.width, this.game.height)

    this.drawMode = 'line'
    this.drawColor = 'white'
    this.drawLayer = 1
  };
  onGameUpdate() {
    this.applet.updateGrid(this.game.width, this.game.height, this.game.layer0.lines, this.game.layer1.lines, this.game.pads)
    this.applet.updatePads(this.game.pads)
    this.applet.updateTerminals(this.game.pads)
    this.applet.updateLines(this.game.layer0.lines, this.game.layer1.lines)
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
    _posRaw.copy(pointerToGrid(event.detail[0]))

    _posHit.copy(_posRaw).round()
    _posHitOld.copy(_posHit)

    this.applet.updateMarkers(_posHit, _posHitOld, _posRaw)
    
    this.applet.updateDrag(event.detail[0].screen, event.detail[0].screenStart)
    
    if (this.drawMode === 'pad') {
      this.game.pads.addAt(_posHit.x, _posHit.y, undefined, false)
    }
    if (this.drawMode === 'terminal') {
      this.game.pads.addAt(_posHit.x, _posHit.y, this.drawColor, true)
    }
    if (this.drawMode === 'line') {
      this.game.plotter.startLineAt(_posHit.clone(), this.drawLayer)
      _posChanged = false
      cancelAnimationFrame(this._rAF)
      this._rAF = requestAnimationFrame(this.onLinePlot)
    }
    if (this.drawMode === 'delete') {
      this.game.pads.deleteAt(_posHit.x, _posHit.y)
      this.game.layer0.deleteAt(_posHit.x, _posHit.y)
      this.game.layer1.deleteAt(_posHit.x, _posHit.y)
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
      this.game.finalizeMove()
    }
    cancelAnimationFrame(this._rAF)
    this.applet.updateGrid(this.game.width, this.game.height, this.game.layer0.lines, this.game.layer1.lines, this.game.pads)
  }

  onLinePlot() {
    if (this.drawMode === 'line' && _posChanged) {
      this.game.plotter.plotLineTo(_posHit.clone(), this.drawLayer)
      _posChanged = false
    }
    this._rAF = requestAnimationFrame(this.onLinePlot)
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