import {IoElement} from '../../io.js';
import {IoStorageFactory} from '../core/storage.js';

export class IoNotify extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      display: flex;
      position: fixed;
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
      line-height: var(--io-item-height);
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
  static get Properties() {
    return {
      expanded: {
        value: true,
        reflect: 1,
      }
    };
  }
  static get Listeners() {
    return {
    };
  }
  constructor(props) {
    super(props);
    this.template([
      ['span', 'This app uses cookies for user interface customization.'],
      ['span', 'Agree'],
      ['io-boolicon', {'on-value-set': this._onAgree}],
      ['span', 'Disagree'],
      ['io-boolicon', {'on-value-set': this._onDisgree}],
    ]);
  }
  _onAgree() {
    if (event.detail.value) IoStorageFactory.permitted = true;
    else IoStorageFactory.permitted = false;
    this.expanded = false;
  }
  _onDisgree() {
    IoStorageFactory.permitted = false;
    this.expanded = false;
  }
}

IoNotify.Register();

if (IoStorageFactory.permitted === null) document.body.appendChild(new IoNotify());
