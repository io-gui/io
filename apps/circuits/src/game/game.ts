import { Register, ReactiveNode, ReactiveProperty, Property, Storage as $, Binding } from '@io-gui/core'
import { Vector2 } from 'three/webgpu'
import { Plotter } from './plotter.js'
import { COLORS } from './items/colors.js'
import { Pads, type PadsData } from './pads.js'
import { Layer, type LayerData } from './layer.js'

export type DrawMode = 'pad' | 'terminal' | 'line' | 'delete'

const _vec2 = new Vector2()

interface LevelData {
  width: number
  height: number
  pads: PadsData
  layer0: LayerData
  layer1: LayerData
}

/**
 * Game — central state machine.
 * Manages pads, lines, load/save, undo/redo, colour propagation,
 * and completion checking.
 */
@Register
export class Game extends ReactiveNode {

  @ReactiveProperty({value: '', type: String})
  declare level: string

  @ReactiveProperty({type: Pads, init: null})
  declare pads: Pads

  @ReactiveProperty({type: Layer, init: null})
  declare layer0: Layer

  @ReactiveProperty({type: Layer, init: null})
  declare layer1: Layer

  @ReactiveProperty({type: Number})
  declare width: number

  @ReactiveProperty({type: Number})
  declare height: number

  undoStack: string[] = []
  redoStack: string[] = []

  @ReactiveProperty({type: Plotter, init: null})
  declare plotter: Plotter

  @Property($({key: 'null-level-state', value: {}, storage: 'local'}))
  declare storedState: Binding

  clear() {
    this.width = 2
    this.height = 2
    this.pads = new Pads(this.width, this.height)
    this.layer0 = new Layer(this.width, this.height)
    this.layer1 = new Layer(this.width, this.height)
    this.plotter.connect(this.pads, this.layer0, this.layer1, this.width, this.height)
    this.redoStack = []
    this.undoStack = []
  }

  async load(level: string): Promise<void> {
    try {
      const resp = await fetch('./public/levels/' + level + '.json')
      if (!resp.ok) console.error('Level not found')
      const text = await resp.text()
      this.clear()
      this.fromJSON(text)
      this.propagateColors()
      // this.save()
    } catch (e) {
      console.warn('Could not load level:', level, e)
    }
  }

  async initialize() {
    this.clear()
    this.storedState = $({key: `${this.level}-level-state`, value: {}, storage: 'local'})

    if (this.level) {
      if (Object.keys(this.storedState.value).length === 0) {
        await this.load(this.level)
      } else {
        this.clear()
        this.fromJSON(JSON.stringify(this.storedState.value))
        this.propagateColors()
      }
    }

    this.undoStack = [this.toJSON()]
    this.redoStack = []
    this.dispatch('game-update', undefined, true)
  }

  levelChanged() {
    void this.initialize().then(() => {
      this.dispatch('game-init-scene', undefined, true)
    })
  }

  reload() {
    this.storedState.value = {}
    void this.initialize()
  }

  save(): void {
    this.storedState.value = {
      width: this.width,
      height: this.height,
      pads: this.pads.toJSON(),
      layer0: this.layer0.toJSON(),
      layer1: this.layer1.toJSON(),
    }
  }

  fromJSON(jsonText: string): void {
    const state: LevelData = JSON.parse(jsonText)
    this.width = state.width
    this.height = state.height
    this.pads = new Pads(this.width, this.height, state.pads)
    this.layer0 = new Layer(this.width, this.height, state.layer0)
    this.layer1 = new Layer(this.width, this.height, state.layer1)
    this.plotter.connect(this.pads, this.layer0, this.layer1, this.width, this.height)
    this.undoStack = []
    this.redoStack = []
  }

  toJSON(): string {
    return JSON.stringify({
      width: this.width,
      height: this.height,
      pads: this.pads.toJSON(),
      layer0: this.layer0.toJSON(),
      layer1: this.layer1.toJSON(),
    })
  }

  updateUndoStack(): void {
    const state = this.toJSON()
    if (state !== this.undoStack[this.undoStack.length - 1]) {
      this.undoStack.push(state)
    }
  }

  undo(): void {
    if (this.undoStack.length >= 2) {
      const currentState = this.undoStack.pop()!
      this.fromJSON(this.undoStack[this.undoStack.length - 1])
      this.redoStack.push(currentState)
      this.propagateColors()
      // this.save()
      this.dispatch('game-update', undefined, true)
    }
  }

  redo(): void {
    if (this.redoStack.length > 0) {
      const state = this.redoStack.pop()!
      this.fromJSON(state)
      this.undoStack.push(state)
      this.propagateColors()
      // this.save()
      this.dispatch('game-update', undefined, true)
    }
  }

  resetColors(): void {
    this.layer0.forEach((line) => line.resetColor())
    this.layer1.forEach((line) => line.resetColor())
    this.pads.forEach((pad) => pad.resetColor())
  }

  propagateColors(): void {
    this.resetColors()

    const lines = [...this.layer0.lines, ...this.layer1.lines];

    for (let iter = 0; iter < 16; iter++) {
      for (const line of lines) {
        const first = line.pos[0]
        const last = line.pos[line.pos.length - 1]

        const p1 = this.pads.getAt(first.x, first.y)
        const p2 = this.pads.getAt(last.x, last.y)
        if (!p1 || !p2) continue

        const c1 = p1.renderColor
        const c2 = p2.renderColor
        const w = COLORS.white

        if (c1 !== w && c2 !== w) {
          if (c1 === c2) line.renderColor = c1
        } else if (c1 === w && c2 === w) {
          line.renderColor = w
        } else {
          if (c1 !== w) {
            line.renderColor = c1
            p2.renderColor = c1
          } else if (c2 !== w) {
            line.renderColor = c2
            p1.renderColor = c2
          }
        }
      }
    }

    this.dispatch('game-update', undefined, true)

    let completed = true

    // TODO: Check for completeness correctly

    this.pads.forEach((pad, x, y) => {
      const nConn = this.plotter.getLinesAtPoint(_vec2.set(x, y)).length
      if (pad.isTerminal) {
        if (nConn !== 1) completed = false
      } else if (nConn !== 2 && pad.renderColor !== COLORS.white) {
        completed = false
      }
    })

    if (completed) console.log('game-complete', this.level, completed)
    this.dispatch('game-complete', { level: this.level, completed }, true)
  }

  finalizeMove(): void {
    if (this.plotter.finalizeLine()) {
      this.updateUndoStack()
      this.propagateColors()
      // this.save()
    }
    this.dispatch('game-update', undefined, true)
  }
}
