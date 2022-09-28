import {IoElement, RegisterIoElement } from '../../iogui.js';
import {IoStorageFactory} from '../core/storage.js';

/*

 **/
@RegisterIoElement
export class IoNotify extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      display: flex;
      position: fixed;
      top: 0;
      left: 0;
      box-sizing: border-box;
      background-color: var(--io-background-color-dark);
      border: var(--io-border);
      border-color: var(--io-color-error);
      width: 100%;
      opacity: 1;
      font-weight: bold;
      align-items: center;
      justify-content: center;
      padding: 0 var(--io-spacing);
    }
    :host > span {
      cursor: default;
      box-sizing: border-box;
      line-height: var(--io-field-height);
      font-size: var(--io-font-size);
      color: var(--io-color);
      padding: 0 var(--io-spacing);
    }
    :host > :nth-child(n+2) {
      flex-shrink: 0;
      align-self: center;
      white-space: nowrap;
    }
    @keyframes io-notification-fade {
      to {
        opacity: 0;
      }
    }
    :host:not([expanded]) {
      animation: io-notification-fade .6s linear forwards;
      pointer-events: none;
    }
    `;
  }
  static get Properties(): any {
    return {
      expanded: {
        value: true,
        reflect: 'prop',
      }
    };
  }
  static get Listeners() {
    return {
    };
  }
  constructor(props?: any) {
    super(props);
    this.template([
      ['span', 'This app uses cookies for user interface customization.'],
      ['span', 'Agree'],
      ['io-boolicon', {'on-value-input': this._onAgree}],
      ['span', 'Disagree'],
      ['io-boolicon', {'on-value-input': this._onDisgree}],
    ]);
  }
  _onAgree(event: CustomEvent) {
    if (event.detail.value) (IoStorageFactory as any).permitted = true;
    else (IoStorageFactory as any).permitted = false;
    this.expanded = false;
  }
  _onDisgree() {
    (IoStorageFactory as any).permitted = false;
    this.expanded = false;
  }
}

if ((IoStorageFactory as any).permitted === null) document.body.appendChild(new IoNotify() as unknown as Node);
