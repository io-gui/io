import { IoElement, Register } from '@io-gui/core'
import { ioButton } from '@io-gui/inputs'
import type { DrawMode } from './game/game.js'

const TERMINAL_COLORS = [
  'red',
  'green',
  'blue',
  'pink',
  'yellow',
  'orange',
  'purple',
  'brown',
  'grey',
  'black',
] as const

@Register
export class CircuitsEditor extends IoElement {
  static get Style() {
    return /* css */ `
      :host {
        display: flex;
        flex-direction: column;
        background: rgba(0, 0, 0, 0.85);
        align-items: center;
        justify-content: center;
        flex: 1 1 auto;
        gap: 4px;
        padding: 8px;
      }
      :host > io-button {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        width: 100%;
      }
    `
  }

  ready() {
    this.changed()
  }

  changed() {
    this.render([
      ioButton({ label: 'Pad', action: () => this._select('pad', 'white') }),
      ...TERMINAL_COLORS.map((c) =>
        ioButton({ label: c, action: () => this._select('terminal', c) }),
      ),
      ioButton({
        label: 'Line (top)',
        action: () => this.dispatch('editor-select', { mode: 'line', layer: 0 }, true),
      }),
      ioButton({
        label: 'Line (bottom)',
        action: () => this.dispatch('editor-select', { mode: 'line', layer: -1 }, true),
      }),
      ioButton({ label: 'Delete', action: () => this._select('delete', 'red') }),
    ])
  }

  private _select(mode: DrawMode, color: string) {
    this.dispatch('editor-select', { mode, color }, true)
  }
}

export const circuitsEditor = CircuitsEditor.vConstructor
