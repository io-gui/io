import { IoElement, Register } from '@io-gui/core'
import { MenuOption, ioMenuTree } from '@io-gui/menus'

@Register
export class CircuitsLevels extends IoElement {
  static get Style() {
    return /* css */ `
      :host > .app-title {
        margin-left: 1rem;
        font-size: 2rem;
        font-weight: bold;
        letter-spacing: 2px;
        text-transform: uppercase;
      }
    `
  }

  private _option = new MenuOption({ id: 'levels', options: [] })

  async ready() {
    await this._loadLevels()
    this.changed()
  }

  private async _loadLevels() {
    const response = await fetch('./public/levels/index.json')
    const levelIds: string[] = await response.json()
    this._option = new MenuOption({
      id: 'levels',
      options: levelIds.map((id) => ({
        id: id,
        action: () => this.dispatch('level-select', { level: id }, true),
      })),
    })
  }

  changed() {
    this.render([ioMenuTree({ option: this._option })])
  }
}

export const circuitsLevels = CircuitsLevels.vConstructor
