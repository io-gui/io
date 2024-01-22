import { VDOMArray } from '../../core/element.js';
import { RegisterIoNode } from '../../core/node.js';
import { IoNavigatorBase } from './io-navigator-base.js';
import './io-scroller.js';

@RegisterIoNode
export class IoNavigatorScroller extends IoNavigatorBase {
  getSlotted(): VDOMArray {
    return ['io-scroller', {options: this.options}, this.elements];
  }
}
