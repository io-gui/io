import { Node } from './node.js';
declare const IoElement_base: {
    new (initProps?: any, ...args: any[]): {
        [x: string]: any;
        readonly compose: null;
        connect(node?: HTMLElement | Node | Window | Document): any;
        disconnect(node?: HTMLElement | Node | Window | Document): any;
        connectedCallback(): void;
        disconnectedCallback(): void;
        dispose(): void;
        changed(): void;
        applyCompose(): void;
        queue(prop: string, value: any, oldValue: any): void;
        queueDispatch(): void;
        queueDispatchLazy(): void;
        objectMutated(event: CustomEvent<any>): void;
        objectMutatedThrottled(prop: string): void;
        bind(prop: string): import("./utils/bindingManager.js").Binding;
        unbind(prop: string): void;
        set(prop: string, value: any, force: boolean): void;
        setProperties(props: any): void;
        addEventListener(type: string, listener: Function, options?: any): void;
        removeEventListener(type: string, listener?: Function | undefined, options?: any): void;
        dispatchEvent(type: string, detail: any, bubbles?: boolean, src?: HTMLElement | Node | Window | Document | undefined): void;
        throttle(func: Function, arg?: any, asynchronous?: boolean | undefined): void;
        requestAnimationFrameOnce(func: Function): void;
        filterObject(object: any, predicate: Function, _depth?: number, _chain?: any[], _i?: number): any;
        filterObjects(object: any, predicate: Function, _depth?: number, _chain?: any[], _i?: number): any;
        import(path: string): Promise<unknown>;
        preventDefault(event: CustomEvent<any>): void;
        stopPropagation(event: CustomEvent<any>): void;
    };
    [x: string]: any;
    readonly Properties: any;
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
    setProperties(props: any): void;
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
 */
declare const RegisterIoElement: (element: typeof IoElement) => void;
export declare const buildTree: () => (node: any) => any;
export { IoElement, RegisterIoElement };
//# sourceMappingURL=io-element.d.ts.map