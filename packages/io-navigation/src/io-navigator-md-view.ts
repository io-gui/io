import { VDOMArray, Register, Property } from 'io-gui';
import { IoNavigatorBase } from './io-navigator-base.js';
import { ioScroller } from './io-scroller.js';
import { ioMarkdown } from 'io-markdown';

@Register
export class IoNavigatorMdView extends IoNavigatorBase {

  @Property({type: Array})
  declare strip: string[];

  @Property(true)
  declare sanitize: boolean;

  getSlotted(): VDOMArray {
    const src = this.options.last;
    return ioScroller({options: this.options}, [
      ioMarkdown({src, strip: this.strip, sanitize: this.sanitize})
    ]);
  }
}
export const ioNavigatorMdView = IoNavigatorMdView.vDOM;