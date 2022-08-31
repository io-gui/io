import {EventDispatcher} from './internals/eventDispatcher.js';
import {IoNode, IoNodeMixin, RegisterIoNode} from './io-node.js';

/**
 * Core `IoElement` class.
 */
class IoElement extends IoNodeMixin(HTMLElement) {
  static get Style(): any {
    // TODO: consider removing from core io-element class.
    return /* css */':host[hidden] { display: none; } :host[disabled] { pointer-events: none; opacity: 0.5; }';
  }
  static get Properties(): any {
    return {
      $: {
        type: Object,
        notify: false,
      },
      tabindex: {
        type: String,
        reflect: 1,
      },
      contenteditable: {
        type: Boolean,
        reflect: 1,
      },
      class: {
        type: String,
        reflect: 1,
      },
      role: {
        type: String,
        reflect: 1,
      },
      label: {
        type: String,
        reflect: 1,
      },
      name: {
        type: String,
        reflect: 1,
      },
      title: {
        type: String,
        reflect: 1,
      },
      id: {
        type: String,
        reflect: -1,
      },
      hidden: {
        type: Boolean,
        reflect: 1,
      },
      disabled: {
        type: Boolean,
        reflect: 1,
      },
    };
  }
  static get Listeners(): any {
    return {
      'focus-to': '_onFocusTo',
    };
  }
  static get observedAttributes() {
    const observed = [];
    for (const prop in this.prototype._protochain.properties) {
      const r  = this.prototype._protochain.properties[prop].reflect;
      if (r === -1 || r === 2) {
        observed.push(prop);
      }
    }
    return observed;
  }
  attributeChangedCallback(prop: string, oldValue: any, newValue: any) {
    const type = this._properties[prop].type;
    if (type === Boolean) {
      if (newValue === null) this[prop] = false;
      else if (newValue === '') this[prop] = true;
    } else if (type === Number || type === String) {
      this[prop] = new type(newValue);
    } else if (type === Object || type === Array) {
      this[prop] = JSON.parse(newValue);
    } else if (typeof type === 'function') {
      this[prop] = new type(JSON.parse(newValue));
    } else {
      this[prop] = isNaN(Number(newValue)) ? newValue : Number(newValue);
    }
  }
  /**
   * Add resize listener if `onResized()` is defined in subclass.
   */
  connectedCallback() {
    // super.connectedCallback();
    if (typeof this.onResized === 'function') {
      ro.observe(this as unknown as HTMLElement);
    }
  }
  /**
   * Removes resize listener if `onResized()` is defined in subclass.
   */
  disconnectedCallback() {
    if (typeof this.onResized === 'function') {
      ro.unobserve(this as unknown as HTMLElement);
    }
  }
  /**
    * Renders DOM from virtual DOM arrays.
    * @param {Array} vDOM - Array of vDOM children.
    * @param {HTMLElement} [host] - Optional template target.
    */
  template(vDOM: Array<any>, host?: HTMLElement) {
    const vChildren = buildTree()(['root', vDOM]).children;
    host = (host || this) as any;
    if (host === (this as any)) this.setProperty('$', {});
    this.traverse(vChildren, host as HTMLElement);
  }
  /**
   * Recurively traverses vDOM.
   * @param {Array} vChildren - Array of vDOM children converted by `buildTree()` for easier parsing.
   * @param {HTMLElement} [host] - Optional template target.
    */
  traverse(vChildren: Array<any>, host: HTMLElement) {
    const children = host.children;
    // focusBacktrack = new WeakMap();
    // remove trailing elements
    while (children.length > vChildren.length) {
      const child = children[children.length - 1];
      host.removeChild(child);
      // TODO: enable and test!
      // const nodes = Array.from(child.querySelectorAll('*'));
      // for (let i = nodes.length; i--;) if (nodes[i].dispose) nodes[i].dispose();
      // if (child.dispose) child.dispose();
    }
    // create new elements after existing
    if (children.length < vChildren.length) {
      const frag = document.createDocumentFragment();
      for (let i = children.length; i < vChildren.length; i++) {
        const element = constructElement(vChildren[i]);
        frag.appendChild(element);
      }
      host.appendChild(frag);
    }
    // replace existing elements
    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement | IoElement;
      if (child.localName !== vChildren[i].name) {
        const oldElement = child;
        const element = constructElement(vChildren[i]);
        host.insertBefore(element, oldElement as unknown as HTMLElement);
        host.removeChild(oldElement as unknown as HTMLElement);
        // TODO: enable and test!
        // const nodes = Array.from(oldElement.querySelectorAll('*'));
        // for (let i = nodes.length; i--;) if (nodes[i].dispose) nodes[i].dispose();
        // if (oldElement.dispose) oldElement.dispose();
      // update existing elements
      } else {
        child.removeAttribute('className');
        if ((child as IoElement)._isIoElement) {
          // Set IoElement element properties
          // TODO: Test property and listeners reset. Consider optimizing.
          (child as IoElement).applyProperties(vChildren[i].props);
        } else {
          // Set native HTML element properties
          applyNativeElementProps(child as HTMLElement, vChildren[i].props);
        }
      }
    }
    for (let i = 0; i < vChildren.length; i++) {
      // Update this.$ map of ids.
      const child = children[i] as HTMLElement | IoElement;
      if (vChildren[i].props.id) this.$[vChildren[i].props.id] = child;
      if (vChildren[i].children !== undefined) {
        if (typeof vChildren[i].children === 'string') {
          // Set textNode value.
          this.flattenTextNode(child as HTMLElement);
          (child as any)._textNode.nodeValue = String(vChildren[i].children);
        } else if (typeof vChildren[i].children === 'object') {
          // Traverse deeper.
          this.traverse(vChildren[i].children, child as HTMLElement);
        }
      }
    }
  }
  /**
   * Helper function to flatten textContent into a single TextNode.
   * Update textContent via TextNode is better for layout performance.
   * @param {HTMLElement} element - Element to flatten.
   */
  flattenTextNode(element: HTMLElement | IoElement) {
    if (element.childNodes.length === 0) {
      element.appendChild(document.createTextNode(''));
    }
    if (element.childNodes[0].nodeName !== '#text') {
      element.innerHTML = '';
      element.appendChild(document.createTextNode(''));
    }
    (element as any)._textNode = element.childNodes[0];
    if (element.childNodes.length > 1) {
      const textContent = element.textContent;
      for (let i = element.childNodes.length; i--;) {
        if (i !== 0) element.removeChild(element.childNodes[i]);
      }
      (element as any)._textNode.nodeValue = textContent;
    }
  }
  get textNode() {
    this.flattenTextNode(this);
    return this._textNode.nodeValue;
  }
  set textNode(value) {
    this.flattenTextNode(this);
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
   * Sets aria attributes.
   */
  applyAria() {
    if (this.label) {
      this.setAttribute('aria-label', this.label);
    } else {
      this.removeAttribute('aria-label');
    }
    if (this.disabled) {
      this.setAttribute('aria-disabled', true);
    } else {
      this.removeAttribute('aria-disabled');
    }
  }
  _onFocusTo(event: CustomEvent) {
    const src = event.composedPath()[0];
    const dir = event.detail.dir;
    const rect = event.detail.rect;
    rect.center = {x: rect.x + rect.width / 2, y: rect.y + rect.height / 2};

    if (src !== this as any) {
      let closest = src;
      let closestX = Infinity;
      let closestY = Infinity;

      // TODO: improve backtracking
      // const backtrack = focusBacktrack.get(src);
      // if (backtrack && backtrack[dir]) {
      //   backtrack[dir].focus();
      //   setBacktrack(backtrack[dir], dir, src);
      //   return;
      // }

      const siblings = this.querySelectorAll('[tabindex="0"]:not([disabled])');

      for (let i = siblings.length; i--;) {

        if (!siblings[i].offsetParent) {
          continue;
        }
        // TODO: unhack
        const sStyle = window.getComputedStyle(siblings[i]);
        if (sStyle.visibility !== 'visible') {
          continue;
        }

        const sRect = siblings[i].getBoundingClientRect();
        sRect.center = {x: sRect.x + sRect.width / 2, y: sRect.y + sRect.height / 2};

        // TODO: improve automatic direction routing.
        switch (dir) {
          case 'right': {
            if (sRect.left >= (rect.right - 1)) {
              const distX = Math.abs(sRect.left - rect.right);
              const distY = Math.abs(sRect.center.y - rect.center.y);
              if (distX < closestX || distY < closestY / 3) {
                closest = siblings[i];
                closestX = distX;
                closestY = distY;
              } else if (distX === closestX && distY < closestY) {
                closest = siblings[i];
                closestY = distY;
              }
            }
            break;
          }
          case 'left': {
            if (sRect.right <= (rect.left + 1)) {
              const distX = Math.abs(sRect.right - rect.left);
              const distY = Math.abs(sRect.center.y - rect.center.y);
              if (distX < closestX || distY < closestY / 3) {
                closest = siblings[i];
                closestX = distX;
                closestY = distY;
              } else if (distX === closestX && distY < closestY) {
                closest = siblings[i];
                closestY = distY;
              }
            }
            break;
          }
          case 'down': {
            if (sRect.top >= (rect.bottom - 1)) {
              const distX = Math.abs(sRect.center.x - rect.center.x);
              const distY = Math.abs(sRect.top - rect.bottom);
              if (distY < closestY || distX < closestX / 3) {
                closest = siblings[i];
                closestX = distX;
                closestY = distY;
              } else if (distY === closestY && distX < closestX) {
                closest = siblings[i];
                closestX = distX;
              }
            }
            break;
          }
          case 'up':{
            if (sRect.bottom <= (rect.top + 1)) {
              const distX = Math.abs(sRect.center.x - rect.center.x);
              const distY = Math.abs(sRect.bottom - rect.top);
              if (distY < closestY || distX < closestX / 3) {
                closest = siblings[i];
                closestX = distX;
                closestY = distY;
              } else if (distY === closestY && distX < closestX) {
                closest = siblings[i];
                closestX = distX;
              }
            }
            break;
          }
        }
      }

      if (closest !== src) {
        (closest as any).focus();
        // setBacktrack(closest, dir, src);
        event.stopPropagation();
      }
    }
  }
  focusTo(dir: string) {
    const rect = this.getBoundingClientRect();
    this.dispatchEvent('focus-to', {dir: dir, rect: rect}, true);
  }
}

