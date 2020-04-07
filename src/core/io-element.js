import {IoNodeMixin} from './io-node.js';
import {Listeners} from './listeners.js';
import {buildTree} from '../../lib/ijk.js';

/**
 * Core `IoElement` class.
 */
class IoElement extends IoNodeMixin(HTMLElement) {
  static get Style() {
    return /* css */`
    :host[hidden] {
      display: none;
    }
    :host[disabled] {
      pointer-events: none;
      opacity: 0.5;
    }
    `;
  }
  static get Properties() {
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
        reflect: true,
      },
    };
  }
  static get Listeners() {
    return {
      'focus-to': '_onFocusTo',
    };
  }
  static get observedAttributes() {
    const observed = [];
    for (let prop in this.prototype.__protoProperties) {
      const r  = this.prototype.__protoProperties[prop].reflect;
      if (r === -1 || r === 2) {
        observed.push(prop);
      }
    }
    return observed;
  }
  attributeChangedCallback(prop, oldValue, newValue) {
    const type = this.__properties[prop].type;
    if (type === Boolean) {
      if (newValue === null) this[prop] = false;
      else if (newValue === '') this[prop] = true;
    } else if (type === Number || type === String) {
      this[prop] = type(newValue);
    } else if (type === Object || type === Array) {
      this[prop] = JSON.parse(newValue);
    } else {
      this[prop] = isNaN(Number(newValue)) ? newValue : Number(newValue);
    }
  }
  /**
   * Add resize listener if `onResized()` is defined in subclass.
   */
  connectedCallback() {
    super.connectedCallback();
    if (typeof this.onResized === 'function') {
      if (ro) {
        ro.observe(this);
      } else {
        // TODO: remove once resize observer implemented in Safari.
        // https://caniuse.com/#feat=resizeobserver
        window.addEventListener('resize', this.onResized);
        setTimeout(() => { this.onResized(); });
      }
    }
  }
  /**
   * Removes resize listener if `onResized()` is defined in subclass.
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    if (typeof this.onResized === 'function') {
      if (ro) {
        ro.unobserve(this);
      } else {
        // TODO: remove once resize observer implemented in Safari.
        // https://caniuse.com/#feat=resizeobserver
        window.removeEventListener('resize', this.onResized);
      }
    }
  }
  /**
    * Renders DOM from virtual DOM arrays.
    * @param {Array} vDOM - Array of vDOM children.
    * @param {HTMLElement} [host] - Optional template target.
    */
  template(vDOM, host) {
    const vChildren = buildTree()(['root', vDOM]).children;
    host = host || this;
    if (host === this) this.__properties.$.value = {};
    this.traverse(vChildren, host);
  }
  /**
   * Recurively traverses vDOM.
   * @param {Array} vChildren - Array of vDOM children converted by `buildTree()` for easier parsing.
   * @param {HTMLElement} [host] - Optional template target.
    */
  traverse(vChildren, host) {
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
      if (children[i].localName !== vChildren[i].name) {
        const oldElement = children[i];
        const element = constructElement(vChildren[i]);
        host.insertBefore(element, oldElement);
        host.removeChild(oldElement);
        // TODO: enable and test!
        // const nodes = Array.from(oldElement.querySelectorAll('*'));
        // for (let i = nodes.length; i--;) if (nodes[i].dispose) nodes[i].dispose();
        // if (oldElement.dispose) oldElement.dispose();
      // update existing elements
      } else {
        children[i].removeAttribute('className');
        if (children[i].__isIoElement) {
          // Set IoElement element properties
          // TODO: Test property and listeners reset. Consider optimizing.
          children[i].setProperties(vChildren[i].props);
        } else {
          // Set native HTML element properties
          setNativeElementProps(children[i], vChildren[i].props);
        }
      }
    }
    for (let i = 0; i < vChildren.length; i++) {
      // Update this.$ map of ids.
      if (vChildren[i].props.id) this.$[vChildren[i].props.id] = children[i];
      if (vChildren[i].children !== undefined) {
        if (typeof vChildren[i].children === 'string') {
          // Set textNode value.
          if (!children[i].__isIoElement) {
            this.flattenTextNode(children[i]);
            children[i]._textNode.nodeValue = String(vChildren[i].children);
          } else {
            console.log(children[i], children[i].__isIoElement, vChildren[i]);
          }
        } else if (typeof vChildren[i].children === 'object') {
          // Traverse deeper.
          this.traverse(vChildren[i].children, children[i]);
        }
      }
    }
  }
  /**
   * Helper function to flatten textContent into a single TextNode.
   * Update textContent via TextNode is better for layout performance.
   * @param {HTMLElement} element - Element to flatten.
   */
  flattenTextNode(element) {
    if (element.childNodes.length === 0) {
      element.appendChild(document.createTextNode(''));
    }
    if (element.childNodes[0].nodeName !== '#text') {
      element.innerHTML = '';
      element.appendChild(document.createTextNode(''));
    }
    element._textNode = element.childNodes[0];
    if (element.childNodes.length > 1) {
      const textContent = element.textContent;
      for (let i = element.childNodes.length; i--;) {
        if (i !== 0) element.removeChild(element.childNodes[i]);
      }
      element._textNode.nodeValue = textContent;
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
  setProperties(props) {
    super.setProperties(props);
    if (props['style']) {
      for (let s in props['style']) {
        this.style[s] = props['style'][s];
      }
    }
  }
  /**
   * Alias for HTMLElement setAttribute where falsey values remove the attribute.
   * @param {string} attr - Attribute name.
   * @param {*} value - Attribute value.
   */
  setAttribute(attr, value) {
    if (value === true) {
      HTMLElement.prototype.setAttribute.call(this, attr, '');
    } else if (value === false || value === '') {
      this.removeAttribute(attr);
    } else if (typeof value === 'string' || typeof value === 'number') {
      if (this.getAttribute(attr) !== String(value)) HTMLElement.prototype.setAttribute.call(this, attr, value);
    }
  }
  /**
   * Sets aria attributes.
   */
  setAria() {
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
  _onFocusTo(event) {
    const src = event.composedPath()[0];
    const dir = event.detail.dir;
    const rect = event.detail.rect;
    rect.center = {x: rect.x + rect.width / 2, y: rect.y + rect.height / 2};

    if (src !== this) {
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
        closest.focus();
        // setBacktrack(closest, dir, src);
        event.stopPropagation();
      }
    }
  }
  focusTo(dir) {
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
warning.innerHTML = `
No support for custom elements detected! <br />
Sorry, modern browser is required to view this page.<br />
Please try <a href="https://www.mozilla.org/en-US/firefox/new/">Firefox</a>,
<a href="https://www.google.com/chrome/">Chrome</a> or
<a href="https://www.apple.com/lae/safari/">Safari</a>`;

/**
 * Register function for `IoElement`. Registers custom element.
 */
IoElement.Register = function() {
  IoNodeMixin.Register.call(this);
  
  const localName = this.name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

  Object.defineProperty(this, 'localName', {value: localName});
  Object.defineProperty(this.prototype, 'localName', {value: localName});

  Object.defineProperty(this, '__isIoElement', {value: true});
  Object.defineProperty(this.prototype, '__isIoElement', {value: true});

  if (window.customElements !== undefined) {
    window.customElements.define(localName, this);
  } else {
    document.body.insertBefore(warning, document.body.children[0]);
    return;
  }

  _initProtoStyle(this.prototype.__protochain);
};

let ro;
if (window.ResizeObserver !== undefined) {
  ro = new ResizeObserver(entries => {
    for (let entry of entries) entry.target.onResized();
  });
}

/**
 * Creates an element from a virtual dom object.
 * @param {Object} vDOMNode - Virtual dom object.
 * @param {string} vDOMNode.name - Element tag.
 * @param {Object} vDOMNode.props - Element properties.
 * @return {HTMLElement} - Created element.
 */
const constructElement = function(vDOMNode) {
  // IoElement classes constructed with constructor.
  const ConstructorClass = window.customElements ? window.customElements.get(vDOMNode.name) : null;
  if (ConstructorClass && ConstructorClass.__isIoElement) return new ConstructorClass(vDOMNode.props);

  // Other element classes constructed with document.createElement.
  const element = document.createElement(vDOMNode.name);
  setNativeElementProps(element, vDOMNode.props);
  return element;
};

const superCreateElement = document.createElement;
document.createElement = function() {
  const tag = arguments[0];
  if (tag.startsWith('io-')) {
    const constructor = customElements.get(tag);
    if (constructor) {
      return new constructor();
    } else {
      return superCreateElement.apply(this, arguments);
    }
  } else  {
    return superCreateElement.apply(this, arguments);
  }
};

/**
 * Sets element properties.
 * @param {HTMLElement} element - Element to set properties on.
 * @param {Object} props - Element properties.
 */
const setNativeElementProps = function(element, props) {
  for (let p in props) {
    const prop = props[p];
    if (p.startsWith('@')) {
      element.setAttribute(p.substr(1), prop);
    } else if (p === 'style') for (let s in prop) element.style.setProperty(s, prop[s]);
    else if (p === 'class') element['className'] = prop;
    else if (p !== 'id') element[p] = prop;
    if (p === 'name') element.setAttribute('name', prop); // TODO: Reconsider
  }
  if (!element.__listeners) {
    Object.defineProperty(element, '__listeners', {value: new Listeners(element)});
    element.__listeners.connect();
  }
  element.__listeners.setPropListeners(props, element);
};

const mixinDB = {};

const commentsRegex =  new RegExp('(\\/\\*[\\s\\S]*?\\*\\/)', 'gi');
const keyframeRegex =  new RegExp('((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})', 'gi');
const mediaQueryRegex =  new RegExp('((@media [\\s\\S]*?){([\\s\\S]*?}\\s*?)})', 'gi');
const mixinRegex = new RegExp('((--[\\s\\S]*?): {([\\s\\S]*?)})', 'gi');
const applyRegex = new RegExp('(@apply\\s.*?;)', 'gi');
const cssRegex =  new RegExp('((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})', 'gi');

// Creates a `<style>` element for all `static get Style()` return strings.
function _initProtoStyle(prototypes) {
  const localName = prototypes[0].constructor.name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  const styleID = 'io-style-' + localName.replace('io-', '');

  let finalStyleString = '';

  // Convert mixins to classes
  let styleString = prototypes[0].constructor.Style;

  if (styleString) {
    const mixins = styleString.match(mixinRegex);
    if (mixins) {
      for (let i = 0; i < mixins.length; i++) {
        const m = mixins[i].split(': {');
        const name = m[0];
        const value = m[1].replace(/}/g, '').trim().replace(/^ +/gm, '');
        mixinDB[name] = value;
        finalStyleString += mixins[i].replace('--', '.').replace(': {', ' {');
      }
    }

    for (let i = prototypes.length; i--;) {
      let styleString = prototypes[i].constructor.Style;
      if (styleString) {
        // Remove mixins
        styleString = styleString.replace(mixinRegex, '');

        // Apply mixins
        const apply = styleString.match(applyRegex);
        if (apply) {
          for (let i = 0; i < apply.length; i++) {
            const name = apply[i].split('@apply ')[1].replace(';', '');
            if (mixinDB[name]) {
              styleString = styleString.replace(apply[i], mixinDB[name]);
            } else {
              console.warn('IoElement: cound not find mixin:', name);
            }
          }
        }

        // Check selector validity (:host prefix)
        {
          let styleStringStripped = styleString;

          // Remove comments
          styleStringStripped = styleStringStripped.replace(commentsRegex, '');

          // Remove keyframes
          styleStringStripped = styleStringStripped.replace(keyframeRegex, '');

          // Remove media queries
          styleStringStripped = styleStringStripped.replace(mediaQueryRegex, '');

          const match = styleStringStripped.match(cssRegex);
          if (match) {
            match.map(selector => {
              selector = selector.trim();
              if (!selector.startsWith(':host')) {
                console.warn(localName + ': CSS Selector not prefixed with ":host"! This will cause style leakage!');
                console.warn(selector);
              }
            });
          }
        }

        // Replace `:host` with element tag.
        finalStyleString += styleString.replace(new RegExp(':host', 'g'), localName);
      }
    }
  }

  if (finalStyleString) {
    const element = document.createElement('style');
    element.innerHTML = finalStyleString;
    element.setAttribute('id', styleID);
    document.head.appendChild(element);
  }
}

export { IoElement };
