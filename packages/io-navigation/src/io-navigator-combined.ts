import { VDOMArray, Register } from 'io-gui';
import { IoNavigatorSelector } from './io-navigator-selector.js';
import { ioScroller } from './io-scroller.js';
import { ioSelector } from './io-selector.js';

@Register
export class IoNavigatorCombined extends IoNavigatorSelector {
  static get Style() {
    return /* css */`
      :host > io-scroller > io-selector {
        overflow: unset !important;
      }
    `;
  }
  getSlotted(): VDOMArray {
    return ioScroller({options: this.options}, [
      ioSelector({options: this.options, cache: this.cache, precache: this.precache, select: this.select, elements: this.elements})
    ]);
  }
}
export const ioNavigatorCombined = IoNavigatorCombined.vConstructor;