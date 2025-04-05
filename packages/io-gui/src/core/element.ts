import { EventDispatcher } from './internals/eventDispatcher';
import { IoNode, IoNodeMixin, IoNodeArgs, ArgsWithBinding } from './node';
import { Property } from './decorators/property';
import { Register } from './decorators/register';
import { Binding } from './internals/binding';
import { applyNativeElementProps, buildTree, constructVDOMElement, disposeElementDeep, toVDOM } from './internals/vDOM';

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

export type IoElementArgs = IoNodeArgs & ArgsWithBinding<{
  $?: string;
  style?: Record<string, string>;
  class?: string;
  title?: string;
  id?: string;
  role?: string;
}>;

// TODO: Consider making more specific types. Might be too complex.
export type AnyIoArgs = {
  [key: string]: any;
}

export type VDOMArray =
  null |
  [string] |
  [string, AnyIoArgs | VDOMArray[] | string] |
  [string, AnyIoArgs, VDOMArray[] | string];

export type VDOMElement = {
  name: string,
  props: AnyIoArgs,
  children: VDOMElement[] | string
}

/**
 * Core `IoElement` class.
 */
@Register
export class IoElement extends IoNodeMixin(HTMLElement) {
  static vConstructor: (arg0?: IoElementArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
  static get Style() {
    return /* css */`
      :host {
        box-sizing: border-box;
        display: block;
      }
      :host[hidden] {
        display: none;
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
  declare class: string;

  @Property({value: '', type: String, reflect: true})
  declare title: string;

  @Property({value: '', type: String, reflect: true})
  declare id: string;

  @Property({value: '', type: String, reflect: true})
  declare role: string;

  //TODO: add types
  // constructor(args?: IoElementArgs) {
  constructor(args?: any) { // TODO: remove after fixing types!
    super(args);
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
   * @param {Array} VDOMElements - Array of VDOMElement[] children.
   * @param {HTMLElement} [host] - Optional template target.
   * @param {boolean} [cache] - Optional don't reuse existing elements and skip dispose
   */
  template(VDOMElements: VDOMArray[], host?: HTMLElement, cache?: boolean) {
    const vChildren = buildTree(['first', VDOMElements])?.children || [];
    host = (host || this) as any;
    if (host === (this as any)) this.$ = {};
    this.traverse(vChildren, host as HTMLElement, cache);
  }
  /**
   * Recurively traverses virtual DOM elements.
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
        const element = constructVDOMElement(vChildren[i]);
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
        const element = constructVDOMElement(vChildren[i]);
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
  /**
   * Returns a vDOM-like representation of the element with children and attributes. This feature is used in testing.
   * @return {Object} vDOM-like representation of the element.
   */
  toVDOM() {
    return toVDOM(this);
  }
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

    Object.defineProperty(ioNodeConstructor, 'vConstructor', {value: function(arg0?: IoElementArgs | VDOMArray[], arg1?: VDOMArray[]): VDOMArray {
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
export const ioElement = IoElement.vConstructor;