// Generated by dts-bundle-generator v6.13.0

/**
 * Property binding class.
 * It facilitates data binding between source node/property and target nodes/properties
 * using `[property]-changed` events.
 */
export declare class Binding {
	readonly node: IoNode;
	readonly property: string;
	readonly targets: Array<EventTarget>;
	readonly targetProperties: WeakMap<EventTarget, string[]>;
	/**
	 * Creates a binding object for specified `node` and `property`.
	 * @param {IoNode} node - Property owner node
	 * @param {string} property - Name of the property
	 */
	constructor(node: IoNode, property: string);
	set value(value: any);
	get value(): any;
	/**
	 * Adds a target `node` and `targetProp` and corresponding `[property]-changed` listener, unless already added.
	 * @param {IoNode} node - Target node
	 * @param {string} property - Target property
	 */
	addTarget(node: IoNode, property: string): void;
	/**
	 * Removes target `node` and `property` and corresponding `[property]-changed` listener.
	 * If `property` is not specified, it removes all target properties.
	 * @param {IoNode} node - Target node
	 * @param {string} property - Target property
	 */
	removeTarget(node: IoNode, property?: string): void;
	/**
	 * Retrieves a list of target properties for specified target node.
	 * @param {IoNode} node - Target node.
	 * @return {Array.<string>} list of target property names.
	 */
	private getTargetProperties;
	/**
	 * Event handler that updates source property when one of the targets emits `[property]-changed` event.
	 * @param {ChangeEvent} event - Property change event.
	 */
	private onTargetChanged;
	/**
	 * Event handler that updates bound properties on target nodes when source node emits `[property]-changed` event.
	 * @param {ChangeEvent} event - Property change event.
	 */
	private onSourceChanged;
	/**
	 * Dispose of the binding by removing all targets and listeners.
	 * Use this when node is no longer needed.
	 */
	dispose(): void;
}
export declare type Constructor = new (...args: any[]) => unknown;
export declare type ReflectType = -1 | 0 | 1 | 2;
export declare type PropertyDefinitionStrong = {
	value?: any;
	type?: Constructor;
	binding?: Binding;
	reflect?: ReflectType;
	notify?: boolean;
	observe?: boolean;
};
export declare type PropertyDefinitionWeak = string | number | boolean | Array<any> | null | undefined | Constructor | Binding | PropertyDefinitionStrong;
/**
 * Property definition class
 */
export declare class ProtoProperty {
	value?: any;
	type?: Constructor;
	binding?: Binding;
	reflect: ReflectType;
	notify: boolean;
	observe: boolean;
	/**
	 * Takes a weakly typed property definition and returns a strongly typed property definition.
	 * @param {PropertyDefinitionWeak} def Weakly typed property definition
	 */
	constructor(def: PropertyDefinitionWeak);
}
/**
 * Assigns property definition values to another property definition, unless they are default values.
 * @param {ProtoProperty} def Target property definition
 * @param {ProtoProperty} srcDef Source property definition
 */
export declare const assignProtoProperty: (def: ProtoProperty, srcDef: ProtoProperty) => void;
/**
 * Property configuration object.
 * It is initialized from corresponding `ProtoProperty` in `ProtoChain`.
 */
export declare class Property {
	value?: any;
	type?: Constructor;
	binding?: Binding;
	reflect: ReflectType;
	notify: boolean;
	observe: boolean;
	/**
	 * Creates the property configuration object and copies values from `ProtoProperty`.
	 * @param {ProtoProperty} propDef ProtoProperty object
	 */
	constructor(propDef: ProtoProperty);
}
export declare type ListenerDefinitionWeak = string | CustomEventListener | [
	string | CustomEventListener,
	AddEventListenerOptions?
];
export declare type ListenerDefinition = [
	string | CustomEventListener,
	AddEventListenerOptions?
];
/**
 * Takes weakly typed listener definition and returns stronly typed listener definition.
 * @param {ListenerDefinitionWeak} def Weakly typed listener definition
 * @return {ListenerDefinition} Stronly typed listener definition
 */
export declare const hardenListenerDefinition: (def: ListenerDefinitionWeak) => ListenerDefinition;
/**
 * Assigns source listener definition to an existing array of listener definitions.
 * @param {ListenerDefinition[]} defs Array of listener definitions
 * @param {ListenerDefinition} srcDef Source listener definition
 */
export declare const assignListenerDefinition: (defs: ListenerDefinition[], srcDef: ListenerDefinition) => void;
/**
 * Takes a node and a listener definition and returns a listener.
 * @param {IoNode} node `IoNode` instance
 * @param {ListenerDefinition} def Listener definition
 * @return {Listener} Listener
 */
