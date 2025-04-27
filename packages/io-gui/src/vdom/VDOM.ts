import { EventDispatcher } from '../core/EventDispatcher';
import { Node } from '../nodes/Node';
import { IoElement } from '../elements/IoElement';

export type VDOMElement = {
  name: string,
  props?: Record<string, any>,
  children?: Array<VDOMElement | null> | string
}

type IntegerNumeric = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32;
type IntegerString = `${IntegerNumeric}`;
type IntegerAny = IntegerNumeric | IntegerString;
type Boolean = boolean | 'true' | 'false';
type Lang = 'ab'|'aa'|'af'|'ak'|'sq'|'am'|'ar'|'an'|'hy'|'as'|'av'|'ae'|'ay'|'az'|'bm'|'ba'|'eu'|'be'|'bn'|'bh'|'bi'|'bs'|'br'|'bg'|'my'|'ca'|'ch'|'ce'|
      'ny'|'zh'|'zh-ans'|'zh-ant'|'cv'|'kw'|'co'|'cr'|'hr'|'cs'|'da'|'dv'|'nl'|'dz'|'en'|'eo'|'et'|'ee'|'fo'|'fj'|'fi'|'fr'|'ff'|'gl'|'gd'|
      'ka'|'de'|'el'|'kl'|'gn'|'gu'|'ht'|'ha'|'he'|'hz'|'hi'|'ho'|'hu'|'is'|'io'|'ig'|'id in'|'ia'|'ie'|'iu'|'ik'|'ga'|'it'|'ja'|'jv'|'kn'|
      'kr'|'ks'|'kk'|'km'|'ki'|'rw'|'rn'|'ky'|'kv'|'kg'|'ko'|'ku'|'kj'|'lo'|'la'|'lv'|'li'|'ln'|'lt'|'lu'|'lg'|'lb'|'gv'|'mk'|'mg'|'ms'|'ml'|'mt'|
      'mi'|'mr'|'mh'|'mo'|'mn'|'na'|'nv'|'ng'|'nd'|'ne'|'no'|'nb'|'nn'|'oc'|'oj'|'cu'|'or'|'om'|'os'|'pi'|'ps'|'fa'|'pl'|'pt'|'pa'|'qu'|'rm'|
      'ro'|'ru'|'se'|'sm'|'sg'|'sa'|'sr'|'sh'|'st'|'tn'|'sn'|'ii'|'sd'|'si'|'ss'|'sk'|'sl'|'so'|'nr'|'es'|'su'|'sw'|'sv'|'tl'|'ty'|'tg'|'ta'|
      'tt'|'te'|'th'|'bo'|'ti'|'to'|'ts'|'tr'|'tk'|'tw'|'ug'|'uk'|'ur'|'uz'|'ve'|'vi'|'vo'|'wa'|'cy'|'wo'|'fy'|'xh'|'yi'|'ji'|'yo'|'za'|'zu';

type PropsWithUndefined<T> = {[K in keyof T]: T[K] | undefined};

