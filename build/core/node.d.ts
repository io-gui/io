import { ProtoChain } from './internals/protoChain.js';
import { Binding } from './internals/binding.js';
import { ChangeQueue } from './internals/changeQueue.js';
import { PropertyInstance, PropertyDeclarations } from './internals/property.js';
import { EventDispatcher, ListenersDeclaration } from './internals/eventDispatcher.js';
export type Constructor = new (...args: any[]) => unknown;
export interface IoNodeConstructor<T> {
    new (...args: any[]): T;
    Properties?: PropertyDeclarations;
    Listeners?: ListenersDeclaration;
    Style?: string;
}
export type CallbackFunction = (arg?: any) => void;
export type KeyboardEventListener = (event: KeyboardEvent) => void;
export type PointerEventListener = (event: PointerEvent) => void;
export type CustomEventListener = (event: CustomEvent) => void | EventListener;
export type FocusEventListener = (event: FocusEvent) => void;
export type TouchEventListener = (event: TouchEvent) => void;
export type AnyEventListener = EventListener | KeyboardEventListener | PointerEventListener | CustomEventListener | FocusEventListener | TouchEventListener;
type prefix<TKey, TPrefix extends string> = TKey extends string ? `${TPrefix}${TKey}` : never;
export type IoNodeArgs = {
    lazy?: boolean;
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
         * Sets the property value, connects the bindings and sets attributes for properties with attribute reflection enabled.
         * @param {string} name Property name to set value of.
         * @param {any} value Peroperty value.
         * @param {boolean} [skipDispatch] flag to skip event dispatch.
         */
        setProperty(name: string, value: any, skipDispatch?: boolean): void;
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
         * @param {string} prop - Property name.
         * @param {*} value - Property value.
         * @param {*} oldValue - Old property value.
         */
        queue(prop: string, value: any, oldValue: any): void;
        /**
         * Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.
         */
        dispatchQueue(): void;
        /**
         * Dispatches the queue immediately.
         */
        dispatchQueueSync: () => void;
        /**
         * Throttles function execution to next frame (rAF) if the function has been executed in the current frame.
         * @param {function} func - Function to throttle.
         * @param {*} arg - argument for throttled function.
         * @param {number} timeout - minimum delay in ms before executing the function.
         */
        throttle(func: CallbackFunction, arg?: any, timeout?: number): void;
        /**
         * Event handler for 'object-mutated' event emitted from the `window`.
         * Node should be listening for this event if it has an observed object property
         * @param {Object} event - Event payload.
         * @param {Object} event.detail.object - Mutated object.
         */
        onObjectMutated: (event: CustomEvent) => void;
        /**
         * This function is called after `onObjectMutated()` determines that one of
         * the object properties has mutated.
         * @param {string} prop - Mutated object property name.
         */
        objectMutated: (prop: string) => void;
        /**
         * Returns a binding to a specified property`.
         * @param {string} prop - Property to bind to.
         * @return {Binding} Binding object.
         */
        bind(prop: string): Binding;
        /**
         * Unbinds a binding to a specified property`.
         * @param {string} prop - Property to unbind.
         */
        unbind(prop: string): void;
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
        dispatchEvent(type: string, detail?: {}, bubbles?: boolean, src?: Node | HTMLElement | Document | Window): void;
        /**
         * Shorthand for dispatching `'object-mutated'` event on window.
         * @param {any} object - object which mutated.
         */
        dispatchMutationEvent(object: any): void;
        /**
         * Disposes all internals.
         * Use this when instance is no longer needed.
         */
        dispose(): void;
        Register(ioNodeConstructor: typeof IoNode): void;
    };
    [x: string]: any;
    readonly Properties: PropertyDeclarations;
};
/**
 * Register function to be called once per class.
 * @param {IoNode} ioNodeConstructor - Node class to register.
 */
export declare function Register(ioNodeConstructor: typeof IoNode): void;
declare const IoNode_base: {
    new (...args: any[]): {
        [x: string]: any;
        readonly _protochain: ProtoChain;
        readonly _properties: Map<string, PropertyInstance>;
        readonly _bindings: Map<string, Binding>;
        readonly _changeQueue: ChangeQueue;
        readonly _eventDispatcher: EventDispatcher;
        /**
         * Sets the property value, connects the bindings and sets attributes for properties with attribute reflection enabled.
         * @param {string} name Property name to set value of.
         * @param {any} value Peroperty value.
         * @param {boolean} [skipDispatch] flag to skip event dispatch.
         */
        setProperty(name: string, value: any, skipDispatch?: boolean | undefined): void;
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
         * @param {string} prop - Property name.
         * @param {*} value - Property value.
         * @param {*} oldValue - Old property value.
         */
        queue(prop: string, value: any, oldValue: any): void;
        /**
         * Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.
         */
        dispatchQueue(): void;
        /**
         * Dispatches the queue immediately.
         */
        dispatchQueueSync: () => void;
        /**
         * Throttles function execution to next frame (rAF) if the function has been executed in the current frame.
         * @param {function} func - Function to throttle.
         * @param {*} arg - argument for throttled function.
         * @param {number} timeout - minimum delay in ms before executing the function.
         */
        throttle(func: CallbackFunction, arg?: any, timeout?: number): void;
        /**
         * Event handler for 'object-mutated' event emitted from the `window`.
         * Node should be listening for this event if it has an observed object property
         * @param {Object} event - Event payload.
         * @param {Object} event.detail.object - Mutated object.
         */
        onObjectMutated: (event: CustomEvent<any>) => void;
        /**
         * This function is called after `onObjectMutated()` determines that one of
         * the object properties has mutated.
         * @param {string} prop - Mutated object property name.
         */
        objectMutated: (prop: string) => void;
        /**
         * Returns a binding to a specified property`.
         * @param {string} prop - Property to bind to.
         * @return {Binding} Binding object.
         */
        bind(prop: string): Binding;
        /**
         * Unbinds a binding to a specified property`.
         * @param {string} prop - Property to unbind.
         */
        unbind(prop: string): void;
        /**
         * Wrapper for addEventListener.
         * @param {string} type - listener name.
         * @param {function} listener - listener handler.
         * @param {Object} options - event listener options.
         */
        addEventListener(type: string, listener: AnyEventListener, options?: AddEventListenerOptions | undefined): void;
        /**
         * Wrapper for removeEventListener.
         * @param {string} type - event name to listen to.
         * @param {function} listener - listener handler.
         * @param {Object} options - event listener options.
         */
        removeEventListener(type: string, listener?: AnyEventListener | undefined, options?: AddEventListenerOptions | undefined): void;
        /**
         * Wrapper for dispatchEvent.
         * @param {string} type - event name to dispatch.
         * @param {Object} detail - event detail.
         * @param {boolean} bubbles - event bubbles.
         * @param {HTMLElement|Node} src source node/element to dispatch event from.
         */
        dispatchEvent(type: string, detail?: {}, bubbles?: boolean, src?: Node | Document | HTMLElement | Window | undefined): void;
        /**
         * Shorthand for dispatching `'object-mutated'` event on window.
         * @param {any} object - object which mutated.
         */
        dispatchMutationEvent(object: any): void;
        /**
         * Disposes all internals.
         * Use this when instance is no longer needed.
         */
        dispose(): void;
        Register(ioNodeConstructor: typeof IoNode): void;
    };
    [x: string]: any;
    readonly Properties: PropertyDeclarations;
};
/**
 * IoNodeMixin applied to `Object` class.
 */
export declare class IoNode extends IoNode_base {
}
export {};
//# sourceMappingURL=node.d.ts.map