import {ProtoAttributes, Attributes} from "./attributes.js";
import {IoNodeMixin} from "./node.js";
import {Listeners} from "./listeners.js";

// TODO: Improve tests.
/**
  * Base class for custom elements.
  * `IoNodeMixin` applied to `HTMLElement` and a few custom functions.
  */
export class IoElement extends IoNodeMixin(HTMLElement) {
  /**
   * See IoNode for more details.
   * @return {Object} properties - Properties configuration objects.
   */
  static get properties() {
    return {
      id: {
        type: String,
        enumerable: false,
      },
      tabindex: {
        type: String,
        reflect: true,
        enumerable: false,
      },
      contenteditable: {
        type: Boolean,
        reflect: true,
        enumerable: false,
      },
      label: {
        type: String,
        reflect: true,
        enumerable: false,
      },
      title: {
        type: String,
        reflect: true,
        enumerable: false,
      },
      role: {
        type: String,
        reflect: true,
        enumerable: false,
      },
      class: {
        type: String,
        reflect: true,
        enumerable: false,
      },
      $: {
        type: Object,
      },
    };
  }
  constructor(props) {
    super(props);
    Object.defineProperty(this, '__attributes', {value: new Attributes(this, this.__protoAttributes)});
  }
  static get observedAttributes() {
    const observed = [];
    for (let prop in this.prototype.__protoProperties) {
      if (this.prototype.__protoProperties[prop].observe) observed.push(prop);
    }
    for (let prop in this.prototype.__protoAttributes) {
      if (this.prototype.__protoAttributes[prop].observe) observed.push(prop);
    }
    return observed;
  }
  attributeChangedCallback(prop, oldValue, newValue) {
    const config = this.__attributes[prop] || this.__properties[prop];
    const type = config.type;
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
  // TODO: performance check and optimize
  titleChanged() {
    this.setAttribute('aria-label', this.title || this.label);
  }
  labelChanged() {
    this.setAttribute('aria-label', this.title || this.label);
  }
  /**
    * Callback when `IoElement` is connected.
    * Resize listener is added here if element class has `resized()` function defined.
    */
  connectedCallback() {
    super.connectedCallback();
    for (let prop in this.__properties) {
      if (this.__properties[prop].reflect) {
        this.setAttribute(prop, this.__properties[prop].value);
      }
      // TODO: test
      if (this.__properties[prop].binding) {
        this[prop] = this.__properties[prop].binding.value;
      }
    }
    if (typeof this.resized == 'function') {
      this.resized();
      if (ro) {
        ro.observe(this);
      } else {
        window.addEventListener('resize', this.resized);
      }
    }
  }
  /**
    * Callback when `IoElement` is connected.
    */
  disconnectedCallback() {
    super.disconnectedCallback();
    if (typeof this.resized == 'function') {
      if (ro) {
        ro.unobserve(this);
      } else {
        window.removeEventListener('resize', this.resized);
      }
    }
  }
  /**
    * Disposes all internals.
    * Use this when node is no longer needed.
    */
  dispose() {
    super.dispose();
    delete this.parent;
    this.children.lenght = 0;
    // this.__properties.$.value = {};
  }
  /**
    * Renders DOM from virtual DOM arrays.
    * @param {Array} children - Array of vDOM children.
    * @param {HTMLElement} [host] - Optional template target.
    */
  template(children, host) {
    // this.__properties.$.value = {};
    this.traverse(buildTree()(['root', children]).children, host || this);
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
      let nodes = Array.from(child.querySelectorAll('*'));
      for (let i = nodes.length; i--;) {
        // if (nodes[i].dispose) nodes[i].dispose(); // TODO: re-enable after fixing #2
      }
      // if (child.dispose) child.dispose(); // TODO: re-enable after fixing #2
      // TODO: not sure why dispose needs to be called ahead of remove children
      // Otherwise some bindings get disconnected.
      // https://github.com/arodic/io/issues/1
      host.removeChild(child);
    }
    // create new elements after existing
    if (children.length < vChildren.length) {
      const frag = document.createDocumentFragment();
      for (let i = children.length; i < vChildren.length; i++) {
        frag.appendChild(constructElement(vChildren[i]));
      }
      host.appendChild(frag);
    }

    for (let i = 0; i < children.length; i++) {
      // replace existing elements
      if (children[i].localName !== vChildren[i].name) {
        const oldElement = children[i];
        host.insertBefore(constructElement(vChildren[i]), oldElement);
        let nodes = Array.from(oldElement.querySelectorAll('*'));
        host.removeChild(oldElement);
        for (let i = nodes.length; i--;) {
          // if (nodes[i].dispose) nodes[i].dispose(); // TODO: re-enable after fixing #2
        }
        // if (oldElement.dispose) oldElement.dispose(); // TODO: re-enable after fixing #2

      // update existing elements
      } else {
        // children[i].className = ''; // TODO: test
        children[i].removeAttribute('className');
        // Io Elements
        if (children[i].hasOwnProperty('__properties')) {
          // WARNING TODO: Better property and listeners reset.
          // WARNING TODO: Test property and listeners reset.
          children[i].setProperties(vChildren[i].props);
          // TODO: Test and remove. Redundant with setProperties().
          // children[i].queueDispatch();
          children[i].__listeners.setPropListeners(vChildren[i].props, children[i]);
          children[i].__listeners.connect();
        // Native HTML Elements
        } else {
          for (let prop in vChildren[i].props) {
            if (prop === 'style') {
              for (let s in vChildren[i].props['style']) {
                // children[i].style[s] = vChildren[i].props[prop][s];
                children[i].style.setProperty(s, vChildren[i].props[prop][s]);
              }
            } else if (prop === 'id') {
              // Skipping. Id's are used for $ in io.
            } else if (prop === 'class') {
              children[i]['className'] = vChildren[i].props[prop];
            } else {
              children[i][prop] = vChildren[i].props[prop];
            }
          }
          // TODO: Refactor for native elements.
          children[i].__listeners.setPropListeners(vChildren[i].props, children[i]);
          children[i].__listeners.connect();
          ///
        }
      }
    }
    for (let i = 0; i < vChildren.length; i++) {
      if (vChildren[i].props.id) {
        this.$[vChildren[i].props.id] = children[i];
      }
      if (vChildren[i].children && typeof vChildren[i].children === 'string') {
        children[i].innerText = vChildren[i].children;
      } else if (vChildren[i].children && typeof vChildren[i].children === 'object') {
        this.traverse(vChildren[i].children, children[i]);
      }
    }
  }
  // fixup for HTMLElement setAttribute
  setAttribute(attr, value) {
    if (value === true) {
      HTMLElement.prototype.setAttribute.call(this, attr, '');
    } else if (value === false || value === '') {
      this.removeAttribute(attr);
    } else if (typeof value == 'string' || typeof value == 'number') {
      if (this.getAttribute(attr) !== String(value)) HTMLElement.prototype.setAttribute.call(this, attr, value);
    }
  }
  focusTo(dir, srcRect) {
    const rect = srcRect || this.getBoundingClientRect();
    let closest = this;
    let closestDist = Infinity;
    let parent = this.parentElement;
    let depth = 0;
    const DEPTH_LIMIT = 10;
    while (parent && depth < DEPTH_LIMIT && closest === this) {
      const siblings = parent.querySelectorAll('[tabindex="0"]');
      for (let i = siblings.length; i--;) {
        // TODO: consider looking up center or bbox instead tor-left corner
        if (!siblings[i].offsetParent) continue;
        const sRect = siblings[i].getBoundingClientRect();
        const dX = sRect.x - rect.x;
        const dY = sRect.y - rect.y;
        const dist = Math.sqrt(dX * dX + dY * dY);
        switch (dir) {
          case 'right':
            if (dX > 0 && dist < closestDist) {
              closest = siblings[i], closestDist = dist;
            }
            break;
          case 'left':
            if (dX < 0 && dist < closestDist) {
              closest = siblings[i], closestDist = dist;
            }
            break;
          case 'down':
            if (dY > 0 && dist < closestDist) {
              closest = siblings[i], closestDist = dist;
            }
            break;
          case 'up':
            if (dY < 0 && dist < closestDist) {
              closest = siblings[i], closestDist = dist;
            }
            break;
        }
      }
      parent = parent.parentElement;
      depth++;
      if (closest !== this) {
        closest.focus();
        return;
      }
    }
  }
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

