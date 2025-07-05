import { Register, ReactiveProperty, Property, span, VDOMElement } from 'io-gui';
import { IoField, IoFieldProps } from 'io-inputs';
import { ioIcon } from 'io-icons';
import { MenuItem } from 'io-menus';
import { IoTabs } from './IoTabs.js';
import { tabDropMarkerSingleton } from './IoTabDropMarker.js';

type IoTabDragIconProps = IoFieldProps & {
  item?: MenuItem,
};

@Register
class IoTabDragIcon extends IoField {
  static vConstructor: (arg0?: IoTabDragIconProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
  static get Style() {
    return /* css */`
      :host {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        transform: translate(-50%, -50%);
        z-index: 100000;
        pointer-events: none;
        border-color: var(--io_borderColorLight);
        background-color: var(--io_bgColorLight) !important;
        user-select: none;
        opacity: 0.75;
      }
      :host[dragging] {
        display: flex;
      }
      :host > * {
        display: inline-block;
        white-space: nowrap;
        padding: 0 var(--io_spacing);
      }
      :host > .label {}
      :host > .hint {
        color: var(--io_colorLight);
        padding-right: var(--io_spacing3);
      }
      :host > .hint:empty {
        padding-right: var(--io_lineHeight);
      }
    `;
  }

  @ReactiveProperty({type: Boolean, reflect: true})
  declare dragging: boolean;

  @ReactiveProperty({type: MenuItem, init: null})
  declare item: MenuItem;

  @ReactiveProperty(null)
  declare dropTarget: IoTabs | null;

  @ReactiveProperty({type: Number, value: -1})
  declare dropIndex: number;

  @Property('-1')
  declare tabIndex: string;

  constructor(args: IoTabDragIconProps = {}) { super(args); }

  changed() {
    if (this.dropTarget && this.dropIndex !== -1) {
      tabDropMarkerSingleton.dropTarget = this.dropTarget;
      tabDropMarkerSingleton.dropIndex = this.dropIndex;
    } else {
      tabDropMarkerSingleton.dropTarget = null;
      tabDropMarkerSingleton.dropIndex = -1;
    }
    this.render([
      ioIcon({value: this.item.icon || ' '}),
      span({class: 'label'}, this.item.label || ''),
      span({class: 'hint'}, this.item.hint || ''),
    ]);
  }
}

export const tabDragIconSingleton = new IoTabDragIcon();
document.body.appendChild(tabDragIconSingleton as unknown as HTMLElement);
