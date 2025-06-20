import { Register, ReactiveProperty, Property, IoOverlaySingleton as Overlay, span, VDOMElement, WithBinding, NudgeDirection } from 'io-gui';
import { IoField, IoFieldProps } from 'io-inputs';
import { ioIcon } from 'io-icons';
import { MenuItem } from 'io-menus';
import { IoPanel } from './IoPanel.js';

export type TabEditCommand = 'delete' | 'shiftLeft' | 'shiftRight' | 'shiftUp' | 'shiftDown' | 'shiftStart' | 'shiftEnd';

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
        user-select: none;
        border-color: var(--io_borderColorLight);
      }
      :host[hidden] {
        display: none;
      }
      :host[selected] {
        background-color: var(--io_bgColorDimmed);
        border-color: var(--io_borderColor);
      }
      :host > * {
        pointer-events: none;
        text-overflow: ellipsis;
      }
      :host > .label {
        flex: 1 1 auto;
        padding: 0 var(--io_spacing);
      }
      :host:not(:hover) > .io-close-icon {
        visibility: hidden;
      }
      :host > .io-close-icon {
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

  @Property('false')
  declare contentEditable: boolean;

  @Property(undefined)
  declare $parent?: IoPanel;

  static get Listeners(): any {
    return {
      'click': 'preventDefault'
    };
  }

  constructor(args: IoTabProps = {}) { super(args); }

  // debug: if (items[i].options?.length) console.warn('IoPanel: Tab options should not have sub-options!');

  preventDefault(event: Event) {
    event.stopPropagation();
    event.preventDefault();
  }
  onClick() {
    this.item.selected = true;
  }
  onPointerdown(event: PointerEvent) {
    super.onPointerdown(event);
    event.stopPropagation();
    this.setPointerCapture(event.pointerId);
    // this.expanded = true;
    // onOverlayPointerdown.call(this, event);
  }
  onPointermove(event: PointerEvent) {
    event.stopPropagation();
    // if (event.pointerType === 'touch') {
    //   if (!this.expanded && !this.inoverlay) return;
    // }
    // onOverlayPointermove.call(this, event);
  }
  onPointerup(event: PointerEvent) {
    super.onPointerup(event);
    event.stopPropagation();
    this.onPointerupAction(event);
  }
  onPointerupAction(event: PointerEvent) {
    this.onClick();
  }
  onCloseClick() {
    this.dispatchEvent('io-edit-tab-item', {item: this.item, command: 'delete'}, false);
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
    // TODO: unbind previous? Test!
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
      this.item.hint ? span({class: 'hint'}, this.item.hint) : null,
      ioIcon({value: 'io:close_small', size: 'small', class: 'io-close-icon', '@click': this.onCloseClick, '@pointerdown': this.preventDefault}),
    ]);
  }
}
export const ioTab = IoTab.vConstructor;




