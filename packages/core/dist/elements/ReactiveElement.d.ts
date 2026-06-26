import { ProtoChain } from '../core/ProtoChain.js';
import { VDOMElement, VDOMChild, VDOMFactoryChildren, NativeElementProps } from '../vdom/VDOM.js';
import { ReactiveObject, ReactivityType, PropertyDefinitions, ListenerDefinitions, PropertyValues } from '../nodes/ReactiveObject.js';
import { type ReactiveNode } from '../core/ReactiveCore.js';
import { Binding } from '../core/Binding.js';
import type { EventDispatcher, AnyEventListener } from '../core/EventDispatcher.js';
import type { ChangeQueue } from '../core/ChangeQueue.js';
import { PropertyInstance } from '../core/Property.js';
import { CallbackFunction } from '../core/Queue.js';
type prefix<TKey, TPrefix extends string> = TKey extends string ? `${TPrefix}${TKey}` : never;
type AnyEventHandler = ((event: CustomEvent) => void) | ((event: PointerEvent) => void) | ((event: KeyboardEvent) => void) | ((event: MouseEvent) => void) | ((event: TouchEvent) => void) | ((event: WheelEvent) => void) | ((event: InputEvent) => void) | ((event: ClipboardEvent) => void) | ((event: DragEvent) => void) | ((event: FocusEvent) => void) | ((event: TransitionEvent) => void) | ((event: AnimationEvent) => void) | ((event: ErrorEvent) => void) | ((event: Event) => void);
export type ReactiveElementProps = NativeElementProps & {
    reactivity?: ReactivityType;
    [key: prefix<string, '@'>]: string | AnyEventHandler;
};
/**
 * Base class for Io-Gui custom elements.
 *
 * ReactiveElement extends `HTMLElement` with the same reactive property system as
 * {@link ReactiveObject}, plus virtual DOM rendering, inherited CSS via static
 * `Style`, and DOM event bridging through {@link EventDispatcher}.
 *
 * Elements render children with {@link ReactiveElement.render} and declare structure
 * through VDOM helpers exported from `@io-gui/core`. Register elements with
 * {@link Register}; factory functions (for example `ioButton`) are generated
 * automatically for VDOM composition.
 *
 * @see ReactiveObject for non-DOM reactive objects
 */
export declare class ReactiveElement extends HTMLElement {
    static vConstructor: (arg0?: ReactiveElementProps | VDOMFactoryChildren, arg1?: VDOMFactoryChildren) => VDOMElement;
    static get Style(): string;
    reactivity: ReactivityType;
    $: Record<string, HTMLElement | ReactiveElement>;
    static get Properties(): PropertyDefinitions;
    static get Fields(): Record<string, unknown>;
    /**
     * Declares class-level event listeners wired at construction via {@link EventDispatcher}.
     * Subclass definitions replace parent handlers for the same event name (last wins).
     * Use {@link addEventListener} for additional listeners at runtime.
     */
    static get Listeners(): ListenerDefinitions;
    readonly _protochain: ProtoChain;
    readonly _properties: Map<string, PropertyInstance>;
    readonly _bindings: Map<string, Binding<unknown>>;
    readonly _changeQueue: ChangeQueue;
    readonly _eventDispatcher: EventDispatcher;
    _hasWindowMutationListener: boolean;
    _hasSelfMutationListener: boolean;
    readonly _children: Array<ReactiveNode>;
    readonly _parents: Array<ReactiveNode>;
    readonly _isReactiveElement: boolean;
    _disposed: boolean;
    _textNode: Text;
    constructor(args?: ReactiveElementProps);
    /** Applies constructor/render props; defers dispatch when `skipDispatch` is true. */
    applyProperties(props: PropertyValues, skipDispatch?: boolean): void;
    setProperties(props: PropertyValues): void;
    setProperty(name: string, value: unknown, debounce?: boolean): void;
    init(): void;
    ready(): void;
    mutated(): void;
    get [Symbol.toStringTag](): string;
    queue(name: string, value: unknown, oldValue: unknown): void;
    dispatchQueue(debounce?: boolean): void;
    throttle(func: CallbackFunction, arg?: unknown, timeout?: number): void;
    debounce(func: CallbackFunction, arg?: unknown, timeout?: number): void;
    onPropertyMutated(event: CustomEvent): boolean;
    dispatchMutation(object?: object | ReactiveObject, properties?: string[]): void;
    bind<K extends keyof this & string>(name: K): Binding<this[K]>;
    bind(name: string): Binding<unknown>;
    unbind<K extends keyof this & string>(name: K): void;
    unbind(name: string): void;
    addEventListener(type: string, listener: AnyEventListener, options?: AddEventListenerOptions): void;
    removeEventListener(type: string, listener?: AnyEventListener, options?: AddEventListenerOptions): void;
    dispatch(type: string, detail?: unknown, bubbles?: boolean, src?: ReactiveObject | HTMLElement | Document | Window): void;
    addParent(parent: ReactiveNode): void;
    removeParent(parent: ReactiveNode): void;
    /** Releases bindings, listeners, queues, and child elements. */
    dispose(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    /** Renders VDOM children into this element or optional host. */
    render(vDOMElements: Array<VDOMChild>, host?: HTMLElement | ReactiveElement, skipDispose?: boolean): void;
    /** Reconciles VDOM tree into host; keyed when children specify `key`. */
    traverse(vChildren: VDOMElement[], host: HTMLElement | ReactiveElement, skipDispose?: boolean): void;
    /**
     * Reconciles host children with vDOM children by position and tag name.
     * @param {Array} vChildren - Array of VDOMElements elements.
     * @param {HTMLElement} host - Template target.
     * @param {boolean} [skipDispose] - Detach removed/replaced nodes without calling dispose (for DOM caching).
     */
    _reconcileChildren(vChildren: VDOMElement[], host: HTMLElement | ReactiveElement, skipDispose?: boolean): void;
    /**
     * Updates props of an existing element matched during reconciliation.
     * @param {HTMLElement | ReactiveElement} child - Element to update.
     * @param {VDOMElement} vChild - Virtual DOM element to apply props from.
     */
    _updateElementProps(child: HTMLElement | ReactiveElement, vChild: VDOMElement): void;
    /**
    * Helper function to flatten textContent into a single TextNode.
    * Update textContent via TextNode is better for layout performance.
    * TODO: Consider using normalize()? Is it the same function?
    * @param {HTMLElement} element - Element to flatten.
    */
    _flattenTextNode(element: HTMLElement | ReactiveElement): void;
    /**
    * Alias for HTMLElement setAttribute where falsey values remove the attribute.
    * @param {string} attr - Attribute name.
    * @param {*} value - Attribute value.
    */
    setAttribute(attr: string, value: boolean | number | string): void;
    Register(ioNodeConstructor: typeof ReactiveElement): void;
}
/**
 * Disposes EventDispatcher on an element.
 */
export declare const releaseEventDispatcher: (element: HTMLElement | ReactiveElement) => void;
/**
 * Disposes EventDispatchers on element and all element descendants.
 */
export declare const releaseSubtreeEventDispatchers: (root: HTMLElement) => void;
/**
 * Clears native element children after releasing orphaned EventDispatchers.
 */
export declare const clearNativeElementChildren: (element: HTMLElement) => void;
/**
 * Disposes the element's children.
 * @param {ReactiveElement} element - Element to dispose children of.
 */
export declare const disposeChildren: (element: ReactiveElement) => void;
export declare const reactiveElement: (arg0?: ReactiveElementProps | VDOMFactoryChildren, arg1?: VDOMFactoryChildren) => VDOMElement;
export {};
