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

class IoProperties extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: column;
        flex: 0 0;
        line-height: 1em;
      }
      :host > .io-property {
        display: flex !important;
        flex-direction: row;
      }
      :host > .io-property > .io-property-label {
        padding: 0 0.2em 0 0.5em;
        flex: 0 0 auto;
        color: var(--io-theme-color);
      }
      :host > .io-property > .io-property-editor {
        margin: 0;
        padding: 0;
      }
      :host > .io-property > io-object,
      :host > .io-property > io-object > io-boolean,
      :host > .io-property > io-object > io-properties {
        padding: 0 !important;
        border: none !important;
        background: none !important;
      }
      :host > .io-property > io-number,
      :host > .io-property > io-string,
      :host > .io-property > io-boolean {
        border: none;
        background: none;
      }
      :host > .io-property > io-number {
        color: var(--io-theme-number-color);
      }
      :host > .io-property > io-string {
        color: var(--io-theme-string-color);
      }
      :host > .io-property > io-boolean {
        color: var(--io-theme-boolean-color);
      }
    </style>`;
  }
  static get properties() {
    return {
      value: Object,
      config: Object,
      props: Array,
      labeled: true,
    };
  }
  get _config() {
    return this.__proto__.__config.getConfig(this.value, this.config);
  }
  _onValueSet(event) {
    const path = event.composedPath();
    if (path[0] === this) return;
    if (event.detail.object) return; // TODO: unhack
    event.stopPropagation();
    const key = path[0].id;
    if (key !== null) {
      this.value[key] = event.detail.value;
      const detail = Object.assign({object: this.value, key: key}, event.detail);
      this.dispatchEvent('object-mutated', detail, false, window); // TODO: test
      this.dispatchEvent('value-set', detail, false);
    }
  }
  // TODO: considet valueMutated() instead
  changed() {
    const config = this._config;
    const elements = [];
    for (let c in config) {
      if (!this.props.length || this.props.indexOf(c) !== -1) {
        // if (config[c]) {
        const tag = config[c][0];
        const protoConfig = config[c][1];
        const label = config[c].label || c;
        const itemConfig = {className: 'io-property-editor', title: label, id: c, value: this.value[c], 'on-value-set': this._onValueSet};
        elements.push(
          ['div', {className: 'io-property'}, [
            this.labeled ? ['span', {className: 'io-property-label', title: label}, label + ':'] : null,
            [tag, Object.assign(itemConfig, protoConfig)]
          ]]);
        // }
      }
    }
    this.template(elements);
  }
  static get config() {
    return {
      'type:string': ['io-string', {}],
      'type:number': ['io-number', {step: 0.01}],
      'type:boolean': ['io-boolean', {true: '☑ true', false: '☐ false'}],
      'type:object': ['io-object', {}],
      'type:null': ['io-string', {}],
      'type:undefined': ['io-string', {}],
    };
  }
}

class Config {
  constructor(prototypes) {
    for (let i = 0; i < prototypes.length; i++) {
      this.registerConfig(prototypes[i].constructor.config || {});
    }
  }
  registerConfig(config) {
    for (let c in config) {
      this[c] = this[c] || [];
      this[c] = [config[c][0] || this[c][0], Object.assign(this[c][1] || {}, config[c][1] || {})];
    }
  }
  getConfig(object, customConfig) {
    const keys = Object.keys(object);
    const prototypes = [];

    let proto = object.__proto__;
    while (proto) {
      keys.push(...Object.keys(proto));
      prototypes.push(proto.constructor.name);
      proto = proto.__proto__;
    }

    const protoConfigs = {};

    for (let i in this) {
      const cfg = i.split('|');
      if (cfg.length === 1) cfg.splice(0, 0, 'Object');
      if (prototypes.indexOf(cfg[0]) !== -1) protoConfigs[cfg[1]] = this[i];
    }

    for (let i in customConfig) {
      const cfg = i.split('|');
      if (cfg.length === 1) cfg.splice(0, 0, 'Object');
      if (prototypes.indexOf(cfg[0]) !== -1) protoConfigs[cfg[1]] = customConfig[i];
    }

    const config = {};

    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      const value = object[k];
      const type = value === null ? 'null' : typeof value;
      const cstr = (value != undefined && value.constructor) ? value.constructor.name : 'null';

      if (type == 'function') continue;

      const typeStr = 'type:' + type;
      const cstrStr = 'constructor:' + cstr;
      const keyStr = k;

      config[k] = {};

      if (protoConfigs[typeStr]) config[k] = protoConfigs[typeStr];
      if (protoConfigs[cstrStr]) config[k] = protoConfigs[cstrStr];
      if (protoConfigs[keyStr]) config[k] = protoConfigs[keyStr];
    }

    return config;
  }
}

IoProperties.Register = function() {
  IoElement.Register.call(this);
  Object.defineProperty(this.prototype, '__config', {value: new Config(this.prototype.__protochain)});
};

IoProperties.Register();
IoProperties.RegisterConfig = function(config) {
  this.prototype.__config.registerConfig(config);
};

class IoArray extends IoProperties {
  static get style() {
    return html`<style>
      :host {
        display: grid;
        grid-row-gap: var(--io-theme-spacing);
        grid-column-gap: var(--io-theme-spacing);
      }
      :host[columns="2"] {
        grid-template-columns: auto auto;
      }
      :host[columns="3"] {
        grid-template-columns: auto auto auto;
      }
      :host[columns="4"] {
        grid-template-columns: auto auto auto auto;
      }
    </style>`;
  }
  changed() {
    const elements = [];
    this.setAttribute('columns', this.columns || Math.sqrt(this.value.length) || 1);
    for (let i = 0; i < this.value.length; i++) {
      elements.push(['io-number', {id: i, value: this.value[i], 'on-value-set': this._onValueSet}]);
    }
    this.template(elements);
  }
}

IoArray.Register();

class IoButton extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: inline-block;
        cursor: pointer;
        white-space: nowrap;
        -webkit-tap-highlight-color: transparent;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1em;
        border: var(--io-theme-button-border);
        border-radius: var(--io-theme-border-radius);
        padding: var(--io-theme-padding);
        padding-left: calc(3 * var(--io-theme-padding));
        padding-right: calc(3 * var(--io-theme-padding));
        background: var(--io-theme-button-bg);
        transition: background-color 0.4s;
        color: var(--io-theme-color);
        user-select: none;
      }
      :host:focus {
        outline: none;
        background: var(--io-theme-focus-bg);
      }
      :host:hover {
        background: var(--io-theme-hover-bg);
      }
      :host[pressed] {
        background: var(--io-theme-active-bg);
      }
    </style>`;
  }
  static get properties() {
    return {
      value: undefined,
      label: 'Button',
      pressed: {
        type: Boolean,
        reflect: true
      },
      action: Function,
      tabindex: 0
    };
  }
  static get listeners() {
    return {
      'keydown': 'onKeydown',
      'click': 'onClick',
    };
  }
  onKeydown(event) {
    if (!this.pressed && (event.which === 13 || event.which === 32)) {
      event.stopPropagation();
      this.pressed = true;
      this.addEventListener('keyup', this.onKeyup);
    }
  }
  onKeyup() {
    this.removeEventListener('keyup', this.onKeyup);
    this.pressed = false;
    if (this.action) this.action(this.value);
    this.dispatchEvent('io-button-clicked', {value: this.value, action: this.action});
  }
  onClick() {
    this.pressed = false;
    if (this.action) this.action(this.value);
    this.dispatchEvent('io-button-clicked', {value: this.value, action: this.action});
  }
  changed() {
    this.title = this.label;
    this.innerText = this.label;
  }
}

