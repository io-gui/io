// TODO: Documentation and tests

class Bindings {
  constructor(instance) {
    Object.defineProperty(this, 'instance', {value: instance, configurable: true});
  }
  get(prop) {
    this[prop] = this[prop] || new Binding(this.instance, prop);
    return this[prop];
  }
  dispose() {
    for (let b in this) {
      this[b].dispose();
      delete this[b];
    }
    delete this.instance;
  }
}

class Binding {
  constructor(source, sourceProp) {
    this.source = source;
    this.sourceProp = sourceProp;
    this.targets = [];
    this.targetsMap = new WeakMap();
    this.updateSource = this.updateSource.bind(this);
    this.updateTargets = this.updateTargets.bind(this);
    this.setSource(this.source);
  }
  get value() {
    return this.source[this.sourceProp];
  }
  set value(value) {
    this.source[this.sourceProp] = value;
  }
  setSource() {
    this.source.addEventListener(this.sourceProp + '-changed', this.updateTargets);
    for (let i = this.targets.length; i--;) {
      const targetProps = this.targetsMap.get(this.targets[i]);
      for (let j = targetProps.length; j--;) {
        this.targets[i].__properties[targetProps[j]].value = this.source[this.sourceProp];
        // TODO: test observers on binding hot-swap!
      }
    }
  }
  setTarget(target, targetProp) {
    if (this.targets.indexOf(target) === -1) this.targets.push(target);
    if (this.targetsMap.has(target)) {
      const targetProps = this.targetsMap.get(target);
      if (targetProps.indexOf(targetProp) === -1) { // safe check needed?
        targetProps.push(targetProp);
        target.addEventListener(targetProp + '-changed', this.updateSource);
      }
    } else {
      this.targetsMap.set(target, [targetProp]);
      target.addEventListener(targetProp + '-changed', this.updateSource);
    }
  }
  removeTarget(target, targetProp) {
    if (this.targetsMap.has(target)) {
      const targetProps = this.targetsMap.get(target);
      if (targetProp) {
        const index = targetProps.indexOf(targetProp);
        if (index !== -1) {
          targetProps.splice(index, 1);
        }
        target.removeEventListener(targetProp + '-changed', this.updateSource);
      } else {
        for (let i = targetProps.length; i--;) {
          target.removeEventListener(targetProps[i] + '-changed', this.updateSource);
        }
        targetProps.length = 0;
      }
      if (targetProps.length === 0) this.targets.splice(this.targets.indexOf(target), 1);
    }
  }
  updateSource(event) {
    if (this.targets.indexOf(event.target) === -1) return;
    const value = event.detail.value;
    if (this.source[this.sourceProp] !== value) {
      this.source[this.sourceProp] = value;
    }
  }
  updateTargets(event) {
    if (event.target != this.source) return;
    const value = event.detail.value;
    for (let i = this.targets.length; i--;) {
      const targetProps = this.targetsMap.get(this.targets[i]);
      for (let j = targetProps.length; j--;) {
        let oldValue = this.targets[i][targetProps[j]];
        if (oldValue !== value) {
          // JavaScript is weird NaN != NaN
          if (typeof value == 'number' && typeof oldValue == 'number' && isNaN(value) && isNaN(oldValue)) continue;
          this.targets[i][targetProps[j]] = value;
        }
      }
    }
  }
  dispose() {
    for (let t in this.targets) {
      this.removeTarget(this.targets[t]);
      delete this.targets[t];
    }
  }
}

// TODO: Documentation and tests

