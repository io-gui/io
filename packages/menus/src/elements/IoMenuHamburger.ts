import { NudgeDirection, Property, Register } from '@io-gui/core'
import { ioIcon } from '@io-gui/icons'
import { IoOption, IoOptionProps } from './IoOption.js'

@Register
export class IoMenuHamburger extends IoOption {
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
export const ioMenuHamburger = (arg0: IoOptionProps) => IoMenuHamburger.vConstructor(arg0)
