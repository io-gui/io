import { Property } from '../decorators/Property.js';
import { Register } from '../decorators/Register.js';
import { applyNativeElementProps, constructElement, disposeChildren, VDOMElement, toVDOM, NativeElementProps } from '../vdom/VDOM.js';
import { Node, NodeMixin, NodeProps } from '../nodes/Node.js';
import { Binding } from '../core/Binding.js';
import { applyElementStyleToDocument } from '../core/Style.js';

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
        display: block;
        box-sizing: border-box;
        -webkit-touch-callout: none;
      }
    `;
  }

  @Property(Object)
  declare $: Record<string, HTMLElement | IoElement>;

  constructor(args?: IoElementProps) {
    super(args);
    for (const name in this._protochain.reactiveProperties) {
      const property = this._reactiveProperties.get(name)!;
      if (property.reflect && property.value !== undefined && property.value !== null) {
        this.setAttribute(name, property.value);
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
    const prop = this._reactiveProperties.get(name)!;
    if (prop.reflect) this.setAttribute(name.toLowerCase(), value);
  }
  /**
   * Renders DOM from virtual DOM arrays.
   * @param {Array} vDOMElements - Array of VDOMElement[] children.
   * @param {HTMLElement} [host] - Optional template target.
   * @param {boolean} [noDispose] - Skip disposal of existing elements.
   */
  render(vDOMElements: Array<VDOMElement | null>, host?: HTMLElement | IoElement, noDispose?: boolean) {
    host = (host || this) as any;
    const vDOMElementsOnly = vDOMElements.filter(item => item !== null);
    this.$ = {};
    this.traverse(vDOMElementsOnly, host as HTMLElement, noDispose);
  }
  /**
   * Recurively traverses virtual DOM elements.
   * TODO: test element.traverse() function!
   * @param {Array} vDOMElements - Array of VDOMElements elements.
   * @param {HTMLElement} [host] - Optional template target.
   * @param {boolean} [noDispose] - Skip disposal of existing elements.
   */
  traverse(vChildren: VDOMElement[], host: HTMLElement | IoElement, noDispose?: boolean) {
    const children = host.children;
    // remove trailing elements
    while (children.length > vChildren.length) {
      const child = children[children.length - 1];
      host.removeChild(child);
      if (!noDispose) disposeChildren(child as unknown as IoElement);
    }
    // replace elements
    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement | IoElement;
      // replace existing elements
      if (child.localName !== vChildren[i].tag || noDispose) {
        const oldElement = child as unknown as HTMLElement;
        const element = constructElement(vChildren[i]);
        host.insertBefore(element, oldElement);
        host.removeChild(oldElement);
        if (!noDispose) disposeChildren(oldElement as unknown as IoElement);
      // update existing elements
      } else {
        // TODO: improve setting/removal/cleanup of native element properties/attributes.
        child.removeAttribute('className');
        child.removeAttribute('style');
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
    // TODO: doing this before "replace elements" cached (noDispose) elements to be created twice.
    // TODO: rename nodispose to dispose.
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
      const vChild = vChildren[i];
      const child = children[i] as HTMLElement | IoElement;
      if (vChild.props?.id) {
        // Update this.$ map of ids.
        debug: {
          if (this.$[vChild.props!.id] !== undefined) {
            console.warn('IoElement: Duplicate id in template.');
          }
        }
        this.$[vChild.props!.id] = child;
      }
      if (vChild.children !== undefined) { // TODO: test this! Look for more cases of truthy check bugs!
        if (typeof vChild.children === 'string') {
          // Set textNode value.
          this._flattenTextNode(child as HTMLElement);
          (child as IoElement)._textNode.nodeValue = String(vChild.children);
        } else if (vChild.children instanceof Array) {
          // Traverse deeper.
          const vDOMElementsOnly = (vChild.children as Array<VDOMElement | null>).filter(item => item !== null);
          this.traverse(vDOMElementsOnly, child as HTMLElement, noDispose);
        }
      }
    }
  }

  /**
  * Helper function to flatten textContent into a single TextNode.
  * Update textContent via TextNode is better for layout performance.
  * TODO: Consider using normalize()? Is it the same function?
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
      if (this._reactiveProperties.has(name)) {
        this.setProperty(name, props[name], true);
      } else {
        if (name === 'class') {
          this.className = props[name];
        } else if (name === 'style') {
          for (const s in props[name]) {
            this.style[s] = props[name][s];
          }
        } else if (name.startsWith('data-')) {
          // TODO: Test this!
          if (props[name] === undefined) {
            this.removeAttribute(name);
          } else {
            this.setAttribute(name, props[name]);
          }
        } else if (!name.startsWith('@')) {
          debug: if (props[name] instanceof Binding) {
            console.warn(`IoElement: Not a ReactiveProperty! Cannot set binding to "${name}" property on element "${this.localName}"`);
          }
          this[name] = props[name];
          // TODO: test and check if type can be attribute.
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

    applyElementStyleToDocument(localName, ioNodeConstructor.prototype._protochain.style);

    // TODO: Define all overloads with type guards.
    // TODO: Add runtime debug type checks.
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