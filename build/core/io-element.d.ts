import { EventDispatcher } from './internals/eventDispatcher.js';
declare const IoElement_base: {
    new (properties?: Record<string, any>, ...args: any[]): {
        [x: string]: any;
        readonly compose: Record<string, Record<string, any>> | null;
        readonly _properties: Record<string, import("./index.js").Property>;
        readonly _bindings: Record<string, import("./index.js").Binding>;
        readonly _changeQueue: import("./index.js").ChangeQueue;
        readonly _eventDispatcher: EventDispatcher;
        setProperty(name: string, value: any, skipDispatch?: boolean | undefined): void;
        applyProperties(props: any): void;
        setProperties(props: any): void;
        setValue(value: any): void;
        dispose(): void;
        changed(): void;
        applyCompose(): void;
        queue(prop: string, value: any, oldValue: any): void;
        queueDispatch(): void;
        queueDispatchLazy(): void;
        objectMutated(event: CustomEvent<any>): void;
        objectMutatedThrottled(prop: string): void;
        bind(prop: string): import("./index.js").Binding;
        unbind(prop: string): void;
        addEventListener(type: string, listener: EventListener | ((event: KeyboardEvent) => void) | ((event: PointerEvent) => void) | ((event: CustomEvent<any>) => void) | ((event: FocusEvent) => void) | ((event: TouchEvent) => void), options?: AddEventListenerOptions | undefined): void;
        removeEventListener(type: string, listener?: (EventListener | ((event: KeyboardEvent) => void) | ((event: PointerEvent) => void) | ((event: CustomEvent<any>) => void) | ((event: FocusEvent) => void) | ((event: TouchEvent) => void)) | undefined, options?: AddEventListenerOptions | undefined): void;
        dispatchEvent(type: string, detail?: {}, bubbles?: boolean, src?: HTMLElement | Node | Window | Document | undefined): void;
        throttle(func: (arg?: any) => void, arg?: any, asynchronous?: boolean | undefined): void;
        requestAnimationFrameOnce(func: (arg?: any) => void): void;
        filterObject(object: any, predicate: (object: any) => boolean, _depth?: number, _chain?: any[], _i?: number): any;
        filterObjects(object: any, predicate: (object: any) => boolean, _depth?: number, _chain?: any[], _i?: number): any;
        import(path: string): Promise<unknown>;
        preventDefault(event: Event): void;
        stopPropagation(event: CustomEvent<any>): void;
    };
    [x: string]: any;
    readonly Properties: import("./io-node.js").PropertiesDeclaration;
};
/**
 * Core `IoElement` class.
 */
declare class IoElement extends IoElement_base {
    static get Style(): any;
    static get Properties(): any;
    static get Listeners(): any;
    static get observedAttributes(): string[];
    attributeChangedCallback(prop: string, oldValue: any, newValue: any): void;
    /**
     * Add resize listener if `onResized()` is defined in subclass.
     */
    connectedCallback(): void;
    /**
     * Removes resize listener if `onResized()` is defined in subclass.
     */
    disconnectedCallback(): void;
    /**
      * Renders DOM from virtual DOM arrays.
      * @param {Array} vDOM - Array of vDOM children.
      * @param {HTMLElement} [host] - Optional template target.
      */
    template(vDOM: Array<any>, host?: HTMLElement): void;
    /**
     * Recurively traverses vDOM.
     * @param {Array} vChildren - Array of vDOM children converted by `buildTree()` for easier parsing.
     * @param {HTMLElement} [host] - Optional template target.
      */
    traverse(vChildren: Array<any>, host: HTMLElement): void;
    /**
     * Helper function to flatten textContent into a single TextNode.
     * Update textContent via TextNode is better for layout performance.
     * @param {HTMLElement} element - Element to flatten.
     */
    flattenTextNode(element: HTMLElement | IoElement): void;
    get textNode(): any;
    set textNode(value: any);
    applyProperties(props: any): void;
    /**
     * Alias for HTMLElement setAttribute where falsey values remove the attribute.
     * @param {string} attr - Attribute name.
     * @param {*} value - Attribute value.
     */
    setAttribute(attr: string, value: boolean | number | string): void;
    applyCompose(): void;
    /**
     * Sets aria attributes.
     */
    applyAria(): void;
    _onFocusTo(event: CustomEvent): void;
    focusTo(dir: string): void;
}
/**
 * Register function for `IoElement`. Registers custom element.
 * @param {IoElement} elementConstructor - Element class to register.
 */
declare const RegisterIoElement: (elementConstructor: typeof IoElement) => void;
export declare const buildTree: () => (node: any) => any;
export { IoElement, RegisterIoElement };
//# sourceMappingURL=io-element.d.ts.map