class Listeners {
  constructor(protochain = {}, instance) {
    for (let i = protochain.length; i--;) {
      const prop = protochain[i].constructor.listeners;
      for (let j in prop) this[j] = prop[j];
    }
    Object.defineProperty(this, 'instance', {value: instance});
    Object.defineProperty(this, 'propListeners', {value: {}});
    Object.defineProperty(this, 'activeListeners', {value: {}});
  }
  clone(instance) {
    const listeners = new Listeners({}, instance);
    for (let prop in this) listeners[prop] = this[prop];
    return listeners;
  }
  setPropListeners(props) {
    for (let l in this.propListeners) delete this.propListeners[l];
    for (let l in props) {
      if (l.startsWith('on-')) {
        this.propListeners[l.slice(3, l.length)] = props[l];
      }
    }
  }
  connect() {
    const instance = this.instance;
    const propListeners = this.propListeners;
    for (let i in this) {
      const listener = typeof this[i] === 'function' ? this[i] : instance[this[i]];
      instance.addEventListener(i, listener);
    }
    for (let i in propListeners) {
      const listener = typeof propListeners[i] === 'function' ? propListeners[i] : instance[propListeners[i]];
      instance.addEventListener(i, listener);
    }
  }
  disconnect() {
    const instance = this.instance;
    const propListeners = this.propListeners;
    for (let i in this) {
      const listener = typeof this[i] === 'function' ? this[i] : instance[this[i]];
      instance.removeEventListener(i, listener);
    }
    for (let i in propListeners) {
      const listener = typeof propListeners[i] === 'function' ? propListeners[i] : instance[propListeners[i]];
      instance.removeEventListener(i, listener);
    }
  }
  dispose() {
    this.disconnect();
    const instance = this.instance;
    const active = this.activeListeners;
    for (let i in active) {
      for (let j = active[i].length; j--;) {
        if (instance.isElement) HTMLElement.prototype.removeEventListener.call(instance, i, active[i][j]);
        active[i].splice(j, 1);
      }
    }
  }
  addEventListener(type, listener) {
    const instance = this.instance;
    const active = this.activeListeners;
    active[type] = active[type] || [];
    const i = active[type].indexOf(listener);
    if (i === - 1) {
      if (instance.isElement) HTMLElement.prototype.addEventListener.call(instance, type, listener);
      active[type].push(listener);
    }
  }
  removeEventListener(type, listener) {
    const instance = this.instance;
    const active = this.activeListeners;
    if (active[type] !== undefined) {
      const i = active[type].indexOf(listener);
      if (i !== - 1) {
        if (instance.isElement) HTMLElement.prototype.removeEventListener.call(instance, type, listener);
        active[type].splice(i, 1);
      }
    }
  }
  dispatchEvent(type, detail = {}, bubbles = true, src = this.instance) {
    if (src instanceof HTMLElement || src === window) {
      HTMLElement.prototype.dispatchEvent.call(src, new CustomEvent(type, {type: type, detail: detail, bubbles: bubbles, composed: true}));
    } else {
      const active = this.activeListeners;
      if (active[type] !== undefined) {
        const array = active[type].slice(0);
        for (let i = 0; i < array.length; i ++) {
          array[i].call(src, {detail: detail, target: src, path: [src]});
          // TODO: consider bubbling
        }
      }
    }
  }
}

// TODO: Documentation and tests

