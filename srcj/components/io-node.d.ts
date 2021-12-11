import { Binding } from '../core/propertyBinder.js';
declare type Constructor<T extends any> = new (...args: any[]) => T;
declare type ComposedProperties = null | Record<string, Record<string, any>>;
declare type CallbackFunction = (arg?: any) => void;
declare type PredicateFunction = (object: any) => boolean;
declare type KeyboardEventListener = (event: KeyboardEvent) => void;
declare type PointerEventListener = (event: PointerEvent) => void;
declare type CustomEventListener = (event: CustomEvent) => void;
declare type FocusEventListener = (event: FocusEvent) => void;
declare type TouchEventListener = (event: TouchEvent) => void;
declare type AnyEventListener = EventListener | KeyboardEventListener | PointerEventListener | CustomEventListener | FocusEventListener | TouchEventListener;
/**
 * Core mixin for `Node` classes.
 * @param {function} superclass - Class to extend.
 * @return {function} - Extended class constructor with `IoNodeMixin` applied to it.
 */
export declare function IoNodeMixin<T extends Constructor<any>>(superclass: T): {
    new (properties?: Record<string, any>, ...args: any[]): {
        [x: string]: any;
        /**
         * `compose` object lets you reactively assign property values to other object's properties.
         * For example, you can assign `this.value` property to the `this.objectProp.result` property.
         *
         * ```
         * get compose () {
         *   return {
         *     objectProp: {result: this.value}
         *   };
         *  }
         * ```
         *
         * Node class does not use `compose` by itself but this feature is available to its sublasses.
         */
        readonly compose: ComposedProperties;
        /**
         * Connects the instance to another node or element.
         * @param {IoNode} node - Node to connect to.
         * @return {this} this
         */
        connect(node?: IoNode | HTMLElement | Document | Window): this;
        /**
         * Disconnects the instance from an another node or element.
         * @param {IoNode} node - Node to disconnect from.
         * @return {this} this
         * */
        disconnect(node?: IoNode | HTMLElement | Document | Window): this;
        /**
         * Connected callback.
         */
        connectedCallback(): void;
        /**
         * Disconnected callback.
         */
        disconnectedCallback(): void;
        /**
         * Disposes all internals.
         * Use this when instance is no longer needed.
         */
        dispose(): void;
        /**
         * default change handler.
         * Invoked when one of the properties change.
         */
        changed(): void;
        /**
         * sets composed properties and invokes `changed()` function on change.
         */
        applyCompose(): void;
        /**
         * Adds property change to the queue.
         * @param {string} prop - Property name.
         * @param {*} value - Property value.
         * @param {*} oldValue - Old property value.
         */
        queue(prop: string, value: any, oldValue: any): void;
        /**
         * Dispatches the queue.
         */
        queueDispatch(): void;
        /**
         * Dispatches the queue in the next rAF cycle.
         */
        queueDispatchLazy(): void;
        /**
         * Event handler for 'object-mutated' event emitted from the `window`.
         * Node should be listening for this event if it has an object property
         * with `observe: "sync" || "async"` configuration.
         * @param {Object} event - Event payload.
         * @param {Object} event.detail.object - Mutated object.
         */
        objectMutated(event: CustomEvent): void;
        /**
         * This function is called after `objectMutated()` determines that one of
         * the object properties has mutated.
         * @param {string} prop - Mutated object property name.
         */
        objectMutatedThrottled(prop: string): void;
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
         * Sets a property and emits `[property]-set` event.
         * Use this when property is set by user action (e.g. mouse click).
         * @param {string} prop - Property name.
         * @param {*} value - Property value.
         * @param {boolean} force - Force value set.
         */
        set(prop: string, value: any, force?: boolean | undefined): void;
        /**
         * Sets multiple properties in batch.
         * [property]-changed` events will be broadcast in the end.
         * @param {Object} props - Map of property names and values.
         */
        setProperties(props: any): void;
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
        dispatchEvent(type: string, detail?: {}, bubbles?: boolean, src?: HTMLElement | Node | Document | Window | undefined): void;
        /**
         * Throttles function execution to next frame (rAF) if the function has been executed in the current frame.
         * @param {function} func - Function to throttle.
         * @param {*} arg - argument for throttled function.
         * @param {boolean} asynchronous - execute with timeout.
         */
        throttle(func: CallbackFunction, arg?: any, asynchronous?: boolean | undefined): void;
        requestAnimationFrameOnce(func: CallbackFunction): void;
        filterObject(object: any, predicate: PredicateFunction, _depth?: number, _chain?: any[], _i?: number): any;
        filterObjects(object: any, predicate: PredicateFunction, _depth?: number, _chain?: any[], _i?: number): any;
        import(path: string): Promise<unknown>;
        /**
         * Handler function with `event.preventDefault()`.
         * @param {Object} event - Event object.
         */
        preventDefault(event: Event): void;
        /**
         * Handler function with `event.stopPropagation()`.
         * @param {Object} event - Event object.
         */
        stopPropagation(event: CustomEvent): void;
    };
    [x: string]: any;
    readonly Properties: any;
};
/**
 * Register function to be called once per class.
 * @param {IoNode} node - Node class to register.
 */
