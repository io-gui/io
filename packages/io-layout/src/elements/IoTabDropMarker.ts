import { Register, ReactiveProperty, IoElement, VDOMElement, IoElementProps, ThemeSingleton } from 'io-gui';
import { IoTab } from './IoTab.js';
import { SplitDirection } from '../nodes/Split.js';
import { IoPanel } from './IoPanel.js';

@Register
class IoTabDropMarker extends IoElement {
  static vConstructor: (arg0?: IoElementProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
  static get Style() {
    return /* css */`
      :host {
        position: fixed;
        height: calc(var(--io_fieldHeight) - var(--io_borderWidth) - var(--io_borderRadius));
        width: var(--io_spacing);
        background-color: var(--io_bgColorBlue);
        margin-bottom: var(--io_borderWidth);
        z-index: 100000;
        display: none;
      }
      :host:not([dropindex="-1"]) {
        display: block;
      }
      :host:not([splitdirection="none"]) {
        display: block;
        opacity: 0.25;
      }
    `;
  }

  @ReactiveProperty(null)
  declare dropTarget: IoPanel | null;

  @ReactiveProperty({type: String, value: 'none', reflect: true})
  declare splitDirection: SplitDirection;

  @ReactiveProperty({type: Number, value: -1, reflect: true})
  declare dropIndex: number;

  constructor(args: IoElementProps = {}) { super(args); }

  changed() {
    if (this.dropTarget && this.dropIndex !== -1) {
      const tabs = this.dropTarget.querySelectorAll('io-tab');
      this.style.width = ``;
      this.style.height = ``;
      if (tabs.length === 0) {
        const rect = this.dropTarget.getBoundingClientRect();
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
    } else if (this.dropTarget && this.splitDirection !== 'none') {
      const rect = this.dropTarget.getBoundingClientRect();
      if (this.splitDirection === 'top') {
        this.style.top = `${rect.top}px`;
        this.style.left = `${rect.left}px`;
        this.style.width = `${rect.width}px`;
        this.style.height = `${rect.height / 2}px`;
      } else if (this.splitDirection === 'bottom') {
        this.style.top = `${rect.top + rect.height / 2}px`;
        this.style.left = `${rect.left}px`;
        this.style.width = `${rect.width}px`;
        this.style.height = `${rect.height / 2}px`;
      } else if (this.splitDirection === 'left') {
        this.style.top = `${rect.top}px`;
        this.style.left = `${rect.left}px`;
        this.style.width = `${rect.width / 2}px`;
        this.style.height = `${rect.height}px`;
      } else if (this.splitDirection === 'right') {
        this.style.top = `${rect.top}px`;
        this.style.left = `${rect.left + rect.width / 2}px`;
        this.style.width = `${rect.width / 2}px`;
        this.style.height = `${rect.height}px`;
      } else if (this.splitDirection === 'center') {
        this.style.top = `${rect.top}px`;
        this.style.left = `${rect.left}px`;
        this.style.width = `${rect.width}px`;
        this.style.height = `${rect.height}px`;
      }
    }
  }
}

export const tabDropMarkerSingleton = new IoTabDropMarker();
setTimeout(() => {
  document.body.appendChild(tabDropMarkerSingleton as unknown as HTMLElement);
}, 100);
