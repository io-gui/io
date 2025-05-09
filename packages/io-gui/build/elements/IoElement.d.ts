import { VDOMElement, NativeElementProps } from '../vdom/VDOM';
import { Node, NodeProps } from '../nodes/Node';
export type IoElementProps = NativeElementProps & NodeProps;
declare const IoElement_base: {
    new (args?: import("../nodes/Node").PropsWithBinding<{
        [key: `@${string}`]: string | ((event: CustomEvent<any>) => void) | ((event: PointerEvent) => void);
        reactivity?: "none" | "immediate" | "throttled" | "debounced";
    }>, ...superProps: any[]): {
        [x: string]: any;
        readonly _protochain: import("..").ProtoChain;
        readonly _properties: Map<string, import("..").PropertyInstance>;
        readonly _bindings: Map<string, import("..").Binding<any>>;
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
        throttle(func: import("..").CallbackFunction, arg?: any, timeout?: number): void;
        debounce(func: import("..").CallbackFunction, arg?: any, timeout?: number): void;
        onPropertyMutated(event: CustomEvent): true | undefined;
        bind<T>(name: string): import("..").Binding<T>;
        unbind(name: string): void;
        addEventListener(type: string, listener: import("..").AnyEventListener, options?: AddEventListenerOptions): void;
        removeEventListener(type: string, listener?: import("..").AnyEventListener, options?: AddEventListenerOptions): void;
        dispatchEvent(type: string, detail?: any, bubbles?: boolean, src?: Node | HTMLElement | Document | Window): void;
        dispose(): void;
        Register(ioNodeConstructor: typeof Node): void;
    };
    [x: string]: any;
    readonly Properties: import("../nodes/Node").PropertyDefinitions;
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
type Direction = 'left' | 'right' | 'down' | 'up';
export declare function focusTo(srcElement: IoElement | HTMLElement, dir: Direction): void;
export {};
//# sourceMappingURL=IoElement.d.ts.map