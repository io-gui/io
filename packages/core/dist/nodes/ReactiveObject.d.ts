import { ProtoChain } from '../core/ProtoChain.js';
import { Binding } from '../core/Binding.js';
import type { ChangeQueue } from '../core/ChangeQueue.js';
import { PropertyInstance, PropertyDefinitionLoose } from '../core/Property.js';
import type { EventDispatcher } from '../core/EventDispatcher.js';
import { CallbackFunction } from '../core/FrameScheduler.js';
import { type ReactiveNode } from '../core/ReactiveCore.js';
import type { ListenerDefinitionLoose, AnyEventListener } from '../core/EventDispatcher.js';
export type AnyConstructor = new (...args: never[]) => object;
export type ReactiveObjectConstructor = new (args: ReactiveObjectProps) => ReactiveObject;
/** Instantiates a property type constructor with runtime constructor arguments. */
export declare function constructType(ctor: AnyConstructor, ...args: unknown[]): object;
export type PropertyDefinitions = Record<string, PropertyDefinitionLoose>;
export type PropertyValues = Record<string, unknown>;
export type ListenerDefinitions = {
    [key: string]: ListenerDefinitionLoose;
};
export interface ReactiveNodeConstructor {
    Properties?: PropertyDefinitions;
    Fields?: Record<string, unknown>;
    Listeners?: ListenerDefinitions;
    Style?: string;
    name?: string;
    prototype: ReactiveNodeConstructor | object | HTMLElement;
}
export type JsonPrimitive = string | number | boolean | null;
export type JsonObject = {
    [key: string]: Json;
};
export type JsonArray = Json[];
export type Json = JsonPrimitive | JsonObject | JsonArray;
export declare const NODES: {
    active: Set<ReactiveObject>;
    disposed: WeakSet<ReactiveObject>;
};
export type DispatchTiming = 'immediate' | 'throttled' | 'debounced';
export type WithBinding<T> = T | Binding<T>;
type prefix<TKey, TPrefix extends string> = TKey extends string ? `${TPrefix}${TKey}` : never;
type AnyEventHandler = ((event: CustomEvent) => void) | ((event: PointerEvent) => void) | ((event: KeyboardEvent) => void) | ((event: MouseEvent) => void) | ((event: TouchEvent) => void) | ((event: WheelEvent) => void) | ((event: InputEvent) => void) | ((event: ClipboardEvent) => void) | ((event: DragEvent) => void) | ((event: FocusEvent) => void) | ((event: TransitionEvent) => void) | ((event: AnimationEvent) => void) | ((event: ErrorEvent) => void) | ((event: Event) => void);
export type ReactiveObjectProps = {
    dispatchTiming?: DispatchTiming;
    [key: prefix<string, '@'>]: string | AnyEventHandler;
};
/**
 * Base class for reactive data models and state containers.
 *
 * ReactiveObject provides the core Io-Gui reactive property system without DOM
 * integration. Subclass it for domain models (for example menu options, layout
 * tabs, or theme state). Field changes dispatch change events and invoke
 * matching handlers; object mutations can propagate via {@link dispatchMutation}.
 *
 * Use {@link bind} for two-way synchronization between properties. Nodes register
 * with {@link Register} and declare reactive properties via static
 * `Properties` or `@Property` decorators.
 *
 * @see ReactiveElement for the DOM-integrated counterpart
 */
export declare class ReactiveObject extends Object {
    dispatchTiming: DispatchTiming;
    static get Properties(): PropertyDefinitions;
    static get Fields(): Record<string, unknown>;
    /** Class-level listeners wired at construction; subclass overrides same event name (last wins). */
    static get Listeners(): ListenerDefinitions;
    readonly _protochain: ProtoChain;
    readonly _properties: Map<string, PropertyInstance>;
    readonly _bindings: Map<string, Binding<unknown>>;
    readonly _changeQueue: ChangeQueue;
    readonly _eventDispatcher: EventDispatcher;
    readonly _children: Array<ReactiveNode>;
    readonly _parents: Array<ReactiveNode>;
    _hasWindowMutationListener: boolean;
    _hasSelfMutationListener: boolean;
    readonly _isReactiveObject: boolean;
    _disposed: boolean;
    constructor(args?: unknown);
    applyProperties(props: PropertyValues, debounce?: boolean): void;
    setProperties(props: PropertyValues, debounce?: boolean): void;
    setProperty(name: string, value: unknown, debounce?: boolean): void;
    copy(node: ReactiveObject): void;
    toJSON(): Json;
    applyJSON(json: Json): this;
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
    dispose(): void;
    Register(ioNodeConstructor: typeof ReactiveObject): void;
}
export declare function initProperties(node: ReactiveNode): void;
export declare function initFields(node: ReactiveNode): void;
export declare function setProperties(node: ReactiveNode, props: PropertyValues, debounce?: boolean): void;
/** Assigns a reactive property, queuing change dispatch unless debounced. */
export declare function setProperty(node: ReactiveNode, name: string, value: unknown, debounce?: boolean): void;
export declare function dispatchQueue(node: ReactiveNode, debounce?: boolean): void;
/** Dispatches `io-mutation` for in-place object or nested Io value changes. */
export declare function dispatchMutation(node: ReactiveNode, object: object | ReactiveObject, properties: string[]): void;
export declare function onPropertyMutated(node: ReactiveNode, event: CustomEvent): boolean;
/** Returns or creates a two-way {@link Binding} for the named reactive property. */
export declare function bind<TNode extends ReactiveNode, K extends keyof TNode & string>(node: TNode, name: K): Binding<TNode[K]>;
export declare function bind(node: ReactiveNode, name: string): Binding<unknown>;
/** Disposes and removes the binding for the named reactive property. */
export declare function unbind<TNode extends ReactiveNode, K extends keyof TNode & string>(node: TNode, name: K): void;
export declare function unbind(node: ReactiveNode, name: string): void;
export { detachChildParents } from '../core/ReactiveCore.js';
/** Tears down bindings, listeners, queues, and parent links for a reactive owner. */
export declare function dispose(node: ReactiveNode): void;
