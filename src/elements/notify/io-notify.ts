import {IoElement, RegisterIoElement } from '../../core/element.js';
import {IoStorage} from '../../core/storage.js';

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
      background-color: var(--iotBackgroundColorDark);
      border: var(--iotBorder);
      border-color: var(--iotColorError);
      width: 100%;
      opacity: 1;
      font-weight: bold;
      align-items: center;
      justify-content: center;
      padding: 0 var(--iotSpacing);
    }
    :host > span {
      cursor: default;
      box-sizing: border-box;
      line-height: var(--iotLineHeight);
      font-size: var(--iotFontSize);
      color: var(--iotColor);
      padding: 0 var(--iotSpacing);
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
        reflect: true,
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
      ['io-boolean', {'on-value-input': this._onAgree}],
      ['span', 'Disagree'],
      ['io-boolean', {'on-value-input': this._onDisgree}],
    ]);
  }
  _onAgree(event: CustomEvent) {
    if (event.detail.value) (IoStorage as any).permitted = true;
    else (IoStorage as any).permitted = false;
    this.expanded = false;
  }
  _onDisgree() {
    (IoStorage as any).permitted = false;
    this.expanded = false;
  }
}

if ((IoStorage as any).permitted === null) document.body.appendChild(new IoNotify() as unknown as Node);
