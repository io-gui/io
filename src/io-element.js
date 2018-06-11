import {Prototypes} from "./core/prototypes.js";
import {ProtoProperties, defineProperties} from "./core/protoProperties.js";
import {ProtoListeners} from "./core/protoListeners.js";
import {ProtoFunctions} from "./core/protoFunctions.js";
import {InstanceListeners} from "./core/instanceListeners.js";
import {initStyle} from "./core/initStyle.js";
import {renderNode, updateNode, buildTree} from "./core/vdom.js";
import {Binding, IoBindingMixin} from "./core/mixinBinding.js";
import {IoElementListenersMixin} from "./core/mixinListeners.js";

export function html() {return arguments[0][0];}

export class IoElement extends IoBindingMixin(IoElementListenersMixin(HTMLElement)) {
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
  constructor(initProps = {}) {
    super();
    this.__protoFunctions.bind(this);

    Object.defineProperty(this, '__props', {value: this.__props.clone()});

    Object.defineProperty(this, '__observers', {value: []});
    Object.defineProperty(this, '__notifiers', {value: []});

    this.setProperties(initProps);

    Object.defineProperty(this, '__instaListeners', {value: new InstanceListeners()});
    this.__instaListeners.setListeners(initProps);

    Object.defineProperty(this, '$', {value: {}}); // TODO: consider clearing on update. possible memory leak!

    for (let prop in this.__props) {
      if (this.__props[prop].reflect) {
        this.setAttribute(prop, this.__props[prop].value);
      }
    }
  }
  connectedCallback() {
    this.__protoListeners.connect(this);
    this.__instaListeners.connect(this);

    this.triggerObservers();
    this.triggerNotifiers();

    for (let p in this.__props) {
      if (this.__props[p].binding) {
        this.__props[p].binding.setTarget(this, p); //TODO: test
      }
    }
  }
  disconnectedCallback() {
    this.__protoListeners.disconnect(this);
    this.__instaListeners.disconnect(this);

    for (let p in this.__props) {
      if (this.__props[p].binding) {
        this.__props[p].binding.removeTarget(this, p);
        delete this.__props[p].binding;
      }
    }
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
        if (children[i].hasOwnProperty('__props')) {
          children[i].setProperties(vChildren[i].props); // TODO: test
          children[i].triggerObservers();
          children[i].__instaListeners.setListeners(vChildren[i].props);
          children[i].__instaListeners.connect(children[i]);
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

  setProperties(props) {

    this.__observers.length = 0;
    this.__notifiers.length = 0;

    this.__observers.push('update');

    for (let p in props) {

      if (this.__props[p] === undefined) continue;

      let oldBinding = this.__props[p].binding;
      let oldValue = this.__props[p].value;

      let binding;
      let value;

      if (props[p] instanceof Binding) {
        binding = props[p];
        value = props[p].source[props[p].sourceProp];
      } else {
        value = props[p];
      }

      this.__props[p].binding = binding;
      this.__props[p].value = value;

      if (value !== oldValue) {
        if (this.__props[p].reflect) {
          this.setAttribute(p, value);
        }
        if (this.__props[p].observer) {
          if (this.__observers.indexOf(this.__props[p].observer) === -1) {
            this.__observers.push(this.__props[p].observer);
          }
        }
        this.__notifiers.push(p + '-changed', {value: value, oldValue: oldValue});
      }

      if (binding !== oldBinding) {
        binding.setTarget(this, p);
        // TODO: test extensivly
        if (oldBinding) console.warn('Disconnect!', binding, oldBinding);
      }

    }

    if (props['className']) {
      this.className = props['className'];
    }

    // TODO: use attributeStyleMap when implemented in browser
    // https://developers.google.com/web/updates/2018/03/cssom
    if (props['style']) {
      for (let s in props['style']) {
        this.style[s] = props['style'][s];
      }
    }
  }

  // fixup for shitty setAttribute spec
  setAttribute(attr, value) {
    if (value === true) {
      HTMLElement.prototype.setAttribute.call(this, attr, '');
    } else if (value === false || value === '') {
      this.removeAttribute(attr);
    } else if (typeof value == 'string' || typeof value == 'number') {
      HTMLElement.prototype.setAttribute.call(this, attr, value);
    }
  }
}

IoElement.Register = function() {
  const prototypes = new Prototypes(this);
  initStyle(prototypes);

  Object.defineProperty(this.prototype, '__props', {value: new ProtoProperties(prototypes)});
  Object.defineProperty(this.prototype, '__protoFunctions', {value: new ProtoFunctions(prototypes)});
  Object.defineProperty(this.prototype, '__protoListeners', {value: new ProtoListeners(prototypes)});

  defineProperties(this.prototype);

  customElements.define(this.name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(), this);
};
