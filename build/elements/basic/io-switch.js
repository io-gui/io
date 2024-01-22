var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register } from '../../core/node.js';
import { IoBoolean } from './io-boolean.js';
/**
 * Input element for `Boolean` data type displayed as switch.
 *
 * <io-element-demo element="io-switch" properties='{"value": true}'></io-element-demo>
 **/
let IoSwitch = class IoSwitch extends IoBoolean {
    static get Style() {
        return /* css */ `
      :host {
        position: relative;
        width: calc(1.5 * var(--iotFieldHeight));
        
      }
      :host:before {
        content: '';
        box-sizing: border-box;
        position: absolute;
        visibility: visible;
        top: var(--iotSpacing);
        left: 0;
        width: 100%;
        height: var(--iotLineHeight);
        border-radius: var(--iotLineHeight);
        border: var(--iotBorder);
        border-color: var(--iotBorderColorInset);
        background-color: var(--iotBackgroundColorField);
        box-shadow: var(--iotShadowInset);
        transition: background-color 0.4s;
      }
      :host:after {
        content: '';
        box-sizing: border-box;
        position: absolute;
        visibility: visible;
        top: calc(var(--iotBorderWidth) + var(--iotSpacing));
        left: var(--iotBorderWidth);
        height: calc(var(--iotLineHeight) - calc(2 * var(--iotBorderWidth)));
        width: calc(var(--iotLineHeight) - calc(2 * var(--iotBorderWidth)));
        background-color: var(--iotBackgroundColorDimmed);
        box-shadow: var(--iotShadowOutset);
        border: var(--iotBorder);
        border-color: var(--iotBorderColorOutset);
        border-radius: var(--iotLineHeight);
        transition-timing-function: ease-in-out;
        transition: left 0.25s;
      }
      :host[value]:after {
        background-color: var(--iotBackgroundColorSelected);
        left: calc(100% - calc(var(--iotLineHeight) - var(--iotBorderWidth)));
      }
      :host:focus:before {
        border-color: var(--iotBorderColorFocus);
        outline: 1px auto var(--iotBorderColorSelected);
        outline: 1px auto -webkit-focus-ring-color;
      }
      :host:focus {
        outline: 0;
        border-color: transparent;
      }
    `;
    }
    init() {
        this.setAttribute('aria-checked', String(!!this.value));
    }
    changed() {
        this.title = this.label;
    }
    valueChanged() {
        this.setAttribute('aria-checked', String(!!this.value));
        if (typeof this.value !== 'boolean') {
            this.setAttribute('aria-invalid', 'true');
        }
        else {
            this.removeAttribute('aria-invalid');
        }
    }
};
IoSwitch = __decorate([
    Register
], IoSwitch);
export { IoSwitch };
//# sourceMappingURL=io-switch.js.map