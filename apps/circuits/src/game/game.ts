import { Register, ReactiveNode, ReactiveProperty, Property, Storage as $, Binding } from '@io-gui/core'
import { Pad, type PadData } from './items/pad.js'
import { Line, type LineData } from './items/line.js'
import { Plotter } from './plotter.js'
import { COLORS, type ColorName } from './items/colors.js'

export type DrawMode = 'pad' | 'terminal' | 'line' | 'delete'

interface LevelData {
  width: number
  height: number
  pads: PadData[]
  lines: LineData[]
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

  @ReactiveProperty({type: Array})
  declare pads: Pad[]
  
  @ReactiveProperty({type: Array})
  declare lines: Line[]

  @ReactiveProperty({type: Number})
  declare width: number

  @ReactiveProperty({type: Number})
  declare height: number

  drawMode: DrawMode = 'line'
  drawColor: ColorName = 'white'
  drawLayer = 0

  undoStack: string[] = []
  redoStack: string[] = []

  @ReactiveProperty({type: Plotter, init: null})
  declare plotter: Plotter

  @Property($({key: 'null-level-state', value: {}, storage: 'local'}))
  declare storedState: Binding

  clear() {
    this.width = 4
    this.height = 5
    this.pads = []
    this.lines = []
    this.plotter.connect(this.pads, this.lines, this.width, this.height)
    this.drawMode = 'line'
    this.drawColor = 'white'
    this.drawLayer = 0
    this.redoStack = []
    this.undoStack = []
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

  async load(level: string): Promise<void> {
    try {
      const resp = await fetch('./public/levels/' + level + '.json')
      if (!resp.ok) console.error('Level not found')
      const text = await resp.text()
      this.clear()
      this.fromJSON(text)
      this.propagateColors()
      this.save()
    } catch (e) {
      console.warn('Could not load level:', level, e)
    }
  }

  save(): void {
    this.storedState.value = {
      width: this.width,
      height: this.height,
      pads: this.pads.map((p) => p.toJSON()),
      lines: this.lines.map((l) => l.toJSON()),
    }
  }

  fromJSON(jsonText: string): void {
    const state: LevelData = JSON.parse(jsonText)
    this.width = state.width
    this.height = state.height
    this.pads = state.pads.map((p) => Pad.fromJSON(p))
    this.lines = state.lines.map((l) => Line.fromJSON(l as LineData))
    this.plotter.connect(this.pads, this.lines, this.width, this.height)
  }

  toJSON(): string {
    return JSON.stringify({
      width: this.width,
      height: this.height,
      pads: this.pads.map((p) => p.toJSON()),
      lines: this.lines.map((l) => l.toJSON()),
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
      this.save()
      this.dispatch('game-update', undefined, true)
    }
  }

  redo(): void {
    if (this.redoStack.length > 0) {
      const state = this.redoStack.pop()!
      this.fromJSON(state)
      this.undoStack.push(state)
      this.propagateColors()
      this.save()
      this.dispatch('game-update', undefined, true)
    }
  }

  resetColors(): void {
    for (const line of this.lines) line.renderColor = COLORS.white
    for (const pad of this.pads) {
      pad.renderColor = pad.isTerminal ? COLORS[pad.color!] : COLORS.white
    }
  }

  propagateColors(): void {
    this.resetColors()

    for (let iter = 0; iter < 16; iter++) {
      for (const line of this.lines) {
        const first = line.pos[0]
        const last = line.pos[line.pos.length - 1]

        const p1 = this.plotter.getPointAt(first)
        const p2 = this.plotter.getPointAt(last)
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
            if (p2 instanceof Pad) p2.renderColor = c1
          } else if (c2 !== w) {
            line.renderColor = c2
            if (p1 instanceof Pad) p1.renderColor = c2
          }
        }
      }
    }

    this.dispatch('game-update', undefined, true)

    let completed = true

    // TODO: Check for completeness correctly

    for (const pad of this.pads) {
      const nConn = this.plotter.getLinesAtPoint(pad.pos).length
      if (pad.isTerminal) {
        if (nConn !== 1) completed = false
      } else if (nConn !== 2 && pad.renderColor !== COLORS.white) {
        completed = false
      }
    }

    if (completed) console.log('game-complete', this.level, completed)
    this.dispatch('game-complete', { level: this.level, completed }, true)
  }

  finalizeMove(lineID: number): void {
    if (this.plotter.verifyLineComplete(lineID)) {
      this.updateUndoStack()
      this.propagateColors()
      this.save()
    }
    this.dispatch('game-update', undefined, true)
  }
}
