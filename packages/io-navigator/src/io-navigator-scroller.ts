import { VDOMArray, Register } from 'io-gui';
import { IoNavigatorBase } from './io-navigator-base.js';
import './io-scroller.js';

@Register
export class IoNavigatorScroller extends IoNavigatorBase {
  getSlotted(): VDOMArray {
    return ['io-scroller', {options: this.options}, this.elements];
  }
}