IoButton.Register();

class IoBoolean extends IoButton {
  static get style() {
    return html`<style>
      :host {
        display: inline;
        background: none;
      }
    </style>`;
  }
  static get properties() {
    return {
      value: {
        type: Boolean,
        reflect: true
      },
      true: 'true',
      false: 'false'
    };
  }
  constructor(props) {
    super(props);
    this.action = this.toggle;
  }
  toggle() {
    this.set('value', !this.value);
  }
  changed() {
    this.innerText = this.value ? this.true : this.false;
  }
}

IoBoolean.Register();

// TODO: document, demo, test

const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl', {antialias: true, premultipliedAlpha: false});

gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
gl.disable(gl.DEPTH_TEST);

const positionBuff = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuff);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,1,0.0,-1,-1,0.0,1,-1,0.0,1,1,0.0]), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

const uvBuff = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, uvBuff);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,1,0,0,1,0,1,1]), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

const indexBuff = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuff);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([3,2,1,3,1,0]), gl.STATIC_DRAW);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

const vertCode = `
attribute vec3 position;
attribute vec2 uv;
varying vec2 vUv;
void main(void) {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}`;

const vertShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertShader, vertCode);
gl.compileShader(vertShader);

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuff);

const shadersCache = new WeakMap();

class IoCanvas extends IoElement {
  static get style() {
    return html`<style>
      :host {
        box-sizing: border-box;
        overflow: hidden;
        position: relative;
        border: 1px solid black;
      }
      :host canvas {
        position: absolute;
        top: 0px;
        left: 0px;
        touch-action: none;
        user-select: none;
      }
    </style>`;
  }
  static get properties() {
    return {
      bg: [0, 0, 0, 1],
      color: [1, 1, 1, 1],
      size: [1, 1],
    };
  }
  static get frag() {
    return `
    varying vec2 vUv;
    void main(void) {
      vec2 px = size * vUv;
      px = mod(px, 5.0);
      if (px.x > 1.0 && px.y > 1.0) discard;
      gl_FragColor = color;
    }`;
  }
  constructor(props) {
    super(props);

    let frag = 'precision mediump float;';

    for (let prop in this.__properties) {
      let type = this.__properties[prop].type;
      let value = this.__properties[prop].value;
      if (type === Number) {
        frag += 'uniform float ' + prop + ';\n';
      } else if (type === Array) {
        frag += 'uniform vec' + value.length + ' ' + prop + ';\n';
      }
      // TODO: implement bool and matrices.
    }

    const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, frag + this.constructor.frag);
    gl.compileShader(fragShader);

    if (shadersCache.has(this.constructor)) {
      this._shader = shadersCache.get(this.constructor);
    } else {
      this._shader = gl.createProgram();
      gl.attachShader(this._shader, vertShader);
      gl.attachShader(this._shader, fragShader);
      shadersCache.set(this.constructor, this._shader);
    }

    gl.linkProgram(this._shader);

    const position = gl.getAttribLocation(this._shader, "position");
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuff);
    gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(position);

    const uv = gl.getAttribLocation(this._shader, "uv");
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuff);
    gl.vertexAttribPointer(uv, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(uv);

    this.template([['canvas', {id: 'canvas'}]]);
    this._context2d = this.$.canvas.getContext('2d');

    this.render();
  }
  resized() {
    const rect = this.getBoundingClientRect();
    this.size[0] = rect.width;
    this.size[1] = rect.height;
    this.render();
  }
  changed() {
    this.render();
  }
  render() {
    if (!this._shader) return;

    canvas.width = this.size[0];
    canvas.height = this.size[1];

    gl.viewport(0, 0, this.size[0], this.size[1]);
    gl.clearColor(this.bg[0], this.bg[1], this.bg[2], this.bg[3]);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(this._shader);

    for (let prop in this.__properties) {
      let type = this.__properties[prop].type;
      let value = this.__properties[prop].value;
      if (type === Number) {
        const uniform = gl.getUniformLocation(this._shader, prop);
        gl.uniform1f(uniform, value);
      } else if (type === Array) {
        const uniform = gl.getUniformLocation(this._shader, prop);
        switch (value.length) {
          case 2:
            gl.uniform2f(uniform, value[0], value[1]);
            break;
          case 3:
            gl.uniform3f(uniform, value[0], value[1], value[2]);
            break;
          case 4:
            gl.uniform4f(uniform, value[0], value[1], value[2], value[3]);
            break;
          default:
        }
      }
    }

    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

    if (this._context2d && canvas.width && canvas.height) {
      this.$.canvas.width = canvas.width;
      this.$.canvas.height = canvas.height;
      this._context2d.drawImage(canvas, 0, 0, canvas.width, canvas.height);
    }
  }
}

IoCanvas.Register();