// let focusBacktrack = new WeakMap();
// const backtrackDir = {'left': 'right', 'right': 'left', 'down': 'up', 'up': 'down'};
// function setBacktrack(element, dir, target) {
//   const backtrack = focusBacktrack.get(element) || {};
//   backtrack[backtrackDir[dir]] = target;
//   focusBacktrack.set(element, backtrack);
// }

const warning = document.createElement('div');
warning.innerHTML = 'No support for custom elements detected! <br />Sorry, modern browser is required to view this page.<br />';

// Global mixin record
const mixinRecord: Record<string, string> = {};

// Regular expressions for style string processing.
const commentsRegex =  new RegExp('(\\/\\*[\\s\\S]*?\\*\\/)', 'gi');
const keyframeRegex =  new RegExp('((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})', 'gi');
const mediaQueryRegex =  new RegExp('((@media [\\s\\S]*?){([\\s\\S]*?}\\s*?)})', 'gi');
const mixinRegex = new RegExp('((--[\\s\\S]*?): {([\\s\\S]*?)})', 'gi');
const applyRegex = new RegExp('(@apply\\s.*?;)', 'gi');
const cssRegex =  new RegExp('((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})', 'gi');


/**
 * Register function for `IoElement`. Registers custom element.
 * @param {IoElement} elementConstructor - Element class to register.
 */
