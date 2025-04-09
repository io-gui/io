import { VDOMElement, Register, Property, ArgsWithBinding } from 'io-gui';
import { IoNavigatorBase, IoNavigatorBaseArgs } from './io-navigator-base.js';
import { ioScroller } from './io-scroller.js';
import { ioMarkdown } from 'io-markdown';

export type IoNavigatorMdViewArgs = IoNavigatorBaseArgs & ArgsWithBinding<{
  strip?: string[];
  sanitize?: boolean;
}>;

@Register
export class IoNavigatorMdView extends IoNavigatorBase {
  static vConstructor: (arg0?: IoNavigatorMdViewArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;

  @Property({type: Array})
  declare strip: string[];

  @Property(true)
  declare sanitize: boolean;

  getSlotted(): VDOMElement {
    const src = this.options.last;
    return ioScroller({options: this.options}, [
      ioMarkdown({src, strip: this.strip, sanitize: this.sanitize})
    ]);
  }
}
export const ioNavigatorMdView = IoNavigatorMdView.vConstructor;