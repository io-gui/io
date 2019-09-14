import {IoElement} from "../../io.js";
import {IoStorageFactory as $} from "../core/storage.js";
import {Config} from "./__config.js";
import {Groups} from "./__groups.js";
import "./breadcrumbs.js";

export class IoInspector extends IoElement {
	static get Style() {
		return /* css */`
		:host {
			@apply --io-column;
		}
		:host > io-breadcrumbs {
			margin-bottom: var(--io-spacing);
		}
		:host > io-object > io-boolean {
			text-transform: capitalize;
		}
		:host > io-object > io-properties {
			border-radius: var(--io-border-radius);
			background-color: var(--io-background-color) !important;
			border: var(--io-border);
			border-color: var(--io-color-border-inset);
			box-shadow: var(--io-shadow-inset);
			padding: var(--io-spacing);
		}
		:host io-properties > io-item {
			color: var(--io-color-link);
		}
		:host io-properties > io-item:hover {
			text-decoration: underline;
		}
		`;
	}
	static get Properties() {
		return {
			value: {
				type: Object,
				observe: true,
			},
			selected: {
				type: Object,
				observe: true,
			},
			groups: Object,
			config: Object,
			autoExpand: ['properties', 'values'],
		};
	}
	static get Listeners() {
		return {
			'item-clicked': '_onSetInspectorValue',
		};
	}
	constructor(props) {
		super(props);
		Object.defineProperty(this, 'uuid', {value: null, writable: true});
	}
	_onSetInspectorValue(event) {
		event.stopPropagation();
		const value = event.detail.value;
		if (value && typeof value === 'object') {
			this.set('selected', value);
		}
	}
	valueChanged() {
		this.selected = this.value;
	}
	changed() {
		this._changedThrottled();
	}
	_changedThrottled() {
		this.throttle(this._changed, null, true);
	}
	_changed() {
		this.uuid = genUUID(this.selected);
		const elements = [
			['io-breadcrumbs', {value: this.value, selected: this.bind('selected'), trim: true}],
		];
		const groups = this.__proto__.__groups.getGroups(this.selected, this.groups);
		const config = this.__proto__.__config.getConfig(this.selected, this.config);
		for (let group in groups) {
			const autoExpanded = this.autoExpand.indexOf(group) !== -1;
			elements.push(
				['io-object', {
					label: group,
					expanded: $({value: autoExpanded, storage: 'local', key: this.uuid + '-' + group}),
					value: this.selected,
					properties: groups[group],
					config: config,
				}],
			);
		}
		this.template(elements);
	}
	static get Config() {
		return {
			'type:object': ['io-item'],
			'type:null': ['io-item'],
		};
	}
	static get Groups() {
		return {
			'Object|hidden': [/^_/],
			// TODO
			'HTMLElement|hidden': [/^on/, /^[A-Z0-9_]*$/, 'childElementCount'],
			'HTMLElement|info': ['localName', 'tagName', 'nodeName', /class/i, /attribute/i],
			'HTMLElement|content': [/content/i, /inner/i, /outer/i],
			'HTMLElement|display': [/width/i, /height/i, /top/i, /left/i, /scroll/i, /style/i],
			'HTMLElement|hierarchy': [/parent/i, /child/i, /element/i, /root/i, /slot/i, /sibling/i, /document/i],
		};
	}
}

function genUUID(object) {
	let UUID = 'io-object-collapse-state-' + object.constructor.name;
	UUID += '-' + object.guid || object.uuid || object.id || '';
	const props = JSON.stringify(Object.keys(object));
	let hash = 0;
	for (let i = 0; i < props.length; i++) {
		hash = ((hash << 5) - hash) + props.charCodeAt(i);
		hash |= 0;
	}
	hash = (-hash).toString(16);
	UUID += '-' + hash;
	return UUID;
}

IoInspector.Register = function() {
	IoElement.Register.call(this);
	Object.defineProperty(this.prototype, '__config', {value: new Config(this.prototype.__protochain)});
	Object.defineProperty(this.prototype, '__groups', {value: new Groups(this.prototype.__protochain)});
};

IoInspector.RegisterConfig = function(config) {
	this.prototype.__config.registerConfig(config);
};

IoInspector.RegisterGroups = function(groups) {
	this.prototype.__groups.registerGroups(groups);
};

IoInspector.Register();

IoInspector.RegisterGroups({
	'Array|values': [/^[0-9]+$/],
});
