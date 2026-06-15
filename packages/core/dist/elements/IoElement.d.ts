import { ProtoChain } from '../core/ProtoChain.js';
import { VDOMElement, NativeElementProps } from '../vdom/VDOM.js';
import { ReactiveNode, ReactivityType, ReactivePropertyDefinitions, ListenerDefinitions, PropertyValues } from '../nodes/ReactiveNode.js';
import { Binding } from '../core/Binding.js';
import type { EventDispatcher, AnyEventListener } from '../core/EventDispatcher.js';
import type { ChangeQueue } from '../core/ChangeQueue.js';
import { ReactivePropertyInstance } from '../core/ReactiveProperty.js';
import { CallbackFunction } from '../core/Queue.js';
type prefix<TKey, TPrefix extends string> = TKey extends string ? `${TPrefix}${TKey}` : never;
type AnyEventHandler = ((event: CustomEvent) => void) | ((event: PointerEvent) => void) | ((event: KeyboardEvent) => void) | ((event: MouseEvent) => void) | ((event: TouchEvent) => void) | ((event: WheelEvent) => void) | ((event: InputEvent) => void) | ((event: ClipboardEvent) => void) | ((event: DragEvent) => void) | ((event: FocusEvent) => void) | ((event: TransitionEvent) => void) | ((event: AnimationEvent) => void) | ((event: ErrorEvent) => void) | ((event: Event) => void);
export type IoElementProps = NativeElementProps & {
    reactivity?: ReactivityType;
    [key: prefix<string, '@'>]: string | AnyEventHandler;
};
/**
 * Base class for Io-Gui custom elements.
 *
 * IoElement extends `HTMLElement` with the same reactive property system as
 * {@link ReactiveNode}, plus virtual DOM rendering, inherited CSS via static
 * `Style`, and DOM event bridging through {@link EventDispatcher}.
 *
 * Elements render children with {@link IoElement.render} and declare structure
 * through VDOM helpers exported from `@io-gui/core`. Register elements with
 * {@link Register}; factory functions (for example `ioButton`) are generated
 * automatically for VDOM composition.
 *
 * @see ReactiveNode for non-DOM reactive objects
 */
export declare class IoElement extends HTMLElement {
    static vConstructor: (arg0?: IoElementProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    reactivity: ReactivityType;
    $: Record<string, HTMLElement | IoElement>;
    static get ReactiveProperties(): ReactivePropertyDefinitions;
    static get Properties(): Record<string, unknown>;
    /**
     * Declares class-level event listeners wired at construction via {@link EventDispatcher}.
     * Subclass definitions replace parent handlers for the same event name (last wins).
     * Use {@link addEventListener} for additional listeners at runtime.
     */
    static get Listeners(): ListenerDefinitions;
    readonly _protochain: ProtoChain;
    readonly _reactiveProperties: Map<string, ReactivePropertyInstance>;
    readonly _bindings: Map<string, Binding<unknown>>;
    readonly _changeQueue: ChangeQueue;
    readonly _eventDispatcher: EventDispatcher;
    _hasWindowMutationListener: boolean;
    _hasSelfMutationListener: boolean;
    readonly _children: Array<ReactiveNode | IoElement>;
    readonly _parents: Array<ReactiveNode | IoElement>;
    readonly _isIoElement: boolean;
    _disposed: boolean;
    _textNode: Text;
    constructor(args?: IoElementProps);
    /** Applies constructor/render props; defers dispatch when `skipDispatch` is true. */
    applyProperties(props: PropertyValues, skipDispatch?: boolean): void;
    setProperties(props: PropertyValues): void;
    setProperty(name: string, value: unknown, debounce?: boolean): void;
    init(): void;
    ready(): void;
    changed(): void;
    get [Symbol.toStringTag](): string;
    queue(name: string, value: unknown, oldValue: unknown): void;
    dispatchQueue(debounce?: boolean): void;
    throttle(func: CallbackFunction, arg?: unknown, timeout?: number): void;
    debounce(func: CallbackFunction, arg?: unknown, timeout?: number): void;
    onPropertyMutated(event: CustomEvent): boolean;
    dispatchMutation(object?: object | ReactiveNode, properties?: string[]): void;
    bind<K extends keyof this & string>(name: K): Binding<this[K]>;
    bind(name: string): Binding<unknown>;
    unbind<K extends keyof this & string>(name: K): void;
    unbind(name: string): void;
    addEventListener(type: string, listener: AnyEventListener, options?: AddEventListenerOptions): void;
    removeEventListener(type: string, listener?: AnyEventListener, options?: AddEventListenerOptions): void;
    dispatch(type: string, detail?: unknown, bubbles?: boolean, src?: ReactiveNode | HTMLElement | Document | Window): void;
    addParent(parent: ReactiveNode | IoElement): void;
    removeParent(parent: ReactiveNode | IoElement): void;
    /** Releases bindings, listeners, queues, and child elements. */
    dispose(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    /** Renders VDOM children into this element or optional host. */
    render(vDOMElements: Array<VDOMElement | null>, host?: HTMLElement | IoElement, noDispose?: boolean): void;
    /** Reconciles VDOM tree into host; keyed when children specify `key`. */
    traverse(vChildren: VDOMElement[], host: HTMLElement | IoElement, noDispose?: boolean): void;
    /**
     * Reconciles host children with vDOM children by position and tag name.
     * @param {Array} vChildren - Array of VDOMElements elements.
     * @param {HTMLElement} host - Template target.
     * @param {boolean} [noDispose] - Skip disposal of existing elements.
     */
    _reconcileChildren(vChildren: VDOMElement[], host: HTMLElement | IoElement, noDispose?: boolean): void;
    /**
     * Updates props of an existing element matched during reconciliation.
     * @param {HTMLElement | IoElement} child - Element to update.
     * @param {VDOMElement} vChild - Virtual DOM element to apply props from.
     */
    _updateElementProps(child: HTMLElement | IoElement, vChild: VDOMElement): void;
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
export {};
//# sourceMappingURL=IoElement.d.ts.map