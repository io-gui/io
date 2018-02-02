import {h, renderElement, initStyle} from "./ioutil.js"

export class Io extends HTMLElement {
  static get style() { return ``; }
  static get shadowStyle() { return ``; }
  static get observedAttributes() {
    let attributes = [];
    let proto = this;
    while (proto) {
      if (proto.properties) {
        let keys = Object.keys(proto.properties);
        for (let i = 0; i < keys.length; i++) {
          if (attributes.indexOf(keys[i]) === -1) attributes.push(keys[i]);
        }
      }
      proto = proto.__proto__;
    }
    return attributes;
  }
  static get definedProperties() {
    let config = {
      properties: {},
      attributes: {},
      listeners: {},
    }
    let proto = this;
    while (proto) {
      let prop = proto.properties;
      for (let key in prop) {
        if (key === 'listeners') {
          for (let listener in prop[key]) config.listeners[listener] = prop[key][listener];
        } else if (key === 'attributes') {
          for (let att in prop[key]) config.attributes[att] = prop[key][att];
        } else {
          if (prop[key].value === undefined) {
            if (prop[key].type === Boolean) prop[key].value = false;
            if (prop[key].type === Number) prop[key].value = 0;
            if (prop[key].type === String) prop[key].value = '';
          }
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
    let definedProperties = this.__proto__.constructor.definedProperties;
    Object.defineProperty(this, '__properties', { value: definedProperties.properties });
    Object.defineProperty(this, '__attributes', { value: definedProperties.attributes });
    Object.defineProperty(this, '__listeners', { value: definedProperties.listeners });
    Object.defineProperty(this, '__handlers', { value: this.__proto__.constructor.definedHandlers });

    for (let key in this.__properties) {
      if (props[key] !== undefined) this.__properties[key].value = props[key];
      this.defineProperty(key, this.__properties[key]);
      this.reflectAttribute(key, this.__properties[key]);
    }

    for (let att in this.__attributes) {
      this.setAttribute(att, this.__attributes[att]);
    }

    for (let i = 0; i < this.__handlers.length; i++) {
      this[this.__handlers[i]] = this[this.__handlers[i]].bind(this);
    }

    initStyle(this.localName, this.__proto__.constructor.style);

    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = this.__proto__.constructor.shadowStyle;
    this.shadowRoot.appendChild(document.createElement('slot'));
  }

  defineProperty(key, config) {
    Object.defineProperty(this, key, {
      get: function() {
        return config.value;
      },
      set: function(value) {
        if (config.value === value) return;
        let oldValue = value;
        config.value = value;
        this.reflectAttribute(key, config);
        if (config.observer) {
          this[config.observer](value, key);
        }
        if (config.notify) {
          this.dispatchEvent(new CustomEvent(key + '-changed', {
            detail: {value: value, oldValue: oldValue},
            bubbles: config.bubbles,
            composed: true
          }));
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
  connectedCallback() {
    for (let e in this.__listeners) {
      this.__listeners[e] = this[this.__listeners[e]];
      this.addEventListener(e, this.__listeners[e]);
    }
    if (typeof this._update == 'function') this._update();
  }
  disconnectedCallback() {
    for (let e in this.__listeners) {
      this.removeEventListener(e, this.__listeners[e]);
    }
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (this.__properties[name].type === Boolean) {
      this[name] = newValue === '' ? true : false;
    } else if (this.__properties[name].type === Number) {
      this[name] = parseFloat(newValue);
    } else {
      this[name] = newValue;
    }
  }
  render(children, host) {
    host = host || this;
    let vDOM = h('name', 'props', 'children')(['root', children]).children;
    this.traverse(vDOM, host);
  }
  traverse(vChildren, host) {
    let children = host.children;
    if (host instanceof ShadowRoot) {
      vChildren.unshift({name: 'style'});
    }

    for (let i = 0; i < vChildren.length; i++) {

      let element;
      let oldElement;
      let observers = [];

      if (children[i] && children[i].localName === vChildren[i].name) {

        element = children[i];
        observers.length = 0;

        for (let prop in vChildren[i].props) {
          if (vChildren[i].props[prop] !== element[prop]) {
            // avoid triggering observers prematurely when re-rendering elements with different props.
            if (element.__properties && element.__properties.hasOwnProperty(prop)) {
              element.__properties[prop].value = vChildren[i].props[prop];
              // TODO: make less ugly
              if (element.__properties[prop].observer && observers.indexOf(element.__properties[prop].observer) === -1) {
                observers.push(element.__properties[prop].observer);
              }
            } else {
              element[prop] = vChildren[i].props[prop];
            }
          }
        }
        // triggering observers
        for (var j = 0; j < observers.length; j++) {
          element[observers[j]]();
        }

      } else if (children[i] && children[i].localName !== vChildren[i].name) {

        oldElement = children[i];
        element = renderElement(vChildren[i]);

        host.insertBefore(element, oldElement);
        host.removeChild(oldElement);

      } else {

        element = renderElement(vChildren[i]);
        host.appendChild(element);

      }

      for (let prop in vChildren[i].props) {
        if (prop == 'listeners') {
          for (let l in vChildren[i].props[prop]) {
            if (typeof vChildren[i].props[prop][l] === 'function') {
              // TODO: test for garbage / lingering listeners
              // TODO: check for conflicts / existing listeners
              element.__listeners[l] = vChildren[i].props[prop][l];
              element.addEventListener(l, element.__listeners[l]);
            }
          }
        } else if (prop == 'className') {
          // TODO: ugh
          element.className = vChildren[i].props[prop];
        }
      }

      if (vChildren[i].children && typeof vChildren[i].children === 'string') {
        element.innerHTML = vChildren[i].children;
      } else if (vChildren[i].children &&  typeof vChildren[i].children === 'object') {
        // TODO: test extensively
        this.traverse(vChildren[i].children, element);
      }

      // TODO: handle attributes better
      if (vChildren[i].props && vChildren[i].props.tabindex !== undefined) {
        element.setAttribute('tabindex', vChildren[i].props.tabindex);
      }

    }

     // TODO: consider caching elements for reuse
     if (children.length > vChildren.length) {
       for (let i = children.length - 1; children.length > vChildren.length; i--) {
         host.removeChild(children[i]);
       }
     }
   }
  _setValue(value) {
    let oldValue = this.value;
    this.value = value;
    this.dispatchEvent(new CustomEvent('value-set', {
      detail: {value: value, oldValue: oldValue},
      bubbles: false,
      composed: true
    }));
  }
  _preventHandler(event) {
    if (event.path[0] === this) {
      event.preventDefault();
    }
  }
  bind(sourceProp, target, targetProp, oneWay) {
    this.__properties[sourceProp].notify = true;
    if (!oneWay) target.__properties[targetProp].notify = true;
    var binding = {
      source: this,
      target: target,
      sourceProp: sourceProp,
      targetProp: targetProp,
      setTarget: function (event) { target[targetProp] = event.detail.value; }.bind(target),
      setSource: function (event) { this[sourceProp] = event.detail.value; }.bind(this)
    };
    binding.source.addEventListener(sourceProp + '-changed', binding.setTarget);
    if (!oneWay) binding.target.addEventListener(targetProp + '-changed', binding.setSource);
    binding.target[targetProp] = binding.source[sourceProp];
    return binding;
  }
  unbind(binding) {
    binding.source.removeEventListener(binding.sourceProp + '-changed', binding.setTarget);
    binding.target.removeEventListener(binding.targetProp + '-changed', binding.setSource);
    for (let prop in binding) { delete binding[prop]; }
  }
}

window.customElements.define('io-div', Io);
