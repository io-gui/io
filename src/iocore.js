import {Protochain} from "./core/protochain.js";
import {Properties} from "./core/properties.js";
import {Listeners} from "./core/listeners.js";
import {Attributes} from "./core/attributes.js";
import {Handlers} from "./core/handlers.js";
import {Styles} from "./core/style.js";
import {InstanceListeners} from "./core/instance-listeners.js";
import {InstanceProperties} from "./core/instance-properties.js";
import {InstanceBindings} from "./core/instance-bindings.js";
import {renderNode, updateNode, buildTree} from "./core/vdom.js";

export function html() { return arguments[0][0]; }

export class Io extends HTMLElement {
  static get style() { return html``;}
  constructor(props = {}) {
    super();

    const protochain = new Protochain(this.__proto__.constructor);

    Object.defineProperty(this, '__styles', { value: new Styles(protochain)} );
    Object.defineProperty(this, '__properties', { value: new Properties(protochain)} );
    Object.defineProperty(this, '__listeners', { value: new Listeners(protochain, this)} );
    Object.defineProperty(this, '__attributes', { value: new Attributes(protochain, this)} );
    Object.defineProperty(this, '__handlers', { value: new Handlers(protochain, this)} );

    Object.defineProperty(this, '__instanceBindings', { value: new InstanceBindings(props, this) } );
    Object.defineProperty(this, '__instanceListeners', { value: new InstanceListeners(props.listeners, this)} );
    Object.defineProperty(this, '__instanceProperties', { value: new InstanceProperties(props, this)} );

    for (let prop in this.__properties) {
      this.defineProperty(prop);
      this.reflectAttribute(prop);
    }
  }
  connectedCallback() {
    this.__listeners.connect();
    // TODO: connect instance listeneres and bindings here
    this.update();
  }
  disconnectedCallback() {
    this.__listeners.disconnect();
    // TODO: disconnect instance listeneres and bindings here
  }
  defineProperty(prop) {
    if (this.__proto__.hasOwnProperty(prop)) return;
    Object.defineProperty(this.__proto__, prop, {
      get: function() {
        return this.__properties[prop].value;
      },
      set: function(value) {
        if (this.__properties[prop].value === value) return;
        let oldValue = this.__properties[prop].value;
        this.__properties[prop].value = value;
        this.reflectAttribute(prop);
        if (this.__properties[prop].observer) {
          this[this.__properties[prop].observer](value, oldValue, prop);
        }
        if (this.__properties[prop].notify) {
          this.fire(prop + '-changed', {value: value, oldValue: oldValue}, this.__properties[prop].bubbles);
        }
      },
      enumerable: true,
      configurable: true
    });
  }
  reflectAttribute(prop) {
    const config = this.__properties[prop];
    if (config.reflect) {
      if (config.value === true) {
        this.setAttribute(prop, '');
      } else if (config.value === false || config.value === '') {
        this.removeAttribute(prop);
      } else if (typeof config.value == 'string' || typeof config.value == 'number') {
        this.setAttribute(prop, config.value);
      }
    }
  }
  render(children, host) {
    this.traverse(buildTree()(['root', children]).children, host || this);
  }
  traverse(vChildren, host) {
    const children = host.children;

    // remove trailing elements
    while (children.length > vChildren.length) host.removeChild(children[children.length - 1]);

    // create new elements after existing
    const frag = document.createDocumentFragment();
    for (let i = children.length; i < vChildren.length; i++) {
      frag.appendChild(renderNode(vChildren[i]));
    }
    host.appendChild(frag);

    for (let i = 0; i < children.length; i++) {

      // replace existing elements
      if (children[i].localName !== vChildren[i].name) {
        const oldElement = children[i];
        host.insertBefore(renderNode(vChildren[i]), oldElement);
        host.removeChild(oldElement);

      // update existing elements
      } else {
        // Io Elements
        if (children[i].hasOwnProperty('__instanceProperties')) {
          children[i].__instanceBindings.update(vChildren[i].props);
          children[i].__instanceProperties.update(vChildren[i].props);
          children[i].__instanceListeners.update(vChildren[i].props['listeners']);
        // Native HTML Elements
        } else {
          updateNode(children[i], vChildren[i]);
        }
      }

      for (let prop in vChildren[i].props) {
        // TODO: use attributeStyleMap when implemented in browser
        // https://developers.google.com/web/updates/2018/03/cssom
        if (prop == 'style') {
          for (let s in vChildren[i].props[prop]) {
            children[i].style[s] = vChildren[i].props[prop][s];
          }
        } else if (prop == 'class') {
          children[i].className = vChildren[i].props[prop];
        }
      }
    }

    for (let i = 0; i < children.length; i++) {
      if (vChildren[i].children && typeof vChildren[i].children === 'string') {
        children[i].innerHTML = vChildren[i].children;
      } else if (vChildren[i].children && typeof vChildren[i].children === 'object') {
        this.traverse(vChildren[i].children, children[i]);
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
    return this.__instanceBindings.bind(sourceProp);
  }
  unbind(sourceProp) {
    this.__instanceBindings.unbind(sourceProp);
  }
  unbindAll() {
    this.__instanceBindings.unbindall();
  }
}
