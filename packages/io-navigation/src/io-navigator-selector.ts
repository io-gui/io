import { VDOMArray, Register, Property, ArgsWithBinding } from 'io-gui';
import { IoNavigatorBase, IoNavigatorBaseArgs } from './io-navigator-base.js';
import { ioSelector } from './io-selector.js';

export type IoNavigatorSelectorArgs = IoNavigatorBaseArgs & ArgsWithBinding<{
  select?: 'first' | 'last';
  cache?: boolean;
  precache?: boolean;
}>;

@Register
export class IoNavigatorSelector extends IoNavigatorBase {

  @Property('first')
  declare select: 'first' | 'last';

  @Property(false)
  declare cache: boolean;

  @Property(false)
  declare precache: boolean;

  getSlotted(): VDOMArray {
    return ioSelector({options: this.options, cache: this.cache, precache: this.precache, select: this.select, elements: this.elements});
  }
  static vDOM: (arg0?: IoNavigatorSelectorArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
}
export const ioNavigatorSelector = IoNavigatorSelector.vDOM;