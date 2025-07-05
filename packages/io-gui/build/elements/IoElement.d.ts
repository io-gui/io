import { VDOMElement, NativeElementProps } from '../vdom/VDOM.js';
import { Node, NodeProps } from '../nodes/Node.js';
import { Binding } from '../core/Binding.js';
export type IoElementProps = NativeElementProps & NodeProps;
declare const IoElement_base: {
    new (args?: NodeProps, ...superProps: any[]): {
        [x: string]: any;
        readonly _protochain: import("../index.js").ProtoChain;
        readonly _reactiveProperties: Map<string, import("../index.js").ReactivePropertyInstance>;
        readonly _bindings: Map<string, Binding<any>>;
        readonly _changeQueue: import("../index.js").ChangeQueue;
        readonly _eventDispatcher: import("../index.js").EventDispatcher;
        applyProperties(props: any, skipDispatch?: boolean): void;
        setProperties(props: any): void;
        setProperty(name: string, value: any, debounce?: boolean): void;
        inputValue(value: any): void;
        ready(): void;
        init(): void;
        changed(): void;
        queue(name: string, value: any, oldValue: any): void;
        dispatchQueue(debounce?: boolean): void;
        throttle(func: import("../index.js").CallbackFunction, arg?: any, timeout?: number): void;
        debounce(func: import("../index.js").CallbackFunction, arg?: any, timeout?: number): void;
        onPropertyMutated(event: CustomEvent): true | undefined;
        bind<T>(name: string): Binding<T>;
        unbind(name: string): void;
        addEventListener(type: string, listener: import("../index.js").AnyEventListener, options?: AddEventListenerOptions): void;
        removeEventListener(type: string, listener?: import("../index.js").AnyEventListener, options?: AddEventListenerOptions): void;
        dispatchEvent(type: string, detail?: any, bubbles?: boolean, src?: Node | HTMLElement | Document | Window): void;
        dispose(): void;
        Register(ioNodeConstructor: typeof Node): void;
    };
    [x: string]: any;
    readonly ReactiveProperties: import("../nodes/Node.js").ReactivePropertyDefinitions;
    readonly Listeners: import("../nodes/Node.js").ListenerDefinitions;
};
/**
 * Core `IoElement` class.
 */
export declare class IoElement extends IoElement_base {
    static vConstructor: (arg0?: IoElementProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    $: Record<string, HTMLElement | IoElement>;
    constructor(args?: IoElementProps);
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
     * @param {boolean} [noDispose] - Skip disposal of existing elements.
     */
    render(vDOMElements: Array<VDOMElement | null>, host?: HTMLElement | IoElement, noDispose?: boolean): void;
    /**
     * Recurively traverses virtual DOM elements.
     * TODO: test element.traverse() function!
     * @param {Array} vDOMElements - Array of VDOMElements elements.
     * @param {HTMLElement} [host] - Optional template target.
     * @param {boolean} [noDispose] - Skip disposal of existing elements.
     */
    traverse(vChildren: VDOMElement[], host: HTMLElement | IoElement, noDispose?: boolean): void;
    /**
    * Helper function to flatten textContent into a single TextNode.
    * Update textContent via TextNode is better for layout performance.
    * TODO: Consider using normalize()? Is it the same function?
    * @param {HTMLElement} element - Element to flatten.
    */
    _flattenTextNode(element: HTMLElement | IoElement): void;
    /**
     * Sets multiple properties in batch.
     * [property]-changed` events will be broadcast in the end.
     * @param {Object} props - Map of property names and values.
     */
    applyProperties(props: any, skipDispatch?: boolean): void;
    /**
    * Alias for HTMLElement setAttribute where falsey values remove the attribute.
    * @param {string} attr - Attribute name.
    * @param {*} value - Attribute value.
    */
    setAttribute(attr: string, value: boolean | number | string): void;
    /**
     * Returns a vDOM-like representation of the element with children and attributes. This feature is used in testing.
     */
    toVDOM(): VDOMElement;
    Register(ioNodeConstructor: typeof Node): void;
}
export declare const ioElement: (arg0?: IoElementProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
export {};
//# sourceMappingURL=IoElement.d.ts.map