class IoCollapsable extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: column;
        border: var(--io-theme-frame-border);
        border-radius: var(--io-theme-border-radius);
        padding: var(--io-theme-padding);
        background: var(--io-theme-frame-bg);
      }
      :host > io-boolean {
        border: none;
        border-radius: 0;
        background: none;
      }
      :host > io-boolean:focus {
        border: none;
      }
      :host > io-boolean::before {
        content: '▸';
        display: inline-block;
        width: 0.65em;
        margin: 0 0.25em;
      }
      :host[expanded] > io-boolean{
        margin-bottom: var(--io-theme-padding);
      }
      :host[expanded] > io-boolean::before{
        content: '▾';
      }
      :host > .io-collapsable-content {
        display: block;
        border: var(--io-theme-content-border);
        border-radius: var(--io-theme-border-radius);
        padding: var(--io-theme-padding);
        background: var(--io-theme-content-bg);
      }
    </style>`;
  }
  static get properties() {
    return {
      label: String,
      expanded: {
        type: Boolean,
        reflect: true
      },
      elements: Array,
    };
  }
  changed() {
    this.template([
      ['io-boolean', {true: this.label, false: this.label, value: this.bind('expanded')}],
      this.expanded ? ['div', {className: 'io-collapsable-content'}, this.elements] : null
    ]);
  }
}

IoCollapsable.Register();

// TODO: document and test

const stagingElement = document.createElement('div');

class IoElementCache extends IoElement {
  static get properties() {
    return {
      selected: Number,
      elements:  Array,
      precache: Boolean,
      cache: Boolean,
      _cache: Object,
    };
  }
  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('readystatechange', this.readystatechange);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('readystatechange', this.readystatechange);
  }
  readystatechange() {
    this.precacheChanged();
  }
  precacheChanged() {
    if (this.precache && document.readyState === 'complete') {
      this.template(this.elements, stagingElement);
      for (let i = 0; i < stagingElement.childNodes.length; i++) {
        this._cache[i] = stagingElement.childNodes[i];
      }
      stagingElement.innerHTML = '';
    }
  }
  dispose() {
    super.dispose();
    this.innerHTML = '';
    stagingElement.innerHTML = '';
    delete this._cache;
  }
  changed() {
    if (!this.elements[this.selected]) return;
    if ((this.precache || this.cache) && (this.elements[this.selected].cache !== false) && this._cache[this.selected]) {
      this.innerHTML = '';
      this.appendChild(this._cache[this.selected]);
    } else {
      if (this.cache) {
        this.innerHTML = '';
        this.template([this.elements[this.selected]], stagingElement);
        this._cache[this.selected] = stagingElement.childNodes[0];
        this.appendChild(this._cache[this.selected]);
        stagingElement.innerHTML = '';
      } else {
        this.template([this.elements[this.selected]]);
      }
    }
  }
}

IoElementCache.Register();

const nodes = {};
let hashes = {};

const parseHashes = function() {
  return window.location.hash.substr(1).split('&').reduce(function (result, item) {
    const parts = item.split('=');
    result[parts[0]] = parts[1];
    return result;
  }, {});
};

const getHashes = function() {
  hashes = parseHashes();
  for (let hash in hashes) {
    if (nodes[hash]) {
      if (nodes[hash] !== '') {
        if (!isNaN(hashes[hash])) {
          nodes[hash].value = JSON.parse(hashes[hash]);
        } else if (hashes[hash] === 'true' || hashes[hash] === 'false') {
          nodes[hash].value = JSON.parse(hashes[hash]);
        } else {
          nodes[hash].value = hashes[hash];
        }
      }
    }
  }
};

const setHashes = function(force) {
  let hashString = '';
  for (let node in nodes) {
    if ((nodes[node].hash || force) && nodes[node].value !== undefined && nodes[node].value !== '' && nodes[node].value !== nodes[node].defValue) {
      if (typeof nodes[node].value === 'string') {
        hashString += node + '=' + nodes[node].value + '&';
      } else {
        hashString += node + '=' + JSON.stringify(nodes[node].value) + '&';
      }
    }
  }
  hashString = hashString.slice(0, -1);
  window.location.hash = hashString;
  if (!window.location.hash) history.replaceState({}, document.title, ".");
};

window.addEventListener("hashchange", getHashes, false);
getHashes();

class IoStorageNode extends IoCore {
  static get properties() {
    return {
      key: String,
      value: undefined,
      defValue: undefined,
      hash: Boolean,
    };
  }
  constructor(props, defValue) {
    super(props);
    this.defValue = defValue;
    const hashValue = hashes[this.key];
    const key = window.location.pathname !== '/' ? window.location.pathname + this.key : this.key;
    const localValue = localStorage.getItem(key);
    if (hashValue !== undefined) {
      this.value = JSON.parse(hashValue);
    } else {
      if (localValue !== null && localValue !== undefined) {
        this.value = JSON.parse(localValue);
      } else {
        this.value = defValue;
      }
    }
  }
  valueChanged() {
    setHashes();
    const key = window.location.pathname !== '/' ? window.location.pathname + this.key : this.key;
    if (this.value === null || this.value === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(this.value));
    }
  }
}

IoStorageNode.Register();

function IoStorage(key, defValue, hash) {
  if (!nodes[key]) {
    nodes[key] = new IoStorageNode({key: key, hash: hash}, defValue);
    nodes[key].binding = nodes[key].bind('value');
    nodes[key].valueChanged();
  }
  return nodes[key].binding;
}

class IoInspectorBreadcrumbs extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex: 1 0;
        flex-direction: row;
        border: var(--io-theme-field-border);
        border-radius: var(--io-theme-border-radius);
        padding: var(--io-theme-padding);
        color: var(--io-theme-field-color);
        background: var(--io-theme-field-bg);
      }
      :host > io-inspector-link {
        border: none;
        overflow: hidden;
        text-overflow: ellipsis;
        background: none;
        padding: 0;
        padding: var(--io-theme-padding);
      }
      :host > io-inspector-link:first-of-type {
        color: var(--io-theme-color);
        overflow: visible;
        text-overflow: clip;
        margin-left: 0.5em;
      }
      :host > io-inspector-link:last-of-type {
        overflow: visible;
        text-overflow: clip;
        margin-right: 0.5em;
      }
      :host > io-inspector-link:not(:first-of-type):before {
        content: '>';
        margin: 0 0.5em;
        opacity: 0.25;
      }
    </style>`;
  }
  static get properties() {
    return {
      crumbs: Array,
    };
  }
  changed() {
    this.template([this.crumbs.map(i => ['io-inspector-link', {value: i}])]);
  }
}

IoInspectorBreadcrumbs.Register();

class IoInspectorLink extends IoButton {
  static get style() {
    return html`<style>
      :host {
        border: none;
        overflow: hidden;
        text-overflow: ellipsis;
        background: none;
        padding: 0;
        border: 1px solid transparent;
        color: var(--io-theme-link-color);
        padding: var(--io-theme-padding) !important;
      }
      :host:focus {
        outline: none;
        background: none;
        text-decoration: underline;
      }
      :host:hover {
        background: none;
        text-decoration: underline;
      }
      :host[pressed] {
        background: none;
      }
    </style>`;
  }
  valueChanged() {
    let name = this.value.constructor.name;
    if (this.value.name) name += ' (' + this.value.name + ')';
    else if (this.value.label) name += ' (' + this.value.label + ')';
    else if (this.value.title) name += ' (' + this.value.title + ')';
    else if (this.value.id) name += ' (' + this.value.id + ')';
    this.title = name;
    this.innerText = name;
  }
}

IoInspectorLink.Register();

function isValueOfPropertyOf(prop, object) {
  for (let key in object) if (object[key] === prop) return key;
  return null;
}

class IoInspector extends IoElement {
  static get style() {
    return html`<style>
    :host {
      display: flex;
      flex-direction: column;
      border: var(--io-theme-content-border);
      border-radius: var(--io-theme-border-radius);
      padding: var(--io-theme-padding);
      background: var(--io-theme-content-bg);
    }
    :host > io-inspector-breadcrumbs {
      margin: var(--io-theme-spacing);
    }
    :host > io-collapsable {
      margin: var(--io-theme-spacing);
    }
    :host > io-collapsable > div io-properties > .io-property {
      overflow: hidden;
      padding: var(--io-theme-padding);
    }
    :host > io-collapsable > div io-properties > .io-property:not(:last-of-type) {
      border-bottom: var(--io-theme-border);
    }
    :host > io-collapsable > div io-properties > .io-property > :nth-child(1) {
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: right;
      flex: 0 1 8em;
      min-width: 3em;
      padding: var(--io-theme-padding);
      margin: calc(0.25 * var(--io-theme-spacing));
    }
    :host > io-collapsable > div io-properties > .io-property > :nth-child(2) {
      flex: 1 0 8em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 2em;
    }

    /* :host > .io-property > io-object,
    :host > .io-property > io-object > io-boolean,
    :host > .io-property > io-object > io-properties {
      padding: 0 !important;
      border: none !important;
      background: none !important;
    } */

    :host div io-properties > .io-property > io-object,
    :host div io-properties > .io-property > io-number,
    :host div io-properties > .io-property > io-string,
    :host div io-properties > .io-property > io-boolean {
      border: 1px solid transparent;
      padding: var(--io-theme-padding) !important;
    }
    :host div io-properties > .io-property > io-boolean:not([value]) {
      opacity: 0.5;
    }
    :host div io-properties > .io-property > io-option {
      flex: 0 1 auto !important;
      padding: var(--io-theme-padding) !important;
    }
    :host div io-properties > .io-property > io-number,
    :host div io-properties > .io-property > io-string {
      border: var(--io-theme-field-border);
      color: var(--io-theme-field-color);
      background: var(--io-theme-field-bg);
    }

    :host io-properties > .io-property > io-properties {
      border: var(--io-theme-field-border);
      background: rgba(127, 127, 127, 0.125);
    }
    </style>`;
  }
  static get properties() {
    return {
      value: Object,
      props: Array,
      config: Object,
      labeled: true,
      crumbs: Array,
    };
  }
  static get listeners() {
    return {
      'io-button-clicked': 'onLinkClicked',
    };
  }
  onLinkClicked(event) {
    event.stopPropagation();
    if (event.path[0].localName === 'io-inspector-link') {
      this.value = event.detail.value;
    }
  }
  get groups() {
    return this.__proto__.__config.getConfig(this.value, this.config);
  }
  valueChanged() {
    let crumb = this.crumbs.find((crumb) => { return crumb === this.value; });
    let lastrumb = this.crumbs[this.crumbs.length - 1];
    if (crumb) {
      this.crumbs.length = this.crumbs.indexOf(crumb) + 1;
    } else {
      if (!lastrumb || !isValueOfPropertyOf(this.value, lastrumb)) this.crumbs.length = 0;
      this.crumbs.push(this.value);
    }
    this.crumbs = [...this.crumbs];
  }
  changed() {
    const elements = [
      ['io-inspector-breadcrumbs', {crumbs: this.crumbs}],
      // TODO: add search
    ];
    // TODO: rewise and document use of storage
    let uuid = this.value.constructor.name;
    uuid += this.value.guid || this.value.uuid || this.value.id || '';
    for (let group in this.groups) {
      elements.push(
        ['io-collapsable', {
          label: group,
          expanded: IoStorage('io-inspector-group-' + uuid + '-' + group, false),
          elements: [
            ['io-properties', {
              value: this.value,
              props: this.groups[group],
              config: {
                'type:object': ['io-inspector-link']
              },
              labeled: true,
            }]
          ]
        }],
      );
    }
    this.template(elements);
  }
  static get config() {
    return {
      'Object|hidden': [/^_/],
      'HTMLElement|hidden': [/^_/, 'innerText', 'outerText', 'innerHTML', 'outerHTML', 'textContent'],
    };
  }
}

