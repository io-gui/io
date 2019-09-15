import {IoElement} from "../../io.js";
import {Config} from "./config.js";

export class IoProperties extends IoElement {
	static get Style() {
		return /* css */`
		:host {
			display: grid;
			grid-gap: var(--io-spacing);
			justify-self: stretch;
			justify-items: start;
			white-space: nowrap;
		}
		:host[horizontal] {
			grid-auto-flow: column;
			grid-template-rows: auto;
		}
		:host[horizontal][labeled] {
			grid-template-rows: auto auto;
		}
		:host:not([horizontal]) {
			grid-template-columns: auto;
		}
		:host:not([horizontal])[labeled] {
			grid-template-columns: minmax(3em, 5em) minmax(6em, 1fr);
		}
		:host:not([horizontal])[labeled] > :nth-child(2n-1) {
			max-width: 100%;
		}
		:host > io-object {}
		:host > io-object {
			padding: 0;
			border: var(--io-border);
			border-radius: var(--io-border-radius);
			border-color: transparent;
			background-color: transparent;
			background-image: none;
		}
		:host > io-object,
		:host > io-properties,
		:host > io-number,
		:host > io-string {
			width: auto;
			justify-self: stretch;
		}
		:host io-properties {
			border: 0 !important;
			border-radius: 0 !important;
			box-shadow: none !important;
		}
		`;
	}
	static get Properties() {
		return {
			labeled: {
				value: true,
				reflect: 1,
			},
			horizontal: {
				value: false,
				reflect: 1,
			},
			value: {
				type: Object,
				observe: true,
			},
			properties: Array,
			config: Object,
		};
	}
	static get Config() {
		return {
			'type:string': ['io-string', {}],
			'type:number': ['io-number', {step: 0.0000001}],
			'type:boolean': ['io-boolean', {}],
			'type:object': ['io-object', {}],
			'type:null': ['io-string', {}],
			'type:undefined': ['io-string', {}],
		};
	}
	_onValueSet(event) {
		if (event.detail.object) return; // TODO: unhack/remove?
		const item = event.composedPath()[0];
		if (item === this) return;
		event.stopImmediatePropagation();
		const prop = item.id;
		if (prop !== null && event.detail.property === 'value') {
			const value = event.detail.value;
			const oldValue = event.detail.oldValue;
			this.value[prop] = value;
			const detail = {object: this.value, property: prop, value: value, oldValue: oldValue};
			this.dispatchEvent('object-mutated', detail, false, window); // TODO: test
		}
	}
	valueMutated() {
		// TODO implement debounce
		clearTimeout(this._cfgTimeout);
		this._cfgTimeout = setTimeout(()=>{
			this._updateChildren();
		}, 1000/30);
	}
	// TODO: unhack?
	_updateChildren() {
		const all = this.querySelectorAll(':scope > *, io-properties > *');
		const subobjects = this.filterObjects(this.value, o => typeof o === 'object', 1);
		for (let i = 0; i < all.length; i++) {
			const child = all[i];
			if (typeof child.value === 'object') {
				if (subobjects.indexOf(child.value) !== -1) {
					if (child.changed) child.changed();
				}
			}
		}
	}
	changed() {
		this._changedThrottled();
	}
	_changedThrottled() {
		this.throttle(this._changed, null, true);
	}
	_changed() {
		const config = this.__proto__.__config.getConfig(this.value, this.config);
		const elements = [];
		for (let c in config) {
			if (!this.properties.length || this.properties.indexOf(c) !== -1) {
				const tag = config[c][0];
				const protoConfig = config[c][1];
				const label = config[c].label || c;
				const itemConfig = {title: label, id: c, value: this.value[c], 'on-value-set': this._onValueSet};
				itemConfig.config = this.config;
				elements.push(
					this.labeled ? ['span', {class: 'io-item'}, label + ':'] : null,
					[tag, Object.assign(itemConfig, protoConfig)],
				);
			}
		}
		this.template(elements);
	}
}

IoProperties.Register = function() {
	IoElement.Register.call(this);
	Object.defineProperty(this.prototype, '__config', {value: new Config(this.prototype.__protochain)});
};

IoProperties.RegisterConfig = function(config) {
	this.prototype.__config.registerConfig(config);
};

IoProperties.Register();

