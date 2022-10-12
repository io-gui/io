import { EventDispatcher } from './internals/eventDispatcher.js';
/**
 * Register function for `IoElement`. Registers custom element.
 * @param {IoElement} elementConstructor - Element class to register.
 */
export declare function RegisterIoElement(elementConstructor: typeof IoElement): void;
declare type VirtualDOMElement = [
    string,
    Record<string, any> | string
] | [
    string,
    Record<string, any> | string,
    VirtualDOMElement[] | string
];
export declare const buildTree: () => (node: VirtualDOMElement) => any;
declare const IoElement_base: {
    new (properties?: Record<string, any>, ...args: any[]): {
        [x: string]: any;
        readonly _protochain: import("./index.js").ProtoChain;
        readonly _properties: Record<string, import("./internals/property.js").PropertyInstance>;
        readonly _bindings: Record<string, import("./index.js").Binding>;
        readonly _changeQueue: import("./index.js").ChangeQueue;
        readonly _eventDispatcher: EventDispatcher;
        setProperty(name: string, value: any, skipDispatch?: boolean | undefined): void;
        applyProperties(props: any): void;
        setProperties(props: any): void;
        inputValue(value: any): void;
        changed(): void;
        init(): void;
        queue(prop: string, value: any, oldValue: any): void;
        dispatchQueue(): void;
        dispatchQueueSync: () => void;
        throttle(func: import("./node.js").CallbackFunction, arg?: any, sync?: boolean): void;
        onObjectMutated: (event: CustomEvent<any>) => void;
        objectMutated: (prop: string) => void;
        bind(prop: string): import("./index.js").Binding;
        unbind(prop: string): void;
        addEventListener(type: string, listener: import("./node.js").AnyEventListener, options?: AddEventListenerOptions | undefined): void;
        removeEventListener(type: string, listener?: import("./node.js").AnyEventListener | undefined, options?: AddEventListenerOptions | undefined): void;
        dispatchEvent(type: string, detail?: {}, bubbles?: boolean, src?: HTMLElement | Node | Document | Window | undefined): void;
        dispose(): void;
    };
    [x: string]: any;
    readonly Properties: import("./internals/property.js").PropertyDeclarations;
};
/**
 * Core `IoElement` class.
 */
export declare class IoElement extends IoElement_base {
    static get Style(): any;
    $: Record<string, any>;
    tabindex: string;
    contenteditable: boolean;
    class: string;
    role: string;
    label: string;
    name: string;
    title: string;
    id: string;
    hidden: boolean;
    disabled: boolean;
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
    disposeDeep(host: HTMLElement, child: any): void;
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
    _flattenTextNode(element: HTMLElement | IoElement): void;
    get textNode(): any;
    set textNode(value: any);
    applyProperties(props: any): void;
    /**
    * Alias for HTMLElement setAttribute where falsey values remove the attribute.
    * @param {string} attr - Attribute name.
    * @param {*} value - Attribute value.
    */
    setAttribute(attr: string, value: boolean | number | string): void;
    labelChanged(): void;
    disabledChanged(): void;
    _onFocusTo(event: CustomEvent): void;
    focusTo(dir: string): void;
}
export {};
//# sourceMappingURL=element.d.ts.map