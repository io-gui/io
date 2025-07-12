import { Register, ReactiveProperty, Property, span, VDOMElement } from 'io-gui';
import { IoField, IoFieldProps } from 'io-inputs';
import { ioIcon } from 'io-icons';
import { tabDropMarkerSingleton } from './IoTabDropMarker.js';
import { Tab } from '../nodes/Tab.js';
import { SplitDirection } from '../nodes/Split.js';
import { IoPanel } from './IoPanel.js';

@Register
class IoTabDragIcon extends IoField {
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
    `;
  }

  @ReactiveProperty({type: Boolean, reflect: true})
  declare dragging: boolean;

  @ReactiveProperty(null)
  declare tab: Tab | null;

  @ReactiveProperty(null)
  declare dropSource: IoPanel | null;

  @ReactiveProperty(null)
  declare dropTarget: IoPanel | null;

  @ReactiveProperty({type: String, value: 'none', reflect: true})
  declare splitDirection: SplitDirection;

  @ReactiveProperty({type: Number, value: -1})
  declare dropIndex: number;

  @Property(-1)
  declare tabIndex: number;

  constructor(args: IoFieldProps = {}) { super(args); }

  changed() {
    tabDropMarkerSingleton.setProperties({
      dropTarget: this.dropTarget,
      splitDirection: this.splitDirection,
      dropIndex: this.dropIndex,
    });
    this.render([
      ioIcon({value: this.tab?.icon || ' '}),
      span({class: 'label'}, this.tab?.label || ''),
    ]);
  }
}

export const tabDragIconSingleton = new IoTabDragIcon();
document.body.appendChild(tabDragIconSingleton as HTMLElement);