class Config$1 {
  constructor(prototypes) {
    for (let i = 0; i < prototypes.length; i++) {
      this.registerConfig(prototypes[i].constructor.config || {});
    }
  }
  registerConfig(config) {
    for (let g in config) {
      this[g] = this[g] || [];
      this[g] = [...this[g], ...config[g]];
    }
  }
  getConfig(object, customGroups) {
    const keys = Object.keys(object);
    const prototypes = [];

    let proto = object.__proto__;
    while (proto) {
      keys.push(...Object.keys(proto));
      prototypes.push(proto.constructor.name);
      proto = proto.__proto__;
    }

    const protoGroups = {};

    for (let i in this) {
      const grp = i.split('|');
      if (grp.length === 1) grp.splice(0, 0, 'Object');
      if (prototypes.indexOf(grp[0]) !== -1) {
        protoGroups[grp[1]] = protoGroups[grp[1]] || [];
        protoGroups[grp[1]].push(...this[i]);
      }
    }

    for (let i in customGroups) {
      const grp = i.split('|');
      if (grp.length === 1) grp.splice(0, 0, 'Object');
      if (prototypes.indexOf(grp[0]) !== -1) {
        protoGroups[grp[1]] = protoGroups[grp[1]] || [];
        protoGroups[grp[1]].push(customGroups[i]);
      }
    }

    const groups = {};
    const assigned = [];

    for (let g in protoGroups) {
      groups[g] = groups[g] || [];
      for (let gg in protoGroups[g]) {
        const gKey = protoGroups[g][gg];
        const reg = new RegExp(gKey);
        for (let i = 0; i < keys.length; i++) {
          const k = keys[i];
          if (typeof gKey === 'string') {
            if (k == gKey) {
              groups[g].push(k);
              assigned.push(k);
            }
          } else if (typeof gKey === 'object') {
            if (reg.exec(k)) {
              groups[g].push(k);
              assigned.push(k);
            }
          }
        }
      }
    }

    if (assigned.length === 0) {
      groups['properties'] = keys;
    } else {
      for (let i = 0; i < keys.length; i++) {
        groups['properties'] = groups['properties'] || [];
        if (assigned.indexOf(keys[i]) === -1) groups['properties'].push(keys[i]);
      }
    }

    for (let group in groups) { if (groups[group].length === 0) delete groups[group]; }
    delete groups.hidden;

    return groups;
  }
}

IoInspector.Register = function() {
  IoElement.Register.call(this);
  Object.defineProperty(this.prototype, '__config', {value: new Config$1(this.prototype.__protochain)});
};

IoInspector.Register();
IoInspector.RegisterConfig = function(config) {
  this.prototype.__config.registerConfig(config);
};

let previousOption;
let previousParent;
let timeoutOpen;
let timeoutReset;
let WAIT_TIME = 1200;
// let lastFocus;

// TODO: implement search

