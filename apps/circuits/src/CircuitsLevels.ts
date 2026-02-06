import { IoElement, Register, div, a, h1 } from '@io-gui/core'

const LEVEL_IDS: string[] = [];
for (let set = 1; set <= 4; set++) {
  for (let lvl = 1; lvl <= 24; lvl++) {
    LEVEL_IDS.push(`lvl_0${set}${String(lvl).padStart(2, '0')}`);
  }
}

@Register
export class CircuitsLevels extends IoElement {
  static get Style() {
    return /* css */`
      :host > .app-title {
        margin-left: 1rem;
        font-size: 2rem;
        font-weight: bold;
        letter-spacing: 2px;
        text-transform: uppercase;
      }
      :host > .level-list {
        display: flex;
        flex-direction: column;
      }
      :host > .level-list > a {
        display: block;
        padding: 0.125em 1em;
        cursor: pointer;
      }
      :host > .level-list > a:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      :host > .level-list > a:active {
        background: rgba(255, 255, 255, 0.2);
      }
    `
  }

  ready() {
    this.changed()
  }

  changed() {
    this.render([
      h1({class: 'app-title'}, 'Circuits'),
      div({class: 'level-list'},
        LEVEL_IDS.map((id) =>
          a({
            id: id,
            '@pointerdown': () => this._onLevelClick(id),
          }, `${id}`)
        )
      ),
    ])
  }

  private _onLevelClick(level: string): void {
    this.dispatch('level-select', { level }, true);
  }
}

export const circuitsLevels = CircuitsLevels.vConstructor
