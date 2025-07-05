import { Register, ReactiveProperty, span, VDOMElement, ThemeSingleton, nudge } from 'io-gui';
import { IoField, IoFieldProps } from 'io-inputs';
import { IoContextEditorSingleton } from 'io-editors';
import { ioIcon } from 'io-icons';
import { MenuItem } from 'io-menus';
import { IoTabs } from './IoTabs.js';
import { tabDragIconSingleton } from './IoTabDragIcon.js';

export type TabEditCommand = 'delete' | 'shiftLeft' | 'shiftRight' | 'shiftUp' | 'shiftDown' | 'shiftStart' | 'shiftEnd';

export type TabData = {
  id?: string,
  label?: string,
  icon?: string,
  hint?: string,
}

export type IoTabProps = IoFieldProps & {
  item?: MenuItem,
};

// TODO: fix and improve keyboard navigation in all cases.
@Register
export class IoTab extends IoField {
  static vConstructor: (arg0?: IoTabProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        position: relative;
        height: inherit;
        min-height: inherit;
        margin: 0;
        margin-right: var(--io_spacing);
        background-color: var(--io_bgColor) !important;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        border-color: var(--io_borderColorLight);
        user-select: none;
      }
      :host[pressed] {
        border-color: unset !important;
        box-shadow: unset !important;
      }
      :host[selected] {
        color: var(--io_colorStrong);
        background-color: var(--io_bgColorLight) !important;
        border-color: var(--io_borderColorStrong);
        border-bottom-color: var(--io_bgColorLight);
        z-index: 1;
      }
      :host[selected]:focus {
        color: var(--io_colorWhite);
      }
      :host > .marker {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background-color: var(--io_bgColorBlue);
        border-bottom-right-radius: var(--io_borderRadius);
      }
      :host > span {
        padding: 0 var(--io_spacing);
      }
      :host > * {
        pointer-events: none;
        display: inline-block;
        white-space: nowrap;
      }
      :host > .label {}
      :host > .hint {
        overflow: hidden;
        text-overflow: ellipsis;
        color: var(--io_colorLight);
        padding-right: var(--io_spacing3);
      }
      :host > .hint:empty {
        padding-right: var(--io_lineHeight);
      }
      :host:not(:hover) > .io-close-icon {
        opacity: 0;
        transform: scale(1);
        transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), opacity linear 0.2s;
      }
      :host:hover > .io-close-icon {
        opacity: 1;
        transform: scale(1.5);
        transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), opacity linear 0.2s;
      }
      :host > .io-close-icon {
        position: absolute;
        right: var(--io_spacing);
        top: var(--io_spacing);
        pointer-events: inherit;
        background: linear-gradient(to right, transparent 0%, var(--io_bgColor) 25%);
      }
      :host[selected] > .io-close-icon {
        background: linear-gradient(to right, transparent 0%, var(--io_bgColorLight) 25%);
      }
      :host > .io-close-icon:hover {
        fill: var(--io_colorStrong);
        stroke: var(--io_colorStrong);
      }
    `;
  }

  @ReactiveProperty({type: MenuItem})
  declare item: MenuItem;

  static get Listeners() {
    return {
      'click': 'preventDefault',
      'contextmenu': 'preventDefault',
    };
  }

  constructor(args: IoTabProps = {}) { super(args); }

  preventDefault(event: Event) {
    event.stopPropagation();
    event.preventDefault();
  }
  onPointerdown(event: PointerEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (event.button === 2) {
      IoContextEditorSingleton.expand({
        value: this.item,
        properties: ['icon', 'label', 'hint'],
        orientation: 'horizontal',
      });
      setTimeout(() => {
        nudge(IoContextEditorSingleton, this, 'down');
      });
      return;
    }
    super.onPointerdown(event);
    this.focus();
    this.setPointerCapture(event.pointerId);
  }
  onPointermove(event: PointerEvent) {
    event.preventDefault();
    // TODO: implement minimum drag distance!
    tabDragIconSingleton.setProperties({
      item: this.item,
      dragging: true,
    });
    tabDragIconSingleton.dropTarget = null;
    tabDragIconSingleton.dropIndex = -1;
    tabDragIconSingleton.style.top = event.clientY + 'px';
    tabDragIconSingleton.style.left = event.clientX + 'px';

    const x = event.clientX;
    const y = event.clientY;
    const m = ThemeSingleton.spacing;
    const tabsContainers = document.querySelectorAll('io-tabs');
    for (let i = 0; i < tabsContainers.length; i++) {
      const tabsContainer = tabsContainers[i] as unknown as IoTabs;
      const tcr = tabsContainer.getBoundingClientRect();
      if (y >= tcr.top && y <= tcr.bottom && x >= tcr.left && x <= tcr.right) {
        const tabs = tabsContainer.querySelectorAll('io-tab');
        for (let j = 0; j < tabs.length; j++) {
          const tab = tabs[j] as unknown as IoTab;
          const tr = tab.getBoundingClientRect();
          const isLast = j === tabs.length - 1;
          // TODO: consider hovering empty tab space.
          if (y >= tr.top - m && y <= tr.bottom + m && x >= tr.left - m && (x <= tr.right + m || isLast && x <= tcr.right)) {
            const side = x < tr.left + tr.width / 2 ? 'left' : 'right';
            const dropIndex = side === 'left' ? j : j + 1;
            tabsContainer.dropIndex = dropIndex;
            tabDragIconSingleton.dropTarget = tabsContainer;
            tabDragIconSingleton.dropIndex = dropIndex;
          }
        }
      } else {
        tabsContainer.dropIndex = -1;
      }
    }
  }
  onPointerup(event: PointerEvent) {
    event.preventDefault();
    super.onPointerup(event);
    this.releasePointerCapture(event.pointerId);
    if (tabDragIconSingleton.dragging) {
      const dropTarget = tabDragIconSingleton.dropTarget;
      const dropIndex = tabDragIconSingleton.dropIndex;
      tabDragIconSingleton.setProperties({
        item: new MenuItem({}),
        dragging: false,
      });
      tabDragIconSingleton.dropTarget = null;
      tabDragIconSingleton.dropIndex = -1;
      const tabsContainers = document.querySelectorAll('io-tabs');
      for (let i = 0; i < tabsContainers.length; i++) {
        const tabsContainer = tabsContainers[i] as unknown as IoTabs;
        tabsContainer.dropIndex = -1;
      }

      if (dropTarget && dropIndex !== -1) {
        dropTarget.addTab(this.item); // TODO: addIndex?: number
        console.log('dropTarget', dropTarget);
        console.log('dropIndex', dropIndex);
      }
    } else {
      this.onClick();
    }
  }
  onClick() {
    this.item.selected = true;
  }
  onCloseClick() {
    this.dispatchEvent('io-edit-tab-item', {item: this.item, command: 'delete'}, true);
  }
  onKeydown(event: KeyboardEvent) {
    let command: TabEditCommand | null = null;

    if (event.key === 'Backspace' && event.shiftKey) {
      command = 'delete';
    } else if (event.key === 'ArrowLeft' && event.shiftKey) {
      command = 'shiftLeft';
    } else if (event.key === 'ArrowRight' && event.shiftKey) {
      command = 'shiftRight';
    } else if (event.key === 'ArrowUp' && event.shiftKey) {
      command = 'shiftUp';
    } else if (event.key === 'ArrowDown' && event.shiftKey) {
      command = 'shiftDown';
    } else if (event.key === 'Home' && event.shiftKey) {
      command = 'shiftStart';
    } else if (event.key === 'End' && event.shiftKey) {
      command = 'shiftEnd';
    }

    if (command) {
      event.preventDefault();
      switch (command) {
        case 'delete': {
          this.dispatchEvent('io-edit-tab-item', {item: this.item, command: 'delete'}, true);
          break;
        }
        case 'shiftLeft':
          this.dispatchEvent('io-edit-tab-item', {item: this.item, command: 'shiftLeft'}, true);
          break;
        case 'shiftRight':
          this.dispatchEvent('io-edit-tab-item', {item: this.item, command: 'shiftRight'}, true);
          break;
        case 'shiftUp':
          this.dispatchEvent('io-edit-tab-item', {item: this.item, command: 'shiftUp'}, true);
          break;
        case 'shiftDown':
          this.dispatchEvent('io-edit-tab-item', {item: this.item, command: 'shiftDown'}, true);
          break;
        case 'shiftStart':
          this.dispatchEvent('io-edit-tab-item', {item: this.item, command: 'shiftStart'}, true);
          break;
        case 'shiftEnd':
          this.dispatchEvent('io-edit-tab-item', {item: this.item, command: 'shiftEnd'}, true);
          break;
        default:
          break;
      }
    } else {
      super.onKeydown(event);
    }
  }
  itemChanged() {
    this.setProperties({
      selected: this.item.bind('selected'),
      disabled: this.item.bind('disabled'),
    });
    debug: if (this.item.options?.length) console.warn('IoTab: Tab item should not have sub-options!');
  }
  itemMutated() {
    // TODO: consider using TabData instead of MenuItem.
    this.changed();
  }
  changed() {
    this.hidden = this.item.hidden;
    this.render([
      this.item.selected ? span({class: 'marker'}) : null,
      ioIcon({value: this.item.icon || ' '}),
      span({class: 'label'}, this.item.label),
      span({class: 'hint'}, this.item.hint || ''),
      ioIcon({value: 'io:close_small', size: 'small', class: 'io-close-icon', '@click': this.onCloseClick, '@pointerdown': this.preventDefault}),
    ]);
  }
}
export const ioTab = IoTab.vConstructor;