export declare const RegisterIoNode: (node: typeof IoNode) => void;
declare const IoNode_base: {
    new (properties?: Record<string, any>, ...args: any[]): {
        [x: string]: any;
        /**
         * `compose` object lets you reactively assign property values to other object's properties.
         * For example, you can assign `this.value` property to the `this.objectProp.result` property.
         *
         * ```
         * get compose () {
         *   return {
         *     objectProp: {result: this.value}
         *   };
         *  }
         * ```
         *
         * Node class does not use `compose` by itself but this feature is available to its sublasses.
         */
        readonly compose: ComposedProperties;
        /**
         * Connects the instance to another node or element.
         * @param {IoNode} node - Node to connect to.
         * @return {this} this
         */
        connect(node?: IoNode | HTMLElement | Document | Window): any;
        /**
         * Disconnects the instance from an another node or element.
         * @param {IoNode} node - Node to disconnect from.
         * @return {this} this
         * */
        disconnect(node?: IoNode | HTMLElement | Document | Window): any;
        /**
         * Connected callback.
         */
        connectedCallback(): void;
        /**
         * Disconnected callback.
         */
        disconnectedCallback(): void;
        /**
         * Disposes all internals.
         * Use this when instance is no longer needed.
         */
        dispose(): void;
        /**
         * default change handler.
         * Invoked when one of the properties change.
         */
        changed(): void;
        /**
         * sets composed properties and invokes `changed()` function on change.
         */
        applyCompose(): void;
        /**
         * Adds property change to the queue.
         * @param {string} prop - Property name.
         * @param {*} value - Property value.
         * @param {*} oldValue - Old property value.
         */
        queue(prop: string, value: any, oldValue: any): void;
        /**
         * Dispatches the queue.
         */
        queueDispatch(): void;
        /**
         * Dispatches the queue in the next rAF cycle.
         */
        queueDispatchLazy(): void;
        /**
         * Event handler for 'object-mutated' event emitted from the `window`.
         * Node should be listening for this event if it has an object property
         * with `observe: "sync" || "async"` configuration.
         * @param {Object} event - Event payload.
         * @param {Object} event.detail.object - Mutated object.
         */
        objectMutated(event: CustomEvent<any>): void;
        /**
         * This function is called after `objectMutated()` determines that one of
         * the object properties has mutated.
         * @param {string} prop - Mutated object property name.
         */
        objectMutatedThrottled(prop: string): void;
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
         * Sets a property and emits `[property]-set` event.
         * Use this when property is set by user action (e.g. mouse click).
         * @param {string} prop - Property name.
         * @param {*} value - Property value.
         * @param {boolean} force - Force value set.
         */
        set(prop: string, value: any, force?: boolean | undefined): void;
        /**
         * Sets multiple properties in batch.
         * [property]-changed` events will be broadcast in the end.
         * @param {Object} props - Map of property names and values.
         */
        setProperties(props: any): void;
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
        dispatchEvent(type: string, detail?: {}, bubbles?: boolean, src?: HTMLElement | Node | Document | Window | undefined): void;
        /**
         * Throttles function execution to next frame (rAF) if the function has been executed in the current frame.
         * @param {function} func - Function to throttle.
         * @param {*} arg - argument for throttled function.
         * @param {boolean} asynchronous - execute with timeout.
         */
        throttle(func: CallbackFunction, arg?: any, asynchronous?: boolean | undefined): void;
        requestAnimationFrameOnce(func: CallbackFunction): void;
        filterObject(object: any, predicate: PredicateFunction, _depth?: number, _chain?: any[], _i?: number): any;
        filterObjects(object: any, predicate: PredicateFunction, _depth?: number, _chain?: any[], _i?: number): any;
        import(path: string): Promise<unknown>;
        /**
         * Handler function with `event.preventDefault()`.
         * @param {Object} event - Event object.
         */
        preventDefault(event: Event): void;
        /**
         * Handler function with `event.stopPropagation()`.
         * @param {Object} event - Event object.
         */
        stopPropagation(event: CustomEvent<any>): void;
    };
    [x: string]: any;
    readonly Properties: any;
};
/**
 * IoNodeMixin applied to `Object` class.
 */
export declare class IoNode extends IoNode_base {
}
export {};
//# sourceMappingURL=io-node.d.ts.map