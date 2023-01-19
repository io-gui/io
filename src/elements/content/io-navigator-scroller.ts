import { RegisterIoElement, VDOMArray } from '../../core/element.js';
import { IoNavigatorBase } from './io-navigator-base.js';
import './io-scroller.js';

@RegisterIoElement
export class IoNavigatorScroller extends IoNavigatorBase {
  getSlotted(): VDOMArray {
    return ['io-scroller', {options: this.options}, this.elements];
  }
}
