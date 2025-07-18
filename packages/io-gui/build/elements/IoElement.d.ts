import { ProtoChain } from '../core/ProtoChain.js';
import { VDOMElement, NativeElementProps } from '../vdom/VDOM.js';
import { Node, NodeProps, ReactivityType, ReactivePropertyDefinitions, ListenerDefinitions } from '../nodes/Node.js';
import { Binding } from '../core/Binding.js';
import { EventDispatcher, AnyEventListener } from '../core/EventDispatcher.js';
import { ChangeQueue } from '../core/ChangeQueue.js';
import { ReactivePropertyInstance } from '../core/ReactiveProperty.js';
import { CallbackFunction } from '../core/Queue.js';
export type IoElementProps = NativeElementProps & NodeProps;
export declare class IoElement extends HTMLElement {
    static vConstructor: (arg0?: IoElementProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    reactivity: ReactivityType;
    $: Record<string, HTMLElement | IoElement>;
    static get ReactiveProperties(): ReactivePropertyDefinitions;
    static get Properties(): Record<string, any>;
    static get Listeners(): ListenerDefinitions;
    readonly _protochain: ProtoChain;
    readonly _reactiveProperties: Map<string, ReactivePropertyInstance>;
    readonly _bindings: Map<string, Binding<any>>;
    readonly _changeQueue: ChangeQueue;
    readonly _eventDispatcher: EventDispatcher;
    readonly _observedObjectProperties: string[];
    readonly _observedNodeProperties: string[];
    readonly _isNode: boolean;
    readonly _isIoElement: boolean;
    _disposed: boolean;
    _textNode: Text;
    constructor(args?: IoElementProps);
    applyProperties(props: any, skipDispatch?: boolean): void;
    setProperties(props: any): void;
    setProperty(name: string, value: any, debounce?: boolean): void;
    init(): void;
    ready(): void;
    changed(): void;
    queue(name: string, value: any, oldValue: any): void;
    dispatchQueue(debounce?: boolean): void;
    throttle(func: CallbackFunction, arg?: any, timeout?: number): void;
    debounce(func: CallbackFunction, arg?: any, timeout?: number): void;
    onPropertyMutated(event: CustomEvent): true | undefined;
    dispatchMutation(object?: Object | Node | IoElement, properties?: string[]): void;
    bind<T>(name: string): Binding<T>;
    unbind(name: string): void;
    addEventListener(type: string, listener: AnyEventListener, options?: AddEventListenerOptions): void;
    removeEventListener(type: string, listener?: AnyEventListener, options?: AddEventListenerOptions): void;
    dispatch(type: string, detail?: any, bubbles?: boolean, src?: Node | HTMLElement | Document | Window): void;
    dispose(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
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
    * Alias for HTMLElement setAttribute where falsey values remove the attribute.
    * @param {string} attr - Attribute name.
    * @param {*} value - Attribute value.
    */
    setAttribute(attr: string, value: boolean | number | string): void;
    /**
     * Returns a vDOM-like representation of the element with children and attributes. This feature is used in testing.
     */
    toVDOM(): VDOMElement;
    Register(ioNodeConstructor: typeof IoElement): void;
}
export declare const ioElement: (arg0?: IoElementProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoElement.d.ts.map