class IoMenuLayer extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: block;
        visibility: hidden;
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 100000;
        background: rgba(0, 0, 0, 0.2);
        user-select: none;
        overflow: hidden;
        pointer-events: none;
        touch-action: none;
      }
      :host[expanded] {
        visibility: visible;
        pointer-events: all;
      }
      :host io-menu-options:not([expanded]) {
        display: none;
      }
      :host io-menu-options {
        position: absolute;
        transform: translateZ(0);
        top: 0;
        left: 0;
        min-width: 6em;
      }
    </style>`;
  }
  static get properties() {
    return {
      expanded: {
        type: Boolean,
        reflect: true,
      },
      $options: Array
    };
  }
  static get listeners() {
    return {
      'pointerup': 'onPointerup',
      'pointermove': 'onPointermove',
      'dragstart': 'preventDefault',
      'contextmenu': 'preventDefault',
    };
  }
  constructor(props) {
    super(props);
    this._hoveredItem = null;
    this._hoveredGroup = null;
    this._x = 0;
    this._y = 0;
    this._v = 0;
    window.addEventListener('scroll', this.onScroll);
    // window.addEventListener('focusin', this.onWindowFocus);
  }
  registerGroup(group) {
    this.$options.push(group);
    group.addEventListener('focusin', this.onMenuItemFocused);
    group.addEventListener('keydown', this.onKeydown);
    group.addEventListener('expanded-changed', this.onGroupExpandedChanged);
  }
  unregisterGroup(group) {
    this.$options.splice(this.$options.indexOf(group), 1);
    group.removeEventListener('focusin', this.onMenuItemFocused);
    group.removeEventListener('keydown', this.onKeydown);
    group.removeEventListener('expanded-changed', this.onGroupExpandedChanged);
  }
  collapseAllGroups() {
    for (let i = this.$options.length; i--;) {
      this.$options[i].expanded = false;
    }
  }
  runAction(option) {
    if (typeof option.action === 'function') {
      option.action.apply(null, [option.value]);
      this.collapseAllGroups();
      // if (lastFocus) {
      //   lastFocus.focus();
      // }
    } else if (option.button) {
      option.button.click(); // TODO: test
      this.collapseAllGroups();
      // if (lastFocus) {
      //   lastFocus.focus();
      // }
    }
  }
  onScroll() {
    if (this.expanded) {
      this.collapseAllGroups();
      // if (lastFocus) {
      //   lastFocus.focus();
      // }
    }
  }
  // onWindowFocus(event) {
  //   if (event.target.localName !== 'io-menu-item') lastFocus = event.target;
  // }
  onMenuItemFocused(event) {
    const path = event.composedPath();
    const item = path[0];
    const optionschain = item.optionschain;
    for (let i = this.$options.length; i--;) {
      if (optionschain.indexOf(this.$options[i]) === -1) {
        this.$options[i].expanded = false;
      }
    }
  }
  onPointermove(event) {
    event.preventDefault();
    this._x = event.clientX;
    this._y = event.clientY;
    this._v = (2 * this._v + Math.abs(event.movementY) - Math.abs(event.movementX)) / 3;
    let groups = this.$options;
    for (let i = groups.length; i--;) {
      if (groups[i].expanded) {
        let rect = groups[i].getBoundingClientRect();
        if (rect.top < this._y && rect.bottom > this._y && rect.left < this._x && rect.right > this._x) {
          this._hover(groups[i]);
          this._hoveredGroup = groups[i];
          return groups[i];
        }
      }
    }
    this._hoveredItem = null;
    this._hoveredGroup = null;
  }
  onPointerup(event) {
    event.stopPropagation();
    event.preventDefault();
    const path = event.composedPath();
    let elem = path[0];
    if (elem.localName === 'io-menu-item') {
      this.runAction(elem.option);
      elem.menuroot.dispatchEvent('io-menu-item-clicked', elem.option);
    } else if (elem === this) {
      if (this._hoveredItem) {
        this.runAction(this._hoveredItem.option);
        this._hoveredItem.menuroot.dispatchEvent('io-menu-item-clicked', this._hoveredItem.option);
      } else if (!this._hoveredGroup) {
        this.collapseAllGroups();
        // if (lastFocus) {
        //   lastFocus.focus();
        // }
      }
    }
  }
  onKeydown(event) {
    event.preventDefault();
    const path = event.composedPath();
    if (path[0].localName !== 'io-menu-item') return;

    let elem = path[0];
    let group = elem.$parent;
    let siblings = [...group.querySelectorAll('io-menu-item')] || [];
    let children = elem.$options ? [...elem.$options.querySelectorAll('io-menu-item')]  : [];
    let index = siblings.indexOf(elem);

    let command = '';

    if (!group.horizontal) {
      if (event.key == 'ArrowUp') command = 'prev';
      if (event.key == 'ArrowRight') command = 'in';
      if (event.key == 'ArrowDown') command = 'next';
      if (event.key == 'ArrowLeft') command = 'out';
    } else {
      if (event.key == 'ArrowUp') command = 'out';
      if (event.key == 'ArrowRight') command = 'next';
      if (event.key == 'ArrowDown') command = 'in';
      if (event.key == 'ArrowLeft') command = 'prev';
    }
    if (event.key == 'Tab') command = 'next';
    if (event.key == 'Escape') command = 'exit';
    if (event.key == 'Enter' || event.which == 32) command = 'action';

    switch (command) {
      case 'action':
        this.onPointerup(event); // TODO: test
        break;
      case 'prev':
        siblings[(index + siblings.length - 1) % (siblings.length)].focus();
        break;
      case 'next':
        siblings[(index + 1) % (siblings.length)].focus();
        break;
      case 'in':
        if (children.length) children[0].focus();
        break;
      case 'out':
        if (group && group.$parent) group.$parent.focus();
        break;
      case 'exit':
        this.collapseAllGroups();
        break;
      default:
        break;
    }
  }
  _hover(group) {
    let items = group.querySelectorAll('io-menu-item');
    for (let i = items.length; i--;) {
      let rect = items[i].getBoundingClientRect();
      if (rect.top < this._y && rect.bottom > this._y && rect.left < this._x && rect.right > this._x) {
        let force = group.horizontal;
        this._focus(items[i], force);
        this._hoveredItem = items[i];
        return items[i];
      }
    }
    this._hoveredItem = null;
    this._hoveredItem = null;
  }
  _focus(item, force) {
    if (item !== previousOption) {
      clearTimeout(timeoutOpen);
      clearTimeout(timeoutReset);
      if (this._v > 1 || item.parentNode !== previousParent || force) {
        previousOption = item;
        item.focus();
      } else {
        timeoutOpen = setTimeout(function() {
          previousOption = item;
          item.focus();
        }.bind(this), WAIT_TIME);
      }
      previousParent = item.parentNode;
      timeoutReset = setTimeout(function() {
        previousOption = null;
        previousParent = null;
      }.bind(this), WAIT_TIME + 1);
    }
  }
  onGroupExpandedChanged(event) {
    const path = event.composedPath();
    if (path[0].expanded) this._setGroupPosition(path[0]);
    for (let i = this.$options.length; i--;) {
      if (this.$options[i].expanded) {
        this.expanded = true;
        return;
      }
    }
    setTimeout(() => { this.expanded = false; });
  }
  _setGroupPosition(group) {
    if (!group.$parent) return;
    let rect = group.getBoundingClientRect();
    let pRect = group.$parent.getBoundingClientRect();
     // TODO: unhack horizontal long submenu bug.
    if (group.position === 'bottom' && rect.height > (window.innerHeight - this._y)) group.position = 'right';
    //
    switch (group.position) {
      case 'pointer':
        group._x = this._x - 2 || pRect.x;
        group._y = this._y - 2 || pRect.y;
        break;
      case 'bottom':
        group._x = pRect.x;
        group._y = pRect.bottom;
        break;
      case 'right':
      default:
        group._x = pRect.right;
        group._y = pRect.y;
        if (group._x + rect.width > window.innerWidth) {
          group._x = pRect.x - rect.width;
        }
        break;
    }
    group._x = Math.min(group._x, window.innerWidth - rect.width);
    group._y = Math.min(group._y, window.innerHeight - rect.height);
    group.style.left = group._x + 'px';
    group.style.top = group._y + 'px';
  }
  expandedChanged() {
    if (!this.expanded) return;
    let group = this._hoveredGroup;
    if (group) {
      let rect = group.getBoundingClientRect();
      if (rect.height > window.innerHeight) {
        if (this._y < 100 && rect.top < 0) {
          let scrollSpeed = (100 - this._y) / 5000;
          let overflow = rect.top;
          group._y = group._y - Math.ceil(overflow * scrollSpeed) + 1;
        } else if (this._y > window.innerHeight - 100 && rect.bottom > window.innerHeight) {
          let scrollSpeed = (100 - (window.innerHeight - this._y)) / 5000;
          let overflow = (rect.bottom - window.innerHeight);
          group._y = group._y - Math.ceil(overflow * scrollSpeed) - 1;
        }
        group.style.left = group._x + 'px';
        group.style.top = group._y + 'px';
      }
    }
    requestAnimationFrame(this.expandedChanged);
  }
}

IoMenuLayer.Register();

IoMenuLayer.singleton = new IoMenuLayer();

document.body.appendChild(IoMenuLayer.singleton);

class IoMenuOptions extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: column;
        white-space: nowrap;
        user-select: none;
        touch-action: none;
        background: white;
        color: black;
        padding: var(--io-theme-padding);
        border: var(--io-theme-menu-border);
        border-radius: var(--io-theme-border-radius);
        box-shadow: var(--io-theme-menu-shadow);
      }
      :host[horizontal] {
        flex-direction: row;
      }
      :host[horizontal] > io-menu-item {
        margin-left: 0.5em;
        margin-right: 0.5em;
      }
      :host[horizontal] > io-menu-item > :not(.menu-label) {
        display: none;
      }
    </style>`;
  }
  static get properties() {
    return {
      options: Array,
      expanded: {
        type: Boolean,
        reflect: true
      },
      position: 'right',
      horizontal: {
        type: Boolean,
        reflect: true
      },
      $parent: HTMLElement
    };
  }
  static get listeners() {
    return {
      'focusin': '_onFocus',
    };
  }
  optionsChanged() {
    const itemPosition = this.horizontal ? 'bottom' : 'right';
    this.template([this.options.map((elem, i) =>
      ['io-menu-item', {
        $parent: this,
        option: typeof this.options[i] === 'object' ? this.options[i] : {value: this.options[i], label: this.options[i]},
        position: itemPosition
      }]
    )]);
  }
  connectedCallback() {
    super.connectedCallback();
    IoMenuLayer.singleton.registerGroup(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    IoMenuLayer.singleton.unregisterGroup(this);
  }
  _onFocus(event) {
    const path = event.composedPath();
    const item = path[0];
    IoMenuLayer.singleton._hoveredGroup = this;
    if (item.localName === 'io-menu-item') {
      IoMenuLayer.singleton._hoveredItem = item;
      if (item.option.options) this.expanded = true;
    }
  }
}

