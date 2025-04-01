import { VDOMArray, Register } from 'io-gui';
import { IoNavigatorBase } from './io-navigator-base.js';
import { ioScroller } from './io-scroller.js';

@Register
export class IoNavigatorScroller extends IoNavigatorBase {
  getSlotted(): VDOMArray {
    return ioScroller({options: this.options}, this.elements);
  }
}
export const ioNavigatorScroller = IoNavigatorScroller.vDOM;