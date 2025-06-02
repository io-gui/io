import { ProtoChain } from '../core/ProtoChain';
import { Binding } from '../core/Binding';
import { ChangeQueue } from '../core/ChangeQueue';
import { ReactivePropertyInstance, ReactivePropertyDefinitionLoose } from '../core/ReactiveProperty';
import { EventDispatcher, ListenerDefinitionLoose, AnyEventListener } from '../core/EventDispatcher';
import { CallbackFunction } from '../core/Queue';
export type AnyConstructor = new (...args: any[]) => unknown;
export type ReactivePropertyDefinitions = Record<string, ReactivePropertyDefinitionLoose>;
export type ListenerDefinitions = Record<string, ListenerDefinitionLoose>;
export interface NodeConstructor<T> {
    new (...args: any[]): T;
    ReactiveProperties?: ReactivePropertyDefinitions;
    Properties?: Record<string, any>;
    Listeners?: ListenerDefinitions;
    Style?: string;
}
type prefix<TKey, TPrefix extends string> = TKey extends string ? `${TPrefix}${TKey}` : never;
export type WithBinding<T> = T | Binding<T>;
export type NodeProps = {
    reactivity?: 'none' | 'immediate' | 'throttled' | 'debounced';
    [key: prefix<string, '@'>]: string | ((event: CustomEvent<any>) => void) | ((event: PointerEvent) => void);
};
/**
 * Core mixin for `Node` classes.
 * @param {function} superclass - Class to extend.
 * @return {function} - Extended class constructor with `NodeMixin` applied to it.
 */
