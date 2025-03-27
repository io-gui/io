import { ProtoChain } from './internals/protoChain';
import { Binding } from './internals/binding';
import { ChangeQueue } from './internals/changeQueue';
import { PropertyInstance, PropertyDefinitionLoose } from './internals/property';
import { EventDispatcher, ListenerDefinitionLoose, AnyEventListener } from './internals/eventDispatcher';
export type Constructor = new (...args: any[]) => unknown;
export type PropertyDefinitions = Record<string, PropertyDefinitionLoose>;
export type ListenerDefinitions = Record<string, ListenerDefinitionLoose>;
export interface IoNodeConstructor<T> {
    new (...args: any[]): T;
    Properties?: PropertyDefinitions;
    Listeners?: ListenerDefinitions;
    Style?: string;
}
export type CallbackFunction = (arg?: any) => void;
type prefix<TKey, TPrefix extends string> = TKey extends string ? `${TPrefix}${TKey}` : never;
export type IoNodeArgs = {
    reactivity?: 'none' | 'immediate' | 'debounced';
    [key: prefix<string, '@'>]: string | ((event: CustomEvent<any>) => void);
};
/**
 * Core mixin for `Node` classes.
 * @param {function} superclass - Class to extend.
 * @return {function} - Extended class constructor with `IoNodeMixin` applied to it.
 */
export declare function IoNodeMixin<T extends IoNodeConstructor<any>>(superclass: T): {
    new (...args: any[]): {
        [x: string]: any;
        readonly _protochain: ProtoChain;
        readonly _properties: Map<string, PropertyInstance>;
        readonly _bindings: Map<string, Binding>;
        readonly _changeQueue: ChangeQueue;
        readonly _eventDispatcher: EventDispatcher;
        /**
         * Sets multiple properties in batch.
         * [property]-changed` events will be broadcast in the end.
         * @param {Object} props - Map of property names and values.
         */
        applyProperties(props: any): void;
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
         * @param {function} func - Function to throttle.
         * @param {*} arg - argument for throttled function.
         */
        throttle(func: CallbackFunction, arg?: any): void;
        /**
         * Debounces function execution to next frame (rAF).
         * @param {function} func - Function to throttle.
         * @param {*} arg - argument for debounced function.
         * @param {number} timeout - minimum delay in ms before executing the function.
         */
        debounce(func: CallbackFunction, arg?: any, timeout?: number): void;
        /**
         * Event handler for 'object-mutated' events emitted from the properties which are IoNode instances.
         * Aditionally, it handles events emitted from the `window` object (used for observing non-IoNode object properties).
         * NOTE: non-IoNode objects don't emit 'object-mutated' event automatically - something needs to emit this for them.
         * This is used to evoke '[propName]Mutated()' mutation handler
         * @param {Object} event - Event payload.
         * @param {EventTarget} event.target - Node that emitted the event.
         * @param {IoNode} event.detail.object - Mutated node.
         */
        onPropertyMutated(event: CustomEvent): void;
        /**
         * Returns a binding to a specified property`.
         * @param {string} name - Property name to bind to.
         * @return {Binding} Binding object.
         */
        bind(name: string): Binding;
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
         * Disposes all internals.
         * Use this when instance is no longer needed.
         */
        dispose(): void;
        Register(ioNodeConstructor: typeof IoNode): void;
    };
    [x: string]: any;
    readonly Properties: PropertyDefinitions;
};
declare const IoNode_base: {
    new (...args: any[]): {
        [x: string]: any;
        readonly _protochain: ProtoChain;
        readonly _properties: Map<string, PropertyInstance>;
        readonly _bindings: Map<string, Binding>;
        readonly _changeQueue: ChangeQueue;
        readonly _eventDispatcher: EventDispatcher;
        /**
         * Sets multiple properties in batch.
         * [property]-changed` events will be broadcast in the end.
         * @param {Object} props - Map of property names and values.
         */
        applyProperties(props: any): void;
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
         * @param {function} func - Function to throttle.
         * @param {*} arg - argument for throttled function.
         */
        throttle(func: CallbackFunction, arg?: any): void;
        /**
         * Debounces function execution to next frame (rAF).
         * @param {function} func - Function to throttle.
         * @param {*} arg - argument for debounced function.
         * @param {number} timeout - minimum delay in ms before executing the function.
         */
        debounce(func: CallbackFunction, arg?: any, timeout?: number): void;
        /**
         * Event handler for 'object-mutated' events emitted from the properties which are IoNode instances.
         * Aditionally, it handles events emitted from the `window` object (used for observing non-IoNode object properties).
         * NOTE: non-IoNode objects don't emit 'object-mutated' event automatically - something needs to emit this for them.
         * This is used to evoke '[propName]Mutated()' mutation handler
         * @param {Object} event - Event payload.
         * @param {EventTarget} event.target - Node that emitted the event.
         * @param {IoNode} event.detail.object - Mutated node.
         */
        onPropertyMutated(event: CustomEvent): void;
        /**
         * Returns a binding to a specified property`.
         * @param {string} name - Property name to bind to.
         * @return {Binding} Binding object.
         */
        bind(name: string): Binding;
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
         * Disposes all internals.
         * Use this when instance is no longer needed.
         */
        dispose(): void;
        Register(ioNodeConstructor: typeof IoNode): void;
    };
    [x: string]: any;
    readonly Properties: PropertyDefinitions;
};
/**
 * IoNodeMixin applied to `Object` class.
 */
export declare class IoNode extends IoNode_base {
}
export declare function nextQueue(): Promise<void>;
export {};
//# sourceMappingURL=node.d.ts.map