import {IoItem} from "./item.js";
import {IoLayerSingleton} from "./layer.js";
import {IoLadderSingleton} from "./ladder.js";

export class IoNumber extends IoItem {
	static get Style() {
		return /* css */`
		:host {
			cursor: text;
			user-select: text;
			-webkit-user-select: text;
			-webkit-touch-callout: default;
			min-width: var(--io-item-height);
			border-color: var(--io-color-border-inset);
			color: var(--io-color-field);
			background-color: var(--io-background-color-field);
			box-shadow: var(--io-shadow-inset);
		}
		:host:before,
		:host:after {
			content: ' ';
			white-space: pre;
			visibility: hidden;
		}
		:host:before {
			content: '-';
		}
		:host:not([positive]):before {
			content: ' ';
		}
		:host[aria-invalid] {
			border: var(--io-border-error);
			background-image: var(--io-gradient-error);
		}
		`;
	}
	static get Properties() {
		return {
			value: Number,
			conversion: 1,
			step: 0.001,
			min: -Infinity,
			max: Infinity,
			ladder: false,
			contenteditable: true,
			role: 'textbox',
			type: {
				value: 'number',
				reflect: 1,
			},
			pattern: {
				value: 'pattern="[0-9]*"',
				reflect: 1,
			},
			inputmode: {
				value: 'numeric',
				reflect: 1,
			},
			spellcheck: {
				value: 'false',
				reflect: 1,
			},
		};
	}
	constructor(props) {
		super(props);
		Object.defineProperty(this, '_pointer', {value: 'touch', writable: true});
	}
	_onPointerdown(event) {
		if (this._pointer === 'touch') event.preventDefault();
		this.addEventListener('pointermove', this._onPointermove);
		this.addEventListener('pointerup', this._onPointerup);
		if (document.activeElement === this && event.button === 0) return;
		this._pointer = event.pointerType;
	}
	_onPointerup(event) {
		this.removeEventListener('pointermove', this._onPointermove);
		this.removeEventListener('pointerup', this._onPointerup);
		if (this.ladder || event.button === 1) {
			if (this._pointer === 'touch') {
				event.preventDefault();
				document.activeElement.blur();
			} else {
				if (document.activeElement !== this) {
					this.focus();
					this.setCaretPosition(this.textNode.length);
				}
			}
			this._expandLadder();
		} else {
			if (document.activeElement !== this) {
				this.focus();
				this.setCaretPosition(this.textNode.length);
			}
		}
	}
	_onFocus(event) {
		super._onFocus(event);
		if (this._pointer === 'touch') {
			IoLadderSingleton.expanded = false;
		}
	}
	_onBlur(event) {
		super._onBlur(event);
		this._setFromTextNode();
		this.scrollTop = 0;
		this.scrollLeft = 0;
		// TODO: unhack race condition
		setTimeout(() => {
			if (!(document.activeElement.parentElement === IoLadderSingleton)) {
				IoLadderSingleton.expanded = false;
			}
		});
	}
	_expandLadder() {
		IoLadderSingleton.src = this;
		IoLadderSingleton.expanded = true;
	}
	_onKeydown(event) {
		const rng = window.getSelection().getRangeAt(0);
		const start = rng.startOffset;
		const end = rng.endOffset;
		const length = this.childNodes[0] ? this.childNodes[0].length : 0;
		const rngInside = rng.startContainer === rng.endContainer && (rng.startContainer === this.childNodes[0] || rng.startContainer === this);

		if (event.which === 27 || event.which === 13 || event.which === 32) { //	esc || enter || space
			event.preventDefault();
			this._setFromTextNode();
		} else if (event.which === 36) { // home
			this.textNode = this.min;
			this._setFromTextNode();
		} else if (event.which === 35) { // end
			this.textNode = this.max;
			this._setFromTextNode();
		} else if (event.which === 33) { // pgup
			const valueNumber = Number(this.textNode);
			if (typeof valueNumber == 'number' && !isNaN(valueNumber) && Math.abs(valueNumber) < Infinity) {
				this.textNode = Number(this.textNode) + this.step;
			} else {
				this.textNode = this.step;
			}
			this._setFromTextNode();
		} else if (event.which === 34) { // pgdown
			const valueNumber = Number(this.textNode);
			if (typeof valueNumber == 'number' && !isNaN(valueNumber) && Math.abs(valueNumber) < Infinity) {
				this.textNode = Number(this.textNode) - this.step;
			} else {
				this.textNode = -this.step;
			}
			this._setFromTextNode();
		} else if (event.which === 37) { // left
			if (event.ctrlKey || (rngInside && start === end && start === 0)) {
				event.preventDefault();
				this.focusTo('left');
			}
		} else if (event.which === 38) { // up
			if (IoLadderSingleton.expanded) {
				const upStep = IoLadderSingleton.querySelector('.io-up1');
				if (upStep) upStep.focus();
			} else if (event.ctrlKey || (rngInside && start === end && start === 0)) {
				event.preventDefault();
				this.focusTo('up');
			}
		} else if (event.which === 39) { // right
			if (event.ctrlKey || (rngInside && start === end && start === length)) {
				event.preventDefault();
				this.focusTo('right');
			}
		} else if (event.which === 40) { // down
			if (IoLadderSingleton.expanded) {
				const downStep = IoLadderSingleton.querySelector('.io-down1');
				if (downStep) downStep.focus();
			} else if (event.ctrlKey || (rngInside && start === end && start === length)) {
				event.preventDefault();
				this.focusTo('down');
			}
		}
	}
	_onKeyup(event) {
		if (event.which === 17) { // ctrl
			this._expandLadder();
		} else if (event.which === 27 || event.which === 13 || event.which === 32) { // esc || enter || space
			IoLayerSingleton.expanded = false;
		}
	}
	_setFromTextNode() {
		let valueText = this.textNode;
		let valueNumber = Number(valueText) / this.conversion;
		valueNumber = Math.min(this.max, Math.max(this.min, valueNumber));
		valueNumber = Math.round(valueNumber / this.step) * this.step;
		let d = Math.max(0, Math.min(100, -Math.floor(Math.log(this.step) / Math.LN10)));
		valueNumber = Number(valueNumber.toFixed(d));
		if (!isNaN(valueNumber)) this.set('value', valueNumber);
		else this.textNode = 'NaN';
	}
	changed() {
		this.title = this.label;
		let value = this.value;
		let valueText;
		if (typeof value == 'number' && !isNaN(value)) {
			value *= this.conversion;
			let d = -Math.floor(Math.log(this.step * this.conversion) / Math.LN10);
			d = Math.max(0, Math.min(100, d));
			value = value.toFixed(d);
			valueText = Number(String(value));
		} else {
			valueText = 'NaN';
		}
		this.textNode = valueText;
		this.setAttribute('positive', this.value >= 0);
	}
	setAria() {
		super.setAria();
		this.setAttribute('aria-invalid', (typeof this.value !== 'number' || isNaN(this.value)) ? 'true' : false);
	}
}

IoNumber.Register();
