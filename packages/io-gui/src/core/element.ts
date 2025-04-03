import { EventDispatcher } from './internals/eventDispatcher';
import { IoNode, IoNodeMixin, IoNodeArgs } from './node';
import { Property } from './decorators/property';
import { Register } from './decorators/register';
// Global mixin record
const mixinRecord: Record<string, string> = {};

// Regular expressions for style string processing.
const commentsRegex =  new RegExp('(\\/\\*[\\s\\S]*?\\*\\/)', 'gi');
const keyframeRegex =  new RegExp('((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})', 'gi');
const mediaQueryRegex =  new RegExp('((@media [\\s\\S]*?){([\\s\\S]*?}\\s*?)})', 'gi');
const mixinRegex = new RegExp('(( --[\\s\\S]*?): {([\\s\\S]*?)})', 'gi');
const applyRegex = new RegExp('(@apply\\s.*?;)', 'gi');
const cssRegex =  new RegExp('((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})', 'gi');

const resizeObserver = new ResizeObserver((entries: any) => {
  for (const entry of entries) (entry.target as unknown as IoElement).onResized();
});

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
  [key: string]: any, // TODO: remove and make specific types
  src?: string; // TODO: move to IoMarkdown
}

export type VDOMArray =
  null |
  [string] |
  [string, IoElementArgs | VDOMArray[] | string] |
  [string, IoElementArgs, VDOMArray[] | string];

export type VDOMElement = {
  name: string,
  props: IoElementArgs,
  children: VDOMElement[] | string
}

/** @license
 * MIT License
 *
 * Copyright (c) 2019 Luke Jackson
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const isArray = (x: any) => Array.isArray(x);
const isString = (x: any) => typeof x === 'string';
const isElementArgs = (object: IoElementArgs | VDOMArray[] | string | undefined) => {
  return typeof object === 'object' && !Array.isArray(object);
};

const clense = (a: any, b: any) => !b ? a : isString(b[0]) ? [...a, b] : [...a, ...b];

const buildTree = (node: VDOMArray): VDOMElement | null => {
  if (isArray(node)) {
    if (isElementArgs(node[1])) {
      const vElement: VDOMElement = {
        name: node[0],
        props: node[1] as IoElementArgs,
        children: []
      };
      if (isArray(node[2])) {
        vElement.children = node[2].reduce(clense, []).map(buildTree);
      } else if (isString(node[2])) {
        vElement.children = node[2];
      }
      return vElement;
    } else {
      return buildTree([node[0], {}, node[1] as VDOMArray[]]);
    }
  }
  return null;
};

/**
 * Creates an element from a virtual dom object.
 * @param {VDOMElement} vDOMElement - Virtual dom object.
 * @return {HTMLElement} - Created element.
 */
const constructElement = function(vDOMElement: VDOMElement) {
  // IoElement classes constructed with constructor.
  const ConstructorClass = window.customElements ? window.customElements.get(vDOMElement.name) : null;
  if (ConstructorClass && (ConstructorClass as any)._isIoElement) {
    return new ConstructorClass(vDOMElement.props);
  }
  // Other element classes constructed with document.createElement.
  const element = document.createElement(vDOMElement.name);
  applyNativeElementProps(element, vDOMElement.props);
  return element;
};