// Creates composed properties from all properties found in protochain.
class Properties {
  constructor(protochain = [], instance) {
    const propertyDefs = {};
    for (let i = protochain.length; i--;) {
      const props = protochain[i].constructor.properties;
      for (let key in props) {
        if (!propertyDefs[key]) propertyDefs[key] = new Property(props[key]);
        else propertyDefs[key].assign(new Property(props[key]));
      }
    }
    for (let key in propertyDefs) {
      this[key] = new Property(propertyDefs[key]);
    }
    Object.defineProperty(this, 'instance', {value: instance});
  }
  // Creates a clone of properties for an instance.
  clone(instance) {
    const properties = new Properties([], instance);
    for (let prop in this) {
      properties[prop] = this[prop].clone();
      if (typeof properties[prop].value === 'object') {
        const value = properties[prop].value;

        if (value && value.isNode) value.connect(instance);

        instance.queue(prop, value, undefined);
      }
    }
    return properties;
  }
  get(prop) {
    return this[prop].value;
  }
  set(prop, value) {

    let oldBinding = this[prop].binding;
    let oldValue = this[prop].value;

    let binding = (value instanceof Binding) ? value : null;

    if (binding && oldBinding && binding !== oldBinding) {
      oldBinding.removeTarget(this.instance, prop); // TODO: test extensively
    }
    if (binding) {
      binding.setTarget(this.instance, prop);
      this[prop].binding = binding;
      this[prop].value = value.source[value.sourceProp];
      value = value.source[value.sourceProp];
    } else {
      this[prop].value = value;
    }

    if (value && value.isNode) {
      value.connect(this.instance);
    }

    if (value !== oldValue && oldValue && oldValue.isNode) {
      oldValue.disconnect(this.instance);
    }

    if (this[prop].reflect) this.instance.setAttribute(prop, value);
  }
  // TODO: test dispose and disconnect for memory leaks!!
  // TODO: dispose bindings properly
  connect() {
    for (let p in this) {
      if (this[p].binding) {
        this[p].binding.setTarget(this.instance, p); //TODO: test
      }
    }
  }
  disconnect() {
    for (let p in this) {
      if (this[p].binding) {
        this[p].binding.removeTarget(this.instance, p);
      }
    }
  }
  dispose() {
    for (let p in this) {
      if (this[p].binding) {
        this[p].binding.removeTarget(this.instance, p);
        delete this[p].binding;
      }
      delete this[p];
    }
  }
}

/*
 Creates a property configuration object with following properties:
 {
   value: default value.
   type: constructor of value.
   reflect: reflects to HTML attribute
   binding: binding object.
   enumerable: makes property enumerable.
 }
 */

class Property {
  constructor(propDef) {
    if (propDef === null || propDef === undefined) {
      propDef = {value: propDef};
    } else if (typeof propDef === 'function') {
      propDef = {type: propDef};
    } else if (propDef instanceof Array) {
      propDef = {type: Array, value: [...propDef]};
    } else if (propDef instanceof Binding) {
      propDef = {binding: propDef, value: propDef.value};
    } else if (typeof propDef !== 'object') {
      propDef = {value: propDef, type: propDef.constructor};
    }
    this.assign(propDef);
  }
  // Helper function to assign new values as we walk up the inheritance chain.
  assign(propDef) {
    if (propDef.value !== undefined) this.value = propDef.value;
    if (propDef.type !== undefined) this.type = propDef.type;
    if (propDef.reflect !== undefined) this.reflect = propDef.reflect;
    if (propDef.binding !== undefined) this.binding = propDef.binding;
    this.enumerable = propDef.enumerable !== undefined ? propDef.enumerable : true;
  }
  // Clones the property. If property value is objects it does one level deep object clone.
  clone() {
    const prop = new Property(this);
    if (prop.type === undefined && prop.value !== undefined && prop.value !== null) {
      prop.type = prop.value.constructor;
    }
    if (prop.type === Array && prop.value) {
      prop.value = [...prop.value];
    }
    // Set default values.
    if (prop.value === undefined && prop.type) {
      if (prop.type === Boolean) prop.value = false;
      else if (prop.type === String) prop.value = '';
      else if (prop.type === Number) prop.value = 0;
      else if (prop.type === Array) prop.value = [];
      else if (prop.type === Object) prop.value = {};
      else if (prop.type !== HTMLElement && prop.type !== Function) {
        prop.value = new prop.type();
      }
    }
    return prop;
  }
}

// TODO: Documentation and tests

class Queue extends Array {
  constructor(instance) {
    super();
    Object.defineProperty(this, 'instance', {value: instance, configurable: true});
  }
  queue(prop, value, oldValue) {
    const i = this.indexOf(prop);
    if (i === -1) {
      this.push(prop, {property: prop, value: value, oldValue: oldValue});
    } else {
      this[i + 1].value = value;
    }
  }
  dispatch() {
    const instance = this.instance;
    if (this.length) {
      for (let j = 0; j < this.length; j += 2) {
        const prop = this[j];
        const payload = {detail: this[j + 1]};
        if (instance[prop + 'Changed']) instance[prop + 'Changed'](payload);
        instance.dispatchEvent(prop + '-changed', payload.detail);
      }
      instance.changed();
      if (!(instance.isElement)) {
        // Emit change ecent for non-elements (nodes)
        instance.dispatchEvent('object-mutated', {object: instance}, null, window);
      }
      this.length = 0;
    }
  }
  dispose() {
    this.length = 0;
    delete this.instance;
  }
}

