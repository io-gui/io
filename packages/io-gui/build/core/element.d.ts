import { EventDispatcher } from './internals/eventDispatcher';
import { IoNode, IoNodeArgs } from './node';
export type IoElementArgs = IoNodeArgs & {
    tabindex?: string;
    contenteditable?: boolean;
    class?: string;
    role?: string;
    label?: string;
    name?: string;
    title?: string;
    id?: string;
    hidden?: boolean;
    disabled?: boolean;
    cache?: boolean;
    [key: string]: any;
};
export type VDOMArray = [
    string
] | [
    string,
    IoElementArgs | string | VDOMArray[]
] | [
    string,
    IoElementArgs | string,
    VDOMArray[] | string
];
export type VDOMElement = {
    name: string;
    props: IoElementArgs;
    children: VDOMElement[];
};
export declare const buildTree: () => (node: VDOMArray) => any;
export declare const disposeElementDeep: (element: IoElement) => void;
/**
 * Sets element properties.
 * @param {HTMLElement} element - Element to set properties on.
 * @param {Object} props - Element properties.
 */
export declare const applyNativeElementProps: (element: HTMLElement, props: any) => void;
declare const IoElement_base: {
    new (...args: any[]): {
        [x: string]: any;
        readonly _protochain: import("..").ProtoChain;
        readonly _properties: Map<string, import("..").PropertyInstance>;
        readonly _bindings: Map<string, import("..").Binding>;
        readonly _changeQueue: import("..").ChangeQueue;
        readonly _eventDispatcher: EventDispatcher;
        applyProperties(props: any): void;
        setProperties(props: any): void;
        setProperty(name: string, value: any, debounce?: boolean): void;
        inputValue(value: any): void;
        changed(): void;
        init(): void;
        queue(name: string, value: any, oldValue: any): void;
        dispatchQueue(debounce?: boolean): void;
        throttle(func: import("./node").CallbackFunction, arg?: any): void;
        debounce(func: import("./node").CallbackFunction, arg?: any, timeout?: number): void;
        onPropertyMutated(event: CustomEvent): void;
        bind(name: string): import("..").Binding;
        unbind(name: string): void;
        addEventListener(type: string, listener: import("./internals/eventDispatcher").AnyEventListener, options?: AddEventListenerOptions): void;
        removeEventListener(type: string, listener?: import("./internals/eventDispatcher").AnyEventListener, options?: AddEventListenerOptions): void;
        dispatchEvent(type: string, detail?: any, bubbles?: boolean, src?: Node | HTMLElement | Document | Window): void;
        dispose(): void;
        Register(ioNodeConstructor: typeof IoNode): void;
    };
    [x: string]: any;
    readonly Properties: import("./node").PropertyDefinitions;
};
/**
 * Core `IoElement` class.
 */
export declare class IoElement extends IoElement_base {
    static get Style(): string;
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
    constructor(...args: any[]);
    /**
    * Add resize listener if `onResized()` is defined in subclass.
    */
    connectedCallback(): void;
    /**
    * Removes resize listener if `onResized()` is defined in subclass.
    */
    disconnectedCallback(): void;
    setProperty(name: string, value: any, debounce?: boolean): void;
    /**
     * Renders DOM from virtual DOM arrays.
     * @param {Array} vDOM - Array of vDOM children.
     * @param {HTMLElement} [host] - Optional template target.
     * @param {boolean} [cache] - Optional don't reuse existing elements and skip dispose
     */
    template(vDOM: Array<any>, host?: HTMLElement, cache?: boolean): void;
    /**
     * Recurively traverses vDOM.
     * TODO: test element.traverse() function!
     * @param {Array} vChildren - Array of vDOM children converted by `buildTree()` for easier parsing.
     * @param {HTMLElement} [host] - Optional template target.
     * @param {boolean} [cache] - Optional don't reuse existing elements and skip dispose
     */
    traverse(vChildren: Array<any>, host: HTMLElement, cache?: boolean): void;
    Register(ioNodeConstructor: typeof IoNode): void;
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
}
export {};
//# sourceMappingURL=element.d.ts.map