  const localName = this.name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

  Object.defineProperty(this, 'localName', {value: localName});
  Object.defineProperty(this.prototype, 'localName', {value: localName});

  if (window.customElements !== undefined) {
    window.customElements.define(localName, this);
  } else {
    document.body.insertBefore(warning, document.body.children[0]);
    return;
  }

  initStyle(this.prototype.__protochain);

  Object.defineProperty(this.prototype, '__protoAttributes', {value: new ProtoAttributes(this.prototype.__protochain)});

  for (let prop in this.prototype.__protoAttributes) {
    Object.defineProperty(this.prototype, prop, {
      get: function() {
        return this.__attributes.get(prop);
      },
      set: function(value) {
        this.__attributes.set(prop);
      },
      enumerable: true,
      configurable: true,
    });
  }
};

let ro;
if (window.ResizeObserver !== undefined) {
  ro = new ResizeObserver(entries => {
    for (let entry of entries) entry.target.resized();
  });
}

// TODO: refactor and make more powerful.
/**
  * Template literal handler for HTML strings.
  * @param {Array} parts - Template literal array argument.
  * @return {string} - Created HTML code.
  */
export function html(parts) {
  let result = {
    string: '',
    vars: {},
  };
  for (let i = 0; i < parts.length; i++) {
    result.string += parts[i] + (arguments[i + 1] || '');
  }
  let vars = result.string.match(/-{2}?([a-z][a-z0-9]*)\b[^;]*;?/gi);
  if (vars) {
    for (let i = 0; i < vars.length; i++) {
      let v = vars[i].split(':');
      if (v.length === 2) {
        result.vars[v[0].trim()] = v[1].trim();
      }
    }
  }
  return result;
}

