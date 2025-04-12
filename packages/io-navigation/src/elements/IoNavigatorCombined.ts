import { VDOMElement, Register } from 'io-gui';
import { IoNavigatorSelector } from './IoNavigatorSelector.js';
import { ioScroller } from './IoScroller.js';
import { ioSelector } from './IoSelector.js';

@Register
export class IoNavigatorCombined extends IoNavigatorSelector {
  static get Style() {
    return /* css */`
      :host > io-scroller > io-selector {
        overflow: unset !important;
      }
    `;
  }
  getSlotted(): VDOMElement {
    return ioScroller({options: this.options}, [
      ioSelector({options: this.options, cache: this.cache, precache: this.precache, select: this.select, elements: this.elements})
    ]);
  }
}
export const ioNavigatorCombined = IoNavigatorCombined.vConstructor;