IoMenuOptions.Register();

class IoMenuItem extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: row;
        cursor: pointer;
        padding: var(--io-theme-padding);
        line-height: 1em;
        touch-action: none;
      }
      :host > * {
        pointer-events: none;
        padding: var(--io-theme-spacing);
      }
      :host > .menu-icon {
        width: 1.25em;
        line-height: 1em;
      }
      :host > .menu-label {
        flex: 1;
      }
      :host > .menu-hint {
        opacity: 0.5;
        padding: 0 0.5em;
      }
      :host > .menu-more {
        opacity: 0.25;
      }
      /* @media (-webkit-min-device-pixel-ratio: 2) {
        :host > * {
          padding: calc(2 * var(--io-theme-spacing));
        }
      } */
    </style>`;
  }
  static get properties() {
    return {
      option: Object,
      position: String,
      $parent: HTMLElement,
      tabindex: 1
    };
  }
  static get listeners() {
    return {
      'focus': 'onFocus',
      'pointerdown': 'onPointerdown',
    };
  }
  get menuroot() {
    let parent = this;
    while (parent && parent.$parent) {
      parent = parent.$parent;
    }
    return parent;
  }
  get optionschain() {
    const chain = [];
    if (this.$options) chain.push(this.$options);
    let parent = this.$parent;
    while (parent) {
      if (parent.localName == 'io-menu-options') chain.push(parent);
      parent = parent.$parent;
    }
    return chain;
  }
  changed() {
    if (this.option.options) {
      let grpProps = {options: this.option.options, $parent: this, position: this.position};
      if (!this.$options) {
        this.$options = new IoMenuOptions(grpProps);
      } else {
        this.$options.setProperties(grpProps); // TODO: test
      }
    }
    this.template([
      this.option.icon ? ['span', {className: 'menu-icon'}, this.option.icon] : null,
      ['span', {className: 'menu-label'}, this.option.label || this.option.value],
      this.option.hint ? ['span', {className: 'menu-hint'}] : null,
      this.option.options ? ['span', {className: 'menu-more'}, '▸'] : null,
    ]);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.$options) {
      if (this.$options.parentNode) {
        IoMenuLayer.singleton.removeChild(this.$options);
      }
    }
  }
  onPointerdown(event) {
    IoMenuLayer.singleton.setPointerCapture(event.pointerId);
    this.focus();
  }
  onFocus() {
    if (this.$options) {
      if (!this.$options.parentNode) {
        IoMenuLayer.singleton.appendChild(this.$options);
      }
      this.$options.expanded = true;
    }
  }
}

IoMenuItem.Register();

// TODO: implement working mousestart/touchstart UX
// TODO: implement keyboard modifiers maybe. Touch alternative?
class IoMenu extends IoElement {
  static get properties() {
    return {
      options: Array,
      expanded: Boolean,
      position: 'pointer',
      ondown: true,
      button: 0,
    };
  }
  constructor(props) {
    super(props);
    this.template([
      ['io-menu-options', {
        id: 'group',
        $parent: this,
        options: this.bind('options'),
        position: this.bind('position'),
        expanded: this.bind('expanded')
      }]
    ]);
    this.$.group.__parent = this;
  }
  connectedCallback() {
    super.connectedCallback();
    this._parent = this.parentElement;
    this._parent.addEventListener('pointerdown', this.onPointerdown);
    this._parent.addEventListener('contextmenu', this.onContextmenu);
    this._parent.style['touch-action'] = 'none';
    IoMenuLayer.singleton.appendChild(this.$['group']);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._parent.removeEventListener('pointerdown', this.onPointerdown);
    this._parent.removeEventListener('contextmenu', this.onContextmenu);
    if (this.$['group']) IoMenuLayer.singleton.removeChild(this.$['group']);
    // TODO: unhack
  }
  getBoundingClientRect() {
    return this._parent.getBoundingClientRect();
  }
  onContextmenu(event) {
    if (this.button === 2) {
      event.preventDefault();
      this.open(event);
    }
  }
  onPointerdown(event) {
    this._parent.setPointerCapture(event.pointerId);
    this._parent.addEventListener('pointerup', this.onPointerup);
    if (this.ondown && event.button === this.button) {
      this.open(event);
    }
  }
  onPointerup(event) {
    this._parent.removeEventListener('pointerup', this.onPointerup);
    if (!this.ondown && event.button === this.button) {
      this.open(event);
    }
  }
  open(event) {
    IoMenuLayer.singleton.collapseAllGroups();
    if (event.pointerId) IoMenuLayer.singleton.setPointerCapture(event.pointerId);
    IoMenuLayer.singleton._x = event.clientX;
    IoMenuLayer.singleton._y = event.clientY;
    this.expanded = true;
  }
}

IoMenu.Register();

const selection = window.getSelection();
const range = document.createRange();

class IoNumber extends IoElement {
  static get style() {
    return html`<style>
      :host {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        border: var(--io-theme-field-border);
        border-radius: var(--io-theme-border-radius);
        padding: var(--io-theme-padding);
        color: var(--io-theme-field-color);
        background: var(--io-theme-field-bg);
      }
      :host:focus {
        overflow: hidden;
        text-overflow: clip;
        outline: none;
        border: var(--io-theme-focus-border);
        background: var(--io-theme-focus-bg);
      }
    </style>`;
  }
  static get properties() {
    return {
      value: Number,
      conversion: 1,
      step: 0.001,
      min: -Infinity,
      max: Infinity,
      strict: true,
      tabindex: 0,
      contenteditable: true
    };
  }
  static get listeners() {
    return {
      'focus': '_onFocus'
    };
  }
  constructor(props) {
    super(props);
    this.setAttribute('spellcheck', 'false');
  }
  _onFocus() {
    this.addEventListener('blur', this._onBlur);
    this.addEventListener('keydown', this._onKeydown);
    this._select();
  }
  _onBlur() {
    this.removeEventListener('blur', this._onBlur);
    this.removeEventListener('keydown', this._onKeydown);
    this.setFromText(this.innerText);
    this.scrollTop = 0;
    this.scrollLeft = 0;
  }
  _onKeydown(event) {
    if (event.which == 13) {
      event.preventDefault();
      this.setFromText(this.innerText);
    }
  }
  _select() {
    range.selectNodeContents(this);
    selection.removeAllRanges();
    selection.addRange(range);
  }
  setFromText(text) {
    // TODO: test conversion
    let value = Math.round(Number(text) / this.step) * this.step / this.conversion;
    if (this.strict) {
      value = Math.min(this.max, Math.max(this.min, value));
    }
    if (!isNaN(value)) this.set('value', value);
  }
  changed() {
    let value = this.value;
    if (typeof value == 'number' && !isNaN(value)) {
      value *= this.conversion;
      value = value.toFixed(-Math.round(Math.log(this.step) / Math.LN10));
      this.innerText = String(value);
    } else {
      this.innerText = 'NaN';
    }
  }
}

IoNumber.Register();

class IoObject extends IoCollapsable {
  static get properties() {
    return {
      value: Object,
      props: Array,
      config: null,
      labeled: true,
    };
  }
  changed() {
    const label = this.label || this.value.constructor.name;
    this.template([
      ['io-boolean', {true: label, false: label, value: this.bind('expanded')}],
      this.expanded ? [
        ['io-properties', {
          className: 'io-collapsable-content',
          value: this.value,
          props: this.props.length ? this.props : Object.keys(this.value),
          config: this.config,
          labeled: this.labeled,
        }]
      ] : null
    ]);
  }
}

IoObject.Register();

class IoOption extends IoButton {
  static get style() {
    return html`<style>
      :host:not([hamburger])::after {
        width: 0.65em;
        margin-left: 0.25em;
        content: '▾';
      }
    </style>`;
  }
  static get properties() {
    return {
      options: Array,
      hamburger: {
        type: Boolean,
        reflect: true,
      },
    };
  }
  static get listeners() {
    return {
      'io-button-clicked': 'onClicked'
    };
  }
  onClicked() {
    this.$['menu'].expanded = true;
    let firstItem = this.$['menu'].$['group'].querySelector('io-menu-item');
    if (firstItem) firstItem.focus();
  }
  onMenu(event) {
    this.$['menu'].expanded = false;
    this.set('value', event.detail.value);
    if (this.action) this.action(this.value);
  }
  changed() {
    let label = this.value;
    if (label instanceof Object) label = label.__proto__.constructor.name;
    if (this.options) {
      for (let i = 0; i < this.options.length; i++) {
        if (this.options[i].value === this.value) {
          label = this.options[i].label || label;
          break;
        }
      }
    }
    this.template([
      ['span', this.hamburger ? '☰' : String(label)],
      ['io-menu', {
        id: 'menu',
        options: this.options,
        position: 'bottom',
        button: 0,
        ondown: false, // TODO: make open ondown and stay open with position:bottom
        'on-io-menu-item-clicked': this.onMenu}]
    ]);
  }
}

IoOption.Register();

// TODO: document and test

class IoTabs extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        font-style: italic;
        overflow: hidden;
      }
      :host > * {
        flex: 0 0 auto;
        display: none;
      }
      :host:not([vertical]) > * {
        margin-right: var(--io-theme-spacing);
      }
      :host[vertical] > * {
        margin-bottom: var(--io-theme-spacing);
      }
      :host[vertical] > io-option {
        padding: calc(var(--io-theme-padding) * 9) var(--io-theme-padding);
      }
      :host[vertical] {
        flex-direction: column;
      }
      :host[vertical][collapsed] > io-option {
        display: inherit;
      }
      :host[vertical]:not([collapsed]) > :nth-child(n+3) {
        display: inherit;
      }
      :host:not([vertical])[overflow] > :nth-child(-n+2) {
        display: inherit;
      }
      :host:not([vertical]):not([overflow]) > :nth-child(n+3) {
        display: inherit;
      }
      :host:not([vertical])[overflow] > :nth-child(n+3) {
        display: inherit;
        visibility: hidden;
      }
      :host:not([vertical]) > * {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.125), transparent 0.75em);
      }
      :host:not([vertical]) > *.io-selected {
        border-bottom-color: var(--io-theme-content-bg);
        background-image: none;
      }
      :host[vertical] > * {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        background-image: linear-gradient(270deg, rgba(0, 0, 0, 0.125), transparent 0.75em);
      }
      :host[vertical] > *.io-selected {
        border-right-color: var(--io-theme-content-bg);
        background-image: none;
      }
      :host > io-option {
        font-style: normal;
      }
      :host > io-button {
        letter-spacing: 0.145em;
        font-weight: 500;
      }
      :host > io-button:not(.io-selected) {
        color: rgba(0, 0, 0, 0.5);
      }
      :host > io-button.io-selected {
        background: var(--io-theme-content-bg);
        font-weight: 600;
        letter-spacing: 0.11em;
      }
    </style>`;
  }
  static get properties() {
    return {
      options: Array,
      selected: null,
      vertical: {
        type: Boolean,
        reflect: true,
      },
      overflow: {
        type: Boolean,
        reflect: true,
      },
      collapsed: {
        type: Boolean,
        reflect: true
      },
    };
  }
  select(id) {
    this.selected = id;
  }
  resized() {
    const rect = this.getBoundingClientRect();
    const lastButton = this.children[this.children.length-1];
    const rectButton = lastButton.getBoundingClientRect();
    this.overflow = (!this.vertical && this.collapsed) || rect.right < rectButton.right;
  }
  changed() {
    const buttons = [];
    const hamburger = ['io-option', {
      hamburger: true,
      value: this.bind('selected'),
      options: this.options
    }];
    for (let i = 0; i < this.options.length; i++) {
      buttons.push(['io-button', {
        label: this.options[i].label,
        value: this.options[i].value,
        action: this.select,
        className: this.selected === this.options[i].value ? 'io-selected' : ''
      }]);
    }
    this.template([hamburger, buttons[this.selected] || ['span'], ...buttons]);
  }
}

