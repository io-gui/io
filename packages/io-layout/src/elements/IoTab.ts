import { Register, ReactiveProperty, Property, span, VDOMElement } from 'io-gui';
import { IoField, IoFieldProps } from 'io-inputs';
import { ioIcon } from 'io-icons';
import { MenuItem } from 'io-menus';
import { IoPanel } from './IoPanel.js';

export type TabEditCommand = 'delete' | 'shiftLeft' | 'shiftRight' | 'shiftUp' | 'shiftDown' | 'shiftStart' | 'shiftEnd';

export type TabData = {
  id?: string,
  label?: string,
  icon?: string,
  hint?: string,
}

export type IoTabProps = IoFieldProps & {
  item?: MenuItem,
  $parent?: IoPanel,
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
        padding: 0;
        /* padding-right: var(--io_lineHeight); */
        height: inherit;
        min-height: inherit;
        margin: var(--io_spacing);
        margin-bottom: calc(-1 * var(--io_borderWidth));
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        border-color: var(--io_borderColorLight);
        border-bottom-color: transparent;
        user-select: none;
        margin-right: var(--io_spacing);
      }
      :host[selected] {
        color: var(--io_colorStrong);
        background-color: var(--io_bgColorLight);
        border-color: var(--io_borderColorStrong);
        border-bottom-color: var(--io_bgColorLight);
      }
      :host[selected]:focus {
        color: var(--io_colorWhite);
      }
      :host:not([selected]) {
        margin-bottom: var(--io_borderWidth) !important;
      }
      :host > * {
        pointer-events: none;
        display: inline-block;
        white-space: nowrap;
        padding: 0 var(--io_spacing);
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
        visibility: hidden;
      }
      :host > .io-close-icon {
        position: absolute;
        right: var(--io_spacing);
        top: 0;
        pointer-events: inherit;
      }
      :host > .io-close-icon:hover {
        fill: var(--io_colorStrong);
        stroke: var(--io_colorStrong);
      }
    `;
  }

  @ReactiveProperty({type: MenuItem})
  declare item: MenuItem;

  @Property(undefined)
  declare $parent?: IoPanel;

  // static get Listeners(): any {
  //   return {
  //     'click': 'preventDefault'
  //   };
  // }

  constructor(args: IoTabProps = {}) { super(args); }

  // debug: if (items[i].options?.length) console.warn('IoPanel: Tab options should not have sub-options!');

  preventDefault(event: Event) {
    event.stopPropagation();
    event.preventDefault();
  }
  onPointerdown(event: PointerEvent) {
    super.onPointerdown(event);
    event.stopPropagation();
    this.setPointerCapture(event.pointerId);
    // this.expanded = true;
    // onOverlayPointerdown.call(this, event);
  }
  onPointermove(event: PointerEvent) {
    // if (event.pointerType === 'touch') {
    //   if (!this.expanded && !this.inoverlay) return;
    // }
    // onOverlayPointermove.call(this, event);
  }
  onPointerup(event: PointerEvent) {
    super.onPointerup(event);
    event.stopPropagation();
    this.releasePointerCapture(event.pointerId);
    this.onPointerupAction(event);
  }
  onPointerupAction(event: PointerEvent) {
    this.onClick();
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
  }
  itemMutated() {
    this.changed();
  }
  changed() {
    this.hidden = this.item.hidden;
    this.render([
      ioIcon({value: this.item.icon || ' '}),
      span({class: 'label'}, this.item.label),
      span({class: 'hint'}, this.item.hint || ''),
      ioIcon({value: 'io:close_small', size: 'small', class: 'io-close-icon', '@click': this.onCloseClick, '@pointerdown': this.preventDefault}),
    ]);
  }
}
export const ioTab = IoTab.vConstructor;




