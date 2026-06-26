import { NudgeDirection, Property, Register } from '@io-gui/core'
import { ioIcon } from '@io-gui/icons'
import { IoMenuItem } from './IoMenuItem.js'

@Register
export class IoMenuHamburger extends IoMenuItem {
  static override get Style() {
    return /* css */`
      :host {
        display: flex;
        flex-shrink: 0;
      }
      :host > * {
        pointer-events: none;
        text-overflow: ellipsis;
      }
    `
  }

  @Property({value: 'down', reflect: true})
  declare direction: NudgeDirection

  override mutated() {
    this.render([ioIcon({value: 'io:hamburger'})])
  }
}
export const ioMenuHamburger = IoMenuHamburger.vConstructor