/**
  * Creates an element from virtual dom array.
  * @param {Array} vDOMNode - Virtual dom array.
  * @return {HTMLElement} - Created element.
  */
const constructElement = function(vDOMNode) {
 let ConstructorClass = window.customElements ? window.customElements.get(vDOMNode.name) : null;
 if (ConstructorClass) return new ConstructorClass(vDOMNode.props);

 let element = document.createElement(vDOMNode.name);
 for (let prop in vDOMNode.props) {
   if (prop === 'style') {
     for (let s in vDOMNode.props[prop]) {
       element.style[s] = vDOMNode.props[prop][s];
     }
   } else if (prop === 'id') {
     // Skipping. Id's are used for $ in io.
   } else if (prop === 'class') {
     element['className'] = vDOMNode.props[prop];
   } else element[prop] = vDOMNode.props[prop];
   if (prop === 'name') element.setAttribute('name', vDOMNode.props[prop]); // TODO: Reconsider
 }
 // TODO: Refactor for native elements
 Object.defineProperty(element, '__listeners', {value: new Listeners(element)});
 element.__listeners.setPropListeners(vDOMNode.props, element);
 element.__listeners.connect();

 return element;
};

// https://github.com/lukejacksonn/ijk
const clense = (a, b) => !b ? a : typeof b[0] === 'string' ? [...a, b] : [...a, ...b];
const buildTree = () => node => !!node && typeof node[1] === 'object' && !Array.isArray(node[1]) ? {
   ['name']: node[0],
   ['props']: node[1],
   ['children']: Array.isArray(node[2]) ? node[2].reduce(clense, []).map(buildTree()) : node[2] || ''
 } : buildTree()([node[0], {}, node[1] || '']);

/**
  * Initializes the element style.
  * @param {Array} prototypes - An array of prototypes to ge the styles from.
  */
function initStyle(prototypes) {
  const localName = prototypes[0].constructor.name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  for (let i = prototypes.length; i--;) {
    const style = prototypes[i].constructor.style;
    const classLocalName = prototypes[i].constructor.name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    if (style) {
      style.string = style.string.replace(new RegExp('<style>', 'g'), '');
      style.string = style.string.replace(new RegExp('</style>', 'g'), '');
      const match = style.string.match(new RegExp(/([^,{}]+)(,(?=[^}]*{)|\s*{)/, 'g'));
      match.map(selector => {
        selector = selector.trim();
        if (!selector.startsWith('@') &&
            !selector.startsWith(':host') &&
            !selector.startsWith('/*') &&
            !selector.startsWith('body')) {
          console.warn(localName + ': CSS Selector not prefixed with ":host"! This will cause style leakage!');
        }
      });
      style.string = style.string.replace(new RegExp(':host', 'g'), localName);
      const element = document.createElement('style');
      element.innerHTML = style.string;
      element.setAttribute('id', 'io-style_' + localName + (classLocalName !== localName ? ('_' + classLocalName) : ''));
      document.head.appendChild(element);
    }
  }
}
