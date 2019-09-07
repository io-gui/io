import {IoElement} from "../../io.js";
import {IoStorageFactory} from "../../io-core.js";

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
    }
    :host > span {
      cursor: default;
      box-sizing: border-box;
      line-height: var(--io-line-height);
      font-size: var(--io-font-size);
      border: var(--io-border);
      border-color: transparent;
      color: var(--io-color);
      padding: var(--io-spacing);
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
      ['span', "This application uses cookies for user interface customization."],
      ['span', "I agree"],
      ['io-boolicon', {'on-value-set': this._onAgree}],
      ['span', "I disagree"],
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