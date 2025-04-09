import { IoNode, IoNodeArgs, ArgsWithBinding } from '../nodes/node';
import { VDOMElement } from '../internals/vDOM';
export type IoElementArgs = IoNodeArgs & ArgsWithBinding<{
    $?: string;
    style?: Record<string, string>;
    class?: string;
    title?: string;
    id?: string;
    role?: string;
}>;
declare const IoElement_base: {
    new (...superArgs: any[]): {
        [x: string]: any;
        readonly _protochain: import("..").ProtoChain;
        readonly _properties: Map<string, import("..").PropertyInstance>;
        readonly _bindings: Map<string, import("..").Binding>;
        readonly _changeQueue: import("..").ChangeQueue;
        readonly _eventDispatcher: import("..").EventDispatcher;
        applyProperties(props: any, skipDispatch?: boolean): void;
        setProperties(props: any): void;
        setProperty(name: string, value: any, debounce?: boolean): void;
        inputValue(value: any): void;
        changed(): void;
        init(): void;
        queue(name: string, value: any, oldValue: any): void;
        dispatchQueue(debounce?: boolean): void;
        throttle(func: import("..").CallbackFunction, arg?: any): void;
        debounce(func: import("..").CallbackFunction, arg?: any, timeout?: number): void;
        onPropertyMutated(event: CustomEvent): void;
        bind(name: string): import("..").Binding;
        unbind(name: string): void;
        addEventListener(type: string, listener: import("..").AnyEventListener, options?: AddEventListenerOptions): void;
        removeEventListener(type: string, listener?: import("..").AnyEventListener, options?: AddEventListenerOptions): void;
        dispatchEvent(type: string, detail?: any, bubbles?: boolean, src?: Node | HTMLElement | Document | Window): void;
        dispose(): void;
        Register(ioNodeConstructor: typeof IoNode): void;
    };
    [x: string]: any;
    readonly Properties: import("../nodes/node").PropertyDefinitions;
};
/**
 * Core `IoElement` class.
 */
export declare class IoElement extends IoElement_base {
    static vConstructor: (arg0?: IoElementArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    $: Record<string, any>;
    class: string;
    title: string;
    id: string;
    role: string;
    constructor(args?: IoElementArgs);
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
     * @param {Array} vDOMElements - Array of VDOMElement[] children.
     * @param {HTMLElement} [host] - Optional template target.
     * @param {boolean} [cache] - Optional don't reuse existing elements and skip dispose
     */
    template(vDOMElements: Array<VDOMElement | null>, host?: HTMLElement | IoElement, cache?: boolean): void;
    /**
     * Recurively traverses virtual DOM elements.
     * TODO: test element.traverse() function!
     * @param {Array} vDOMElements - Array of VDOMElements elements.
     * @param {HTMLElement} [host] - Optional template target.
     * @param {boolean} [cache] - Optional don't reuse existing elements and skip dispose
     */
    traverse(vChildren: VDOMElement[], host: HTMLElement | IoElement, cache?: boolean): void;
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
    /**
     * Returns a vDOM-like representation of the element with children and attributes. This feature is used in testing.
     * @return {Object} vDOM-like representation of the element.
     */
    toVDOM(): VDOMElement;
    Register(ioNodeConstructor: typeof IoNode): void;
}
export declare const ioElement: (arg0?: IoElementArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
export {};
//# sourceMappingURL=element.d.ts.map