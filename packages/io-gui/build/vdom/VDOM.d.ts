import { IoElement } from '../elements/IoElement';
export type VDOMElement = {
    tag: string;
    props?: Record<string, any>;
    children?: Array<VDOMElement | null> | string;
};
type IntegerNumeric = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32;
type IntegerString = `${IntegerNumeric}`;
type IntegerAny = IntegerNumeric | IntegerString;
type Boolean = boolean | 'true' | 'false';
type Lang = 'ab' | 'aa' | 'af' | 'ak' | 'sq' | 'am' | 'ar' | 'an' | 'hy' | 'as' | 'av' | 'ae' | 'ay' | 'az' | 'bm' | 'ba' | 'eu' | 'be' | 'bn' | 'bh' | 'bi' | 'bs' | 'br' | 'bg' | 'my' | 'ca' | 'ch' | 'ce' | 'ny' | 'zh' | 'zh-ans' | 'zh-ant' | 'cv' | 'kw' | 'co' | 'cr' | 'hr' | 'cs' | 'da' | 'dv' | 'nl' | 'dz' | 'en' | 'eo' | 'et' | 'ee' | 'fo' | 'fj' | 'fi' | 'fr' | 'ff' | 'gl' | 'gd' | 'ka' | 'de' | 'el' | 'kl' | 'gn' | 'gu' | 'ht' | 'ha' | 'he' | 'hz' | 'hi' | 'ho' | 'hu' | 'is' | 'io' | 'ig' | 'id in' | 'ia' | 'ie' | 'iu' | 'ik' | 'ga' | 'it' | 'ja' | 'jv' | 'kn' | 'kr' | 'ks' | 'kk' | 'km' | 'ki' | 'rw' | 'rn' | 'ky' | 'kv' | 'kg' | 'ko' | 'ku' | 'kj' | 'lo' | 'la' | 'lv' | 'li' | 'ln' | 'lt' | 'lu' | 'lg' | 'lb' | 'gv' | 'mk' | 'mg' | 'ms' | 'ml' | 'mt' | 'mi' | 'mr' | 'mh' | 'mo' | 'mn' | 'na' | 'nv' | 'ng' | 'nd' | 'ne' | 'no' | 'nb' | 'nn' | 'oc' | 'oj' | 'cu' | 'or' | 'om' | 'os' | 'pi' | 'ps' | 'fa' | 'pl' | 'pt' | 'pa' | 'qu' | 'rm' | 'ro' | 'ru' | 'se' | 'sm' | 'sg' | 'sa' | 'sr' | 'sh' | 'st' | 'tn' | 'sn' | 'ii' | 'sd' | 'si' | 'ss' | 'sk' | 'sl' | 'so' | 'nr' | 'es' | 'su' | 'sw' | 'sv' | 'tl' | 'ty' | 'tg' | 'ta' | 'tt' | 'te' | 'th' | 'bo' | 'ti' | 'to' | 'ts' | 'tr' | 'tk' | 'tw' | 'ug' | 'uk' | 'ur' | 'uz' | 've' | 'vi' | 'vo' | 'wa' | 'cy' | 'wo' | 'fy' | 'xh' | 'yi' | 'ji' | 'yo' | 'za' | 'zu';
type PropsWithUndefined<T> = {
    [K in keyof T]: T[K] | undefined;
};
export type AriaProps = PropsWithUndefined<{
    role?: 'alert' | 'alertdialog' | 'application' | 'article' | 'banner' | 'button' | 'cell' | 'checkbox' | 'columnheader' | 'combobox' | 'complementary' | 'contentinfo' | 'definition' | 'dialog' | 'directory' | 'document' | 'feed' | 'figure' | 'form' | 'grid' | 'gridcell' | 'group' | 'heading' | 'img' | 'link' | 'list' | 'listbox' | 'listitem' | 'log' | 'main' | 'marquee' | 'math' | 'menu' | 'menubar' | 'menuitem' | 'menuitemcheckbox' | 'menuitemradio' | 'navigation' | 'none' | 'note' | 'option' | 'presentation' | 'progressbar' | 'radio' | 'radiogroup' | 'region' | 'row' | 'rowgroup' | 'rowheader' | 'scrollbar' | 'search' | 'searchbox' | 'separator' | 'slider' | 'spinbutton' | 'status' | 'switch' | 'tab' | 'table' | 'tablist' | 'tabpanel' | 'term' | 'textbox' | 'timer' | 'toolbar' | 'tooltip' | 'tree' | 'treegrid' | 'treeitem';
    ariaAtomic?: Boolean;
    ariaAutoComplete?: 'inline' | 'list' | 'both' | 'none';
    ariaBusy?: Boolean;
    ariaBrailleLabel?: string;
    ariaBrailleRoleDescription?: string;
    ariaChecked?: Boolean | 'mixed';
    ariaColCount?: IntegerAny;
    ariaColIndex?: IntegerAny;
    ariaColSpan?: IntegerAny;
    ariaCurrent?: Boolean | 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false';
    ariaDescription?: string;
    ariaDisabled?: Boolean;
    ariaExpanded?: Boolean | 'undefined';
    ariaHasPopup?: Boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
    ariaHidden?: Boolean | 'undefined';
    ariaInvalid?: Boolean | 'grammar' | 'spelling';
    ariaKeyShortcuts?: string;
    ariaLabel?: string;
    ariaLevel?: IntegerAny;
    ariaLive?: 'assertive' | 'polite' | 'off';
    ariaModal?: Boolean;
    ariaMultiLine?: Boolean;
    ariaMultiSelectable?: Boolean;
    ariaOrientation?: 'horizontal' | 'vertical' | 'undefined';
    ariaPlaceholder?: string;
    ariaPosInSet?: IntegerAny;
    ariaPressed?: Boolean | 'mixed' | 'undefined';
    ariaReadOnly?: Boolean;
    ariaRequired?: Boolean;
    ariaRelevant?: 'additions' | 'all' | 'removals' | 'text';
    ariaRoleDescription?: string;
    ariaRowCount?: IntegerAny;
    ariaRowIndex?: IntegerAny;
    ariaRowSpan?: IntegerAny;
    ariaSelected?: Boolean | 'undefined';
    ariaSetSize?: IntegerAny;
    ariaSort?: 'none' | 'ascending' | 'descending' | 'other';
    ariaValueMax?: number | `${number}`;
    ariaValueMin?: number | `${number}`;
    ariaValueNow?: number | `${number}`;
    ariaValueText?: string;
    ariaColIndexText?: string;
    ariaRowIndexText?: string;
    ariaActiveDescendantElement?: HTMLElement;
    ariaControlsElements?: HTMLElement;
    ariaDescribedByElements?: HTMLElement;
    ariaDetailsElements?: HTMLElement;
    ariaErrorMessageElements?: HTMLElement;
    ariaFlowToElements?: HTMLElement;
    ariaLabelledByElements?: HTMLElement;
}>;
export type OtherHTMLElementProps = PropsWithUndefined<{
    target?: '_blank' | '_self' | '_parent' | '_top' | string;
    download?: string;
    ping?: string;
    rel?: string;
    relList?: DOMTokenList;
    hreflang?: Lang;
    type?: string;
    referrerPolicy?: 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';
    text?: string;
    coords?: string;
    charset?: string;
    name?: string;
    rev?: string;
    shape?: 'rect' | 'circle' | 'poly' | 'default';
    protocol?: string;
    username?: string;
    password?: string;
    host?: string;
    hostname?: string;
    port?: string;
    pathname?: string;
    search?: string;
    hash?: string;
    href?: string;
    attributionSrc?: string;
    alt?: string;
    noHref?: boolean;
    cite?: string;
    clear?: 'left' | 'right' | 'both' | 'all' | 'none';
    disabled?: boolean;
    formAction?: string;
    formEnctype?: 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain';
    formMethod?: 'get' | 'post' | 'dialog';
    formNoValidate?: boolean;
    formTarget?: '_blank' | '_self' | '_parent' | '_top' | string;
    value?: string | number;
    commandForElement?: string;
    command?: string;
    width?: number | string;
    height?: number | string;
    span?: number;
    ch?: string;
    chOff?: string;
    vAlign?: 'top' | 'middle' | 'bottom' | 'baseline';
    dateTime?: string;
    open?: boolean;
    returnValue?: string;
    closedBy?: string;
    compact?: boolean;
    src?: string;
    color?: string;
    face?: string;
    size?: number | string;
    acceptCharset?: string;
    action?: string;
    autocomplete?: 'on' | 'off';
    enctype?: 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain';
    encoding?: string;
    method?: 'get' | 'post' | 'dialog';
    noValidate?: boolean;
    scrolling?: 'yes' | 'no' | 'auto';
    frameBorder?: '0' | '1';
    longDesc?: string;
    noResize?: boolean;
    marginHeight?: number | string;
    marginWidth?: number | string;
    cols?: number | string;
    rows?: number | string;
    noShade?: boolean;
    version?: string;
    srcdoc?: string;
    sandbox?: string;
    allowFullscreen?: boolean;
    csp?: string;
    allow?: string;
    loading?: 'eager' | 'lazy';
    credentialless?: boolean;
    allowPaymentRequest?: boolean;
    privateToken?: boolean;
    browsingTopics?: boolean;
    adAuctionHeaders?: boolean;
    sharedStorageWritable?: boolean;
    srcset?: string;
    sizes?: string;
    crossOrigin?: 'anonymous' | 'use-credentials' | '';
    useMap?: string;
    isMap?: boolean;
    decoding?: 'sync' | 'async' | 'auto';
    fetchPriority?: 'high' | 'low' | 'auto';
    lowsrc?: string;
    hspace?: number | string;
    vspace?: number | string;
    border?: number | string;
    accept?: string;
    defaultChecked?: boolean;
    checked?: boolean;
    dirName?: string;
    files?: FileList;
    indeterminate?: boolean;
    max?: number | string;
    maxLength?: number;
    min?: number | string;
    minLength?: number;
    multiple?: boolean;
    pattern?: string;
    placeholder?: string;
    readOnly?: boolean;
    required?: boolean;
    step?: number | string;
    defaultValue?: string;
    valueAsDate?: Date | null;
    valueAsNumber?: number;
    selectionStart?: number;
    selectionEnd?: number;
    selectionDirection?: 'forward' | 'backward' | 'none';
    webkitdirectory?: boolean;
    incremental?: boolean;
    htmlFor?: string;
    media?: string;
    as?: string;
    imageSrcset?: string;
    imageSizes?: string;
    integrity?: string;
    blocking?: boolean;
    httpEquiv?: string;
    content?: string;
    scheme?: string;
    low?: number | string;
    high?: number | string;
    optimum?: number | string;
    data?: string;
    archive?: string;
    code?: string;
    declare?: boolean;
    standby?: string;
    codeBase?: string;
    codeType?: string;
    reversed?: boolean;
    start?: number;
    label?: string;
    defaultSelected?: boolean;
    selected?: boolean;
    valueType?: string;
    noModule?: boolean;
    async?: boolean;
    defer?: boolean;
    event?: string;
    length?: number;
    selectedIndex?: number;
    caption?: string;
    tHead?: string;
    tFoot?: string;
    frame?: string;
    rules?: string;
    summary?: string;
    cellPadding?: string;
    cellSpacing?: string;
    colSpan?: number;
    rowSpan?: number;
    headers?: string;
    axis?: string;
    noWrap?: boolean;
    abbr?: string;
    scope?: 'row' | 'col' | 'rowgroup' | 'colgroup';
    shadowRootMode?: 'open' | 'closed';
    shadowRootDelegatesFocus?: boolean;
    shadowRootClonable?: boolean;
    shadowRootSerializable?: boolean;
    wrap?: 'soft' | 'hard';
    kind?: string;
    srclang?: Lang;
    default?: boolean;
    poster?: string;
    playsInline?: boolean;
    disablePictureInPicture?: boolean;
}>;
export type NativeElementProps = AriaProps & PropsWithUndefined<{
    title?: string;
    lang?: Lang;
    translate?: any;
    dir?: any;
    hidden?: any;
    inert?: any;
    accessKey?: any;
    draggable?: any;
    spellcheck?: boolean;
    autocapitalize?: any;
    contentEditable?: Boolean;
    enterKeyHint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send';
    inputMode?: 'decimal' | 'email' | 'numeric' | 'tel' | 'search' | 'url' | 'text';
    virtualKeyboardPolicy?: 'manual' | 'auto';
    innerText?: string;
    outerText?: string;
    writingSuggestions?: Boolean;
    autofocus?: boolean;
    tabIndex?: IntegerAny | -1 | '-1';
    style?: Record<string, string>;
    id?: string;
    class?: string;
    innerHTML?: string;
    outerHTML?: string;
    scrollTop?: number;
    scrollLeft?: number;
    scrollWidth?: number;
    scrollHeight?: number;
    textContent?: string;
}>;
/**
 * Sets native element's properties and attributes.
 * - style: formatted as Object.
 * - class: shorthand for className.
 * - "@" + event: name for event listener.
 * @param {HTMLElement} element - Native HTMLElement to apply properties to.
 * @param {Object} props - Element properties.
 */
export declare const applyNativeElementProps: (element: HTMLElement, props: NativeElementProps) => void;
/**
 * Creates an element from a virtual DOM object.
 * @param {VDOMElement} vDOMElement - Virtual DOM object.
 * @return {HTMLElement} - Created element.
 */
export declare const constructElement: (vDOMElement: VDOMElement) => HTMLElement;
/**
 * Disposes the element's children.
 * @param {IoElement} element - Element to dispose children of.
 */
export declare const disposeChildren: (element: IoElement) => void;
/**
 * Converts an element to a virtual dom object.
 * NODE: This vDOM contains elements only attributes (not properties).
 * Used for testing but might be useful for other things.
 * @param {IoElement | HTMLElement} element - Element to convert.
 * @return {VDOMElement} - Virtual dom object.
 */
export declare const toVDOM: (element: IoElement | HTMLElement) => VDOMElement;
export {};
//# sourceMappingURL=VDOM.d.ts.map