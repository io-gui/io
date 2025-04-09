import { VDOMElement, Register } from 'io-gui';
import { IoNavigatorBase } from './io-navigator-base.js';
import { ioScroller } from './io-scroller.js';

@Register
export class IoNavigatorScroller extends IoNavigatorBase {
  getSlotted(): VDOMElement {
    return ioScroller({options: this.options}, this.elements);
  }
}
export const ioNavigatorScroller = IoNavigatorScroller.vConstructor;