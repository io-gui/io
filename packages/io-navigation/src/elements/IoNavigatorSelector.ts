import { VDOMElement, Register, Property, PropsWithBinding } from 'io-gui';
import { IoNavigatorBase, IoNavigatorBaseProps } from './IoNavigatorBase.js';
import { ioSelector } from './IoSelector.js';

export type IoNavigatorSelectorProps = IoNavigatorBaseProps & PropsWithBinding<{
  select?: 'first' | 'last';
  cache?: boolean;
  precache?: boolean;
}>;

@Register
export class IoNavigatorSelector extends IoNavigatorBase {
  static vConstructor: (arg0?: IoNavigatorSelectorProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;

  @Property('first')
  declare select: 'first' | 'last';

  @Property(false)
  declare cache: boolean;

  @Property(false)
  declare precache: boolean;

  getSlotted(): VDOMElement {
    return ioSelector({options: this.options, cache: this.cache, precache: this.precache, select: this.select, elements: this.elements});
  }
}
export const ioNavigatorSelector = IoNavigatorSelector.vConstructor;