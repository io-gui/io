import { RegisterIoElement, VDOMArray } from '../../core/element.js';
import { Property } from '../../core/internals/property.js';
import { IoNavigatorBase } from './io-navigator-base.js';

@RegisterIoElement
export class IoNavigatorSelector extends IoNavigatorBase {

  @Property('first')
  declare select: 'first' | 'last';

  @Property(false)
  declare cache: boolean;

  @Property(false)
  declare precache: boolean;

  getSlotted(): VDOMArray {
    return ['io-selector', {options: this.options, cache: this.cache, precache: this.precache, select: this.select, elements: this.elements}];
  }
}
