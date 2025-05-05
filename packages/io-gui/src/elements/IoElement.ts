import { Default } from '../decorators/Default';
import { Register } from '../decorators/Register';
import { applyNativeElementProps, constructElement, disposeChildren, VDOMElement, toVDOM, NativeElementProps } from '../vdom/VDOM';
import { Node, NodeMixin, NodeProps } from '../nodes/Node';

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

export type IoElementProps = NativeElementProps & NodeProps;

/**
 * Core `IoElement` class.
 */
@Register
export class IoElement extends NodeMixin(HTMLElement) {
  static vConstructor: (arg0?: IoElementProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
  static get Style() {
    return /* css */`
      :host {
        box-sizing: border-box;
        display: block;
      }
    `;
  }

  @Default(Object)
  declare $: Record<string, HTMLElement | IoElement>;

  constructor(args?: IoElementProps) {
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
    if (prop.reflect) this.setAttribute(name.toLowerCase(), value);
  }
  // TODO: Reconsider cache parameter. Does it belong in the code class?
  /**
   * Renders DOM from virtual DOM arrays.
   * @param {Array} vDOMElements - Array of VDOMElement[] children.
   * @param {HTMLElement} [host] - Optional template target.
   * @param {boolean} [cache] - Optional don't reuse existing elements and skip dispose
   */
  template(vDOMElements: Array<VDOMElement | null>, host?: HTMLElement | IoElement, cache?: boolean) {
    host = (host || this) as any;
    const vDOMElementsOnly = vDOMElements.filter(item => item !== null);
    this.traverse(vDOMElementsOnly, host as HTMLElement, cache);
  }
  /**
   * Recurively traverses virtual DOM elements.
   * TODO: test element.traverse() function!
   * @param {Array} vDOMElements - Array of VDOMElements elements.
   * @param {HTMLElement} [host] - Optional template target.
   * @param {boolean} [cache] - Optional don't reuse existing elements and skip dispose
   */
  traverse(vChildren: VDOMElement[], host: HTMLElement | IoElement, cache?: boolean) {
    const children = host.children;
    // remove trailing elements
    while (children.length > vChildren.length) {
      const child = children[children.length - 1];
      host.removeChild(child);
      if (!cache) disposeChildren(child as unknown as IoElement);
    }
    // replace elements
    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement | IoElement;
      // replace existing elements
      if (child.localName !== vChildren[i].tag || cache) {
        const oldElement = child as unknown as HTMLElement;
        const element = constructElement(vChildren[i]);
        host.insertBefore(element, oldElement);
        host.removeChild(oldElement);
        if (!cache) disposeChildren(oldElement as unknown as IoElement);
      // update existing elements
      } else {
        // TODO: improve setting/removal/cleanup of native element properties/attributes.
        child.removeAttribute('className');
        if (vChildren[i].props) {
          if ((child as IoElement)._isIoElement) {
            // Set IoElement element properties
            (child as IoElement).applyProperties(vChildren[i].props);
          } else {
            // Set native HTML element properties
            applyNativeElementProps(child as HTMLElement, vChildren[i].props!);
          }
        }
      }
    }
    // TODO: doing this before "replace elements" cached elements to be created twice.
    // TODO: test
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
      if (vChildren[i].props?.id) {
        this.$[vChildren[i].props!.id] = child;
      }
      if (vChildren[i].children) {
        if (typeof vChildren[i].children === 'string') {
          // Set textNode value.
          this._flattenTextNode(child as HTMLElement);
          (child as IoElement)._textNode.nodeValue = String(vChildren[i].children);
        } else if (vChildren[i].children instanceof Array && vChildren[i].children!.length > 0) {
          // Traverse deeper.
          const vDOMElementsOnly = (vChildren[i].children as Array<VDOMElement | null>).filter(item => item !== null);
          this.traverse(vDOMElementsOnly, child as HTMLElement, cache);
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
  /**
   * Sets multiple properties in batch.
   * [property]-changed` events will be broadcast in the end.
   * @param {Object} props - Map of property names and values.
   */
  applyProperties(props: any, skipDispatch = false) {
    for (const name in props) {
      if (this._properties.has(name)) {
        this.setProperty(name, props[name], true);
      } else {
        if (name === 'class') {
          this.className = props[name];
        } else if (name === 'style') {
          for (const s in props[name]) {
            this.style[s] = props[name][s];
          }
        } else if (!name.startsWith('@')) {
          // TODO: test
          this[name] = props[name];
          if (props[name] === undefined && this.hasAttribute(name)) {
            this.removeAttribute(name);
          }
        }
      }
    }
    this._eventDispatcher.applyPropListeners(props);
    if (!skipDispatch) this.dispatchQueue();
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
   */
  toVDOM() {
    return toVDOM(this);
  }
  Register(ioNodeConstructor: typeof Node) {
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

    // TODO: Define all overloads with type guards.
    // TODO: Add runtime debuf type checks.
    // TODO: Test thoroughly.
    Object.defineProperty(ioNodeConstructor, 'vConstructor', {value: function(arg0?: IoElementProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string): VDOMElement {
      const vDOMElement: VDOMElement = {tag: localName};
      if (arg0 !== undefined) {
        if (typeof arg0 === 'string') {
          vDOMElement.children = arg0;
        } else if (arg0 instanceof Array) {
          vDOMElement.children = arg0;
        } else if (typeof arg0 === 'object') {
          vDOMElement.props = arg0;
        }
        if (arg1 !== undefined) {
          if (typeof arg1 === 'string') {
            vDOMElement.children = arg1;
          } else if (arg1 instanceof Array) {
            vDOMElement.children = arg1;
          }
        }
      }
      return vDOMElement;
    }});
  }
}
export const ioElement = IoElement.vConstructor;