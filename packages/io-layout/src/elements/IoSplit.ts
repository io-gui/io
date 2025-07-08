import { Register, ReactiveProperty, VDOMElement, IoElement, IoElementProps, Property, ThemeSingleton } from 'io-gui';
import { MenuItem } from 'io-menus';
import { ioPanel } from './IoPanel.js';
import { ioDivider } from './IoDivider.js';
import { Split } from '../nodes/Split.js';
import { Panel } from '../nodes/Panel.js';

export type IoSplitProps = IoElementProps & {
  split?: Split,
  elements?: VDOMElement[],
  addMenuItem?: MenuItem,
};

@Register
export class IoSplit extends IoElement {
  static vConstructor: (arg0?: IoSplitProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        overflow: hidden;
        flex-direction: row;
      }
      :host[orientation='vertical'] {
        flex-direction: column;
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
      'io-divider-move': 'onDividerMove',
      'io-divider-move-end': 'onDividerMoveEnd',
      'io-panel-remove': 'onPanelRemove',
      'io-split-remove': 'onSplitRemove',
      'io-split-convert-to-panel': 'onSplitConvertToPanel',
    };
  }

  constructor(args: IoSplitProps = {}) { super(args); }

  onDividerMove(event: CustomEvent) {
    event.stopPropagation();
    const index = event.detail.index;
    const rect = this.getBoundingClientRect();
    const orientation = this.split.orientation;

    const dividerSize = ThemeSingleton.spacing3;
    const totalSpace = (orientation === 'horizontal' ? rect.width : rect.height) - dividerSize * (this.children.length - 1) / 2;
    const minSize = orientation === 'horizontal' ? ThemeSingleton.fieldHeight * 4 : ThemeSingleton.fieldHeight;

    const splits = [];
    const splitSizes = [];
    const splitResize = [];

    for (let i = 0; i < this.children.length; i += 2) {
      const splitElement = this.children[i] as HTMLElement;

      const splitRect = splitElement.getBoundingClientRect();
      const splitSize = orientation === 'horizontal' ? splitRect.width : splitRect.height;

      let x = event.detail.clientX - splitRect.left - dividerSize / 2;
      let y = event.detail.clientY - splitRect.top - dividerSize / 2;
      if (i === this.children.length - 1) {
        // NOTE: The last panel should be sized from the end.
        x = rect.width - (event.detail.clientX - rect.left) - dividerSize / 2;
        y = rect.height - (event.detail.clientY - rect.top) - dividerSize / 2;
      }
      let size = orientation === 'horizontal' ? x : y;

      splits.push(splitElement);
      splitSizes.push(splitSize);
      splitResize.push(size);
    }

    let fixedSpaceBefore = 0;
    let fixedSpaceAfter = 0;
    let flexSpace = 0;
    let flexCountBefore = 0;
    let flexCountAfter = 0;

    for (let i = 0; i < splits.length; i++) {
      let idx = index;
      if (idx === splits.length - 2) {
        // NOTE: The last divider manipulates the panel after the split.
        idx = splits.length - 1;
      }
      if (splits[i].style.flex.endsWith('%')) {
        flexSpace += splitSizes[i];
        if (i < idx) {
          flexCountBefore++;
        } else if (i > idx) {
          flexCountAfter++;
        }
      } else {
        if (i < idx) {
          fixedSpaceBefore += splitSizes[i];
        } else if (i > idx) {
          fixedSpaceAfter += splitSizes[i];
        }
      }
    }

    if (index === 0) {
      const maxSize = totalSpace - minSize * flexCountAfter - fixedSpaceAfter;
      const size = Math.max(minSize, Math.min(maxSize, splitResize[0]));
      // Set fixed size for the first panel.
      splits[index].style.flex = `0 0 ${size}px`;
      // Prevent flex splits from compressing below minSize.
      for (let i = 0; i < splits.length; i++) {
        if (splits[i].style.flex.endsWith('%')) {
          if (i !== index) {
            splits[i].style.flex = `1 1 ${Math.max(minSize, splitSizes[i]) / flexSpace * 100}%`;
          }
        }
      }

    } else if (index === splits.length - 2) {
      const maxSize = totalSpace - minSize * flexCountBefore - fixedSpaceBefore;
      const size = Math.max(minSize, Math.min(maxSize, splitResize[index + 1]));
      // Set fixed size for the last panel.
      splits[index + 1].style.flex = `0 0 ${size}px`;
      // Prevent flex splits from compressing below minSize.
      for (let i = 0; i < splits.length; i++) {
        if (splits[i].style.flex.endsWith('%')) {
          if (i !== index + 1) {
            splits[i].style.flex = `1 1 ${Math.max(minSize, splitSizes[i]) / flexSpace * 100}%`;
          }
        }
      }
    } else {
      const maxSize = splitSizes[index] + splitSizes[index + 1] - minSize;
      const size = Math.max(minSize, Math.min(maxSize, splitResize[index]));
      const sizeNext = splitSizes[index + 1] - (size - splitSizes[index]);
      // Apply flex sizes
      for (let i = 0; i < splits.length; i++) {
        if (splits[i].style.flex.endsWith('%')) {
          if (i === index) {
            splits[i].style.flex = `1 1 ${size / flexSpace * 100}%`;
          } else if (i === index + 1) {
            splits[i].style.flex = `1 1 ${sizeNext / flexSpace * 100}%`;
          } else {
            splits[i].style.flex = `1 1 ${Math.max(minSize, splitSizes[i]) / flexSpace * 100}%`;
          }
        }
      }
    }
  }

  onDividerMoveEnd(event: CustomEvent) {
    event.stopPropagation();
    let index = 0;
    for (let i = 0; i < this.children.length; i += 2) {
      const splitElement = this.children[i] as HTMLElement;
      this.split.children[index].flex = splitElement.style.flex;
      index++;
    }
    this.dispatch('io-split-data-changed', {}, true);
  }

  onPanelRemove(event: CustomEvent) {
    if (event.detail.panel === this.split) return;
    event.stopPropagation();
    this.split.remove(event.detail.panel);
    if (this.split.children.length === 0) {
      this.dispatch('io-split-remove', {split: this.split}, true);
    } else if (this.split.children.length === 1) {
      this.dispatch('io-split-convert-to-panel', {split: this.split}, true);
    } else {
      this.dispatch('io-split-data-changed', {}, true);
    }
  }

  onSplitRemove(event: CustomEvent) {
    if (event.detail.split === this.split) return;
    event.stopPropagation();
    this.split.remove(event.detail.split);
    this.dispatch('io-split-data-changed', {}, true);
  }

  onSplitConvertToPanel(event: CustomEvent) {
    if (event.detail.split === this.split) return;
    event.stopPropagation();
    this.split.convertToPanel(event.detail.split);
    this.dispatch('io-split-data-changed', {}, true);
  }

  splitMutated() {
    this.changed();
  }

  changed() {
    this.setAttribute('orientation', this.split.orientation);
    this.style.flex = this.split.flex;
    // TODO: Validate split
    const vChildren: VDOMElement[] = [];
    for (let i = 0; i < this.split.children.length; i++) {
      const child = this.split.children[i];
      if (child instanceof Split) {
        vChildren.push(ioSplit({
          split: child,
          style: {flex: child.flex},
          elements: this.elements,
          addMenuItem: this.addMenuItem,
        }));
      } else if (child instanceof Panel) {
        vChildren.push(ioPanel({
          panel: child,
          style: {flex: child.flex},
          elements: this.elements,
          addMenuItem: this.addMenuItem,
        }));
      } else debug: {
        console.warn('IOSplit: Invalid child type', child);
      }
      if (i < this.split.children.length - 1) {
        vChildren.push(ioDivider({orientation: this.split.orientation, index: i}));
      }
    }
    this.render(vChildren);
  }
}
export const ioSplit = IoSplit.vConstructor;