export const disposeElementDeep = function(element: IoElement) {
  // NOTE: This timeout ensures that element's change queue is emptied before disposing.
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

const superCreateElement = document.createElement;
document.createElement = function(tagName: string, options?: ElementCreationOptions) {
  if (tagName.startsWith('io-')) {
    const constructor = customElements.get(tagName);
    if (constructor) {
      return new constructor();
    } else {
      return superCreateElement.apply(this, [tagName, options]);
    }
  } else  {
    return superCreateElement.apply(this, [tagName, options]);
  }
};

/**
 * Sets element properties.
 * @param {HTMLElement} element - Element to set properties on.
 * @param {Object} props - Element properties.
 */
export const applyNativeElementProps = function(element: HTMLElement, props: any) {
  for (const p in props) {
    const prop = props[p];
    if (p === 'style') for (const s in prop) element.style.setProperty(s, prop[s]);
    else if (p === 'class') element['className'] = prop;
    else (element as unknown as IoElement)[p] = prop;
    if (p === 'name') element.setAttribute('name', prop);
    if (p === 'src') element.setAttribute('src', prop);
  }
  if (!(element as unknown as IoElement)._eventDispatcher) {
    Object.defineProperty(element, '_eventDispatcher', {enumerable: false, configurable: true, value: new EventDispatcher(element as unknown as IoNode)});
  }
  (element as unknown as IoElement)._eventDispatcher.applyPropListeners(props);
};

/**
 * Core `IoElement` class.
 */
@Register
export class IoElement extends IoNodeMixin(HTMLElement) {

  static get Style(): string {
    return /* css */`
      :host {
        box-sizing: border-box;
        display: block;
      }
      :host[hidden] {
        display: none;
      }
      :host[disabled] {
        pointer-events: none;
        opacity: 0.5;
      }
      :host:focus {
        border-color: var(--io_colorBlue);
        outline: 1px auto var(--io_colorBlue);
        outline: 1px auto -webkit-focus-ring-color;
      }
      :host[aria-invalid] {
        border: var(--io_borderFail);
      }
    `;
  }

  declare $: Record<string, any>; // TODO: Add type safety.

  @Property({value: '', type: String, reflect: true})
  declare tabindex: string;

  @Property({value: false, type: Boolean, reflect: true})
  declare contenteditable: boolean;

  @Property({value: '', type: String, reflect: true})
  declare class: string;

  @Property({value: '', type: String, reflect: true})
  declare role: string;

  @Property({value: '', type: String, reflect: true})
  declare title: string;

  @Property({value: '', type: String, reflect: true})
  declare id: string;

  @Property({value: false, type: Boolean, reflect: true})
  declare disabled: boolean;

  //TODO: add types
  constructor(...args: any[]) {
    super(...args);

    for (const name in this._protochain.properties) {
      const property = this._properties.get(name)!;
      const value = property.value;
      if (value !== undefined && value !== null) {
        if (property.reflect) {
          this.setAttribute(name, value);
        }
      }
    }
  }

  /**
  * Add resize listener if `onResized()` is defined in subclass.
  */
  connectedCallback() {
    if (typeof this.onResized === 'function') {
      resizeObserver.observe(this as unknown as HTMLElement);
    }
  }
  /**
  * Removes resize listener if `onResized()` is defined in subclass.
  */
  disconnectedCallback() {
    if (typeof this.onResized === 'function') {
      resizeObserver.unobserve(this as unknown as HTMLElement);
    }
  }

  setProperty(name: string, value: any, debounce = false) {
    super.setProperty(name, value, debounce);
    const prop = this._properties.get(name)!;
    if (prop.reflect) this.setAttribute(name, value);
  }
  // TODO: Reconsider cache parameter. Does it belong in the code class?
  /**
   * Renders DOM from virtual DOM arrays.
   * @param {Array} vDOM - Array of vDOM children.
   * @param {HTMLElement} [host] - Optional template target.
   * @param {boolean} [cache] - Optional don't reuse existing elements and skip dispose
   */
  template(vDOM: Array<any>, host?: HTMLElement, cache?: boolean) {
    const vChildren = buildTree(['first', vDOM])?.children || [];
    host = (host || this) as any;
    if (host === (this as any)) this.$ = {};
    this.traverse(vChildren, host as HTMLElement, cache);
  }
  /**
   * Recurively traverses vDOM.
   * TODO: test element.traverse() function!
   * @param {Array} vChildren - Array of vDOM children converted by `buildTree()` for easier parsing.
   * @param {HTMLElement} [host] - Optional template target.
   * @param {boolean} [cache] - Optional don't reuse existing elements and skip dispose
   */
  traverse(vChildren: Array<any> | string, host: HTMLElement, cache?: boolean) {
    const children = host.children;
    // remove trailing elements
    while (children.length > vChildren.length) {
      const child = children[children.length - 1];
      host.removeChild(child);
      if (!cache) disposeElementDeep(child as unknown as IoElement);
    }
    // replace elements
    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement | IoElement;
      // replace existing elements
      if (child.localName !== vChildren[i].name || cache) {
        const oldElement = child as unknown as HTMLElement;
        const element = constructElement(vChildren[i]);
        host.insertBefore(element, oldElement);
        host.removeChild(oldElement);
        if (!cache) disposeElementDeep(oldElement as unknown as IoElement);
      // update existing elements
      } else {
        child.removeAttribute('className');
        if ((child as IoElement)._isIoElement) {
          // Set IoElement element properties
          (child as IoElement).applyProperties(vChildren[i].props);
        } else {
          // Set native HTML element properties
          applyNativeElementProps(child as HTMLElement, vChildren[i].props);
        }
      }
    }
    // TODO: doing this before "replace elements" cached elements to be created twice. Consider making a unit test for this.
    // create new elements after existing
    if (children.length < vChildren.length) {
      const frag = document.createDocumentFragment();
      for (let i = children.length; i < vChildren.length; i++) {
        const element = constructElement(vChildren[i]);
        frag.appendChild(element);
      }
      host.appendChild(frag);
    }
    for (let i = 0; i < vChildren.length; i++) {
      // Update this.$ map of ids.
      const child = children[i] as HTMLElement | IoElement;
      if (vChildren[i].props.$) {
        this.$[vChildren[i].props.$] = child;
      }
      if (vChildren[i].children !== undefined) {
        if (typeof vChildren[i].children === 'string') {
          // Set textNode value.
          this._flattenTextNode(child as HTMLElement);
          (child as IoElement)._textNode.nodeValue = String(vChildren[i].children);
        } else if (vChildren[i].children.length > 0) {
          // Traverse deeper.
          this.traverse(vChildren[i].children, child as HTMLElement, cache);
        }
      }
    }
  }

  /**
  * Helper function to flatten textContent into a single TextNode.
  * Update textContent via TextNode is better for layout performance.
  * @param {HTMLElement} element - Element to flatten.
  */
  _flattenTextNode(element: HTMLElement | IoElement) {
    if (element.childNodes.length === 0) {
      element.appendChild(document.createTextNode(''));
    }
    if (element.childNodes[0].nodeName !== '#text') {
      element.innerHTML = '';
      element.appendChild(document.createTextNode(''));
    }
    (element as IoElement)._textNode = element.childNodes[0];
    if (element.childNodes.length > 1) {
      const textContent = element.textContent;
      for (let i = element.childNodes.length; i--;) {
        if (i !== 0) element.removeChild(element.childNodes[i]);
      }
      (element as IoElement)._textNode.nodeValue = textContent;
    }
  }
  get textNode() {
    this._flattenTextNode(this);
    return this._textNode.nodeValue;
  }
  set textNode(value) {
    this._flattenTextNode(this);
    this._textNode.nodeValue = String(value);
  }
  applyProperties(props: any) {
    super.applyProperties(props);
    if (props['style']) {
      for (const s in props['style']) {
        this.style[s] = props['style'][s];
      }
    }
  }
  /**
  * Alias for HTMLElement setAttribute where falsey values remove the attribute.
  * @param {string} attr - Attribute name.
  * @param {*} value - Attribute value.
  */
  setAttribute(attr: string, value: boolean | number | string) {
    if (value === true) {
      HTMLElement.prototype.setAttribute.call(this, attr, '');
    } else if (value === false || value === '') {
      this.removeAttribute(attr);
    } else if (typeof value === 'string' || typeof value === 'number') {
      if (this.getAttribute(attr) !== String(value)) HTMLElement.prototype.setAttribute.call(this, attr, String(value));
    }
  }
  disabledChanged() {
    if (this.disabled) {
      this.setAttribute('aria-disabled', this.disabled);
    } else {
      this.removeAttribute('aria-disabled');
    }
  }
  /**
   * Returns a vDOM-like representation of the element with children and attributes. This feature is used in testing.
   * @return {Object} vDOM-like representation of the element.
   */
  serialize() {
    return serializeChild(this);
  }

  static vDOM: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;

  Register(ioNodeConstructor: typeof IoNode) {
    super.Register(ioNodeConstructor);
    const localName = ioNodeConstructor.name.replace(/([a-z])([A-Z,0-9])/g, '$1-$2').toLowerCase();

    Object.defineProperty(ioNodeConstructor, 'localName', {value: localName});
    Object.defineProperty(ioNodeConstructor.prototype, 'localName', {value: localName});

    Object.defineProperty(ioNodeConstructor, '_isIoElement', {enumerable: false, value: true});
    Object.defineProperty(ioNodeConstructor.prototype, '_isIoElement', {enumerable: false, value: true});
    Object.defineProperty(window, ioNodeConstructor.name, {value: ioNodeConstructor});

    window.customElements.define(localName, ioNodeConstructor as unknown as CustomElementConstructor);

    let mixinsString = '';
    const mixins = ioNodeConstructor.prototype._protochain.styles.match(mixinRegex);
    if (mixins) {
      for (let i = 0; i < mixins.length; i++) {
        // TODO: improve mixing regex and string handling.
        const m = mixins[i].split(': {');
        const name = m[0].replace(' --', '--');
        const value = m[1].replace(/}/g, '').trim().replace(/^ +/gm, '');
        mixinRecord[name] = value;
        mixinsString += mixins[i].replace(' --', '.').replace(': {', ' {');
      }
    }

    // Remove mixins
    let styleString = ioNodeConstructor.prototype._protochain.styles.replace(mixinRegex, '');
    // Apply mixins
    const apply = styleString.match(applyRegex);
    if (apply) {
      for (let i = 0; i < apply.length; i++) {
        const name = apply[i].split('@apply ')[1].replace(';', '');
        if (mixinRecord[name]) {
          styleString = styleString.replace(apply[i], mixinRecord[name]);
        } else {
          console.warn('IoElement: cound not find mixin:', name);
        }
      }
    }

    debug: {
      let styleStringStripped = styleString;
      styleStringStripped = styleStringStripped.replace(commentsRegex, '');
      styleStringStripped = styleStringStripped.replace(keyframeRegex, '');
      styleStringStripped = styleStringStripped.replace(mediaQueryRegex, '');
      const match = styleStringStripped.match(cssRegex);
      if (match) {
        match.map((selector: any) => {
          selector = selector.trim();
          if (!selector.startsWith(':host')) {
            console.warn(localName + ': CSS Selector not prefixed with ":host"! This will cause style leakage!');
            console.warn(selector);
          }
        });
      }
    }

    // Replace `:host` with element tag and add mixin CSS variables.
    styleString = mixinsString + styleString.replace(new RegExp(':host', 'g'), localName);

    const styleElement = document.createElement('style');
    styleElement.innerHTML = styleString;
    styleElement.setAttribute('id', 'io-style-' + localName.replace('io-', ''));
    document.head.appendChild(styleElement);

    Object.defineProperty(ioNodeConstructor, 'vDOM', {value: function(arg0?: IoElementArgs | VDOMArray[], arg1?: VDOMArray[]): VDOMArray {
      if (arg0 !== undefined) {
        if (arg1 !== undefined) {
          return [localName, arg0 as IoElementArgs, arg1 as VDOMArray[]];
        } else {
          return [localName, arg0 as IoElementArgs | VDOMArray[]];
        }
      } else {
        return [localName];
      }
    }});
  }
}

