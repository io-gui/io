import { Register, IoElement, VDOMElement, IoElementProps, ReactiveProperty, Property } from 'io-gui';
import { MenuItem } from 'io-menus';
import { ioSplit } from './IoSplit.js';
import { Split } from '../nodes/Split.js';

export type IoLayoutProps = IoElementProps & {
  split?: Split,
  elements?: VDOMElement[],
};

@Register
export class IoLayout extends IoElement {
  static vConstructor: (arg0?: IoLayoutProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
  static get Style() {
    return /* css */`
      :host {
        position: relative;
        display: flex;
        flex: 1 1 100%;
        max-width: 100%;
        max-height: 100%;
      }
      :host > io-split {
        max-width: 100%;
        max-height: 100%;
      }
    `;
  }

  @ReactiveProperty({type: Object, init: null})
  declare split: Split;

  @ReactiveProperty(Array)
  declare elements: VDOMElement[];

  @Property(MenuItem)
  declare private addMenuItem: MenuItem;

  static get Listeners() {
    return {
      'io-split-data-changed': 'onSplitDataChanged',
      'io-panel-data-changed': 'onPanelDataChanged',
    };
  }
  onSplitDataChanged(event: CustomEvent) {
    event.stopPropagation();
    this.debounce(this.onDataChangedDebounced, undefined, 1);
  }
  onPanelDataChanged(event: CustomEvent) {
    event.stopPropagation();
    this.debounce(this.onDataChangedDebounced, undefined, 1);
  }
  onDataChangedDebounced() {
    this.dispatch('object-mutated', {object: this.split}, false, window);
  }
  changed() {
    this.render([
      ioSplit({
        split: this.split,
        elements: this.elements,
        addMenuItem: this.addMenuItem,
      })
    ]);
  }
}
export const ioLayout = IoLayout.vConstructor;