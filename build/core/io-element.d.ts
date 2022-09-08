declare const IoElement_base: import("./io-node.js").IoNodeConstructor<any>;
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
declare type VirtualDOMElement = [
    string,
    Record<string, any> | string
] | [
    string,
    Record<string, any> | string,
    VirtualDOMElement[] | string
];
export declare const buildTree: () => (node: VirtualDOMElement) => any;
export { IoElement, RegisterIoElement };
//# sourceMappingURL=io-element.d.ts.map