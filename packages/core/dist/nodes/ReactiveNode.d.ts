import { ProtoChain } from '../core/ProtoChain.js';
import { Binding } from '../core/Binding.js';
import { ChangeQueue } from '../core/ChangeQueue.js';
import { ReactivePropertyInstance, ReactivePropertyDefinitionLoose } from '../core/ReactiveProperty.js';
import { EventDispatcher, ListenerDefinitionLoose, AnyEventListener } from '../core/EventDispatcher.js';
import { CallbackFunction } from '../core/Queue.js';
import { IoElement } from '../elements/IoElement.js';
export type AnyConstructor = new (...args: any[]) => unknown;
export type ReactivePropertyDefinitions = Record<string, ReactivePropertyDefinitionLoose>;
export type ListenerDefinitions = {
    [key: string]: ListenerDefinitionLoose;
};
export interface ReactiveNodeConstructor {
    ReactiveProperties?: ReactivePropertyDefinitions;
    Properties?: Record<string, any>;
    Listeners?: ListenerDefinitions;
    Style?: string;
    name?: string;
    prototype: ReactiveNodeConstructor | object | HTMLElement;
}
export declare const NODES: {
    active: Set<ReactiveNode>;
    disposed: WeakSet<ReactiveNode>;
};
export type ReactivityType = 'immediate' | 'throttled' | 'debounced';
export type WithBinding<T> = T | Binding;
type prefix<TKey, TPrefix extends string> = TKey extends string ? `${TPrefix}${TKey}` : never;
type AnyEventHandler = ((event: CustomEvent<any>) => void) | ((event: PointerEvent) => void) | ((event: KeyboardEvent) => void) | ((event: MouseEvent) => void) | ((event: TouchEvent) => void) | ((event: WheelEvent) => void) | ((event: InputEvent) => void) | ((event: ClipboardEvent) => void) | ((event: DragEvent) => void) | ((event: FocusEvent) => void) | ((event: TransitionEvent) => void) | ((event: AnimationEvent) => void) | ((event: ErrorEvent) => void) | ((event: Event) => void);
export type ReactiveNodeProps = {
    reactivity?: ReactivityType;
    [key: prefix<string, '@'>]: string | AnyEventHandler;
};
export declare class ReactiveNode extends Object {
    reactivity: ReactivityType;
    static get ReactiveProperties(): ReactivePropertyDefinitions;
    static get Properties(): Record<string, any>;
    static get Listeners(): ListenerDefinitions;
    readonly _protochain: ProtoChain;
    readonly _reactiveProperties: Map<string, ReactivePropertyInstance>;
    readonly _bindings: Map<string, Binding>;
    readonly _changeQueue: ChangeQueue;
    readonly _eventDispatcher: EventDispatcher;
    readonly _parents: Array<ReactiveNode | IoElement>;
    readonly _isNode: boolean;
    readonly _isIoElement: boolean;
    _disposed: boolean;
    constructor(args?: any);
    applyProperties(props: any, skipDispatch?: boolean): void;
    setProperties(props: any): void;
    setProperty(name: string, value: any, debounce?: boolean): void;
    init(): void;
    ready(): void;
    changed(): void;
    get [Symbol.toStringTag](): string;
    queue(name: string, value: any, oldValue: any): void;
    dispatchQueue(debounce?: boolean): void;
    throttle(func: CallbackFunction, arg?: any, timeout?: number): void;
    debounce(func: CallbackFunction, arg?: any, timeout?: number): void;
    onPropertyMutated(event: CustomEvent): boolean;
    dispatchMutation(object?: object | ReactiveNode, properties?: string[]): void;
    bind(name: string): Binding;
    unbind(name: string): void;
    addEventListener(type: string, listener: AnyEventListener, options?: AddEventListenerOptions): void;
    removeEventListener(type: string, listener?: AnyEventListener, options?: AddEventListenerOptions): void;
    dispatch(type: string, detail?: any, bubbles?: boolean, src?: ReactiveNode | HTMLElement | Document | Window): void;
    addParent(parent: ReactiveNode | IoElement): void;
    removeParent(parent: ReactiveNode | IoElement): void;
    dispose(): void;
    Register(ioNodeConstructor: typeof ReactiveNode): void;
}
export declare function initReactiveProperties(node: ReactiveNode | IoElement): void;
export declare function initProperties(node: ReactiveNode | IoElement): void;
export declare function setProperties(node: ReactiveNode | IoElement, props: any): void;
export declare function setProperty(node: ReactiveNode | IoElement, name: string, value: any, debounce?: boolean): void;
export declare function dispatchQueue(node: ReactiveNode | IoElement, debounce?: boolean): void;
export declare function dispatchMutation(node: ReactiveNode | IoElement, object: object | ReactiveNode, properties: string[]): void;
export declare function onPropertyMutated(node: ReactiveNode | IoElement, event: CustomEvent): boolean;
export declare function bind(node: ReactiveNode | IoElement, name: string): Binding;
export declare function unbind(node: ReactiveNode | IoElement, name: string): void;
export declare function dispose(node: ReactiveNode | IoElement): void;
export {};
//# sourceMappingURL=ReactiveNode.d.ts.map