export type AriaProps = PropsWithUndefined<{
  role?: 'alert'|'alertdialog'|'application'|'article'|'banner'|'button'|'cell'|'checkbox'|'columnheader'|'combobox'|'complementary'|
      'contentinfo'|'definition'|'dialog'|'directory'|'document'|'feed'|'figure'|'form'|'grid'|'gridcell'|'group'|'heading'|'img'|
      'link'|'list'|'listbox'|'listitem'|'log'|'main'|'marquee'|'math'|'menu'|'menubar'|'menuitem'|'menuitemcheckbox'|'menuitemradio'|
      'navigation'|'none'|'note'|'option'|'presentation'|'progressbar'|'radio'|'radiogroup'|'region'|'row'|'rowgroup'|'rowheader'|
      'scrollbar'|'search'|'searchbox'|'separator'|'slider'|'spinbutton'|'status'|'switch'|'tab'|'table'|'tablist'|'tabpanel'|'term'|
      'textbox'|'timer'|'toolbar'|'tooltip'|'tree'|'treegrid'|'treeitem',
  ariaAtomic?: Boolean,
  ariaAutoComplete?: 'inline' | 'list' | 'both' | 'none',
  ariaBusy?: Boolean,
  ariaBrailleLabel?: string,
  ariaBrailleRoleDescription?: string,
  ariaChecked?: Boolean | 'mixed',
  ariaColCount?: IntegerAny,
  ariaColIndex?: IntegerAny,
  ariaColSpan?: IntegerAny,
  ariaCurrent?: Boolean | 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false',
  ariaDescription?: string,
  ariaDisabled?: Boolean,
  ariaExpanded?: Boolean | 'undefined',
  ariaHasPopup?: Boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog',
  ariaHidden?: Boolean | 'undefined',
  ariaInvalid?: Boolean | 'grammar' | 'spelling',
  ariaKeyShortcuts?: string,
  ariaLabel?: string;
  ariaLevel?: IntegerAny,
  ariaLive?: 'assertive' | 'polite' | 'off',
  ariaModal?: Boolean,
  ariaMultiLine?: Boolean,
  ariaMultiSelectable?: Boolean,
  ariaOrientation?: 'horizontal' | 'vertical' | 'undefined',
  ariaPlaceholder?: string,
  ariaPosInSet?: IntegerAny,
  ariaPressed?: Boolean | 'mixed' | 'undefined',
  ariaReadOnly?: Boolean,
  ariaRequired?: Boolean,
  ariaRelevant?: 'additions' | 'all' | 'removals' | 'text',
  ariaRoleDescription?: string,
  ariaRowCount?: IntegerAny,
  ariaRowIndex?: IntegerAny,
  ariaRowSpan?: IntegerAny,
  ariaSelected?: Boolean | 'undefined',
  ariaSetSize?: IntegerAny,
  ariaSort?: 'none' | 'ascending' | 'descending' | 'other',
  ariaValueMax?: number | `${number}`,
  ariaValueMin?: number | `${number}`,
  ariaValueNow?: number | `${number}`,
  ariaValueText?: string,
  ariaColIndexText?: string,
  ariaRowIndexText?: string,
  // TODO: Implement and test in VDOM!
  ariaActiveDescendantElement?: HTMLElement,
  ariaControlsElements?: HTMLElement,
  ariaDescribedByElements?: HTMLElement,
  ariaDetailsElements?: HTMLElement,
  ariaErrorMessageElements?: HTMLElement,
  ariaFlowToElements?: HTMLElement,
  ariaLabelledByElements?: HTMLElement,
}>