// TODO: Documentation and tests

const IoCoreMixin = (superclass) => class extends superclass {
  static get properties() {
    return {};
  }
  get bindings() {
    return;
  }
  constructor(initProps = {}) {
    super();
    if (!this.constructor.prototype.__registered) this.constructor.Register();

    Object.defineProperty(this, '__queue', {value: new Queue(this)});
    Object.defineProperty(this, '__bindings', {value: new Bindings(this)});
    Object.defineProperty(this, '__properties', {value: this.__properties.clone(this)});
    Object.defineProperty(this, '__listeners', {value: this.__listeners.clone(this)});

    for (let i = 0; i < this.__functions.length; i++) {
      this[this.__functions[i]] = this[this.__functions[i]].bind(this);
    }

    this.__listeners.setPropListeners(initProps, this);

    if (this.bindings) this.bindNodes(this.bindings);

    this.setProperties(initProps);
  }
  connect(instance) {
    this._instances = this._instances || [];
    if (this._instances.indexOf(instance) === -1) {
      this._instances.push(instance);
      if (!this.__connected) this.connectedCallback();
    }
  }
  disconnect(instance) {
    if (this._instances.indexOf(instance) !== -1) {
      this._instances.splice(this._instances.indexOf(instance), 1);
    }
    if (this._instances.length === 0 && this.__connected) {
      this.disconnectedCallback();
    }
  }
  preventDefault(event) {
    event.preventDefault();
  }
  changed() {}
  bind(prop) {
    return this.__bindings.get(prop);
  }
  set(prop, value) {
    if (this[prop] !== value) {
      const oldValue = this[prop];
      this[prop] = value;
      this.dispatchEvent(prop + '-set', {property: prop, value: value, oldValue: oldValue}, false);
    }
  }
  setProperties(props) {
    for (let p in props) {
      if (this.__properties[p] === undefined) continue;
      const oldValue = this.__properties[p].value;
      this.__properties.set(p, props[p]);
      const value = this.__properties[p].value;
      if (value !== oldValue) this.queue(p, value, oldValue);
    }

    this.className = props['className'] || '';

    if (props['style']) {
      for (let s in props['style']) {
        this.style[s] = props['style'][s];
        this.style.setProperty(s, props['style'][s]);
      }
    }

    this.queueDispatch();
  }
  // TODO: test extensively
  bindNodes(nodes) {
    for (let n in nodes) {
      const properties = nodes[n];
      this[n].setProperties(properties);
      this.addEventListener(n + '-changed', (event) => {
        if (event.detail.oldValue) event.detail.oldValue.dispose(); // TODO: test
        event.detail.value.setProperties(properties);
      });
    }
  }
  onObjectMutation(event) {
    for (let i = this.__objectProps.length; i--;) {
      const prop = this.__objectProps[i];
      const value = this.__properties[prop].value;
      if (value === event.detail.object) {
        if (this[prop + 'Mutated']) this[prop + 'Mutated'](event);
        this.changed();
        return;
      }
    }
  }
  connectedCallback() {
    this.__listeners.connect();
    this.__properties.connect();
    this.__connected = true;
    if (this.__objectProps.length) {
      window.addEventListener('object-mutated', this.onObjectMutation);
    }
    this.queueDispatch();
  }
  disconnectedCallback() {
    this.__listeners.disconnect();
    this.__properties.disconnect();
    this.__connected = false;
    if (this.__objectProps.length) {
      window.removeEventListener('object-mutated', this.onObjectMutation);
    }
  }
  dispose() {
    this.__queue.dispose();
    this.__bindings.dispose();
    this.__listeners.dispose();
    this.__properties.dispose();
  }
  addEventListener(type, listener) {
    this.__listeners.addEventListener(type, listener);
  }
  removeEventListener(type, listener) {
    this.__listeners.removeEventListener(type, listener);
  }
  dispatchEvent(type, detail, bubbles, src) {
    this.__listeners.dispatchEvent(type, detail, bubbles, src);
  }
  queue(prop, value, oldValue) {
    this.__queue.queue(prop, value, oldValue);
  }
  queueDispatch() {
    this.__queue.dispatch();
  }
};

