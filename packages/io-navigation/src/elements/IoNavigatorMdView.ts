import { VDOMElement, Register, ReactiveProperty } from 'io-gui';
import { IoNavigatorBase, IoNavigatorBaseProps } from './IoNavigatorBase.js';
import { ioScroller } from './IoScroller.js';
import { ioMarkdown } from 'io-markdown';

export type IoNavigatorMdViewProps = IoNavigatorBaseProps & {
  strip?: string[],
  sanitize?: boolean,
};

@Register
export class IoNavigatorMdView extends IoNavigatorBase {
  static vConstructor: (arg0?: IoNavigatorMdViewProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;

  @ReactiveProperty({type: Array})
  declare strip: string[];

  @ReactiveProperty(true)
  declare sanitize: boolean;

  getSlotted(): VDOMElement {
    const src = this.options.selected;
    return ioScroller({options: this.options}, [
      ioMarkdown({src, strip: this.strip, sanitize: this.sanitize})
    ]);
  }
}
export const ioNavigatorMdView = IoNavigatorMdView.vConstructor;