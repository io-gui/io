import { Register, ReactiveProperty, VDOMElement, IoElement, IoElementProps, Property, ThemeSingleton } from 'io-gui';
import { MenuItem } from 'io-menus';
import { PanelData, ioPanel } from './IoPanel.js';
import { ioDivider } from './IoDivider.js';

export type SplitData = {
  type: 'split',
  direction: 'row' | 'column',
  children: Array<SplitData | PanelData>,
  flex: string,
};

export type IoSplitProps = IoElementProps & {
  split?: SplitData,
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
      }
      :host[direction='column'] {
        flex-direction: column;
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
      'io-divider-move': 'onDividerMove',
      'io-divider-move-end': 'onDividerMoveEnd',
    };
  }

  constructor(args: IoSplitProps = {}) { super(args); }

  onDividerMove(event: CustomEvent) {
    event.stopPropagation();
    const index = event.detail.index;
    const rect = this.getBoundingClientRect();
    const dir = this.split.direction;

    const dividerSize = ThemeSingleton.spacing3;
    const totalSpace = (dir === 'row' ? rect.width : rect.height) - dividerSize * (this.children.length - 1) / 2;
    const minSize = dir === 'row' ? ThemeSingleton.fieldHeight * 4 : ThemeSingleton.fieldHeight;

    const splits = [];
    const splitSizes = [];
    const splitResize = [];

    for (let i = 0; i < this.children.length; i += 2) {
      const splitElement = this.children[i];

      const splitRect = splitElement.getBoundingClientRect();
      const splitSize = dir === 'row' ? splitRect.width : splitRect.height;

      let x = event.detail.clientX - splitRect.left - dividerSize / 2;
      let y = event.detail.clientY - splitRect.top - dividerSize / 2;
      if (i === this.children.length - 1) {
        // NOTE: The last panel should be sized from the end.
        x = rect.width - (event.detail.clientX - rect.left) - dividerSize / 2;
        y = rect.height - (event.detail.clientY - rect.top) - dividerSize / 2;
      }
      let size = dir === 'row' ? x : y;

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
      const splitElement = this.children[i];
      this.split.children[index].flex = splitElement.style.flex;
      index++;
    }
    this.dispatchEvent('io-split-data-changed', {split: this.split}, true);
  }

  changed() {
    this.setAttribute('direction', this.split.direction);
    this.style.flex = this.split.flex;
    // TODO: Validate split
    const vChildren: VDOMElement[] = [];
    for (let i = 0; i < this.split.children.length; i++) {
      const child = this.split.children[i];
      if (child.type === 'split') {
        vChildren.push(ioSplit({
          split: child,
          elements: this.elements,
          addMenuItem: this.addMenuItem,
        }));
      } else if (child.type === 'panel') {
        vChildren.push(ioPanel({
          panel: child,
          elements: this.elements,
          addMenuItem: this.addMenuItem,
        }));
      } else debug: {
        console.warn('IOSplit: Invalid child type', child);
      }
      if (i < this.split.children.length - 1) {
        vChildren.push(ioDivider({direction: this.split.direction, index: i}));
      }
    }

    this.render(vChildren);
  }
}
export const ioSplit = IoSplit.vConstructor;