const RegisterIoElement = function (elementConstructor: typeof IoElement) {
  RegisterIoNode(elementConstructor);

  const localName = elementConstructor.name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

  Object.defineProperty(elementConstructor, 'localName', {value: localName});
  Object.defineProperty(elementConstructor.prototype, 'localName', {value: localName});

  Object.defineProperty(elementConstructor, '_isIoElement', {enumerable: false, value: true});
  Object.defineProperty(elementConstructor.prototype, '_isIoElement', {enumerable: false, value: true});
  Object.defineProperty(window, elementConstructor.name, {value: elementConstructor});

  if (window.customElements !== undefined) {
    window.customElements.define(localName, elementConstructor as unknown as CustomElementConstructor);
  } else {
    document.body.insertBefore(warning, document.body.children[0]);
    return;
  }

    let mixinsString = '';
    const mixins = elementConstructor.prototype._protochain.style.match(mixinRegex);
    if (mixins) {
      for (let i = 0; i < mixins.length; i++) {
        const m = mixins[i].split(': {');
        const name = m[0];
        const value = m[1].replace(/}/g, '').trim().replace(/^ +/gm, '');
        mixinRecord[name] = value;
        mixinsString += mixins[i].replace('--', '.').replace(': {', ' {');
      }
    }

    // Remove mixins
    let styleString = elementConstructor.prototype._protochain.style.replace(mixinRegex, '');
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
};

