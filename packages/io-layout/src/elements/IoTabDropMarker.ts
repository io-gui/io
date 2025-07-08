import { Register, ReactiveProperty, IoElement, VDOMElement, IoElementProps, ThemeSingleton } from 'io-gui';
import { IoTabs } from './IoTabs.js';
import { IoTab } from './IoTab.js';

type IoTabDropMarkerProps = IoElementProps & {

};

@Register
class IoTabDropMarker extends IoElement {
  static vConstructor: (arg0?: IoTabDropMarkerProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
  static get Style() {
    return /* css */`
      :host {
        position: fixed;
        height: calc(var(--io_fieldHeight) - var(--io_borderWidth) - var(--io_borderRadius));
        width: var(--io_spacing);
        background-color: var(--io_bgColorBlue);
        margin-bottom: var(--io_borderWidth);
        z-index: 100000;
      }
      :host[dropindex="-1"] {
        display: none;
      }
    `;
  }

  @ReactiveProperty(null)
  declare dropTarget: IoTabs | null;

  @ReactiveProperty({type: Number, value: -1, reflect: true})
  declare dropIndex: number;

  constructor(args: IoTabDropMarkerProps = {}) { super(args); }

  changed() {
    const hasDropTarget = this.dropTarget && this.dropIndex !== -1;
    if (hasDropTarget) {
      const tabs = this.dropTarget!.querySelectorAll('io-tab');
      if (tabs.length === 0) {
        const rect = this.dropTarget!.getBoundingClientRect();
        this.style.top = `${rect.top + ThemeSingleton.borderRadius}px`;
        this.style.left = `${rect.left}px`;
      } else if (this.dropIndex > tabs.length - 1) {
        const tab = tabs[tabs.length - 1] as IoTab;
        const rect = tab.getBoundingClientRect();
        this.style.top = `${rect.top + ThemeSingleton.borderRadius}px`;
        this.style.left = `${rect.left + rect.width}px`;
      } else {
        const tab = tabs[this.dropIndex] as IoTab;
        const rect = tab.getBoundingClientRect();
        this.style.top = `${rect.top + ThemeSingleton.borderRadius}px`;
        this.style.left = `${rect.left - ThemeSingleton.spacing}px`;
      }
    }
  }
}

export const tabDropMarkerSingleton = new IoTabDropMarker();
document.body.appendChild(tabDropMarkerSingleton as unknown as HTMLElement);
