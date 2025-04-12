import { VDOMElement, Register } from 'io-gui';
import { IoNavigatorBase } from './IoNavigatorBase.js';
import { ioScroller } from './IoScroller.js';

@Register
export class IoNavigatorScroller extends IoNavigatorBase {
  getSlotted(): VDOMElement {
    return ioScroller({options: this.options}, this.elements);
  }
}
export const ioNavigatorScroller = IoNavigatorScroller.vConstructor;