const ro = new ResizeObserver((entries: any) => {
  for (const entry of entries) (entry.target as unknown as IoElement).onResized();
});

/**
 * Creates an element from a virtual dom object.
 * @param {Object} vDOMNode - Virtual dom object.
 * @param {string} vDOMNode.name - Element tag.
 * @param {Object} vDOMNode.props - Element properties.
 * @return {HTMLElement} - Created element.
 */
// TODO: vDOMNode type
const constructElement = function(vDOMNode: any) {
  // IoElement classes constructed with constructor.
  const ConstructorClass = window.customElements ? window.customElements.get(vDOMNode.name) : null;
  if (ConstructorClass && (ConstructorClass as any)._isIoElement) return new ConstructorClass(vDOMNode.props);

  // Other element classes constructed with document.createElement.
  const element = document.createElement(vDOMNode.name);
  applyNativeElementProps(element, vDOMNode.props);
  return element;
};

const superCreateElement = document.createElement;
// TODO: args type
document.createElement = function(...args: any[]) {
  const tag = args[0];
  if (tag.startsWith('io-')) {
    const constructor = customElements.get(tag);
    if (constructor) {
      return new constructor();
    } else {
      return superCreateElement.apply(this, args as any);
    }
  } else  {
    return superCreateElement.apply(this, args as any);
  }
};

/**
 * Sets element properties.
 * @param {HTMLElement} element - Element to set properties on.
 * @param {Object} props - Element properties.
 */
const applyNativeElementProps = function(element: HTMLElement, props: any) {
  for (const p in props) {
    const prop = props[p];
    if (p.startsWith('@')) {
      element.setAttribute(p.substr(1), prop);
    } else if (p === 'style') for (const s in prop) element.style.setProperty(s, prop[s]);
    else if (p === 'class') element['className'] = prop;
    else if (p !== 'id') (element as any)[p] = prop;
    if (p === 'name') element.setAttribute('name', prop); // TODO: Reconsider
  }
  if (!(element as any)._eventDispatcher) {
    // TODO: test
    Object.defineProperty(element, '_eventDispatcher', {value: new EventDispatcher(element as unknown as IoNode)});
    // TODO: disconnect on disposal?
  }
  (element as any)._eventDispatcher.applyPropListeners(props, element);
};

RegisterIoElement(IoElement);

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

const isString = (x: any) => typeof x === 'string';
const isArray = Array.isArray;
const isObject = (x: any) => typeof x === 'object' && !isArray(x);

const clense = (a: any, b: any) => !b ? a : isString(b[0]) ? [...a, b] : [...a, ...b];

export const buildTree = () => (node: any): any => !!node && isObject(node[1]) ? {
  ['name']: node[0],
  ['props']: node[1],
  ['children']: isArray(node[2]) ? node[2].reduce(clense, []).map(buildTree()) : node[2]
} : buildTree()([node[0], {}, node[1]]);

export {IoElement, RegisterIoElement};
