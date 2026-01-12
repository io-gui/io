import { Register, IoElement, VDOMElement, IoElementProps, ReactiveProperty, Property, Binding } from '@io-gui/core'
import { MenuOption } from '@io-gui/menus'
import { ioSplit } from './IoSplit.js'
import { Split } from '../nodes/Split.js'

export type IoLayoutProps = IoElementProps & {
  split: Split | Binding
  elements: VDOMElement[]
  addMenuOption?: MenuOption
  frozen?: boolean
}

@Register
export class IoLayout extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        position: relative;
        display: flex;
        flex: 1 1 100%;
        max-width: 100%;
        max-height: 100%;
      }
      :host > io-split {
        max-width: 100%;
        max-height: 100%;
      }
      :host[frozen] .io-close-icon,
      :host[frozen] .io-tabs-add-tab {
        display: none;
      }
    `
  }

  @ReactiveProperty({type: Object})
  declare split: Split

  @ReactiveProperty(Array)
  declare elements: VDOMElement[]

  @Property({type: MenuOption})
  declare addMenuOption: MenuOption | undefined

  @ReactiveProperty({type: Boolean, value: false, reflect: true})
  declare frozen: boolean

  changed() {
    this.render([
      ioSplit({
        split: this.split,
        elements: this.elements,
        addMenuOption: this.addMenuOption,
      })
    ])
  }
}

export const ioLayout = function(arg0: IoLayoutProps) {
  return IoLayout.vConstructor(arg0)
}