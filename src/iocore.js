import {Attributes} from "./core/attributes.js";
import {Binding} from "./core/binding.js";
import {Listeners} from "./core/listeners.js";
import {Protochain} from "./core/protochain.js";
import {Properties} from "./core/properties.js";
import {initStyle} from "./core/style.js";
import {renderNode, buildTree} from "./core/vdom.js";

export function html() { return arguments[0][0]; }

export class Io extends HTMLElement {
  static get style() {
    return html`<style></style>`;
  }
  static get handlers() {
    if (this.__handlers) return this.__handlers;
    this.__handlers = [];
    let proto = this.prototype;
    while (proto) {
      let names = Object.getOwnPropertyNames(proto);
      for (let i = 0; i < names.length; i++) {
        if (names[i].substring(names[i].length-7, names[i].length) === 'Handler') {
          this.__handlers.push(names[i]);
        }
      }
      proto = proto.__proto__;
    }
    return this.__handlers;
  }
  constructor(props = {}) {
    super();

    initStyle(this.localName, this.__proto__.constructor.style);

    const protochain = new Protochain(this);

    Object.defineProperty(this, '__properties', { value: new Properties(protochain) });
    Object.defineProperty(this, '__listeners', { value: new Listeners(protochain) });
    Object.defineProperty(this, '__attributes', { value: new Attributes(protochain) });

    for (let prop in this.__properties) {
      if (props[prop] instanceof Binding) {
        let binding = props[prop];
        this.__properties[prop].value = binding.source[binding.sourceProp];
        binding.setTarget(this, prop);
        binding.bind();
      } else if (props[prop] !== undefined) {
        this.__properties[prop].value = props[prop];
      }
      this.defineProperty(prop);
      this.reflectAttribute(prop, this.__properties[prop]);
    }

    for (let att in this.__attributes) {
      this.setAttribute(att, this.__attributes[att]);
    }

    for (let i = 0; i < this.handlers.length; i++) {
      this[handlers[i]] = this[handlers[i]].bind(this);
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
  defineProperty(key) {
    if (this.__proto__.hasOwnProperty(key)) return;
    Object.defineProperty(this.__proto__, key, {
      get: function() {
        return this.__properties[key].value;
      },
      set: function(value) {
        if (this.__properties[key].value === value) return;
        let oldValue = this.__properties[key].value;
        this.__properties[key].value = value;
        this.reflectAttribute(key, this.__properties[key]);
        if (this.__properties[key].observer) {
          this[this.__properties[key].observer](value, oldValue, key);
        }
        if (this.__properties[key].notify) {
          this.fire(key + '-changed', {value: value, oldValue: oldValue}, this.__properties[key].bubbles);
        }
      },
      enumerable: true,
      configurable: true
    });
  }
  reflectAttribute(key, prop) {
    if (prop.reflectToAttribute) {
      if (prop.value === true) {
        this.setAttribute(key, '');
      } else if (prop.value === false || prop.value === '') {
        this.removeAttribute(key);
      } else if (typeof prop.value == 'string' || typeof prop.value == 'number') {
        this.setAttribute(key, prop.value);
      }
    }
  }
  render(children, host) {
    this.traverse(buildTree()(['root', children]).children, host || this);
  }
  traverse(vChildren, host) {
    let children = host.children;

    // remove trailing elements
    while (children.length > vChildren.length) host.removeChild(children[children.length - 1]);

    // create new elements
    let frag = document.createDocumentFragment();
    for (let i = children.length; i < vChildren.length; i++) {
      frag.appendChild(renderNode(vChildren[i]));
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
        for (let j = 0; j < observers.length; j++) {
          element[observers[j]]();
        }
        // triggering reflections
        for (let j = 0; j < reflections.length; j++) {
          element.reflectAttribute(reflections[j], element.__properties[reflections[j]]);
        }

      } else {

        oldElement = children[i];
        host.insertBefore(renderNode(vChildren[i]), oldElement);
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
  bind(sourceProp) {
    this.__bindings = this.__bindings || {};
    this.__bindings[sourceProp] = this.__bindings[sourceProp] || new Binding(this, sourceProp);
    return this.__bindings[sourceProp];
  }
  unbind(sourceProp) {
    if (this.__bindings[sourceProp]) this.__bindings[sourceProp].unbind();
    delete this.__bindings[sourceProp];
  }
  unbindAll() {
    for (let sourceProp in this.__bindings) this.unbind(sourceProp);
  }
}
