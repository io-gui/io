import {IoElement} from "../../io.js";

export class IoBreadcrumbs extends IoElement {
	static get Style() {
		return /* css */`
		:host {
			display: flex;
			flex: 0 0 auto;
			flex-direction: row;
			align-self: stretch;
			justify-self: stretch;
			border-radius: var(--io-border-radius);
			border: var(--io-border);
			border-color: var(--io-color-border-inset);
			padding: var(--io-spacing);
			color: var(--io-color-field);
			background-color: var(--io-background-color-field);
			padding: var(--io-spacing);
		}
		:host > io-item {
			padding: var(--io-spacing);
		}
		:host > io-item:hover {
			text-decoration: underline;
		}
		:host > io-item:first-of-type {
			overflow: visible;
			text-overflow: clip;
			margin-left: var(--io-spacing);
		}
		:host > io-item:last-of-type {
			overflow: visible;
			text-overflow: clip;
			margin-right: var(--io-spacing);
		}
		:host > io-item:not(:first-of-type):before {
			content: '>';
			margin: 0 var(--io-spacing);
			padding: 0 var(--io-spacing) 0 0;
			opacity: 0.25;
		}
		`;
	}
	static get Properties() {
		return {
			value: Object,
			selected: null,
			options: {
				type: Array,
				observe: true,
			},
		};
	}
	_onClick(event) {
		this.set('selected', this.options[event.detail.value]);
	}
	valueChanged() {
		this.options.length = 0;
		this.options.push(this.value);
	}
	selectedChanged() {
		const index = this.options.indexOf(this.selected);
		if (index !== -1) {
			this.options.length = index + 1;
		} else {
			this.options.push(this.selected);
		}
	}
	changed() {
		const elements = [];
		for (let i = 0; i < this.options.length; i++) {
			elements.push(['io-item', {
				value: i,
				label: getLabel(this.options[i]),
				'on-item-clicked': this._onClick,
			}]);
		}
		this.template(elements);
	}
}

IoBreadcrumbs.Register();

function getLabel(object) {
	if (object instanceof Array) {
		return String(`${object.constructor.name} (${object.length})`);
	} else if (typeof object === 'object') {
		return String(`${object.constructor.name}`);
	} else {
		return String(object);
	}
}
