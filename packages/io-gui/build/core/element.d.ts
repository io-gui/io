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
    src?: string;
};
export type VDOMArray = null | [
    string
] | [
    string,
    IoElementArgs | VDOMArray[] | string
] | [
    string,
    IoElementArgs,
    VDOMArray[] | string
];
export type VDOMElement = {
    name: string;
    props: IoElementArgs;
    children: VDOMElement[] | string;
};
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
    traverse(vChildren: Array<any> | string, host: HTMLElement, cache?: boolean): void;
    static vDOM: (arg0?: IoElementArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray;
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
export declare const ioElement: (arg0?: IoElementArgs | VDOMArray[], arg1?: VDOMArray[]) => VDOMArray;
export declare const a: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, abbr: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, acronym: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, address: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, applet: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, area: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, article: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, aside: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, audio: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, b: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, base: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, basefont: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, bdi: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, bdo: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, big: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, blockquote: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, body: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, br: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, button: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, canvas: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, caption: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, center: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, cite: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, code: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, col: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, colgroup: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, data: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, datalist: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, dd: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, del: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, details: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, dfn: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, dialog: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, dir: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, div: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, dl: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, dt: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, em: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, embed: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, fieldset: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, figcaption: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, figure: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, font: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, footer: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, form: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, frame: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, frameset: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, head: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, header: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, hgroup: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, h1: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, h2: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, h3: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, h4: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, h5: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, h6: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, hr: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, html: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, i: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, iframe: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, img: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, input: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, ins: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, kbd: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, keygen: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, label: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, legend: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, li: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, link: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, main: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, map: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, mark: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, menu: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, menuitem: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, meta: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, meter: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, nav: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, noframes: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, noscript: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, object: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, ol: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, optgroup: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, option: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, output: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, p: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, param: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, picture: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, pre: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, progress: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, q: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, rp: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, rt: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, ruby: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, s: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, samp: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, script: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, section: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, select: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, small: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, source: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, span: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, strike: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, strong: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, style: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, sub: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, summary: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, sup: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, svg: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, table: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, tbody: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, td: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, template: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, textarea: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, tfoot: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, th: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, thead: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, time: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, title: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, tr: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, track: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, tt: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, u: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, ul: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, video: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray, wbr: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
export {};
//# sourceMappingURL=element.d.ts.map