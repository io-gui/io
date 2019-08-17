import {IoNodeMixin} from "./node.js";
import {Listeners} from "./listeners.js";
import {buildTree} from "../../lib/ijk.js";

export class IoElement extends IoNodeMixin(HTMLElement) {
  static get Attributes() {
    return {
      tabindex: String,
      contenteditable: Boolean,
      class: String,
      role: String,
      label: String,
      id: String,
    };
  }
  static get observedAttributes() {
    const observed = [];
    for (let prop in this.prototype.__protoProperties) {
      if (this.prototype.__protoProperties[prop].reflect === -1) {
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
    if (host === this) this.__properties.$.value = {};
    this.traverse(vChildren, host || this);
  }
  /**
    * Recurively traverses vDOM.
    * @param {Array} vChildren - Array of vDOM children converted by `buildTree()` for easier parsing.
    * @param {HTMLElement} [host] - Optional template target.
    */
  traverse(vChildren, host) {
    const children = host.children;
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
        frag.appendChild(constructElement(vChildren[i]));
      }
      host.appendChild(frag);
    }
    // replace existing elements
    for (let i = 0; i < children.length; i++) {
      if (children[i].localName !== vChildren[i].name) {
        const oldElement = children[i];
        host.insertBefore(constructElement(vChildren[i]), oldElement);
        host.removeChild(oldElement);
        // TODO: enable and test!
        // const nodes = Array.from(oldElement.querySelectorAll('*'));
        // for (let i = nodes.length; i--;) if (nodes[i].dispose) nodes[i].dispose();
        // if (oldElement.dispose) oldElement.dispose();
      // update existing elements
      } else {
        children[i].removeAttribute('className');
        if (Object.prototype.hasOwnProperty.call(children[i], '__properties')) {
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
      if (vChildren[i].children) {
        if (typeof vChildren[i].children === 'string') {
          // Set textNode value.
          this.flattenTextNode(children[i]);
          children[i]._textNode.nodeValue = String(vChildren[i].children);
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
      element.appendChild(document.createTextNode(""));
    }
    if (element.childNodes[0].nodeName !== "#text") {
      element.innerHTML = '';
      element.appendChild(document.createTextNode(""));
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
  focusTo(dir, srcRect) {
    const rect = srcRect || this.getBoundingClientRect();
    rect.center = {x: rect.x + rect.width / 2, y: rect.y + rect.height / 2};
    let closest = this;
    let closestDist = Infinity;
    let parent = this.parentElement;
    let depth = 0;
    const DEPTH_LIMIT = 10;

    const backtrack = focusBacktrack.get(this);
    if (backtrack && backtrack[dir]) {
      backtrack[dir].focus();
      setBacktrack(backtrack[dir], dir, this);
      return;
    }

    while (parent && depth < DEPTH_LIMIT && closest === this) {
      const siblings = parent.querySelectorAll('[tabindex="0"]');
      for (let i = siblings.length; i--;) {

        if (!siblings[i].offsetParent) continue;
        const sRect = siblings[i].getBoundingClientRect();
        sRect.center = {x: sRect.x + sRect.width / 2, y: sRect.y + sRect.height / 2};

        const dX = sRect.center.x - rect.center.x;
        const dY = sRect.center.y - rect.center.y;

        const isRight = sRect.right > rect.right + 1;
        const isLeft = sRect.left < rect.left - 1;
        const isDown = sRect.center.y > rect.center.y + 1;
        const isUp = sRect.center.y < rect.center.y - 1;

        const distY = Math.sqrt(0.2 * dX * dX + dY * dY);
        const distX = Math.sqrt(dX * dX + 0.2 * dY * dY);

        // TODO: improve automatic direction routing.
        switch (dir) {
          case 'right':
            if (dX > 0 && distX < closestDist && isRight) {
              closest = siblings[i], closestDist = distX;
            }
            break;
          case 'left':
            if (dX < 0 && distX < closestDist && isLeft) {
              closest = siblings[i], closestDist = distX;
            }
            break;
          case 'down':
            if (dY > 0 && distY < closestDist && isDown) {
              closest = siblings[i], closestDist = distY;
            }
            break;
          case 'up':
            if (dY < 0 && distY < closestDist && isUp) {
              closest = siblings[i], closestDist = distY;
            }
            break;
        }
      }
      parent = parent.parentElement;
      depth++;
      if (closest !== this) {
        closest.focus();
        setBacktrack(closest, dir, this);
        return;
      }
    }
  }
}

const focusBacktrack = new WeakMap();
const backtrackDir = {'left': 'right', 'right': 'left', 'down': 'up', 'up': 'down'};
function setBacktrack(element, dir, target) {
  const backtrack = focusBacktrack.get(element) || {};
  backtrack[backtrackDir[dir]] = target;
  focusBacktrack.set(element, backtrack);
}

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
  IoElement.isIoElement = true;

  const localName = this.name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

  Object.defineProperty(this, 'localName', {value: localName});
  Object.defineProperty(this.prototype, 'localName', {value: localName});

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
 * Template literal handler for CSS code in HTML.
 * @param {Array} parts - Template literal array argument.
 * @return {string} - Created HTML code.
 */
export function html(parts) {
  let result = '';
  for (let i = 0; i < parts.length; i++) {
    result += parts[i] + (arguments[i + 1] || '');
  }
  result = result.replace(new RegExp('<style>', 'g'), '');
  result = result.replace(new RegExp('</style>', 'g'), '');
  return result;
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
  if (ConstructorClass && ConstructorClass.isIoElement) return new ConstructorClass(vDOMNode.props);

  // Other element classes constructed with document.createElement.
  const element = document.createElement(vDOMNode.name);
  setNativeElementProps(element, vDOMNode.props);
  return element;
};

/**
 * Sets element properties.
 * @param {HTMLElement} element - Element to set properties on.
 * @param {Object} props - Element properties.
 */
const setNativeElementProps = function(element, props) {
  for (let p in props) {
    const prop = props[p];
    if (p === 'style') for (let s in prop) element.style.setProperty(s, prop[s]);
    else if (p === 'class') element['className'] = prop;
    else element[p] = prop;
    if (p === 'name') element.setAttribute('name', prop); // TODO: Reconsider
  }
  if (!element.__listeners) {
    Object.defineProperty(element, '__listeners', {value: new Listeners(element)});
    element.__listeners.connect();
  }
  element.__listeners.setPropListeners(props, element);
};

// Creates a `<style>` element for all `static get Style()` return strings.
function _initProtoStyle(prototypes) {
  const localName = prototypes[0].constructor.name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  for (let i = prototypes.length; i--;) {
    let styleString = prototypes[i].constructor.Style;
    const classLocalName = prototypes[i].constructor.name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    if (styleString) {
      // TODO: Do proper CSS parsing.
      const match = styleString.match(new RegExp(/([^,{}]+)(,(?=[^}]*{)|\s*{)/, 'g'));
      match.map(selector => {
        selector = selector.trim();
        if (!selector.startsWith('@') &&
            !selector.startsWith(':host') &&
            !selector.startsWith('from') &&
            !selector.startsWith('to') &&
            !selector.startsWith('/*') &&
            !selector.startsWith('body')) {
          console.warn(localName + ': CSS Selector not prefixed with ":host"! This will cause style leakage!');
        }
      });
      // Replace `:host` with element tag.
      styleString = styleString.replace(new RegExp(':host', 'g'), localName);
      const element = document.createElement('style');
      element.innerHTML = styleString;
      element.setAttribute('id', 'io-style_' + localName + (classLocalName !== localName ? ('_' + classLocalName) : ''));
      document.head.appendChild(element);
    }
  }
}
