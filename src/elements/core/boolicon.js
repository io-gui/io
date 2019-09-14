import {IoBoolean} from "./boolean.js";
import {IoIconsetSingleton} from "./iconset.js";

export class IoBoolicon extends IoBoolean {
	static get Style() {
		return /* css */`
		:host {
			width: var(--io-item-height);
			height: var(--io-item-height);
			fill: var(--io-color, currentcolor);
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
		`;
	}
	static get Properties() {
		return {
			true: 'icons:check',
			false: 'icons:uncheck',
			stroke: {
				value: true,
				reflect: 1,
			},
		};
	}
	changed() {
		this.setAttribute('aria-checked', String(!!this.value));
		this.setAttribute('aria-invalid', typeof this.value !== 'boolean' ? 'true' : false);
		this.setAttribute('aria-label', this.label);
		this.title = this.label;
		this.innerHTML = IoIconsetSingleton.getIcon(this.value ? this.true : this.false);
	}
}

IoBoolicon.Register();
