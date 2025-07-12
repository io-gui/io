import { Register, NodeArray, ReactiveProperty } from 'io-gui';
import { IoField, IoFieldProps } from 'io-inputs';
import { ioIcon } from 'io-icons';
import { Tab } from '../nodes/Tab.js';
import { IoTabsHamburgerMenuSingleton } from './IoTabsHamburgerMenuSingleton.js';

export type IoTabsHamburgerProps = IoFieldProps & {
  tabs: NodeArray<Tab>,
};

@Register
export class IoTabsHamburger extends IoField {
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        user-select: none;
        flex-shrink: 0;
      }
    `;
  }

  @ReactiveProperty({type: NodeArray, init: null})
  declare private tabs: NodeArray<Tab>;

  constructor(args: IoTabsHamburgerProps) { super(args); }

  onClick() {
    IoTabsHamburgerMenuSingleton.expand({
      source: this,
      direction: 'down',
      tabs: this.tabs,
    });
  }
  changed() {
    this.render([
      ioIcon({value: 'io:columns'})
    ]);
  }
}

export const ioTabsHamburger = function(arg0: IoTabsHamburgerProps) {
  return IoTabsHamburger.vConstructor(arg0);
};