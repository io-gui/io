import { Register, ReactiveProperty, span, VDOMElement, ThemeSingleton, nudge } from 'io-gui';
import { IoField, IoFieldProps } from 'io-inputs';
import { IoContextEditorSingleton } from 'io-editors';
import { ioIcon } from 'io-icons';
import { MenuItem } from 'io-menus';
import { IoTabs } from './IoTabs.js';
import { tabDragIconSingleton } from './IoTabDragIcon.js';
import { IoPanel } from './IoPanel.js';

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
        padding-right: var(--io_lineHeight);
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
      :host:not(:hover) > .io-close-icon {
        opacity: 0;
        transform: scale(0.2);
        transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), opacity linear 0.2s;
      }
      :host:hover > .io-close-icon {
        opacity: 1;
        transform: scale(0.5);
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
        transform: scale(0.75);
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
        properties: ['id', 'label', 'icon'],
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
      dropSource: this.parentElement as IoTabs,
      dropTarget: null,
      dropIndex: -1,
    });
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
        if (tabs.length === 0) {
          tabDragIconSingleton.dropTarget = tabsContainer;
          tabDragIconSingleton.dropIndex = 0;
          break;
        }
        for (let j = 0; j < tabs.length; j++) {
          const tab = tabs[j] as unknown as IoTab;
          const tr = tab.getBoundingClientRect();
          const isLast = j === tabs.length - 1;
          // TODO: consider hovering empty tab space.
          if (y >= tr.top - m && y <= tr.bottom + m && x >= tr.left - m && (x <= tr.right + m || isLast && x <= tcr.right)) {
            const side = x < tr.left + tr.width / 2 ? 'left' : 'right';
            const dropIndex = side === 'left' ? j : j + 1;
            tabDragIconSingleton.dropTarget = tabsContainer;
            tabDragIconSingleton.dropIndex = dropIndex;
          }
        }
      }
    }
  }
  onPointerup(event: PointerEvent) {
    event.preventDefault();
    super.onPointerup(event);
    this.releasePointerCapture(event.pointerId);
    if (tabDragIconSingleton.dragging) {
      const dropSource = tabDragIconSingleton.dropSource;
      const dropTarget = tabDragIconSingleton.dropTarget;
      const dropIndex = tabDragIconSingleton.dropIndex;

      if (dropTarget && dropIndex !== -1) {
        const targetPanel = dropTarget.parentElement as IoPanel;
        targetPanel.addTab(this.item, dropIndex);
        if (dropSource && dropSource !== dropTarget) {
          const sourcePanel = dropSource.parentElement as IoPanel;
          sourcePanel.removeTab(this.item);
        }
      }

      tabDragIconSingleton.setProperties({
        item: new MenuItem({}),
        dragging: false,
        dropSource: null,
        dropTarget: null,
        dropIndex: -1,
      });
    } else {
      this.onClick();
    }
  }
  onClick() {
    this.item.selected = true;
  }
  onCloseClick() {
    this.dispatch('io-edit-tab-item', {item: this.item, key: 'Backspace'}, true);
  }
  onKeydown(event: KeyboardEvent) {
    if (event.shiftKey && ['Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      this.dispatch('io-edit-tab-item', {item: this.item, key: event.key}, true);
    } else {
      super.onKeydown(event);
    }
  }
  itemChanged() {
    this.setProperties({
      selected: this.item.bind('selected'),
      disabled: this.item.bind('disabled'),
    });
    debug: if (this.item.options?.items.length) console.warn('IoTab: Tab item should not have sub-options!');
  }
  itemMutated() {
    // TODO: consider using Tab(s) instead of MenuItem(s).
    this.changed();
  }
  changed() {
    this.hidden = this.item.hidden;
    this.render([
      this.item.selected ? span({class: 'marker'}) : null,
      ioIcon({value: this.item.icon || ' '}),
      span({class: 'label'}, this.item.label),
      ioIcon({value: 'io:close', size: 'small', class: 'io-close-icon', '@click': this.onCloseClick, '@pointerdown': this.preventDefault}),
    ]);
  }
}
export const ioTab = IoTab.vConstructor;