IoTabs.Register();

class IoSelector extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        position: relative;
        overflow: auto;
      }
      :host[vertical] {
        flex-direction: row;
      }
      :host > io-tabs {
        z-index: 2;
        flex: 0 0 auto;
      }
      :host:not([vertical]) > io-tabs {
        margin: 0 var(--io-theme-spacing);
        margin-bottom: -1px;
      }
      :host[vertical] > io-tabs {
        flex: 0 0 auto;
        margin: var(--io-theme-spacing) 0;
        margin-right: -1px;
      }
      :host[vertical] > io-tabs > io-button,
      :host[vertical] > io-tabs > io-button.io-selected {
        align-self: flex-end;
        color: var(--io-theme-link-color);
        border: none;
        background: none;
        background-image: none !important;
      }
      :host[vertical] > io-tabs > io-button:hover {
        text-decoration: underline;
      }
      :host > io-element-cache {
        flex: 1 1 auto;
        padding: var(--io-theme-padding);
        border: var(--io-theme-content-border);
        border-radius: var(--io-theme-border-radius);
        background: var(--io-theme-content-bg);
        overflow: auto;
      }
    </style>`;
  }
  static get properties() {
    return {
      elements: Array,
      selected: Number,
      precache: Boolean,
      cache: true,
      collapseWidth: 500,
      vertical: {
        type: Boolean,
        reflect: true
      },
      collapsed: {
        type: Boolean,
        reflect: true
      },
    };
  }
  resized() {
    const rect = this.getBoundingClientRect();
    this.collapsed = this.vertical && rect.width < this.collapseWidth;
  }
  changed() {
    const options = [];
    for (let i = 0; i < this.elements.length; i++) {
      const props = this.elements[i][1] || {};
      const label = props.label || props.title || props.name || this.elements[i][0] + '[' + i + ']';
      options.push({
        value: i,
        label: label,
      });
    }
    this.template([
      ['io-tabs', {
        selected: this.bind('selected'),
        vertical: this.vertical,
        collapsed: this.collapsed,
        options: options,
      }],
      ['io-element-cache', {
        elements: this.elements,
        selected: this.selected,
        cache: this.cache,
        precache: this.precache,
      }],
    ]);
  }
}

IoSelector.Register();

class IoSlider extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: row;
        min-width: 12em;
      }
      :host > io-number {
        flex: 0 0 auto;
      }
      :host > io-slider-knob {
        flex: 1 1 auto;
        margin-left: var(--io-theme-spacing);
        border-radius: 2px;
      }
    </style>`;
  }
  static get properties() {
    return {
      value: 0,
      step: 0.001,
      min: 0,
      max: 1,
      strict: true,
    };
  }
  _onValueSet(event) {
    this.dispatchEvent('value-set', event.detail, false);
    this.value = event.detail.value;
  }
  changed() {
    const charLength = (Math.max(Math.max(String(this.min).length, String(this.max).length), String(this.step).length));
    this.template([
      ['io-number', {value: this.value, step: this.step, min: this.min, max: this.max, strict: this.strict, id: 'number', 'on-value-set': this._onValueSet}],
      ['io-slider-knob', {value: this.value, step: this.step, minValue: this.min, maxValue: this.max, id: 'slider', 'on-value-set': this._onValueSet}]
    ]);
    this.$.number.style.setProperty('min-width', charLength + 'em');
  }
}

