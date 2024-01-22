import { VDOMArray } from '../../core/element.js';
import { RegisterIoNode } from '../../core/node.js';
import { IoNavigatorSelector } from './io-navigator-selector.js';
import './io-scroller.js';

@RegisterIoNode
export class IoNavigatorCombined extends IoNavigatorSelector {
  static get Style() {
    return /* css */`
      :host > io-scroller > io-selector {
        overflow: unset !important;
      }
    `;
  }
  getSlotted(): VDOMArray {
    return ['io-scroller', {options: this.options}, [
      ['io-selector', {options: this.options, cache: this.cache, precache: this.precache, select: this.select, elements: this.elements}]
    ]];
  }
}
