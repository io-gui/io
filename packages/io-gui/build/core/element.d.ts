import { EventDispatcher } from './internals/eventDispatcher';
import { IoNode, IoNodeArgs } from './node';
export type IoElementArgs = IoNodeArgs & {
    tabindex?: string;
    contenteditable?: boolean;
    class?: string;
    role?: string;
    label?: string;
    name?: string;
    title?: string;
    id?: string;
    hidden?: boolean;
    disabled?: boolean;
    cache?: boolean;
    [key: string]: any;
};
export type VDOMArray = [
    string
] | [
    string,
    IoElementArgs | string | VDOMArray[]
] | [
    string,
    IoElementArgs | string,
    VDOMArray[] | string
];
export type VDOMElement = {
    name: string;
    props: IoElementArgs;
    children: VDOMElement[];
};
export declare const buildTree: () => (node: VDOMArray) => any;
export declare const disposeElementDeep: (element: IoElement) => void;
/**
 * Sets element properties.
 * @param {HTMLElement} element - Element to set properties on.
 * @param {Object} props - Element properties.
 */
export declare const applyNativeElementProps: (element: HTMLElement, props: any) => void;
declare const IoElement_base: {
    new (...args: any[]): {
        [x: string]: any;
        readonly _protochain: import("..").ProtoChain;
        readonly _properties: Map<string, import("..").PropertyInstance>;
        readonly _bindings: Map<string, import("..").Binding>;
        readonly _changeQueue: import("..").ChangeQueue;
        readonly _eventDispatcher: EventDispatcher;
        applyProperties(props: any): void;
        setProperties(props: any): void;
        setProperty(name: string, value: any, debounce?: boolean): void;
        inputValue(value: any): void;
        changed(): void;
        init(): void;
        queue(name: string, value: any, oldValue: any): void;
        dispatchQueue(debounce?: boolean): void;
        throttle(func: import("./node").CallbackFunction, arg?: any): void;
        debounce(func: import("./node").CallbackFunction, arg?: any, timeout?: number): void;
        onPropertyMutated(event: CustomEvent): void;
        bind(name: string): import("..").Binding;
        unbind(name: string): void;
        addEventListener(type: string, listener: import("./internals/eventDispatcher").AnyEventListener, options?: AddEventListenerOptions): void;
        removeEventListener(type: string, listener?: import("./internals/eventDispatcher").AnyEventListener, options?: AddEventListenerOptions): void;
        dispatchEvent(type: string, detail?: any, bubbles?: boolean, src?: Node | HTMLElement | Document | Window): void;
        dispose(): void;
        Register(ioNodeConstructor: typeof IoNode): void;
    };
    [x: string]: any;
    readonly Properties: import("./node").PropertyDefinitions;
};
/**
 * Core `IoElement` class.
 */
export declare class IoElement extends IoElement_base {
    static get Style(): string;
    $: Record<string, any>;
    tabindex: string;
    contenteditable: boolean;
    class: string;
    role: string;
    label: string;
    name: string;
    title: string;
    id: string;
    hidden: boolean;
    disabled: boolean;
    constructor(...args: any[]);
    /**
    * Add resize listener if `onResized()` is defined in subclass.
    */
    connectedCallback(): void;
    /**
    * Removes resize listener if `onResized()` is defined in subclass.
    */
    disconnectedCallback(): void;
    setProperty(name: string, value: any, debounce?: boolean): void;
    /**
     * Renders DOM from virtual DOM arrays.
     * @param {Array} vDOM - Array of vDOM children.
     * @param {HTMLElement} [host] - Optional template target.
     * @param {boolean} [cache] - Optional don't reuse existing elements and skip dispose
     */
    template(vDOM: Array<any>, host?: HTMLElement, cache?: boolean): void;
    /**
     * Recurively traverses vDOM.
     * TODO: test element.traverse() function!
     * @param {Array} vChildren - Array of vDOM children converted by `buildTree()` for easier parsing.
     * @param {HTMLElement} [host] - Optional template target.
     * @param {boolean} [cache] - Optional don't reuse existing elements and skip dispose
     */
    traverse(vChildren: Array<any>, host: HTMLElement, cache?: boolean): void;
    static vDOM: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray;
    Register(ioNodeConstructor: typeof IoNode): void;
    /**
    * Helper function to flatten textContent into a single TextNode.
    * Update textContent via TextNode is better for layout performance.
    * @param {HTMLElement} element - Element to flatten.
    */
    _flattenTextNode(element: HTMLElement | IoElement): void;
    get textNode(): any;
    set textNode(value: any);
    applyProperties(props: any): void;
    /**
    * Alias for HTMLElement setAttribute where falsey values remove the attribute.
    * @param {string} attr - Attribute name.
    * @param {*} value - Attribute value.
    */
    setAttribute(attr: string, value: boolean | number | string): void;
    labelChanged(): void;
    disabledChanged(): void;
}
export declare const ioElement: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray;
export declare const a: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, abbr: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, acronym: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, address: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, applet: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, area: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, article: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, aside: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, audio: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, b: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, base: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, basefont: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, bdi: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, bdo: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, big: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, blockquote: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, body: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, br: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, button: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, canvas: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, caption: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, center: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, cite: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, code: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, col: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, colgroup: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, data: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, datalist: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, dd: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, del: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, details: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, dfn: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, dialog: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, dir: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, div: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, dl: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, dt: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, em: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, embed: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, fieldset: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, figcaption: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, figure: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, font: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, footer: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, form: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, frame: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, frameset: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, head: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, header: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, hgroup: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, h1: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, h2: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, h3: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, h4: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, h5: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, h6: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, hr: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, html: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, i: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, iframe: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, img: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, input: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, ins: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, kbd: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, keygen: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, label: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, legend: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, li: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, link: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, main: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, map: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, mark: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, menu: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, menuitem: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, meta: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, meter: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, nav: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, noframes: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, noscript: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, object: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, ol: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, optgroup: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, option: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, output: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, p: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, param: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, picture: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, pre: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, progress: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, q: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, rp: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, rt: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, ruby: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, s: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, samp: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, script: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, section: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, select: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, small: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, source: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, span: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, strike: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, strong: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, style: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, sub: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, summary: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, sup: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, svg: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, table: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, tbody: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, td: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, template: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, textarea: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, tfoot: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, th: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, thead: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, time: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, title: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, tr: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, track: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, tt: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, u: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, ul: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, video: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray, wbr: (arg0?: IoNodeArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray;
export {};
//# sourceMappingURL=element.d.ts.map