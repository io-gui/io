import { PropertyDefinitionWeak } from './internals/property.js';
import { ListenerDefinitionWeak } from './internals/eventDispatcher.js';
export declare type ListenersDeclaration = Record<string, ListenerDefinitionWeak>;
export declare type PropertiesDeclaration = Record<string, PropertyDefinitionWeak>;
export interface IoNodeConstructor<T> {
    new (...args: any[]): T;
    Properties?: PropertiesDeclaration;
    Listeners?: ListenersDeclaration;
    Style?: string;
    __proto__?: IoNodeConstructor<T>;
}
export declare type CallbackFunction = (arg?: any) => void;
export declare type KeyboardEventListener = (event: KeyboardEvent) => void;
export declare type PointerEventListener = (event: PointerEvent) => void;
export declare type CustomEventListener = (event: CustomEvent) => void | EventListener;
export declare type FocusEventListener = (event: FocusEvent) => void;
export declare type TouchEventListener = (event: TouchEvent) => void;
export declare type AnyEventListener = EventListener | KeyboardEventListener | PointerEventListener | CustomEventListener | FocusEventListener | TouchEventListener;
/**
 * Core mixin for `Node` classes.
 * @param {function} superclass - Class to extend.
 * @return {function} - Extended class constructor with `IoNodeMixin` applied to it.
 */
export declare function IoNodeMixin<T extends IoNodeConstructor<any>>(superclass: T): IoNodeConstructor<any>;
/**
 * Register function to be called once per class.
 * @param {IoNode} nodeConstructor - Node class to register.
 */
export declare const RegisterIoNode: (nodeConstructor: typeof IoNode) => void;
declare const IoNode_base: IoNodeConstructor<any>;
/**
 * IoNodeMixin applied to `Object` class.
 */
export declare class IoNode extends IoNode_base {
}
export {};
//# sourceMappingURL=io-node.d.ts.map