export declare const listenerFromDefinition: (node: IoNode | HTMLElement, def: ListenerDefinition) => Listener;
export declare type Listener = [
	CustomEventListener,
	AddEventListenerOptions?
];
export declare type Listeners = Record<string, Listener[]>;
/**
 * Internal utility class responsible for handling listeners and dispatching events.
 * It makes events of all `IoNode` classes compatible with DOM events.
 * It maintains three independent lists of listeners:
 *  - `protoListeners` specified as `get Listeners()` class declarations
 *  - `propListeners` specified as inline properties prefixed with "on-"
 *  - `addedListeners` explicitly added using `addEventListener()`
 */
export declare class EventDispatcher {
	readonly node: IoNode | HTMLElement;
	readonly isEventTarget: boolean;
	readonly protoListeners: Listeners;
	readonly propListeners: Listeners;
	readonly addedListeners: Listeners;
	/**
	 * Creates an instance of `EventDispatcher` for specified `IoNode` instance.
	 * It initializes `protoListeners` from `ProtoChain`.
	 * @param {IoNode} node owner IoNode
	 */
	constructor(node: IoNode | HTMLElement);
	/**
	 * Sets `protoListeners` specified as `get Listeners()` class declarations.
	 * @param {IoNode} node owner IoNode
	 */
	setProtoListeners(node: IoNode): void;
	/**
	 * Sets `propListeners` specified as inline properties prefixed with "on-".
	 * It removes existing `propListeners` that are no longer specified and it replaces the ones that changed.
	 * @param {Record<string, any>} properties Inline properties
	 */
	applyPropListeners(properties: Record<string, any>): void;
	/**
	 * Proxy for `addEventListener` method.
	 * Adds an event listener to `addedListeners`.
	 * @param {string} name Name of the event
	 * @param {CustomEventListener} listener Event listener handler
	 * @param {AddEventListenerOptions} [options] Event listener options
	 */
	addEventListener(name: string, listener: CustomEventListener, options?: AddEventListenerOptions): void;
	/**
	 * Proxy for `removeEventListener` method.
	 * Removes an event listener from `addedListeners`.
	 * If `listener` is not specified it removes all listeners for specified `type`.
	 * @param {string} name Name of the event
	 * @param {CustomEventListener} listener Event listener handler
	 * @param {AddEventListenerOptions} [options] Event listener options
	*/
	removeEventListener(name: string, listener?: CustomEventListener, options?: AddEventListenerOptions): void;
	/**
	 * Shorthand for custom event dispatch.
	 * @param {string} name Name of the event
	 * @param {any} detail Event detail data
	 * @param {boolean} [bubbles] Makes event bubble
	 * @param {EventTarget} [node] Event target override to dispatch the event from
	 */
	dispatchEvent(name: string, detail?: any, bubbles?: boolean, node?: EventTarget | IoNode): void;
	/**
	 * Disconnects all event listeners and removes all references for garbage collection.
	 * Use this when node is discarded.
	 */
	dispose(): void;
}
export declare type ListenersDeclaration = Record<string, ListenerDefinitionWeak>;
export declare type PropertiesDeclaration = Record<string, PropertyDefinitionWeak>;
export interface IoNodeConstructor<T> {
	new (...args: any[]): T;
	Properties?: PropertiesDeclaration;
	Listeners?: ListenersDeclaration;
	Style?: string;
	__proto__?: IoNodeConstructor<T>;
}
export declare type CallbackFunction = (arg?: any) => void;
export declare type KeyboardEventListener = (event: KeyboardEvent) => void;
export declare type PointerEventListener = (event: PointerEvent) => void;
export declare type CustomEventListener = (event: CustomEvent) => void | EventListener;
export declare type FocusEventListener = (event: FocusEvent) => void;
export declare type TouchEventListener = (event: TouchEvent) => void;
export declare type AnyEventListener = EventListener | KeyboardEventListener | PointerEventListener | CustomEventListener | FocusEventListener | TouchEventListener;
/**
 * Core mixin for `Node` classes.
 * @param {function} superclass - Class to extend.
 * @return {function} - Extended class constructor with `IoNodeMixin` applied to it.
 */
export declare function IoNodeMixin<T extends IoNodeConstructor<any>>(superclass: T): IoNodeConstructor<any>;
/**
 * Register function to be called once per class.
 * @param {IoNode} target - Node class to register.
 */
export declare const RegisterIoNode: (target: typeof IoNode) => void;
declare const IoNode_base: IoNodeConstructor<any>;
/**
 * IoNodeMixin applied to `Object` class.
 */
export declare class IoNode extends IoNode_base {
}
/**
 * Register function for `IoElement`. Registers custom element.
 * @param {IoElement} elementConstructor - Element class to register.
 */
