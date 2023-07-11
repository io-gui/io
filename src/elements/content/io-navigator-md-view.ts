import { RegisterIoElement, VDOMArray } from '../../core/element.js';
import { Property } from '../../core/internals/property.js';
import { IoNavigatorBase } from './io-navigator-base.js';
import './io-md-view.js';

@RegisterIoElement
export class IoNavigatorMdView extends IoNavigatorBase {

  @Property({type: Array})
  declare strip: string[];

  @Property(true)
  declare sanitize: boolean;

  getSlotted(): VDOMArray {
    const src = this.options.last;
    return ['io-scroller', {options: this.options}, [
      ['io-md-view', {src, strip: this.strip, sanitize: this.sanitize}]
    ]];
  }
}
