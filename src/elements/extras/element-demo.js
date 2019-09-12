import {IoElement} from "../../io.js";
import {IoThemeSingleton, IoStorageFactory as $} from "../../io-core.js";

const suboptions = [];
const options = [
	{label: "Red", icon: "❤️", options: [{value: "Red1"}, {value: "Red2"}, {value: "Red3"}]},
	{label: "Green", icon: "💚", options: [{value: "Green1"}, {value: "Green2"}, {value: "Green3"}]},
	{label: "Blue", icon: "💙", options: [{value: "Blue1"}, {value: "Blue2"}, {value: "Blue3"}]},
	{label: "Numbers", options: [
		{label: 'one', value: 1},
		{label: 'two', value: 2},
		{label: 'three', value: 3},
		{label: 'four', value: 4},
		{label: 'five', value: 5},
	]},
	{label: "Suboptions", options: suboptions},
];
suboptions.push(...[
	{label: 'Hearts', options: options},
	{label: 'suboption one', options: options},
	{label: 'suboption two', options: options},
	{label: 'suboption three', options: options},
]);

const option = {
	"label": "Hearts",
	"icon": "💕",
	"hint": "colors",
	"options": options,
};

const words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'ac', 'libero',
	'vitae', 'magna', 'tellus', 'nisl', 'wisi', 'lacinia', 'curae', 'mauris',
	'fusce', 'interdum', 'vestibulum', 'nunc', 'velit'];
const hearts = ["❤️", "💚", "💙", "💜", "🧡", "💔", "💖", "🖤", "💗", "💘"];
const longOptions = [];
for (let i = 0; i < 100; i++) {
	const r1 = words[Math.floor(Math.random() * 20)];
	const r2 = words[Math.floor(Math.random() * 20)];
	const r3 = words[Math.floor(Math.random() * 20)];
	const i = hearts[Math.floor(Math.random() * 10)] || '';
	longOptions.push({icon: i, label: r1 + ' ' + r2, value: r1 + ' ' + r2, hint: r3});
}

$({key: 'demo:boolean', value: true});
$({key: 'demo:string', value: 'Hello io!'});
$({key: 'demo:leet', value: 1337});
$({key: 'demo:number', value: 0});
$({key: 'demo:theme', value: IoThemeSingleton.bind('theme')});
$({key: 'demo:menuoptions', value: options});
$({key: 'demo:longmenuoptions', value: longOptions});
$({key: 'demo:menuoption', value: option});
$({key: 'demo:rgba', value: {"r": 1, "g": 0.5, "b": 0, "a": 1}});
$({key: 'demo:cmyk', value: {"c": 0, "m": 0, "y": 0, "k": 0}});
$({key: 'demo:object', value: {
	number: 0.5,
	string: "hello",
	boolean: true,
	object: {prop1: 1, prop2: 2},
	array: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
	vector2: [1, 1],
	vector3: [1, 1, 1],
	vector4: [1, 1, 1, 1],
	matrix2: [1, 1, 1, 1],
	matrix3: [1, 1, 1, 1, 1, 1, 1, 1, 1],
	matrix4: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
}});

export class IoElementDemo extends IoElement {
	static get Style() {
		return /* css */`
		:host {
			@apply --io-panel;
			position: relative;
		}
		:host > io-boolicon {
			z-index: 2;
			position: absolute !important;
			top: calc(calc(2 * var(--io-spacing)) + var(--io-border-width));
			right: calc(calc(2 * var(--io-spacing)) + var(--io-border-width));
		}
		:host > io-boolicon:not([value]):not(:hover) {
			opacity: 0.5;
		}
		:host > io-properties {
			align-self: stretch;
			padding: var(--io-spacing) 0;
			margin: var(--io-border-width);
			margin-right: var(--io-spacing);
			margin-bottom: calc(2 * var(--io-spacing));
		}
		:host > io-properties > :nth-child(2) {
			margin-right: calc(var(--io-item-height) + var(--io-spacing));
		}
		:host > .io-content {
			border-radius: var(--io-border-radius);
			border: var(--io-border);
			border-color: var(--io-color-border-inset);
			padding: var(--io-spacing);
			box-shadow: var(--io-shadow-inset);
			color: var(--io-color);
			background-color: var(--io-background-color);
			background-image: none;
		}
		:host:not([expanded]) > .io-content {
			margin-right: calc(var(--io-item-height) + calc(3 * var(--io-spacing)));
		}
		`;
	}
	static get Properties() {
		return {
			element: {
				type: String,
				reflect: -1,
			},
			properties: {
				type: Object,
				reflect: -1,
				observe: true,
			},
			width: {
				type: String,
				reflect: -1,
			},
			height: {
				type: String,
				reflect: -1,
			},
			config: {
				type: Object,
				reflect: -1,
			},
			expanded: {
				type: Boolean,
				reflect: 2,
			}
		};
	}
	_onObjectMutation(event) {
		super._onObjectMutation(event);
		for (let i = this.__observedProps.length; i--;) {
			const prop = this.__observedProps[i];
			const value = this.__properties[prop].value;
			const hasObject = !!this.filterObject(value, o => { return o === event.detail.object; });
			if (hasObject) {
				const children = this.querySelectorAll('*');
				for (let i = 0; i < children.length; i++) {
					if (children[i].changed) children[i].changed();
				}
			}
		}
	}
	propertiesChanged() {
		// TODO: Unhack demovalues
		for (let p in this.properties) {
			const prop = this.properties[p];
			if (typeof prop === 'string' && prop.startsWith('demo:')) {
				this.properties[p] = $({key: prop});
			}
		}
	}
	changed() {
		const properties = this.properties;
		const elements = [['io-boolicon', {value: this.bind('expanded'), true: 'icons:gear', false: 'icons:gear'}]];
		if (this.expanded) {
			elements.push(['io-properties', {
				value: properties,
				config: Object.assign({
					'type:number': ['io-number', {step: 0.00001}],
					'type:boolean': ['io-switch'],
				}, this.config)}
			]);
		}
		elements.push(['div', {class: 'io-content'}, [
			[this.element, Object.assign({'id': 'demo-element'}, properties)],
		]]);
		this.template(elements);
		if (this.width) this.$['demo-element'].style.width = this.width;
		if (this.height) this.$['demo-element'].style.height = this.height;
		if (this.$['demo-element'].onResized) this.$['demo-element'].onResized();
	}
}

IoElementDemo.Register();