export declare const RegisterIoElement: (elementConstructor: typeof IoElement) => void;
export declare type VirtualDOMElement = [
	string,
	Record<string, any> | string
] | [
	string,
	Record<string, any> | string,
	VirtualDOMElement[] | string
];
export declare const buildTree: () => (node: VirtualDOMElement) => any;
declare const IoElement_base: IoNodeConstructor<any>;
/**
 * Core `IoElement` class.
 */
export declare class IoElement extends IoElement_base {
	static get Style(): any;
	static get Properties(): any;
	static get Listeners(): any;
	static get observedAttributes(): string[];
	attributeChangedCallback(prop: string, oldValue: any, newValue: any): void;
	/**
	* Add resize listener if `onResized()` is defined in subclass.
	*/
	connectedCallback(): void;
	/**
	* Removes resize listener if `onResized()` is defined in subclass.
	*/
	disconnectedCallback(): void;
	/**
	 * Renders DOM from virtual DOM arrays.
	 * @param {Array} vDOM - Array of vDOM children.
	 * @param {HTMLElement} [host] - Optional template target.
	 */
	template(vDOM: Array<any>, host?: HTMLElement): void;
	/**
	* Recurively traverses vDOM.
	* @param {Array} vChildren - Array of vDOM children converted by `buildTree()` for easier parsing.
	* @param {HTMLElement} [host] - Optional template target.
	  */
	traverse(vChildren: Array<any>, host: HTMLElement): void;
	/**
	* Helper function to flatten textContent into a single TextNode.
	* Update textContent via TextNode is better for layout performance.
	* @param {HTMLElement} element - Element to flatten.
	*/
	flattenTextNode(element: HTMLElement | IoElement): void;
	get textNode(): any;
	set textNode(value: any);
	applyProperties(props: any): void;
	/**
	* Alias for HTMLElement setAttribute where falsey values remove the attribute.
	* @param {string} attr - Attribute name.
	* @param {*} value - Attribute value.
	*/
	setAttribute(attr: string, value: boolean | number | string): void;
	/**
	* Sets aria attributes.
	*/
	applyAria(): void;
	_onFocusTo(event: CustomEvent): void;
	focusTo(dir: string): void;
}
/**
 * Property change FIFO queue.
 * Responsible for dispatching change events and invoking change handler functions with property change payloads.
 */
export declare class ChangeQueue {
	private readonly node;
	private readonly changes;
	private dispatching;
	/**
	 * Creates change queue for the specified owner instance of `IoNode`.
	 * @param {IoNode} node - Owner node.
	 */
	constructor(node: IoNode);
	/**
	 * Adds property change payload to the queue by specifying property name, previous and the new value.
	 * If the change is already in the queue, the new value is updated in-queue.
	 * @param {string} property - Property name.
	 * @param {any} value Property value.
	 * @param {any} oldValue Old property value.
	 */
	queue(property: string, value: any, oldValue: any): void;
	/**
	 * Dispatches and clears the queue.
	 * For each property change in the queue:
	 *  - It fires the `'[propName]-changed'` `ChangeEvent` from the owner node with `Change` data as `event.detail`.
	 *  - It executes node's `[propName]Changed(change)` change handler function if it is defined.
	 * If owner node is not connected dispatch is aborted.
	 * After all changes are dispatched it invokes `.changed()` functions od the owner node instance.
	 */
	dispatch(): void;
	/**
	 * Clears the queue and removes the node reference.
	 * Use this when node queue is no longer needed.
	 */
	dispose(): void;
}
export interface Change {
	property: string;
	value: any;
	oldValue: any;
}
export interface ChangeEvent extends CustomEvent {
	readonly target: EventTarget;
	readonly detail: Change;
	readonly path: EventTarget[];
}
/**
 * Internal utility class that contains usefull information about class inheritance.
 * Inherited definitions are aggregated additively during prototype chain traversal in `IoNode`.
 */