const serializeChildren = function(htmlCollection: [IoElement | HTMLElement]): vDOMLike[] {
  const children = [];
  for (let i = 0; i < htmlCollection.length; i++) {
    children.push(serializeChild(htmlCollection[i]));
  }
  return children;
};

const serializeAttributes = function(element: IoElement | HTMLElement): Record<string, any> {
  const attributes: Record<string, any> = {};
  for (let i = 0; i < element.attributes.length; i++) {
    const name = element.attributes[i].name;
    const value = element.getAttribute(name);
    if (value !== null) {
      attributes[name] = value;
    }
  }
  return attributes;
};

type vDOMLike = [string, Record<string, any>, vDOMLike[]];

const serializeChild = function(element: IoElement | HTMLElement): [string, Record<string, any>, vDOMLike[]] {
  return [
    element.localName,
    serializeAttributes(element),
    element.children.length > 0 ? serializeChildren((element as any).children) : element.textContent
  ];
};


//TODO: test element vDOM factories!
export const ioElement = IoElement.vDOM;

const nativeElements = [
  'a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b', 'base', 'basefont', 'bdi', 'bdo', 'big', 'blockquote',
  'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn',
  'dialog', 'dir', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'frame', 'frameset', 'head',
  'header', 'hgroup', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend',
   'li', 'link', 'main', 'map', 'mark', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noframes', 'noscript', 'object', 'ol', 'optgroup', 'option',
  'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source',
  'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'svg', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead',
  'time', 'title', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr'
];
const nativeVDOMFactories: Record<string, (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray> = {};
nativeElements.forEach((element) => {
  const vDOMFactory = function(arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string): VDOMArray {
    if (arg0 !== undefined) {
      if (arg1 !== undefined) {
        return [element, arg0 as IoElementArgs, arg1 as VDOMArray[] | string];
      } else {
        return [element, arg0 as IoElementArgs | VDOMArray[] | string];
      }
    } else {
      return [element];
    }
  };
  nativeVDOMFactories[element] = vDOMFactory;
});

export const {
  a, abbr, acronym, address, applet, area, article, aside, audio, b, base, basefont, bdi, bdo, big, blockquote,
  body, br, button, canvas, caption, center, cite, code, col, colgroup, data, datalist, dd, del, details, dfn,
  dialog, dir, div, dl, dt, em, embed, fieldset, figcaption, figure, font, footer, form, frame, frameset, head,
  header, hgroup, h1, h2, h3, h4, h5, h6, hr, html, i, iframe, img, input, ins, kbd, keygen, label, legend, li,
  link, main, map, mark, menu, menuitem, meta, meter, nav, noframes, noscript, object, ol, optgroup, option,
  output, p, param, picture, pre, progress, q, rp, rt, ruby, s, samp, script, section, select, small, source,
  span, strike, strong, style, sub, summary, sup, svg, table, tbody, td, template, textarea, tfoot, th, thead,
  time, title, tr, track, tt, u, ul, video, wbr
} = nativeVDOMFactories;
