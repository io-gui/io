import { RegisterIoElement } from '../../iogui.js';
import { IoBoolean } from './boolean.js';
import { IoIconsetSingleton } from './iconset.js';
/*
 * Extends `IoBoolean`. Implements `IoIcon`.
 *
 * Input element for `Boolean` data type displayed as icon. It can be configured to display custom `true` or `false` icon depending on its `value`.
 *
 * <io-element-demo element="io-boolicon" properties='{"value": true, "true": "icons:check", "false": "icons:close", "stroke": false}'></io-element-demo>
 **/
export class IoBoolicon extends IoBoolean {
    static get Style() {
        return /* css */ `
    :host {
      width: var(--io-item-height);
      height: var(--io-item-height);
      fill: var(--io-color, currentcolor);
      padding: 0;
    }
    :host[stroke] {
      stroke: var(--io-background-color, currentcolor);
      stroke-width: var(--io-stroke-width);
    }
    :host > svg {
      pointer-events: none;
      width: 100%;
      height: 100%;
    }
    :host > svg > g {
      transform-origin: 0px 0px;
    }
    :host[aria-invalid] {
      border: var(--io-border-error);
      background-image: var(--io-gradient-error);
    }
    `;
    }
    static get Properties() {
        return {
            true: 'icons:box_fill_checked',
            false: 'icons:box',
            stroke: {
                value: false,
                reflect: 1,
            },
        };
    }
    changed() {
        this.title = this.label;
        this.innerHTML = IoIconsetSingleton.getIcon(this.value ? this.true : this.false);
    }
    applyAria() {
        super.applyAria();
        this.setAttribute('aria-checked', String(!!this.value));
        this.setAttribute('aria-invalid', typeof this.value !== 'boolean' ? 'true' : false);
    }
}
RegisterIoElement(IoBoolicon);
//# sourceMappingURL=boolicon.js.map