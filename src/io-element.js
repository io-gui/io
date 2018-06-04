import {Prototypes} from "./core/prototypes.js";
import {ProtoProperties} from "./core/protoProperties.js";
import {ProtoListeners} from "./core/protoListeners.js";
import {ProtoFunctions} from "./core/protoFunctions.js";
import {initStyle} from "./core/initStyle.js";
import {Node} from "./core/node.js";
import {renderNode, updateNode, buildTree} from "./core/vdom.js";

export function html() { return arguments[0][0]; }

export class IoElement extends HTMLElement {
  static get properties() {
    return {
      id: String,
      tabindex: {
        type: String,
        reflect: true
      },
      contenteditable: {
        type: Boolean,
        reflect: true
      }
    };
  }
  constructor(initProps) {
    super();
    this.__proto__.__protoFunctions.bind(this);

    Object.defineProperty(this, '__props', { value: this.__props.clone() } );
    Object.defineProperty(this, '__listeners', {value: {}});
    Object.defineProperty(this, '__observers', {value: []});
    Object.defineProperty(this, '__notifiers', {value: []});
    Object.defineProperty(this, '__connected', {value: false, writable: true});

    Object.defineProperty(this, '__node', { value: new Node(this) } );
    this.__node.update(initProps);

    Object.defineProperty(this, '$', { value: {} } ); // TODO: consider clearing on update. possible memory leak!

    for (let prop in this.__props) {
      if (this.__props[prop].reflect) {
        this.setAttribute(prop, this.__props[prop].value);
      }
    }
  }
  connectedCallback() {
    this.__proto__.__protoListeners.connect(this);
    this.__node.connect();
    this.triggerObservers();
    this.triggerNotifiers();
    this.__connected = true;
  }
  disconnectedCallback() {
    this.__proto__.__protoListeners.disconnect(this);
    this.__node.disconnect();
    this.__connected = false;
  }
  dispose() {
    // for (let id in this.$) {
    //   delete this.$[id];
    // }
  }

  update() {}

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
        if (children[i].hasOwnProperty('__node')) {
          children[i].__node.update(vChildren[i].props); // TODO: test
          children[i].triggerObservers();
          children[i].triggerNotifiers();
        // Native HTML Elements
        } else {
          updateNode(children[i], vChildren[i]);
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
  bind(sourceProp) {
    return this.__node.bind(sourceProp);
  }

  triggerObservers() {
    // TODO: test
    // if (!this.__connected) return;
    for (let j = 0; j < this.__observers.length; j++) {
      this[this.__observers[j]]();
    }
    this.__observers.length = 0;
  }
  triggerNotifiers() {
    // if (!this.__connected) return;
    // TODO: test
    for (let j = 0; j < this.__notifiers.length; j++) {
      this.dispatchEvent(this.__notifiers[j][0], this.__notifiers[j][1]);
    }
    this.__notifiers.length = 0;
  }

  set(prop, value) {
    let oldValue = this[prop];
    this[prop] = value;
    this.dispatchEvent(prop + '-set', {value: value, oldValue: oldValue}, true);
  }
  setAttribute(attr, value) {
    if (value === true) {
      HTMLElement.prototype.setAttribute.call(this,
        attr, '');
    } else if (value === false || value === '') {
      this.removeAttribute(attr);
    } else if (typeof value == 'string' || typeof value == 'number') {
      HTMLElement.prototype.setAttribute.call(this,
        attr, value);
    }
  }
  addEventListener(type, listener) {
    this.__listeners[type] = this.__listeners[type] || [];
    if (this.__listeners[type].indexOf(listener) === - 1) {
      this.__listeners[type].push(listener);
      HTMLElement.prototype.addEventListener.call(this, type, listener);
    }
  }
  hasEventListener(type, listener) {
    return this.__listeners[type] !== undefined && this.__listeners[type].indexOf(listener) !== - 1;
  }
  removeEventListener(type, listener) {
    if (this.__listeners[type] !== undefined) {
      let i = this.__listeners[type].indexOf(listener);
      if (i !== - 1) {
        this.__listeners[type].splice(i, 1);
        HTMLElement.prototype.removeEventListener.call(this, type, listener);
      }
    }
  }
  dispatchEvent(eventName, detail, bubbles = true, src = this) {
    HTMLElement.prototype.dispatchEvent.call(src, new CustomEvent(eventName, {
      detail: detail,
      bubbles: bubbles,
      composed: true
    }));
  }
}

IoElement.Register = function() {
  const prototypes = new Prototypes(this);
  initStyle(prototypes);

  Object.defineProperty(this.prototype, '__props', { value: new ProtoProperties(prototypes) } );

  for (let prop in this.prototype.__props) {
    Object.defineProperty(this.prototype, prop, {
      get: function() {
        return this.__props[prop].value;
      },
      set: function(value) {
        if (this.__props[prop].value === value) return;
        let oldValue = this.__props[prop].value;
        this.__props[prop].value = value;
        if (this.__props[prop].reflect) {
          this.setAttribute(prop, this.__props[prop].value);
        }
        if (this.__props[prop].observer) {
          this[this.__props[prop].observer](value, oldValue);
        }
        this.dispatchEvent(prop + '-changed', {value: value, oldValue: oldValue});
        this.update();
      },
      enumerable: true,
      configurable: true
    });
  }

  Object.defineProperty(this.prototype, '__protoListeners', { value: new ProtoListeners(prototypes) });
  Object.defineProperty(this.prototype, '__protoFunctions', { value: new ProtoFunctions(prototypes) });

  customElements.define(this.name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(), this);
};
