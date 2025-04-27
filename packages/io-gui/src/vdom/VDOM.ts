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

type ArgsWithUndefined<T> = {[K in keyof T]: T[K] | undefined};

export type AriaProps = ArgsWithUndefined<{
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
  ariaLabel?: string,
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

export type NativeElementProps = AriaProps &ArgsWithUndefined<{
  title?: string,
  lang?: null,
  translate?: null,
  dir?: null,
  hidden?: null,
  inert?: null,
  accessKey?: null,
  draggable?: null,
  spellcheck?: Boolean,
  autocapitalize?: null,
  contentEditable?: Boolean,
  enterKeyHint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send',
  inputMode?: 'decimal' | 'email' | 'numeric' | 'tel' | 'search' | 'url' | 'text',
  virtualKeyboardPolicy?: 'manual' | 'auto',
  // offsetParent?: null,
  innerText?: string,
  outerText?: string,
  writingSuggestions?: Boolean,
  autofocus?: boolean,
  tabIndex?: IntegerAny | -1 | '-1',
  style?: Record<string, string>, // TODO: add deep type safety
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