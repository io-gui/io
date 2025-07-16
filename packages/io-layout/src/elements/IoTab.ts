import { Register, ReactiveProperty, span, ThemeSingleton } from 'io-gui';
import { IoField, IoFieldProps, ioField, ioString } from 'io-inputs';
import { IoContextEditorSingleton } from 'io-editors';
import { IconsetDB, ioIcon } from 'io-icons';
import { MenuItemProps, MenuOptions, ioOptionSelect } from 'io-menus';
import { IoTabs } from './IoTabs.js';
import { IoPanel } from './IoPanel.js';
import { Tab } from '../nodes/Tab.js';
import { tabDragIconSingleton } from './IoTabDragIcon.js';

const icons = [];
for (const set of Object.keys(IconsetDB)) {
  for (const icon of Object.keys(IconsetDB[set])) {
    const id = `${set}:${icon}`;
    icons.push({value: id, label: icon, icon: id});
  }
}

const iconOptions = ioOptionSelect({label: 'Select', options: new MenuOptions({items: icons as MenuItemProps[]})});

export type IoTabProps = IoFieldProps & {
  tab: Tab,
};

let _dragStartX = 0;
let _dragStartY = 0;

// TODO: fix and improve keyboard navigation in all cases.
@Register
export class IoTab extends IoField {
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        position: relative;
        height: inherit;
        min-height: inherit;
        /* TODO: use vars for this */
        min-width: calc(var(--io_fieldHeight) * 1.25);
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
      :host[overflow]:not([selected]) > .io-close-icon {
        display: none;
      }
      :host[selected]:focus {
        color: var(--io_colorWhite);
        z-index: 2;
      }
      :host > .io-icon:not([value=' ']) {
        margin: 0 var(--io_spacing2) 0 0;
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
        overflow: hidden; 
        text-overflow: ellipsis !important;
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
        transform: scale(0.4);
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
        transform: scale(0.5);
        fill: var(--io_colorStrong);
        stroke: var(--io_colorStrong);
      }
    `;
  }

  @ReactiveProperty({type: Tab})
  declare tab: Tab;

  @ReactiveProperty({type: Boolean, reflect: true})
  declare overflow: boolean;

  static get Listeners() {
    return {
      'click': 'preventDefault',
      'contextmenu': 'preventDefault',
    };
  }

  constructor(args: IoTabProps) { super(args); }

  onResized() {
    const span = this.querySelector('span')!;
    this.overflow = span.scrollWidth > span.clientWidth;
  }
  preventDefault(event: Event) {
    event.stopPropagation();
    event.preventDefault();
  }
  onPointerdown(event: PointerEvent) {
    event.preventDefault();
    event.stopPropagation();
    _dragStartX = event.clientX;
    _dragStartY = event.clientY;
    this.setPointerCapture(event.pointerId);
    super.onPointerdown(event);
    if (event.buttons === 2) {
      this.expandContextEditor();
    } else {
      this.focus();
    }
  }
  onPointermove(event: PointerEvent) {
    event.preventDefault();
    if (event.buttons !== 1) return;
    const panel = this.parentElement!.parentElement as IoPanel;
    if (!tabDragIconSingleton.dragging) {
      const dx = Math.abs(_dragStartX - event.clientX);
      const dy = Math.abs(_dragStartY - event.clientY);
      if (dx > 10 || dy > 10) {
        tabDragIconSingleton.setProperties({
          tab: this.tab,
          dragging: true,
          dropSource: panel,
          dropTarget: null,
          dropIndex: -1,
        });
        tabDragIconSingleton.style.top = event.clientY + 'px';
        tabDragIconSingleton.style.left = event.clientX + 'px';
      }
      return;
    }
    tabDragIconSingleton.style.top = event.clientY + 'px';
    tabDragIconSingleton.style.left = event.clientX + 'px';

    const x = event.clientX;
    const y = event.clientY;
    const m = ThemeSingleton.spacing;
    const tabsContainers = document.querySelectorAll('io-tabs');
    for (let i = 0; i < tabsContainers.length; i++) {
      const tabsContainer = tabsContainers[i] as IoTabs;
      const targetPanel = tabsContainer.parentElement as IoPanel;
      const tcr = tabsContainer.getBoundingClientRect();
      if (y >= tcr.top && y <= tcr.bottom && x >= tcr.left && x <= tcr.right) {
        const tabs = tabsContainer.querySelectorAll('io-tab');
        if (tabs.length === 0) {
          tabDragIconSingleton.setProperties({
            dropTarget: targetPanel,
            splitDirection: 'none',
            dropIndex: 0,
          });
          return;
        }
        for (let j = 0; j < tabs.length; j++) {
          const tab = tabs[j] as IoTab;
          const tr = tab.getBoundingClientRect();
          const isLast = j === tabs.length - 1;
          // TODO: consider hovering empty tab space.
          if (y >= tr.top - m && y <= tr.bottom + m && x >= tr.left - m && (x <= tr.right + m || isLast && x <= tcr.right)) {
            const side = x < tr.left + tr.width / 2 ? 'left' : 'right';
            const dropIndex = side === 'left' ? j : j + 1;
            tabDragIconSingleton.setProperties({
              dropTarget: targetPanel,
              splitDirection: 'none',
              dropIndex: dropIndex,
            });
            return;
          }
        }
      }
    }

    const panels = document.querySelectorAll('io-panel');
    for (let i = 0; i < panels.length; i++) {
      const targetPanel = panels[i] as IoPanel;
      const pr = targetPanel.getBoundingClientRect();
      if (y >= pr.top && y <= pr.bottom && x >= pr.left && x <= pr.right) {
        // get xy relative to panel center
        const rx = (x - pr.left - pr.width / 2) / pr.width * 2;
        const ry = (y - pr.top - pr.height / 2) / pr.height * 2;
        let direction = 'none';

        if (Math.abs(rx) < 0.5 && Math.abs(ry) < 0.5) {
          direction = 'center';
        } else if (ry > 0 && Math.abs(ry) > Math.abs(rx)) {
          direction = 'bottom';
        } else if (ry < 0 && Math.abs(ry) > Math.abs(rx)) {
          direction = 'top';
        } else if (rx > 0 && Math.abs(rx) > Math.abs(ry)) {
          direction = 'right';
        } else if (rx < 0 && Math.abs(rx) > Math.abs(ry)) {
          direction = 'left';
        }

        tabDragIconSingleton.setProperties({
          dropTarget: targetPanel,
          splitDirection: direction,
          dropIndex: -1,
        });
        return;
      }
    }
  }
  onPointerup(event: PointerEvent) {
    event.preventDefault();
    super.onPointerup(event);
    this.releasePointerCapture(event.pointerId);
    if (tabDragIconSingleton.dragging) {
      const source = tabDragIconSingleton.dropSource;
      const target = tabDragIconSingleton.dropTarget;
      const index = tabDragIconSingleton.dropIndex;
      const direction = tabDragIconSingleton.splitDirection;

      if (target && index !== -1) {
        if (source && source !== target) {
          source.removeTab(this.tab);
        }
        target.addTab(this.tab, index);
      } else if (source && target && direction !== 'none') {
        target.moveTabToSplit(source, this.tab, direction);
      }

      tabDragIconSingleton.setProperties({
        dragging: false,
        dropSource: null,
        dropTarget: null,
        splitDirection: 'none',
        dropIndex: -1,
      });
    } else {
      this.onClick();
    }
  }
  onPointercancel(event: PointerEvent) {
    event.preventDefault();
    event.stopPropagation();
    super.onPointercancel(event);
    tabDragIconSingleton.setProperties({
      dragging: false,
      dropSource: null,
      dropTarget: null,
      splitDirection: 'none',
      dropIndex: -1,
    });
  }
  onPointerleave(event: PointerEvent) {
    event.preventDefault();
    event.stopPropagation();
    super.onPointerleave(event);
    tabDragIconSingleton.setProperties({
      dragging: false,
      dropSource: null,
      dropTarget: null,
      splitDirection: 'none',
      dropIndex: -1,
    });
  }
  onClick() {
    this.dispatch('io-edit-tab', {tab: this.tab, key: 'Select'}, true);
  }
  onDeleteClick() {
    this.dispatch('io-edit-tab', {tab: this.tab, key: 'Backspace'}, true);
  }
  expandContextEditor() {
    IoContextEditorSingleton.expand({
      source: this,
      direction: 'down',
      value: this.tab,
      properties: ['id', 'label', 'icon'],
      orientation: 'horizontal',
      config: new Map([
        [Object, [
          ['id', ioField({inert: true})],
          ['label', ioString({live: true})],
          ['icon', iconOptions],
        ]],
      ]),
    });
  }
  onKeydown(event: KeyboardEvent) {
    if (event.shiftKey && ['Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      this.dispatch('io-edit-tab', {tab: this.tab, key: event.key}, true);
    } else if (event.shiftKey && event.key === 'Enter') {
      this.expandContextEditor();
    } else {
      super.onKeydown(event);
    }
  }
  tabMutated() {
    this.changed();
  }
  changed() {
    this.setAttribute('selected', this.tab.selected);
    this.render([
      this.tab.selected ? span({class: 'marker'}) : null,
      ioIcon({class: 'io-icon', value: this.tab.icon || ' '}),
      span({class: 'label'}, this.tab.label),
      ioIcon({value: 'io:close', size: 'small', class: 'io-close-icon', '@click': this.onDeleteClick, '@pointerdown': this.preventDefault}),
    ]);
  }
}

export const ioTab = function(arg0: IoTabProps) {
  return IoTab.vConstructor(arg0);
};