export type OtherHTMLElementProps = PropsWithUndefined<{
  target?: '_blank' | '_self' | '_parent' | '_top' | string,
  download?: string,
  ping?: string,
  rel?: string,
  relList?: DOMTokenList,
  hreflang?: Lang,
  type?: string,
  referrerPolicy?: 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url',
  text?: string,
  coords?: string,
  charset?: string,
  name?: string,
  rev?: string,
  shape?: 'rect' | 'circle' | 'poly' | 'default',
  protocol?: string,
  username?: string,
  password?: string,
  host?: string,
  hostname?: string,
  port?: string,
  pathname?: string,
  search?: string,
  hash?: string,
  href?: string,
  attributionSrc?: string,
  alt?: string,
  noHref?: boolean,
  cite?: string,
  clear?: 'left' | 'right' | 'both' | 'all' | 'none',
  disabled?: boolean,
  formAction?: string,
  formEnctype?: 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain',
  formMethod?: 'get' | 'post' | 'dialog',
  formNoValidate?: boolean,
  formTarget?: '_blank' | '_self' | '_parent' | '_top' | string,
  value?: string | number,
  commandForElement?: string,
  command?: string,
  width?: number | string,
  height?: number | string,
  span?: number,
  ch?: string,
  chOff?: string,
  vAlign?: 'top' | 'middle' | 'bottom' | 'baseline',
  dateTime?: string,
  open?: boolean,
  returnValue?: string,
  closedBy?: string,
  compact?: boolean,
  src?: string,
  color?: string,
  face?: string,
  size?: number | string,
  acceptCharset?: string,
  action?: string,
  autocomplete?: 'on' | 'off',
  enctype?: 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain',
  encoding?: string,
  method?: 'get' | 'post' | 'dialog',
  noValidate?: boolean,
  scrolling?: 'yes' | 'no' | 'auto',
  frameBorder?: '0' | '1',
  longDesc?: string,
  noResize?: boolean,
  marginHeight?: number | string,
  marginWidth?: number | string,
  cols?: number | string,
  rows?: number | string,
  noShade?: boolean,
  version?: string,
  srcdoc?: string,
  sandbox?: string,
  allowFullscreen?: boolean,
  csp?: string,
  allow?: string,
  loading?: 'eager' | 'lazy',
  credentialless?: boolean,
  allowPaymentRequest?: boolean,
  privateToken?: boolean,
  browsingTopics?: boolean,
  adAuctionHeaders?: boolean,
  sharedStorageWritable?: boolean,
  srcset?: string,
  sizes?: string,
  crossOrigin?: 'anonymous' | 'use-credentials' | '',
  useMap?: string,
  isMap?: boolean,
  decoding?: 'sync' | 'async' | 'auto',
  fetchPriority?: 'high' | 'low' | 'auto',
  lowsrc?: string,
  hspace?: number | string,
  vspace?: number | string,
  border?: number | string,
  accept?: string,
  defaultChecked?: boolean,
  checked?: boolean,
  dirName?: string,
  files?: FileList,
  indeterminate?: boolean,
  max?: number | string,
  maxLength?: number,
  min?: number | string,
  minLength?: number,
  multiple?: boolean,
  pattern?: string,
  placeholder?: string,
  readOnly?: boolean,
  required?: boolean,
  step?: number | string,
  defaultValue?: string,
  valueAsDate?: Date | null,
  valueAsNumber?: number,
  selectionStart?: number,
  selectionEnd?: number,
  selectionDirection?: 'forward' | 'backward' | 'none',
  webkitdirectory?: boolean,
  incremental?: boolean,
  htmlFor?: string,
  media?: string,
  as?: string,
  imageSrcset?: string,
  imageSizes?: string,
  integrity?: string,
  blocking?: boolean,
  httpEquiv?: string,
  content?: string,
  scheme?: string,
  low?: number | string,
  high?: number | string,
  optimum?: number | string,
  data?: string,
  archive?: string,
  code?: string,
  declare?: boolean,
  standby?: string,
  codeBase?: string,
  codeType?: string,
  reversed?: boolean,
  start?: number,
  label?: string,
  defaultSelected?: boolean,
  selected?: boolean,
  valueType?: string,
  noModule?: boolean,
  async?: boolean,
  defer?: boolean,
  event?: string,
  length?: number,
  selectedIndex?: number,
  caption?: string,
  tHead?: string,
  tFoot?: string,
  frame?: string,
  rules?: string,
  summary?: string,
  cellPadding?: string,
  cellSpacing?: string,
  colSpan?: number,
  rowSpan?: number,
  headers?: string,
  axis?: string,
  noWrap?: boolean,
  abbr?: string,
  scope?: 'row' | 'col' | 'rowgroup' | 'colgroup',
  shadowRootMode?: 'open' | 'closed',
  shadowRootDelegatesFocus?: boolean,
  shadowRootClonable?: boolean,
  shadowRootSerializable?: boolean,
  wrap?: 'soft' | 'hard',
  kind?: string,
  srclang?: Lang,
  default?: boolean,
  poster?: string,
  playsInline?: boolean,
  disablePictureInPicture?: boolean,
}>;

export type NativeElementProps = AriaProps & PropsWithUndefined<{
  title?: string,
  lang?: Lang,
  translate?: any,
  dir?: any,
  hidden?: any,
  inert?: any,
  accessKey?: any,
  draggable?: any,
  spellcheck?: Boolean,
  autocapitalize?: any,
  contentEditable?: Boolean,
  enterKeyHint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send',
  inputMode?: 'decimal' | 'email' | 'numeric' | 'tel' | 'search' | 'url' | 'text',
  virtualKeyboardPolicy?: 'manual' | 'auto',
  // offsetParent?: any,
  innerText?: string,
  outerText?: string,
  writingSuggestions?: Boolean,
  autofocus?: boolean,
  tabIndex?: IntegerAny | -1 | '-1',
  style?: Record<string, string>,
  id?: string,
  class?: string, // Shorthand for className
  innerHTML?: string,
  outerHTML?: string,
  scrollTop?: number,
  scrollLeft?: number,
  scrollWidth?: number,
  scrollHeight?: number,
  textContent?: string,
}>

const defaultPropsMap = new WeakMap<HTMLElement, NativeElementProps>();

