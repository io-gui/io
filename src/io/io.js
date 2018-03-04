import {Binding, IoBindingMixin} from "./iobinding.js";
import {IoPropertyMixin} from "./ioproperty.js";
import {IoPointerMixin} from "./iopointer.js";

export {IoPropertyMixin, IoPointerMixin};

export function html() { return arguments[0][0]; }

export class Io extends IoBindingMixin(HTMLElement) {
  static get style() { return html``; }
  static get definedProperties() {
    let config = {
      properties: {},
      attributes: {},
      listeners: {},
    };
    let proto = this;
    while (proto) {
      let prop = proto.properties;
      for (let key in prop) {
        if (key === 'listeners') {
          for (let listener in prop[key]) {
            config.listeners[listener] = config.listeners[listener] || [];
            config.listeners[listener].push(prop[key][listener]);
          }
        } else if (key === 'attributes') {
          for (let att in prop[key]) config.attributes[att] = prop[key][att];
        } else {
          if (prop[key].value === undefined) {
            if (prop[key].type === Boolean) prop[key].value = false;
            if (prop[key].type === Number) prop[key].value = 0;
            if (prop[key].type === String) prop[key].value = '';
          }
          prop[key].notify = prop[key].notify || false;
          prop[key].bubbles = prop[key].bubbles || false;
          config.properties[key] = Object.assign(prop[key], config.properties[key] || {});
        }
      }
      proto = proto.__proto__;
    }
    return config;
  }
  static get definedHandlers() {
    let handlers = [];
    let proto = this.prototype;
    while (proto) {
      let names = Object.getOwnPropertyNames(proto);
      for (let i = 0; i < names.length; i++) {
        if (names[i].substring(names[i].length-7, names[i].length) === 'Handler') {
          handlers.push(names[i]);
        }
      }
      proto = proto.__proto__;
    }
    return handlers;
  }
  constructor(props = {}) {
    super();
    initStyle(this.localName, this.__proto__.constructor.style);
    let definedProperties = this.__proto__.constructor.definedProperties;
    Object.defineProperty(this, '__properties', { value: definedProperties.properties });
    Object.defineProperty(this, '__attributes', { value: definedProperties.attributes });
    Object.defineProperty(this, '__listeners', { value: definedProperties.listeners });
    Object.defineProperty(this, '__handlers', { value: this.__proto__.constructor.definedHandlers });
    Object.defineProperty(this, '__bindings', { value: {} });

    for (let prop in this.__properties) {
      if (props[prop] instanceof Binding) {
        let binding = props[prop];
        this.__properties[prop].value = binding.source[binding.sourceProp];
        binding.setTarget(this, prop);
        binding.bind();
      } else if (props[prop] !== undefined) {
        this.__properties[prop].value = props[prop];
      }
      this.defineProperty(prop, this.__properties[prop]);
      this.reflectAttribute(prop, this.__properties[prop]);
    }

    for (let att in this.__attributes) {
      this.setAttribute(att, this.__attributes[att]);
    }

    for (let i = 0; i < this.__handlers.length; i++) {
      this[this.__handlers[i]] = this[this.__handlers[i]].bind(this);
    }
  }
  connectedCallback() {
    for (let e in this.__listeners) {
      for (let l = 0; l < this.__listeners[e].length; l++) {
        if (typeof this.__listeners[e][l] === 'string')
        this.__listeners[e][l] = this[this.__listeners[e][l]];
        this.addEventListener(e, this.__listeners[e][l]);
      }
    }
    // TODO: handle redundant updates
    this.update();
  }
  disconnectedCallback() {
    for (let e in this.__listeners) {
      for (let l = 0; l < this.__listeners[e].length; l++) {
        this.removeEventListener(e, this.__listeners[e][l]);
      }
    }
  }
  defineProperty(key, config) {
    Object.defineProperty(this, key, {
      get: function() {
        return config.value;
      },
      set: function(value) {
        if (config.value === value) return;
        let oldValue = config.value;
        config.value = value;
        this.reflectAttribute(key, config);
        if (config.observer) {
          this[config.observer](value, oldValue, key);
        }
        if (config.notify) {
          this.fire(key + '-changed', {value: value, oldValue: oldValue}, config.bubbles);
        }
      },
      enumerable: true,
      configurable: true
    });
  }
  reflectAttribute(key, config) {
    if (config.reflectToAttribute) {
      if (config.value === true) {
        this.setAttribute(key, '');
      } else if (config.value === false || config.value === '') {
        this.removeAttribute(key);
      } else if (typeof config.value == 'string' || typeof config.value == 'number') {
        this.setAttribute(key, config.value);
      }
    }
  }
  render(children, host) {
    this.traverse(buildVDOM()(['root', children]).children, host || this);
  }
  traverse(vChildren, host) {
    let children = host.children;

    // remove trailing elements
    while (children.length > vChildren.length) host.removeChild(children[children.length - 1]);

    // create new elements
    let frag = document.createDocumentFragment();
    for (let i = children.length; i < vChildren.length; i++) {
      frag.appendChild(_renderElement(vChildren[i]));
    }
    host.appendChild(frag);

    // update existing elements
    for (let i = 0; i < children.length; i++) {

      let element;
      let oldElement;
      let observers = [];
      let reflections = [];

      if (children[i].localName === vChildren[i].name) {

        element = children[i];

        for (let prop in vChildren[i].props) {

          if (vChildren[i].props[prop] !== element[prop]) {

            if (prop === 'style' || prop === 'listeners' || prop === 'class') continue;

            let value = vChildren[i].props[prop];

            // TODO: remove  garbage / lingering bindings
            if (value instanceof Binding) {
              let binding = value;
              value = binding.source[binding.sourceProp];
              binding.setTarget(element, prop);
              binding.bind();
            }

            // avoid triggering observers prematurely when re-rendering elements with different props.
            if (element.__properties && element.__properties.hasOwnProperty(prop)) {
              let oldValue = element.__properties[prop].value;
              element.__properties[prop].value = value;
              // TODO: make less ugly
              if (element.__properties[prop].reflectToAttribute && reflections.indexOf(prop) === -1) {
                reflections.push(prop);
              }
              if (element.__properties[prop].observer && observers.indexOf(element.__properties[prop].observer) === -1) {
                if (value !== oldValue) {
                  observers.push(element.__properties[prop].observer);
                }
              }
            } else {
              element[prop] = value;
            }
          }
        }

        // triggering observers
        for (var j = 0; j < observers.length; j++) {
          element[observers[j]]();
        }
        // triggering reflections
        for (var j = 0; j < reflections.length; j++) {
          element.reflectAttribute(reflections[j], element.__properties[reflections[j]]);
        }

      } else {

        oldElement = children[i];
        host.insertBefore(_renderElement(vChildren[i]), oldElement);
        host.removeChild(oldElement);

      }

    }

    for (let i = 0; i < children.length; i++) {

      let element = children[i];

      for (let prop in vChildren[i].props) {
        if (prop == 'listeners') {
          for (let l in vChildren[i].props[prop]) {
            if (typeof vChildren[i].props[prop][l] === 'function') {
              // TODO: remove  garbage / lingering listeners
              // TODO: check for conflicts / existing listeners
              element.__listeners[l] = element.__listeners[l] || [];
              element.__listeners[l].push(vChildren[i].props[prop][l]);
              element.addEventListener(l, vChildren[i].props[prop][l]);
            }
          }
        } else if (prop == 'style') {
          for (let s in vChildren[i].props[prop]) {
            element.style[s] = vChildren[i].props[prop][s];
          }
        } else if (prop == 'class') {
          // TODO: ugh
          element.className = vChildren[i].props[prop];
        }
      }

      if (vChildren[i].children && typeof vChildren[i].children === 'string') {
        element.innerHTML = vChildren[i].children;
      } else if (vChildren[i].children && typeof vChildren[i].children === 'object') {
        // TODO: test extensively
        this.traverse(vChildren[i].children, element);
      }
    }
  }
  update() {}
  set(prop, value) {
    let oldValue = this[prop];
    this[prop] = value;
    this.fire(prop + '-set', {value: value, oldValue: oldValue}, false);
  }
  fire(eventName, detail, bubbles = true) {
    this.dispatchEvent(new CustomEvent(eventName, {
      detail: detail,
      bubbles: bubbles,
      composed: true
    }));
  }
}