IoCoreMixin.Register = function () {
  Object.defineProperty(this.prototype, '__registered', {value: true});

  const protochain = [];
  let proto = this.prototype;
  while (proto && proto.constructor !== HTMLElement && proto.constructor !== Object) {
    protochain.push(proto); proto = proto.__proto__;
  }
  Object.defineProperty(this.prototype, 'isNode', {value: proto.constructor !== HTMLElement});
  Object.defineProperty(this.prototype, 'isElement', {value: proto.constructor === HTMLElement});

  Object.defineProperty(this.prototype, '__protochain', {value: protochain});


  Object.defineProperty(this.prototype, '__properties', {value: new Properties(this.prototype.__protochain)});
  Object.defineProperty(this.prototype, '__listeners', {value: new Listeners(this.prototype.__protochain)});

  const functions = [];
  for (let i = this.prototype.__protochain.length; i--;) {
    const proto = this.prototype.__protochain[i];
    const names = Object.getOwnPropertyNames(proto);
    for (let j = 0; j < names.length; j++) {
      if (names[j] === 'constructor') continue;
      if (Object.getOwnPropertyDescriptor(proto, names[j]).get) continue;
      if (typeof proto[names[j]] !== 'function') continue;
      if (proto[names[j]].name === 'anonymous') continue;
      if (functions.indexOf(names[j]) === -1) functions.push(names[j]);
    }
  }
  Object.defineProperty(this.prototype, '__functions', {value: functions});

  Object.defineProperty(this.prototype, '__objectProps', {value: []});
  const ignore = [Boolean, String, Number, HTMLElement, Function, undefined];
  for (let prop in this.prototype.__properties) {
    let type = this.prototype.__properties[prop].type;
    if (ignore.indexOf(type) == -1) this.prototype.__objectProps.push(prop);
  }

  for (let prop in this.prototype.__properties) {
    const isPublic = prop.charAt(0) !== '_';
    const isEnumerable = !(this.prototype.__properties[prop].enumerable === false);
    Object.defineProperty(this.prototype, prop, {
      get: function() {
        return this.__properties[prop].value;
      },
      set: function(value) {
        if (this.__properties[prop].value === value) return;
        const oldValue = this.__properties.get(prop);
        this.__properties.set(prop, value);
        value = this.__properties.get(prop);
        if (isPublic && this.__connected) {
          this.queue(prop, value, oldValue);
          this.queueDispatch();
        }
      },
      enumerable: isEnumerable && isPublic,
      configurable: true,
    });
  }
};

class IoCore extends IoCoreMixin(Object) {}

IoCore.Register = IoCoreMixin.Register;

// TODO: Documentation and tests