/**
 * Sets native element's properties and attributes.
 * - style: formatted as Object.
 * - class: shorthand for className.
 * - "@" + event: name for event listener.
 * @param {HTMLElement} element - Native HTMLElement to apply properties to.
 * @param {Object} props - Element properties.
 */
export const applyNativeElementProps = function(element: HTMLElement, props: NativeElementProps) {
  // TODO: remove type conversion once NativeElementProps is fully typed.
  const _element = (element as unknown as IoElement);

  let defaultPropValues: NativeElementProps = defaultPropsMap.get(element) || {};
  if (!defaultPropValues) {
    defaultPropValues = {};
    defaultPropsMap.set(element, defaultPropValues);
  }
  for (const _p in props) {
    const p = _p as keyof NativeElementProps;
    const prop: any = props[p];
    if (!Object.hasOwn(defaultPropValues, p)) {
      defaultPropValues[p] = _element[p];
    }
    if (p === 'style') {
      for (const s in prop) {
        element.style.setProperty(s, prop[s]);
      }
    } else if (p === 'class') {
      element['className'] = prop;
    } else {
      if (prop === undefined) {
        _element[p] = defaultPropValues[p];
      } else {
        _element[p] = prop;
      }
    }
    if (prop === undefined) element.removeAttribute(p);
    if (prop === defaultPropValues[p]) element.removeAttribute(p);
  }
  // Reset properties to defaults if they are not in the props.
  for (const _p in defaultPropValues) {
    const p = _p as keyof NativeElementProps;
    if (!Object.hasOwn(props, p)) {
      _element[p] = defaultPropValues[p];
      element.removeAttribute(p);
    }
  }
  if (!_element._eventDispatcher) {
    Object.defineProperty(element, '_eventDispatcher', {enumerable: false, configurable: true, value: new EventDispatcher(element as unknown as Node)});
  }
  _element._eventDispatcher.applyPropListeners(props);
};

/**
 * Creates an element from a virtual DOM object.
 * @param {VDOMElement} vDOMElement - Virtual DOM object.
 * @return {HTMLElement} - Created element.
 */
export const constructElement = function(vDOMElement: VDOMElement) {
  const props = vDOMElement.props || {};
  // IoElement classes constructed with constructor.
  const ConstructorClass = window.customElements ? window.customElements.get(vDOMElement.name) : null;
  if (ConstructorClass && (ConstructorClass as any)._isIoElement) {
    return new ConstructorClass(props);
  }
  // Other element classes constructed with document.createElement.
  const element = document.createElement(vDOMElement.name);
  applyNativeElementProps(element, props);
  return element;
};

/**
 * Disposes the element's children.
 * @param {IoElement} element - Element to dispose children of.
 */
export const disposeChildren = function(element: IoElement) {
  // NOTE: This rAF ensures that element's change queue is emptied before disposing.
  requestAnimationFrame(() => {
    const elements = [...(element.querySelectorAll('*')), element] as IoElement[];
    for (let i = elements.length; i--;) {
      if (typeof elements[i].dispose === 'function') {
        elements[i].dispose();
      } else if (elements[i]._eventDispatcher) {
        elements[i]._eventDispatcher.dispose();
        delete (elements[i] as any)._eventDispatcher;
      }
    }
  });
};

const vDOMAttributes = function(element: IoElement | HTMLElement): Record<string, any> {
  const attributes: Record<string, any> = {};
  for (let i = 0; i < element.attributes.length; i++) {
    const name = element.attributes[i].name;
    const value = element.getAttribute(name);
    if (value !== null) attributes[name] = value;
  }
  return attributes;
};

const toVDOMChildren = function(htmlCollection: [IoElement | HTMLElement]): VDOMElement[] {
  const children = [];
  for (let i = 0; i < htmlCollection.length; i++) {
    children.push(toVDOM(htmlCollection[i]));
  }
  return children;
};

/**
 * Converts an element to a virtual dom object.
 * NODE: This vDOM contains elements only attributes (not properties).
 * Used for testing but might be useful for other things.
 * @param {IoElement | HTMLElement} element - Element to convert.
 * @return {VDOMElement} - Virtual dom object.
 */
export const toVDOM = function(element: IoElement | HTMLElement): VDOMElement {
  return {
    name: element.localName,
    props: vDOMAttributes(element),
    children: element.children.length > 0 ? toVDOMChildren((element as any).children) : element.textContent
  };
};