const _renderElement = function(vDOMNode) {
  let ConstructorClass = customElements.get(vDOMNode.name);
  let element;
  if (ConstructorClass) {
    element = new ConstructorClass(vDOMNode.props);
  } else {
    element = document.createElement(vDOMNode.name);
    for (let prop in vDOMNode.props) {
      element[prop] = vDOMNode.props[prop];
    }
  }
  return element;
};

const _styledElements = {};
const _stagingElement = document.createElement('div');
const initStyle = function(localName, style) {
  if (style && !_styledElements[localName]) {
    _styledElements[localName] = true;
    _stagingElement.innerHTML = style.replace(new RegExp(':host', 'g'), localName);
    let element = _stagingElement.querySelector('style');
    element.setAttribute('id', 'io-style-' + localName);
    document.head.appendChild(element);
  }
};

// https://github.com/lukejacksonn/ijk
const clense = (a, b) => !b ? a : typeof b[0] === 'string' ? [...a, b] : [...a, ...b];
const buildVDOM = () => node => !!node && typeof node[1] === 'object' && !Array.isArray(node[1]) ? {
    ['name']: node[0],
    ['props']: node[1],
    ['children']: Array.isArray(node[2]) ? node[2].reduce(clense, []).map(buildVDOM()) : node[2] || ''
  } : buildVDOM()([node[0], {}, node[1] || '']);