export declare function NodeMixin<T extends NodeConstructor<any>>(superclass: T): {
    new (args?: NodeProps, ...superProps: any[]): {
        [x: string]: any;
        readonly _protochain: ProtoChain;
        readonly _reactiveProperties: Map<string, ReactivePropertyInstance>;
        readonly _bindings: Map<string, Binding<any>>;
        readonly _changeQueue: ChangeQueue;
        readonly _eventDispatcher: EventDispatcher;
        /**
         * Sets multiple properties in batch.
         * [property]-changed` events will be broadcast in the end.
         * @param {Object} props - Map of property names and values.
         */
        applyProperties(props: any, skipDispatch?: boolean): void;
        /**
         * Sets multiple properties in batch.
         * [property]-changed` events will be broadcast in the end.
         * @param {Object} props - Map of property names and values.
         */
        setProperties(props: any): void;
        /**
         * Sets the property value, connects the bindings and sets attributes for properties with attribute reflection enabled.
         * @param {string} name Property name to set value of.
         * @param {any} value Peroperty value.
         * @param {boolean} [debounce] flag to skip event dispatch.
         */
        setProperty(name: string, value: any, debounce?: boolean): void;
        /**
         * Sets value property and emits `value-input` event.
         * Use this when value property is set by user action (e.g. mouse click).
         * @param {*} value - Property value.
         */
        inputValue(value: any): void;
        /**
         * default change handler.
         * Invoked when one of the properties change.
         */
        changed(): void;
        init(): void;
        /**
         * Adds property change to the queue.
         * @param {string} name - Property name.
         * @param {*} value - Property value.
         * @param {*} oldValue - Old property value.
         */
        queue(name: string, value: any, oldValue: any): void;
        /**
         * Dispatches the queue in the next rAF cycle if `reactivity` property is set to `"debounced"`. Otherwise it dispatches the queue immediately.
         */
        dispatchQueue(debounce?: boolean): void;
        /**
         * Throttles function execution once per frame (rAF).
         * @param {CallbackFunction} func - Function to throttle.
         * @param {*} [arg] - Optional argument for throttled function.
         */
        throttle(func: CallbackFunction, arg?: any, timeout?: number): void;
        /**
         * Debounces function execution to next frame (rAF).
         * @param {CallbackFunction} func - Function to debounce.
         * @param {*} [arg] - Optional argument for debounced function.
         */
        debounce(func: CallbackFunction, arg?: any, timeout?: number): void;
        /**
         * Event handler for 'object-mutated' events emitted from the properties which are Node instances.
         * Aditionally, it handles events emitted from the `window` object (used for observing non-Node object properties).
         * NOTE: non-Node objects don't emit 'object-mutated' event automatically - something needs to emit this for them.
         * This is used to evoke '[propName]Mutated()' mutation handler
         * @param {Object} event - Event payload.
         * @param {EventTarget} event.target - Node that emitted the event.
         * @param {Node} event.detail.object - Mutated node.
         */
        onPropertyMutated(event: CustomEvent): true | undefined;
        /**
         * Returns a binding to a specified property`.
         * @param {string} name - Property name to bind to.
         * @return {Binding} Binding object.
         */
        bind<T_1>(name: string): Binding<T_1>;
        /**
         * Unbinds a binding to a specified property`.
         * @param {string} name - Property name to unbind.
         */
        unbind(name: string): void;
        /**
         * Wrapper for addEventListener.
         * @param {string} type - listener name.
         * @param {function} listener - listener handler.
         * @param {Object} options - event listener options.
         */
        addEventListener(type: string, listener: AnyEventListener, options?: AddEventListenerOptions): void;
        /**
         * Wrapper for removeEventListener.
         * @param {string} type - event name to listen to.
         * @param {function} listener - listener handler.
         * @param {Object} options - event listener options.
         */
        removeEventListener(type: string, listener?: AnyEventListener, options?: AddEventListenerOptions): void;
        /**
         * Wrapper for dispatchEvent.
         * @param {string} type - event name to dispatch.
         * @param {Object} detail - event detail.
         * @param {boolean} bubbles - event bubbles.
         * @param {HTMLElement|Node} src source node/element to dispatch event from.
         */
        dispatchEvent(type: string, detail?: any, bubbles?: boolean, src?: Node | HTMLElement | Document | Window): void;
        /**
         * Disposes all core.
         * Use this when instance is no longer needed.
         */
        dispose(): void;
        Register(ioNodeConstructor: typeof Node): void;
    };
    [x: string]: any;
    readonly ReactiveProperties: ReactivePropertyDefinitions;
};
declare const Node_base: {
    new (args?: NodeProps, ...superProps: any[]): {
        [x: string]: any;
        readonly _protochain: ProtoChain;
        readonly _reactiveProperties: Map<string, ReactivePropertyInstance>;
        readonly _bindings: Map<string, Binding<any>>;
        readonly _changeQueue: ChangeQueue;
        readonly _eventDispatcher: EventDispatcher;
        /**
         * Sets multiple properties in batch.
         * [property]-changed` events will be broadcast in the end.
         * @param {Object} props - Map of property names and values.
         */
        applyProperties(props: any, skipDispatch?: boolean): void;
        /**
         * Sets multiple properties in batch.
         * [property]-changed` events will be broadcast in the end.
         * @param {Object} props - Map of property names and values.
         */
        setProperties(props: any): void;
        /**
         * Sets the property value, connects the bindings and sets attributes for properties with attribute reflection enabled.
         * @param {string} name Property name to set value of.
         * @param {any} value Peroperty value.
         * @param {boolean} [debounce] flag to skip event dispatch.
         */
        setProperty(name: string, value: any, debounce?: boolean): void;
        /**
         * Sets value property and emits `value-input` event.
         * Use this when value property is set by user action (e.g. mouse click).
         * @param {*} value - Property value.
         */
        inputValue(value: any): void;
        /**
         * default change handler.
         * Invoked when one of the properties change.
         */
        changed(): void;
        init(): void;
        /**
         * Adds property change to the queue.
         * @param {string} name - Property name.
         * @param {*} value - Property value.
         * @param {*} oldValue - Old property value.
         */
        queue(name: string, value: any, oldValue: any): void;
        /**
         * Dispatches the queue in the next rAF cycle if `reactivity` property is set to `"debounced"`. Otherwise it dispatches the queue immediately.
         */
        dispatchQueue(debounce?: boolean): void;
        /**
         * Throttles function execution once per frame (rAF).
         * @param {CallbackFunction} func - Function to throttle.
         * @param {*} [arg] - Optional argument for throttled function.
         */
        throttle(func: CallbackFunction, arg?: any, timeout?: number): void;
        /**
         * Debounces function execution to next frame (rAF).
         * @param {CallbackFunction} func - Function to debounce.
         * @param {*} [arg] - Optional argument for debounced function.
         */
        debounce(func: CallbackFunction, arg?: any, timeout?: number): void;
        /**
         * Event handler for 'object-mutated' events emitted from the properties which are Node instances.
         * Aditionally, it handles events emitted from the `window` object (used for observing non-Node object properties).
         * NOTE: non-Node objects don't emit 'object-mutated' event automatically - something needs to emit this for them.
         * This is used to evoke '[propName]Mutated()' mutation handler
         * @param {Object} event - Event payload.
         * @param {EventTarget} event.target - Node that emitted the event.
         * @param {Node} event.detail.object - Mutated node.
         */
        onPropertyMutated(event: CustomEvent): true | undefined;
        /**
         * Returns a binding to a specified property`.
         * @param {string} name - Property name to bind to.
         * @return {Binding} Binding object.
         */
        bind<T>(name: string): Binding<T>;
        /**
         * Unbinds a binding to a specified property`.
         * @param {string} name - Property name to unbind.
         */
        unbind(name: string): void;
        /**
         * Wrapper for addEventListener.
         * @param {string} type - listener name.
         * @param {function} listener - listener handler.
         * @param {Object} options - event listener options.
         */
        addEventListener(type: string, listener: AnyEventListener, options?: AddEventListenerOptions): void;
        /**
         * Wrapper for removeEventListener.
         * @param {string} type - event name to listen to.
         * @param {function} listener - listener handler.
         * @param {Object} options - event listener options.
         */
        removeEventListener(type: string, listener?: AnyEventListener, options?: AddEventListenerOptions): void;
        /**
         * Wrapper for dispatchEvent.
         * @param {string} type - event name to dispatch.
         * @param {Object} detail - event detail.
         * @param {boolean} bubbles - event bubbles.
         * @param {HTMLElement|Node} src source node/element to dispatch event from.
         */
        dispatchEvent(type: string, detail?: any, bubbles?: boolean, src?: Node | HTMLElement | Document | Window): void;
        /**
         * Disposes all core.
         * Use this when instance is no longer needed.
         */
        dispose(): void;
        Register(ioNodeConstructor: typeof Node): void;
    };
    [x: string]: any;
    readonly ReactiveProperties: ReactivePropertyDefinitions;
};
/**
 * NodeMixin applied to `Object` class.
 */
export declare class Node extends Node_base {
}
export {};
//# sourceMappingURL=Node.d.ts.map