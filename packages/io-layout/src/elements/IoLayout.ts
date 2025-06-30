import { Register, IoElement, VDOMElement, IoElementProps, ReactiveProperty, Property } from 'io-gui';
import { MenuOptions, MenuItem } from 'io-menus';
import { ioSplit, SplitData } from './IoSplit.js';

export type IoLayoutProps = IoElementProps & {
  split?: SplitData,
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
  declare split: SplitData;

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
    this.dispatchEvent('object-mutated', {object: this.split}, false, window);
  }
  onPanelDataChanged(event: CustomEvent) {
    this.dispatchEvent('object-mutated', {object: this.split}, false, window);
  }
  elementsChanged() {
    if (this.addMenuItem) {
      this.addMenuItem.options?.dispose();
      this.addMenuItem.dispose();
    }
    const items: MenuItem[] = [];
    for (let i = 0; i < this.elements.length; i++) {
      const id = this.elements[i].props?.id;
      if (id) {
        items.push(new MenuItem({
          mode: 'none',
          id: id,
          label: this.elements[i].props?.label || id,
          icon: this.elements[i].props?.icon || '',
          hint: this.elements[i].props?.hint || '',
        }));
      }
    }
    this.addMenuItem = new MenuItem({
      mode: 'none',
      options: new MenuOptions({items}),
    });
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