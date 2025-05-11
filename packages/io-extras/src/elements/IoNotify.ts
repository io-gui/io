import { IoElement, Register, Storage, span } from 'io-gui';
import { ioBoolean } from 'io-inputs';

/*

 **/
@Register
export class IoNotify extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      display: flex;
      position: fixed;
      top: 0;
      left: 0;
      box-sizing: border-box;
      background-color: var(--io_bgColorDimmed);
      border: var(--io_border);
      border-color: var(--io_colorRed);
      width: 100%;
      opacity: 1;
      font-weight: bold;
      align-items: center;
      justify-content: center;
      padding: 0 var(--io_spacing);
    }
    :host > span {
      cursor: default;
      box-sizing: border-box;
      line-height: var(--io_lineHeight);
      color: var(--io_color);
      padding: 0 var(--io_spacing);
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
  static get ReactiveProperties(): any {
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
      span('This app uses cookies for user interface customization.'),
      span('Agree'),
      ioBoolean({ '@value-input': this._onAgree }),
      span('Disagree'),
      ioBoolean({ '@value-input': this._onDisgree }),
    ]);
  }
  _onAgree(event: CustomEvent) {
    if (event.detail.value) (Storage as any).permitted = true;
    else (Storage as any).permitted = false;
    this.expanded = false;
  }
  _onDisgree() {
    (Storage as any).permitted = false;
    this.expanded = false;
  }
}
export const ioNotify = IoNotify.vConstructor;
if ((Storage as any).permitted === null) document.body.appendChild(new IoNotify() as unknown as Node);
