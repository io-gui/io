import {IoBoolean} from './boolean.js';

export class IoSwitch extends IoBoolean {
	static get Style() {
		return /* css */`
		:host {
			position: relative;
			width: calc(1.5 * var(--io-item-height));
		}
		:host:before {
			display: inline-block;
			box-sizing: border-box;
			position: absolute;
			content: '';
			top: var(--io-spacing);
			left: 0;
			width: calc(100% - calc(2 * var(--io-border-width)));
			height: var(--io-line-height);
			border-radius: var(--io-line-height);
			border: var(--io-border);
			border-color: var(--io-color-border-inset);
			background-color: var(--io-background-color-dark);
			box-shadow: var(--io-shadow-inset);
			transition: background-color 0.4s;
		}
		:host:after {
			display: inline-block;
			box-sizing: border-box;
			position: absolute;
			content: '';
			top: calc(var(--io-border-width) + var(--io-spacing));
			left: var(--io-border-width);
			height: calc(var(--io-line-height) - calc(2 * var(--io-border-width)));
			width: calc(var(--io-line-height) - calc(2 * var(--io-border-width)));
			background-color: var(--io-background-color-dark);
			border: var(--io-border);
			border-color: var(--io-color-border-outset);
			border-radius: var(--io-line-height);
			transition-timing-function: ease-in-out;
			transition: left 0.25s;
		}
		:host[value]:after {
			background-color: rgba(80, 210, 355, 0.75);
			left: calc(calc(100% - var(--io-line-height)) - var(--io-border-width));
		}
		:host[aria-invalid] {
			border: var(--io-border-error);
			background-image: var(--io-gradient-error);
		}
		:host:hover:before,
		:host[display="switch"][value]:not([aria-invalid]):before {
			background-color: var(--io-background-color);
		}
		:host:focus:before,
		:host:focus:after {
			border-color: var(--io-color-focus);
		}
		:host:focus {
			outline-color: var(--io-color-focus);
		}
		`;
	}
	changed() {
		this.title = this.label;
	}
	setAria() {
		super.setAria();
		this.setAttribute('aria-checked', String(!!this.value));
		this.setAttribute('aria-invalid', typeof this.value !== 'boolean' ? 'true' : false);
		this.setAttribute('aria-label', this.label);
	}
}

IoSwitch.Register();