IoSlider.Register();

class IoSliderKnob extends IoCanvas {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        cursor: ew-resize;
        touch-action: none;
      }
      :host > img {
        pointer-events: none;
        touch-action: none;
      }
    </style>`;
  }
  static get properties() {
    return {
      value: 0,
      step: 0.01,
      minValue: 0,
      maxValue: 1000,
      startColor: [0.3, 0.9, 1, 1],
      endColor: [0.9, 1, 0.5, 1],
      lineColor: [0.3, 0.3, 0.3, 1],
      bg: [0.5, 0.5, 0.5, 1],
      snapWidth: 2,
      slotWidth: 2,
      handleWidth: 4,
    };
  }
  static get listeners() {
    return {
      'pointerdown': 'onPointerdown',
      'pointermove': 'onPointermove',
      'dragstart': 'preventDefault',
    };
  }
  onPointerdown(event) {
    this.setPointerCapture(event.pointerId);
  }
  onPointermove(event) {
    this.setPointerCapture(event.pointerId);
    if (event.buttons !== 0) {
      event.preventDefault();
      const rect = this.getBoundingClientRect();
      const x = (event.clientX - rect.x) / rect.width;
      const pos = Math.max(0,Math.min(1, x));
      let value = this.minValue + (this.maxValue - this.minValue) * pos;
      value = Math.round(value / this.step) * this.step;
      value = Math.min(this.maxValue, Math.max(this.minValue, (value)));
      this.set('value', value);
    }
  }
  // TODO: implement proper sdf shapes.
  static get frag() {
    return `
    varying vec2 vUv;
    void main(void) {

      vec4 finalColor = vec4(0.0, 0.0, 0.0, 0.0);

      float _range = maxValue - minValue;
      float _progress = (value - minValue) / _range;
      float _value = mix(minValue, maxValue, vUv.x);
      float _stepRange = size.x / (_range / step);

      if (_stepRange > snapWidth * 4.0) {
        float pxValue = _value * size.x / _range;
        float pxStep = step * size.x / _range;
        float snap0 = mod(pxValue, pxStep);
        float snap1 = pxStep - mod(pxValue, pxStep);
        float snap = min(snap0, snap1) * 2.0;
        snap -= snapWidth;
        snap = 1.0 - clamp(snap, 0.0, 1.0);
        finalColor = mix(finalColor, lineColor, snap);
      }

      float slot = (abs(0.5 - vUv.y) * 2.0) * size.y;
      slot = (1.0 - slot) + slotWidth;
      slot = clamp(slot, 0.0, 1.0);
      vec4 slotColor = mix(startColor, endColor, vUv.x);

      float progress = (vUv.x - _progress) * size.x;
      progress = clamp(progress, 0.0, 1.0);
      slotColor = mix(slotColor, lineColor, progress);

      float handle = abs(vUv.x - _progress) * size.x;
      handle = (1.0 - handle) + handleWidth;
      handle = clamp(handle, 0.0, 1.0);

      finalColor = mix(finalColor, slotColor, slot);
      finalColor = mix(finalColor, mix(startColor, endColor, _progress), handle);

      gl_FragColor = finalColor;
    }`;
  }
}

IoSliderKnob.Register();

const selection$1 = window.getSelection();
const range$1 = document.createRange();

class IoString extends IoElement {
  static get style() {
    return html`<style>
      :host {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        border: var(--io-theme-field-border);
        border-radius: var(--io-theme-border-radius);
        padding: var(--io-theme-padding);
        color: var(--io-theme-field-color);
        background: var(--io-theme-field-bg);
      }
      :host:focus {
        overflow: hidden;
        text-overflow: clip;
        outline: none;
        border: var(--io-theme-focus-border);
        background: var(--io-theme-focus-bg);
      }
    </style>`;
  }
  static get properties() {
    return {
      value: String,
      tabindex: 0,
      contenteditable: true
    };
  }
  static get listeners() {
    return {
      'focus': '_onFocus'
    };
  }
  _onFocus() {
    this.addEventListener('blur', this._onBlur);
    this.addEventListener('keydown', this._onKeydown);
    this._select();
  }
  _onBlur() {
    this.set('value', this.innerText);
    this.scrollTop = 0;
    this.scrollLeft = 0;
    this.removeEventListener('blur', this._onBlur);
    this.removeEventListener('keydown', this._onKeydown);
  }
  _onKeydown(event) {
    if (event.which == 13) {
      event.preventDefault();
      this.set('value', this.innerText);
    }
  }
  _select() {
    range$1.selectNodeContents(this);
    selection$1.removeAllRanges();
    selection$1.addRange(range$1);
  }
  valueChanged() {
    this.innerText = String(this.value).replace(new RegExp(' ', 'g'), '\u00A0');
  }
}

IoString.Register();

class IoTheme extends IoElement {
  static get style() {
    return html`<style>
      body {
        --bg: #eee;
        --radius: 5px 5px 5px 5px;
        --spacing: 3px;
        --padding: 3px;
        --border-radius: 2px;
        --border: 1px solid rgba(128, 128, 128, 0.25);
        --color: #000;

        --number-color: rgb(28, 0, 207);
        --string-color: rgb(196, 26, 22);
        --boolean-color: rgb(170, 13, 145);

        --link-color: #09d;
        --focus-border: 1px solid #09d;
        --focus-bg: #def;
        --active-bg: #ef8;
        --hover-bg: #fff;

        --frame-border: 1px solid #aaa;
        --frame-bg: #ccc;

        --content-border: 1px solid #aaa;
        --content-bg: #eee;

        --button-border: 1px solid #999;
        --button-bg: #bbb;

        --field-border: 1px solid #ccc;
        --field-color: #333;
        --field-bg: white;

        --menu-border: 1px solid #999;
        --menu-bg: #bbb;
        --menu-shadow: 2px 3px 5px rgba(0,0,0,0.2);
      }
      @media (-webkit-min-device-pixel-ratio: 2) {
        body {
          --radius: 7px 7px 7px 7px;
          --spacing: 4px;
          --padding: 4px;
          --border-radius: 4px;
        }
      }
    </style>`;
  }
}

IoTheme.Register();

/**
 * @author arodic / https://github.com/arodic
 */

export { IoCoreMixin, IoCore, IoElement, html, initStyle, Bindings, Binding, IoArray, IoBoolean, IoButton, IoCanvas, IoCollapsable, IoElementCache, IoInspector, IoInspectorBreadcrumbs, IoInspectorLink, IoMenuItem, IoMenuLayer, IoMenuOptions, IoMenu, IoNumber, IoObject, IoOption, IoProperties, IoTabs, IoSelector, IoSlider, IoString, IoTheme, IoStorage, nodes as storageNodes };
