import { Register, IoElement, VDOMElement, IoElementProps, ReactiveProperty, Property } from 'io-gui';
import { MenuOption } from 'io-menus';
import { ioSplit } from './IoSplit.js';
import { Split } from '../nodes/Split.js';

export type IoLayoutProps = IoElementProps & {
  split: Split,
  elements: VDOMElement[],
  addMenuOption: MenuOption,
};

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
    `;
  }

  @ReactiveProperty({type: Object})
  declare split: Split;

  @ReactiveProperty(Array)
  declare elements: VDOMElement[];

  @Property({type: MenuOption})
  declare private addMenuOption: MenuOption;

  changed() {
    this.render([
      ioSplit({
        split: this.split,
        elements: this.elements,
        addMenuOption: this.addMenuOption,
      })
    ]);
  }
}

export const ioLayout = function(arg0: IoLayoutProps) {
  return IoLayout.vConstructor(arg0);
};