export declare class ProtoChain {
	readonly constructors: Array<IoNodeConstructor<any>>;
	readonly functions: Array<string>;
	readonly properties: {
		[property: string]: ProtoProperty;
	};
	readonly listeners: {
		[property: string]: ListenerDefinition[];
	};
	readonly style: string;
	readonly observedObjectProperties: string[];
	/**
	 * Creates an instance of `ProtoChain`.
	 * @param {IoNodeConstructor<any>} ioNodeClass - Owner `IoNode`-derived class.
	 */
	constructor(ioNodeClass: IoNodeConstructor<any>);
	/**
	 * Binds all auto-binding functions from the `.functions` array to specified `IoNode`-derived instance.
	 * @param {IoNode} node - `IoNode` instance to bind functions to.
	 */
	autobindFunctions(node: IoNode): void;
}
export declare class Path extends IoNode {
	static get Properties(): {
		value: ArrayConstructor;
		string: StringConstructor;
		root: null;
		leaf: null;
		delimiter: string;
	};
	valueChanged(): void;
	onMutation(): void;
	update(): void;
	stringChanged(): void;
	rootChanged(): void;
	leafChanged(): void;
}
declare const Options_base: IoNodeConstructor<any>;
export declare class Options extends Options_base {
	static get Properties(): {
		items: {
			type: ArrayConstructor;
		};
		path: {
			type: typeof Path;
		};
		lazy: boolean;
	};
	constructor(options?: Array<Item | any>, props?: {});
	option(value: any): any;
	pathChanged(): void;
	onItemSelectedPathChanged(event: any): void;
	onItemSelectedChanged(event: any): void;
	setSelectedPath(path?: any[]): void;
	selectDefault(): boolean;
	changed(): void;
}
export declare class Item extends IoNode {
	static get Properties(): {
		value: undefined;
		label: string;
		icon: string;
		hint: string;
		action: undefined;
		select: string;
		selected: BooleanConstructor;
		path: {
			type: typeof Path;
		};
		options: {
			type: typeof Options;
		};
	};
	constructor(option: any);
	get hasmore(): boolean;
	option(value: any): any;
	onOptionsSelectedPathChanged(): void;
	optionsChanged(): void;
	selectedChanged(): void;
	setSelectedPath(selected: any, path?: any[]): void;
	changed(): void;
}
declare class IoTheme extends IoElement {
	static get Style(): string;
	static get Properties(): any;
	constructor(props?: any);
	_toCss(rgba: number[]): string;
	reset(): void;
	themeChanged(): void;
	changed(): void;
}
export declare const IoThemeSingleton: IoTheme;
export declare type UniformTypes = BooleanConstructor | NumberConstructor | ArrayConstructor;
export declare class IoGl extends IoElement {
	static get Style(): string;
	static get Properties(): any;
	static get Vert(): string;
	static get GlUtils(): string;
	static get Frag(): string;
	initPropertyUniform(name: string, property: Property): string;
	initShader(): WebGLProgram;
	css: typeof IoThemeSingleton;
	constructor(properties?: Record<string, any>);
	onResized(): void;
	cssMutated(): void;
	changed(): void;
	_onRender(): void;
	setShaderProgram(): void;
	updatePropertyUniform(name: string, property: Property): void;
	updateCssUniforms(): void;
	setUniform(name: string, type: UniformTypes, value: any): void;
}
export declare class IoSlider extends IoGl {
	static get Style(): string;
	static get Properties(): any;
	static get Listeners(): {
		focus: string;
		contextmenu: string;
		pointerdown: string;
		touchstart: string;
	};
	_onFocus(): void;
	_onBlur(): void;
	_onContextmenu(event: Event): void;
	_onTouchstart(event: TouchEvent): void;
	_onTouchmove(event: TouchEvent): void;
	_onTouchend(): void;
	_onPointerdown(event: PointerEvent): void;
	_onPointermove(event: PointerEvent): void;
	_onPointerup(event: PointerEvent): void;
	_getPointerCoord(event: PointerEvent): number[];
	_getValueFromCoord(coord: number): number;
	_getCoordFromValue(value: number): number;
	_onPointermoveThrottled(event: PointerEvent): void;
	_setValue(x: number, y?: number): void;
	_onKeydown(event: KeyboardEvent): void;
	_setIncrease(): void;
	_setDecrease(): void;
	_setMin(): void;
	_setMax(): void;
	changed(): void;
	applyAria(): void;
	static get GlUtils(): string;
	static get Frag(): string;
}
declare const IoColorSlider_base: {
	new (...args: any[]): {
		[x: string]: any;
		valueMutated(): void;
		modeChanged(): void;
		setValueFromRgb(): void;
		setValueFromHsv(): void;
		setValueFromHsl(): void;
		setValueFromCmyk(): void;
		valueChanged(): void;
	};
	readonly Properties: any;
	readonly GlUtils: string;
} & typeof IoSlider;
export declare class IoColorSlider extends IoColorSlider_base {
	static get Properties(): any;
	static get GlUtils(): string;
	valueMutated(): void;
	applyAria(): void;
	_onKeydown(event: KeyboardEvent): void;
	_setIncrease(): void;
	_setDecrease(): void;
	_setMin(): void;
	_setMax(): void;
	_onPointermoveThrottled(event: PointerEvent): void;
	_notifyValueChange(): void;
	_setValue(x: number, y?: number): void;
}
export declare class IoColorSliderRed extends IoColorSlider {
	static get Frag(): string;
	_setIncrease(): void;
	_setDecrease(): void;
	_setValue(x: number): void;
}
export declare class IoColorSliderGreen extends IoColorSlider {
	static get Frag(): string;
	_setIncrease(): void;
	_setDecrease(): void;
	_setValue(x: number): void;
}
export declare class IoColorSliderBlue extends IoColorSlider {
	static get Frag(): string;
	_setIncrease(): void;
	_setDecrease(): void;
	_setValue(x: number): void;
}
export declare class IoColorSliderHue extends IoColorSlider {
	static get Frag(): string;
	_setIncrease(): void;
	_setDecrease(): void;
	_setValue(x: number): void;
}
export declare class IoColorSliderSaturation extends IoColorSlider {
	static get Frag(): string;
	_setIncrease(): void;
	_setDecrease(): void;
	_setValue(x: number): void;
}
export declare class IoColorSliderValue extends IoColorSlider {
	static get Frag(): string;
	_setIncrease(): void;
	_setDecrease(): void;
	_setValue(x: number): void;
}
export declare class IoColorSliderLevel extends IoColorSlider {
	static get Frag(): string;
	_setIncrease(): void;
	_setDecrease(): void;
	_setValue(x: number): void;
}
export declare class IoColorSliderHs extends IoColorSlider {
	static get Style(): string;
	static get Properties(): any;
	static get Frag(): string;
	_onKeydown(event: KeyboardEvent): void;
	_setValue(x: number, y: number): void;
}
export declare class IoColorSliderSv extends IoColorSlider {
	static get Style(): string;
	static get Properties(): any;
	static get Frag(): string;
	_onKeydown(event: KeyboardEvent): void;
	_setValue(x: number, y: number): void;
}
export declare class IoColorSliderSl extends IoColorSlider {
	static get Style(): string;
	static get Properties(): any;
	static get Frag(): string;
	_onKeydown(event: KeyboardEvent): void;
	_setValue(x: number, y: number): void;
}
export declare class IoColorSliderCyan extends IoColorSlider {
	static get Frag(): string;
	_setIncrease(): void;
	_setDecrease(): void;
	_setValue(x: number): void;
}
export declare class IoColorSliderMagenta extends IoColorSlider {
	static get Frag(): string;
	_setIncrease(): void;
	_setDecrease(): void;
	_setValue(x: number): void;
}
export declare class IoColorSliderYellow extends IoColorSlider {
	static get Frag(): string;
	_setIncrease(): void;
	_setDecrease(): void;
	_setValue(x: number): void;
}
export declare class IoColorSliderKey extends IoColorSlider {
	static get Frag(): string;
	_setIncrease(): void;
	_setDecrease(): void;
	_setValue(x: number): void;
}
export declare class IoColorSliderAlpha extends IoColorSlider {
	static get Frag(): string;
	applyAria(): void;
	_setIncrease(): void;
	_setDecrease(): void;
	_setMin(): void;
	_setMax(): void;
	_setValue(x: number): void;
}
declare const IoColorPanel_base: {
	new (...args: any[]): {
		[x: string]: any;
		valueMutated(): void;
		modeChanged(): void;
		setValueFromRgb(): void;
		setValueFromHsv(): void;
		setValueFromHsl(): void;
		setValueFromCmyk(): void;
		valueChanged(): void;
	};
	readonly Properties: any;
	readonly GlUtils: string;
} & typeof IoElement;
export declare class IoColorPanel extends IoColorPanel_base {
	static get Style(): string;
	static get Properties(): any;
	static get Listeners(): {
		keydown: string;
	};
	_onKeydown(event: KeyboardEvent): void;
	onValueSet(): void;
	changed(): void;
}
export declare class IoItem extends IoElement {
	static get Style(): string;
	static get Properties(): PropertiesDeclaration;
	static get Listeners(): {
		focus: string;
		pointerdown: string;
		click: string;
	};
	constructor(properties?: Record<string, any>);
	_onFocus(event: FocusEvent): void;
	_onBlur(event: FocusEvent): void;
	_onPointerdown(event: PointerEvent): void;
	_onPointermove(event: PointerEvent): void;
	_onPointerleave(event: PointerEvent): void;
	_onPointerup(event: PointerEvent): void;
	_onClick(): void;
	_onKeydown(event: KeyboardEvent): void;
	_onKeyup(event: KeyboardEvent): void;
	getCaretPosition(): number;
	setCaretPosition(position: number): void;
	changed(): void;
}
declare const IoColorPicker_base: {
	new (...args: any[]): {
		[x: string]: any;
		valueMutated(): void;
		modeChanged(): void;
		setValueFromRgb(): void;
		setValueFromHsv(): void;
		setValueFromHsl(): void;
		setValueFromCmyk(): void;
		valueChanged(): void;
	};
	readonly Properties: any;
	readonly GlUtils: string;
} & typeof IoItem;
export declare class IoColorPicker extends IoColorPicker_base {
	static get Style(): string;
	static get Properties(): any;
	static get Listeners(): any;
	_onClick(): void;
	get expanded(): any;
	_onKeydown(event: KeyboardEvent): void;
	_onValueSet(): void;
	toggle(): void;
	expand(): void;
	collapse(): void;
	changed(): void;
}
declare const IoColorVector_base: {
	new (...args: any[]): {
		[x: string]: any;
		valueMutated(): void;
		modeChanged(): void;
		setValueFromRgb(): void;
		setValueFromHsv(): void;
		setValueFromHsl(): void;
		setValueFromCmyk(): void;
		valueChanged(): void;
	};
	readonly Properties: any;
	readonly GlUtils: string;
} & typeof IoElement;
export declare class IoColorVector extends IoColorVector_base {
	static get Style(): string;
	static get Properties(): any;
	_onValueSet(event: CustomEvent): void;
	changed(): void;
	getSlotted(): (string | {
		id: string;
		mode: any;
		value: any;
	})[];
}
export interface StorageProps {
	key: string;
	value?: unknown;
	storage?: "hash" | "local";
}
export declare const IoStorageFactory: (props: StorageProps) => any;
export declare class IoContent extends IoElement {
	static get Style(): string;
	static get Properties(): any;
	changed(): void;
}
export declare class IoButton extends IoItem {
	static get Style(): string;
	static get Properties(): any;
	_onPointerdown(event: PointerEvent): void;
	_onPointerleave(event: PointerEvent): void;
	_onPointerup(event: PointerEvent): void;
	_onKeydown(event: KeyboardEvent): void;
	_onKeyup(event: KeyboardEvent): void;
	_onClick(): void;
}
export declare class IoBoolean extends IoItem {
	static get Style(): string;
	static get Properties(): any;
	_onClick(): void;
	toggle(): void;
	valueChanged(): void;
	changed(): void;
	applyAria(): void;
}
export declare class IoBoolicon extends IoBoolean {
	static get Style(): string;
	static get Properties(): any;
	changed(): void;
	applyAria(): void;
}
export declare class IoSwitch extends IoBoolean {
	static get Style(): string;
	changed(): void;
	applyAria(): void;
}
export declare class IoString extends IoItem {
	static get Style(): string;
	static get Properties(): any;
	_setFromTextNode(): void;
	_tryParseFromTextNode(): void;
	_onBlur(event: FocusEvent): void;
	_onPointerdown(): void;
	_onPointermove(): void;
	_onPointerup(): void;
	_onKeyup(event: KeyboardEvent): void;
	_onKeydown(event: KeyboardEvent): void;
	changed(): void;
	applyAria(): void;
}
export declare class IoNumber extends IoItem {
	static get Style(): string;
	static get Properties(): any;
	constructor(properties?: Record<string, any>);
	_onPointerdown(event: PointerEvent): void;
	_onPointerup(event: PointerEvent): void;
	_onFocus(event: FocusEvent): void;
	_onBlur(event: FocusEvent): void;
	_expandLadder(): void;
	_onKeydown(event: KeyboardEvent): void;
	_onKeyup(event: KeyboardEvent): void;
	_setFromTextNode(): void;
	changed(): void;
	applyAria(): void;
}
export declare class IoSliderRange extends IoSlider {
	static get Properties(): any;
	_onPointerdown(event: PointerEvent): void;
	_onPointermoveThrottled(event: PointerEvent): void;
	_setValue(x: number, y: number): void;
	_onKeydown(event: KeyboardEvent): void;
	_setIncrease(): void;
	_setDecrease(): void;
	_setMin(): void;
	_setMax(): void;
	applyAria(): void;
	static get Frag(): string;
}
export declare class IoNumberSlider extends IoElement {
	static get Style(): string;
	static get Properties(): any;
	_onNumberSet(event: CustomEvent): void;
	_onSliderSet(event: CustomEvent): void;
	changed(): void;
}
export declare class IoNumberSliderRange extends IoElement {
	static get Style(): string;
	static get Properties(): any;
	_onNumberSet(event: CustomEvent): void;
	_onSliderSet(event: CustomEvent): void;
	changed(): void;
}
export declare class IoLadder extends IoElement {
	static get Style(): string;
	static get Properties(): any;
	static get Listeners(): {
		"ladder-step-change": string;
		"ladder-step-collapse": string;
		focusin: string;
	};
	get value(): any;
	_onFocusIn(event: FocusEvent): void;
	_onFocusTo(event: CustomEvent): void;
	_onLadderStepChange(event: CustomEvent): void;
	_onLadderStepCollapse(): void;
	srcChanged(): void;
	expandedChanged(): void;
	changed(): void;
}
export declare const IoLadderSingleton: IoLadder;
declare class IoIconset extends IoNode {
	registerIcons(name: string, svg: string): void;
	getIcon(icon: string): string;
}
export declare const IoIconsetSingleton: IoIconset;
export declare class IoIcon extends IoElement {
	static get Style(): string;
	static get Properties(): any;
	iconChanged(): void;
}
export declare type NudgeDirection = "pointer" | "top" | "left" | "bottom" | "right";
declare class IoLayer extends IoElement {
	static get Style(): string;
	static get Properties(): any;
	static get Listeners(): {
		pointerup: string;
		contextmenu: string;
		focusin: string;
		scroll: string;
		wheel: string;
		mousedown: string;
		mouseup: string;
		mousemove: string;
		touchstart: string;
		touchmove: string;
		touchend: string;
		keydown: string;
		keyup: string;
	};
	constructor(properties?: Record<string, any>);
	stopPropagation(event: Event): void;
	_onPointerup(event: PointerEvent): void;
	_onCollapse(): void;
	_onContextmenu(event: Event): void;
	_onFocusIn(event: FocusEvent): void;
	_onScroll(event: Event): void;
	nudgeDown(element: HTMLElement, x: number, y: number, elemRect: DOMRect, force?: boolean): boolean;
	nudgeUp(element: HTMLElement, x: number, y: number, elemRect: DOMRect, force?: boolean): boolean;
	nudgeRight(element: HTMLElement, x: number, y: number, elemRect: DOMRect, force?: boolean): boolean;
	nudgeLeft(element: HTMLElement, x: number, y: number, elemRect: DOMRect, force?: boolean): boolean;
	nudgePointer(element: HTMLElement, x: number, y: number, elemRect: DOMRect): boolean;
	setElementPosition(element: HTMLElement, direction: NudgeDirection, srcRect: DOMRect): void;
	appendChild(child: HTMLElement): void;
	removeChild(child: HTMLElement): void;
	onChildExpanded(): void;
	onChildExpandedDelayed(): void;
	expandedChanged(): void;
}
export declare const IoLayerSingleton: IoLayer;
export declare class IoMdView extends IoElement {
	static get Style(): string;
	static get Properties(): any;
	onResized(): void;
	parseMarkdown(markdown: string): void;
	pathChanged(): void;
}
export declare class IoSelector extends IoElement {
	static get Style(): string;
	static get Properties(): any;
	static get Listeners(): {
		scroll: (string | {
			capture: boolean;
			passive: boolean;
		})[];
		"content-ready": string;
	};
	constructor(props?: any);
	_selectDefault(): void;
	_onIoContentReady(event: CustomEvent): void;
	connectedCallback(): void;
	scrollTo(id: string, smooth?: boolean): void;
	_onScroll(): void;
	selectedChanged(): void;
	optionsChanged(): void;
	elementsChanged(): void;
	updateScroll(): void;
	getSlotted(): any;
	importModule(path: string): Promise<unknown>;
	update(): void;
}
export declare class IoSidebar extends IoElement {
	static get Style(): string;
	static get Properties(): any;
	_filterObject(object: any, predicate: (object: any) => boolean, _depth?: number, _chain?: any[], _i?: number): any;
	_onSelect(id: string): void;
	_addOptions(options: any): any;
	changed(): void;
}
export declare class IoSelectorSidebar extends IoSelector {
	static get Style(): string;
	static get Properties(): any;
	onResized(): void;
	collapsedChanged(): void;
	getSlotted(): (string | {
		selected: any;
		options: any;
		collapsed: any;
	})[];
}
export declare class IoMdViewSelector extends IoSelectorSidebar {
	static get Properties(): any;
	update(): void;
}
export declare class IoServiceLoader extends IoNode {
	static get Properties(): any;
	constructor(props?: any);
	init(): Promise<void>;
	serviceWorkerChanged(): void;
	subscribe(): void;
	requestNotification(): Promise<void>;
	onServiceWorkerMessage(message: any): void;
}
export declare class IoElementDemo extends IoElement {
	static get Style(): string;
	static get Properties(): any;
	objectMutated(event: CustomEvent): void;
	changed(): void;
}
export declare class IoLayout extends IoElement {
	static get Style(): string;
	static get Properties(): any;
	static get Listeners(): {
		"io-layout-divider-move": string;
		"io-layout-tab-insert": string;
	};
	_onSelectedChanged(): void;
	changed(): void;
	_onLayoutTabInsert(event: CustomEvent): void;
	_onDividerMove(event: CustomEvent): void;
}
export declare class IoCollapsable extends IoElement {
	static get Style(): string;
	static get Properties(): any;
	changed(): void;
}
export declare class IoSelectorTabs extends IoSelector {
	static get Style(): string;
	static get Properties(): any;
	getSlotted(): any;
}
export declare class IoVector extends IoElement {
	static get Style(): string;
	static get Properties(): any;
	_onValueSet(event: CustomEvent): void;
	valueChanged(): void;
	changed(): void;
	getSlotted(): (string | {
		value: any;
		true: string;
		false: string;
	})[] | null;
}
export declare class IoMatrix extends IoElement {
	static get Style(): string;
	static get Properties(): any;
	_onValueSet(event: CustomEvent): void;
	valueChanged(): void;
	changed(): void;
}
export declare class IoMenuItem extends IoItem {
	static get Style(): string;
	static get Properties(): any;
	static get Listeners(): any;
	preventDefault(event: Event): void;
	get hasmore(): any;
	get inlayer(): any;
	connectedCallback(): void;
	disconnectedCallback(): void;
	_onClick(): void;
	_onItemClicked(event: PointerEvent): void;
	_onPointerdown(event: PointerEvent): void;
	_onPointermove(event: PointerEvent): void;
	_gethovered(event: PointerEvent): any;
	_expandHovered(): void;
	_onLayerPointermove(event: PointerEvent): void;
	_onLayerPointerup(event: PointerEvent): void;
	_onPointerup(event: PointerEvent): void;
	_onKeydown(event: KeyboardEvent): void;
	_onCollapse(): void;
	_onCollapseRoot(): void;
	expandedChanged(): void;
	optionChanged(change: CustomEvent): void;
	onOptionChanged(): void;
	changed(): void;
}
export declare class IoMenuOptions extends IoElement {
	static get Style(): string;
	static get Properties(): any;
	static get Listeners(): {
		"item-clicked": string;
		touchstart: string;
	};
	connectedCallback(): void;
	_onItemClicked(event: CustomEvent): void;
	_stopPropagation(event: MouseEvent): void;
	onResized(): void;
	_onSetOverflow(): void;
	_onCollapse(): void;
	expandedChanged(): void;
	searchChanged(): void;
	_onExpandedChangedLazy(): void;
	_clipHeight(): void;
	_filterOptions(object: any, predicate: (object: any) => boolean, _depth?: number, _chain?: any[], _i?: number): any;
	get _options(): any;
	changed(): void;
}
export declare class IoOptionMenu extends IoElement {
	static get Style(): string;
	static get Properties(): any;
	get _label(): any;
	_onPathChanged(event: CustomEvent): void;
	changed(): void;
}
export declare class IoContextMenu extends IoElement {
	static get Properties(): any;
	connectedCallback(): void;
	disconnectedCallback(): void;
	getBoundingClientRect(): any;
	_onItemClicked(event: CustomEvent): void;
	_onContextmenu(event: MouseEvent): void;
	_onPointerdown(event: PointerEvent): void;
	_onPointermove(event: PointerEvent): void;
	_onPointerup(event: PointerEvent): void;
	_onLayerPointermove(event: PointerEvent): void;
	_onClick(event: MouseEvent): void;
	_onCollapse(): void;
	expandedChanged(): void;
}
export declare class IoNotify extends IoElement {
	static get Style(): string;
	static get Properties(): any;
	static get Listeners(): {};
	constructor(props?: any);
	_onAgree(event: CustomEvent): void;
	_onDisgree(): void;
}
export declare class IoInspector extends IoElement {
	static get Style(): string;
	static get Properties(): any;
	static get Listeners(): {
		"item-clicked": string;
	};
	constructor(props?: any);
	_onItemClicked(event: CustomEvent): void;
	valueChanged(): void;
	advancedChanged(): void;
	selectedMutated(): void;
	_getConfig(): void;
	_getGroups(): void;
	_getWidgets(): void;
	_getAll(): void;
	changed(): void;
	_onhangedThrCottle(): void;
	_onChange(): void;
	static get Config(): {
		"type:object": (string | {
			class: string;
		})[];
		"type:null": (string | {
			class: string;
		})[];
	};
	static get Groups(): {
		"Object|hidden": RegExp[];
		"HTMLElement|main": (string | RegExp)[];
		"HTMLElement|hidden": (string | RegExp)[];
		"HTMLElement|content": RegExp[];
		"HTMLElement|display": RegExp[];
		"HTMLElement|hierarchy": RegExp[];
	};
	static get Widgets(): {};
	static RegisterConfig: (config: any) => void;
	static RegisterGroups: (groups: any) => void;
	static RegisterWidgets: (widgets: any) => void;
	static Register(): void;
}
export declare class IoProperties extends IoElement {
	static get Style(): string;
	static get Properties(): any;
	static get Config(): {
		"type:string": {}[];
		"type:number": (string | {
			step: number;
		})[];
		"type:boolean": {}[];
		"type:object": {}[];
		"type:null": {}[];
		"type:undefined": {}[];
	};
	_onValueSet(event: CustomEvent): void;
	_getConfig(): any;
	valueMutated(): void;
	changed(): void;
	_changedThrottled(): void;
	_onChange(): void;
	static RegisterConfig: (config: any) => void;
}
export declare class IoObject extends IoElement {
	static get Style(): string;
	static get Properties(): any;
	changed(): void;
}
/** @License
 * Copyright ©2022 Aleksandar (Aki) Rodic
 *
 * The MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
export declare const LICENSE = "MIT";

export {};
