import { ProtoChain } from '../core/ProtoChain.js';
import { Binding } from '../core/Binding.js';
import type { ChangeQueue } from '../core/ChangeQueue.js';
import { ReactivePropertyInstance, ReactivePropertyDefinitionLoose } from '../core/ReactiveProperty.js';
import type { EventDispatcher } from '../core/EventDispatcher.js';
import { CallbackFunction } from '../core/Queue.js';
import { IoElement } from '../elements/IoElement.js';
import type { ListenerDefinitionLoose, AnyEventListener } from '../core/EventDispatcher.js';
export type AnyConstructor = new (...args: never[]) => object;
/** Instantiates a property type constructor with runtime constructor arguments. */
export declare function constructType(ctor: AnyConstructor, ...args: unknown[]): object;
export type ReactivePropertyDefinitions = Record<string, ReactivePropertyDefinitionLoose>;
export type PropertyValues = Record<string, unknown>;
export type ListenerDefinitions = {
    [key: string]: ListenerDefinitionLoose;
};
export interface ReactiveNodeConstructor {
    ReactiveProperties?: ReactivePropertyDefinitions;
    Properties?: Record<string, unknown>;
    Listeners?: ListenerDefinitions;
    Style?: string;
    name?: string;
    prototype: ReactiveNodeConstructor | object | HTMLElement;
}
export interface Json {
    [key: string]: string | number | boolean | Json | Json[];
}
export declare const NODES: {
    active: Set<ReactiveNode>;
    disposed: WeakSet<ReactiveNode>;
};
export type ReactivityType = 'immediate' | 'throttled' | 'debounced';
export type WithBinding<T> = T | Binding<T>;
type prefix<TKey, TPrefix extends string> = TKey extends string ? `${TPrefix}${TKey}` : never;
type AnyEventHandler = ((event: CustomEvent) => void) | ((event: PointerEvent) => void) | ((event: KeyboardEvent) => void) | ((event: MouseEvent) => void) | ((event: TouchEvent) => void) | ((event: WheelEvent) => void) | ((event: InputEvent) => void) | ((event: ClipboardEvent) => void) | ((event: DragEvent) => void) | ((event: FocusEvent) => void) | ((event: TransitionEvent) => void) | ((event: AnimationEvent) => void) | ((event: ErrorEvent) => void) | ((event: Event) => void);
export type ReactiveNodeProps = {
    reactivity?: ReactivityType;
    [key: prefix<string, '@'>]: string | AnyEventHandler;
};
/**
 * Base class for reactive data models and state containers.
 *
 * ReactiveNode provides the core Io-Gui reactive property system without DOM
 * integration. Subclass it for domain models (for example menu options, layout
 * tabs, or theme state). Property changes dispatch change events and invoke
 * matching handlers; object mutations can propagate via {@link dispatchMutation}.
 *
 * Use {@link bind} for two-way synchronization between properties. Nodes register
 * with {@link Register} and declare reactive properties via static
 * `ReactiveProperties` or `@ReactiveProperty` decorators.
 *
 * @see IoElement for the DOM-integrated counterpart
 */
export declare class ReactiveNode extends Object {
    reactivity: ReactivityType;
    static get ReactiveProperties(): ReactivePropertyDefinitions;
    static get Properties(): Record<string, unknown>;
    /** Class-level listeners wired at construction; subclass overrides same event name (last wins). */
    static get Listeners(): ListenerDefinitions;
    readonly _protochain: ProtoChain;
    readonly _reactiveProperties: Map<string, ReactivePropertyInstance>;
    readonly _bindings: Map<string, Binding<unknown>>;
    readonly _changeQueue: ChangeQueue;
    readonly _eventDispatcher: EventDispatcher;
    readonly _children: Array<ReactiveNode | IoElement>;
    readonly _parents: Array<ReactiveNode | IoElement>;
    _hasWindowMutationListener: boolean;
    _hasSelfMutationListener: boolean;
    readonly _isNode: boolean;
    _disposed: boolean;
    constructor(args?: unknown);
    applyProperties(props: PropertyValues, skipDispatch?: boolean): void;
    setProperties(props: PropertyValues): void;
    setProperty(name: string, value: unknown, debounce?: boolean): void;
    copy(node: ReactiveNode): void;
    toJSON(): Json;
    applyJSON(json: Json): this;
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
    dispose(): void;
    Register(ioNodeConstructor: typeof ReactiveNode): void;
}
export declare function initReactiveProperties(node: ReactiveNode | IoElement): void;
export declare function initProperties(node: ReactiveNode | IoElement): void;
export declare function setProperties(node: ReactiveNode | IoElement, props: PropertyValues): void;
/** Assigns a reactive property, queuing change dispatch unless debounced. */
export declare function setProperty(node: ReactiveNode | IoElement, name: string, value: unknown, debounce?: boolean): void;
export declare function dispatchQueue(node: ReactiveNode | IoElement, debounce?: boolean): void;
/** Dispatches `io-object-mutation` for in-place object or nested Io value changes. */
export declare function dispatchMutation(node: ReactiveNode | IoElement, object: object | ReactiveNode, properties: string[]): void;
export declare function onPropertyMutated(node: ReactiveNode | IoElement, event: CustomEvent): boolean;
/** Returns or creates a two-way {@link Binding} for the named reactive property. */
export declare function bind<TNode extends ReactiveNode | IoElement, K extends keyof TNode & string>(node: TNode, name: K): Binding<TNode[K]>;
export declare function bind(node: ReactiveNode | IoElement, name: string): Binding<unknown>;
/** Disposes and removes the binding for the named reactive property. */
export declare function unbind<TNode extends ReactiveNode | IoElement, K extends keyof TNode & string>(node: TNode, name: K): void;
export declare function unbind(node: ReactiveNode | IoElement, name: string): void;
export { detachChildParents } from '../core/ReactiveCore.js';
/** Tears down bindings, listeners, queues, and parent links for a reactive owner. */
export declare function dispose(node: ReactiveNode | IoElement): void;
//# sourceMappingURL=ReactiveNode.d.ts.map