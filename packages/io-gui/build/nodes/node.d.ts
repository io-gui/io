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
export interface NodeConstructor {
    ReactiveProperties?: ReactivePropertyDefinitions;
    Properties?: Record<string, any>;
    Listeners?: ListenerDefinitions;
    Style?: string;
    name?: string;
    prototype: NodeConstructor | Object | HTMLElement;
}
export type ReactivityType = 'immediate' | 'throttled' | 'debounced';
export type WithBinding<T> = T | Binding<T>;
type prefix<TKey, TPrefix extends string> = TKey extends string ? `${TPrefix}${TKey}` : never;
export type NodeProps = {
    reactivity?: ReactivityType;
    [key: prefix<string, '@'>]: string | ((event: CustomEvent<any>) => void) | ((event: PointerEvent) => void);
};
export declare class Node extends Object {
    reactivity: ReactivityType;
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
    readonly _parents: Array<Node>;
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
    addParent(parent: Node): void;
    removeParent(parent: Node): void;
    dispose(): void;
    Register(ioNodeConstructor: typeof Node): void;
}
export declare function initReactiveProperties(node: Node | IoElement): void;
export declare function initProperties(node: Node | IoElement): void;
export declare function setProperties(node: Node | IoElement, props: any): void;
export declare function setProperty(node: Node | IoElement, name: string, value: any, debounce?: boolean): void;
export declare function dispatchQueue(node: Node | IoElement, debounce?: boolean): void;
export declare function onPropertyMutated(node: Node | IoElement, event: CustomEvent): true | undefined;
export declare function observeObjectProperty(node: Node | IoElement, name: string, property: ReactivePropertyInstance): void;
export declare function observeNodeProperty(node: Node | IoElement, name: string, property: ReactivePropertyInstance): void;
export declare function bind<T>(node: Node | IoElement, name: string): Binding<T>;
export declare function unbind(node: Node | IoElement, name: string): void;
export declare function dispose(node: Node | IoElement): void;
export {};
//# sourceMappingURL=Node.d.ts.map