var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IoElement } from '../../core/element.js';
import { Register } from '../../core/node.js';
import { IoStorage } from '../../core/storage.js';
/*

 **/
let IoNotify = class IoNotify extends IoElement {
    static get Style() {
        return /* css */ `
    :host {
      display: flex;
      position: fixed;
      top: 0;
      left: 0;
      box-sizing: border-box;
      background-color: var(--iotBackgroundColorDimmed);
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
    static get Properties() {
        return {
            expanded: {
                value: true,
                reflect: true,
            }
        };
    }
    static get Listeners() {
        return {};
    }
    constructor(props) {
        super(props);
        this.template([
            ['span', 'This app uses cookies for user interface customization.'],
            ['span', 'Agree'],
            ['io-boolean', { '@value-input': this._onAgree }],
            ['span', 'Disagree'],
            ['io-boolean', { '@value-input': this._onDisgree }],
        ]);
    }
    _onAgree(event) {
        if (event.detail.value)
            IoStorage.permitted = true;
        else
            IoStorage.permitted = false;
        this.expanded = false;
    }
    _onDisgree() {
        IoStorage.permitted = false;
        this.expanded = false;
    }
};
IoNotify = __decorate([
    Register
], IoNotify);
export { IoNotify };
if (IoStorage.permitted === null)
    document.body.appendChild(new IoNotify());
//# sourceMappingURL=io-notify.js.map