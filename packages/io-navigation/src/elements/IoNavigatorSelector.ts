import { VDOMElement, Register, ReactiveProperty } from 'io-gui';
import { IoNavigatorBase, IoNavigatorBaseProps } from './IoNavigatorBase.js';
import { ioSelector } from './IoSelector.js';

export type IoNavigatorSelectorProps = IoNavigatorBaseProps & {
  select?: 'shallow' | 'deep',
  cache?: boolean,
  precache?: boolean,
};

@Register
export class IoNavigatorSelector extends IoNavigatorBase {
  static vConstructor: (arg0?: IoNavigatorSelectorProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;

  @ReactiveProperty('shallow')
  declare select: 'shallow' | 'deep';

  @ReactiveProperty(false)
  declare cache: boolean;

  @ReactiveProperty(false)
  declare precache: boolean;

  getSlotted(): VDOMElement {
    return ioSelector({options: this.options, cache: this.cache, precache: this.precache, select: this.select, elements: this.elements});
  }
}
export const ioNavigatorSelector = IoNavigatorSelector.vConstructor;