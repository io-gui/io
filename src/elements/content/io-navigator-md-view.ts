import { VDOMArray } from '../../core/element.js';
import { Register } from '../../core/decorators/register.js';
import { Property } from '../../core/decorators/property.js';
import { IoNavigatorBase } from './io-navigator-base.js';

@Register
export class IoNavigatorMdView extends IoNavigatorBase {

  @Property({type: Array})
  declare strip: string[];

  @Property(true)
  declare sanitize: boolean;

  getSlotted(): VDOMArray {
    const src = this.options.last;
    return ['io-scroller', {options: this.options}, [
      ['io-markdown', {src, strip: this.strip, sanitize: this.sanitize}]
    ]];
  }
}