class IoElement extends IoCoreMixin(HTMLElement) {
  static get properties() {
    return {
      id: {
        type: String,
        enumerable: false
      },
      tabindex: {
        type: String,
        reflect: true,
        enumerable: false
      },
      contenteditable: {
        type: Boolean,
        reflect: true,
        enumerable: false
      },
      title: {
        type: String,
        reflect: true,
        enumerable: false
      },
      $: {
        type: Object,
      },
    };
  }
  connectedCallback() {
    super.connectedCallback();
    for (let prop in this.__properties) {
      if (this.__properties[prop].reflect) {
        this.setAttribute(prop, this.__properties[prop].value);
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
  dispose() {
    super.dispose();
    delete this.parent;
    this.children.lenght = 0;
    // this.__properties.$.value = {};
  }
  template(children, host) {
    // this.__properties.$.value = {};
    this.traverse(buildTree()(['root', children]).children, host || this);
  }
  traverse(vChildren, host) {
    const children = host.children;
    // remove trailing elements
    while (children.length > vChildren.length) {
      const child = children[children.length - 1];
      let nodes = Array.from(child.querySelectorAll('*'));
      host.removeChild(child);
      for (let i = nodes.length; i--;) {
        if (nodes[i].dispose) nodes[i].dispose();
      }
      if (child.dispose) child.dispose();
    }
    // create new elements after existing
    const frag = document.createDocumentFragment();
    for (let i = children.length; i < vChildren.length; i++) {
      frag.appendChild(constructElement(vChildren[i]));
    }
    host.appendChild(frag);

    for (let i = 0; i < children.length; i++) {

      // replace existing elements
      if (children[i].localName !== vChildren[i].name) {
        const oldElement = children[i];
        host.insertBefore(constructElement(vChildren[i]), oldElement);
        let nodes = Array.from(oldElement.querySelectorAll('*'));
        host.removeChild(oldElement);
        for (let i = nodes.length; i--;) {
          if (nodes[i].dispose) nodes[i].dispose();
        }
        if (oldElement.dispose) oldElement.dispose();

      // update existing elements
      } else {
        children[i].className = '';
        // Io Elements
        if (children[i].hasOwnProperty('__properties')) {
          // WARNING TODO: better property and listeners reset.
          // WARNING TODO: test property and listeners reset
          children[i].setProperties(vChildren[i].props);
          // children[i].queueDispatch(); // TODO: test and remove. Redundant with setProperties()
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
            }
            else children[i][prop] = vChildren[i].props[prop];
          }
          // TODO: refactor for native elements
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
  // fixup for setAttribute
  setAttribute(attr, value) {
    if (value === true) {
      HTMLElement.prototype.setAttribute.call(this, attr, '');
    } else if (value === false || value === '') {
      this.removeAttribute(attr);
    } else if (typeof value == 'string' || typeof value == 'number') {
      if (this.getAttribute(attr) !== String(value)) HTMLElement.prototype.setAttribute.call(this, attr, value);
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

IoElement.Register = function() {

  IoCoreMixin.Register.call(this);

  // window[this.name] = this; // TODO: consider

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

};

let ro;
if (window.ResizeObserver !== undefined) {
  ro = new ResizeObserver(entries => {
    for (let entry of entries) entry.target.resized();
  });
}

function html(parts) {
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

const constructElement = function(vDOMNode) {
 let ConstructorClass = window.customElements ? window.customElements.get(vDOMNode.name) : null;
 if (ConstructorClass) return new ConstructorClass(vDOMNode.props);

 let element = document.createElement(vDOMNode.name);
 for (let prop in vDOMNode.props) {
   if (prop === 'style') {
     for (let s in vDOMNode.props[prop]) {
       element.style[s] = vDOMNode.props[prop][s];
     }
   } else element[prop] = vDOMNode.props[prop];
 }
 /// TODO: refactor for native elements
 Object.defineProperty(element, '__listeners', {value: new Listeners({}, element)});
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

const _stagingElement = document.createElement('div');

function initStyle(prototypes) {
  let localName = prototypes[0].constructor.name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  for (let i = prototypes.length; i--;) {
    let style = prototypes[i].constructor.style;
    if (style) {
      style.string = style.string.replace(new RegExp(':host', 'g'), localName);
      for (let v in style.vars) {
        style.string = style.string.replace(new RegExp(v, 'g'), v.replace('--', '--' + localName + '-'));
      }
      _stagingElement.innerHTML = style.string;
      let element = _stagingElement.querySelector('style');
      element.setAttribute('id', 'io-style-' + localName + '-' + i);
      document.head.appendChild(element);
    }

  }
}

/**
 * @author arodic / https://github.com/arodic
 *
 */

export { IoCoreMixin, IoCore, IoElement, html, initStyle, Binding, Bindings };
