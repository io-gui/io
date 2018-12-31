// Get a list of io prototypes by walking down the prototype chain.
class Prototypes extends Array {
  constructor(_constructor) {
    super();
    let proto = _constructor.prototype;
    // Stop at HTMLElement for IoElement and Object for IoNode.
    while (proto && proto.constructor !== HTMLElement && proto.constructor !== Object) {
      this.push(proto);
      proto = proto.__proto__;
    }
  }
}

// Creates a properties object with configurations inherited from prototype chain.

const illegalPropNames = ['style', 'className', 'listeners'];

class ProtoProperties {
  constructor(prototypes) {
    const propertyDefs = {};
    for (let i = prototypes.length; i--;) {
      let prop = prototypes[i].constructor.properties;
      for (let key in prop) {
        if (illegalPropNames.indexOf(key) !== -1) {
          console.warn('Illegal property name:', key);
        }
        let propDef = new Property(prop[key], true);
        if (propertyDefs[key]) propertyDefs[key].assign(propDef);
        else propertyDefs[key] = propDef;
      }
    }
    for (let key in propertyDefs) {
      this[key] = new Property(propertyDefs[key]);
    }
  }
  // Instances should use this function to create unique clone of properties.
  clone() {
    let properties = new ProtoProperties([]);
    for (let prop in this) {
      properties[prop] = this[prop].clone();
    }
    return properties;
  }
}

function defineProperties(prototype) {
  for (let prop in prototype.__props) {
    const observer = prop + 'Changed';
    const changeEvent = prop + '-changed';
    const isPublic = prop.charAt(0) !== '_';
    const isEnumerable = !(prototype.__props[prop].enumerable === false);
    Object.defineProperty(prototype, prop, {
      get: function() {
        return this.__props[prop].value;
      },
      set: function(value) {
        if (this.__props[prop].value === value) return;
        const oldValue = this.__props[prop].value;
        this.__props[prop].value = value;
        if (this.__props[prop].reflect) this.setAttribute(prop, this.__props[prop].value);
        if (isPublic) {
          if (this[observer]) this[observer](value, oldValue);
          if (this.__props[prop].observer) this[this.__props[prop].observer](value, oldValue);
          this.changed();
          this.dispatchEvent(changeEvent, {property: prop, value: value, oldValue: oldValue});
        }
      },
      enumerable: isEnumerable && isPublic,
      configurable: true,
    });
  }
}

/*
Creates a property object from properties defined in the prototype chain.
{
  value: property value
  type: constructor of the value
  observer: neme of the function to be called when value changes
  reflect: reflection to HTML element attribute
  binding: binding object if bound
}
 */
class Property {
  constructor(propDef) {
    if (propDef === null || propDef === undefined) {
      propDef = {value: propDef};
    } else if (typeof propDef === 'function') {
      propDef = {type: propDef};
    } else if (typeof propDef !== 'object') {
      propDef = {value: propDef, type: propDef.constructor};
    }
    this.value = propDef.value;
    this.type = propDef.type;
    this.observer = propDef.observer;
    this.reflect = propDef.reflect;
    this.binding = propDef.binding;
    this.config = propDef.config;
    this.enumerable = propDef.enumerable !== undefined ? propDef.enumerable : true;
  }
  // Helper function to assign new values as we walk up the inheritance chain.
  assign(propDef) {
    if (propDef.value !== undefined) this.value = propDef.value;
    if (propDef.type !== undefined) this.type = propDef.type;
    if (propDef.observer !== undefined) this.observer = propDef.observer;
    if (propDef.reflect !== undefined) this.reflect = propDef.reflect;
    if (propDef.binding !== undefined) this.binding = propDef.binding;
    if (propDef.config !== undefined) this.config = propDef.config;
    if (propDef.enumerable !== undefined) this.enumerable = propDef.enumerable;
  }
  // Clones the property. If property value is objects it does one level deep object clone.
  clone() {
    // console.log(typeof this.value === 'function');
    let prop = new Property(this);

    // Set default value if type is defined but value is not.
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

// Creates a list of listeners defined in prototype chain.
class ProtoListeners {
  constructor(prototypes) {
    for (let i = prototypes.length; i--;) {
      let prop = prototypes[i].constructor.listeners;
      for (let j in prop) this[j] = prop[j];
    }
  }
  connect(element) {
    for (let i in this) {
      element.addEventListener(i, element[this[i]]);
    }
  }
  disconnect(element) {
    for (let i in this) {
      element.removeEventListener(i, element[this[i]]);
    }
  }
}

// Creates a list of functions defined in prototype chain.
class ProtoFunctions extends Array {
  constructor(prototypes) {
    super();
    for (let i = prototypes.length; i--;) {
      let names = Object.getOwnPropertyNames(prototypes[i]);
      for (let j = 0; j < names.length; j++) {
        if (names[j] === 'constructor') continue;
        if (typeof prototypes[i][names[j]] !== 'function') continue;
        if (prototypes[i][names[j]].name === 'anonymous') {
          continue;
        }
        if (this.indexOf(names[j]) === -1) this.push(names[j]);
        if (names[j] === 'value') console.log(prototypes[i][names[j]]);
      }
    }
  }
  // Binds all functions to instance.
  bind(element) {
    for (let i = 0; i < this.length; i++) {
      element[this[i]] = element[this[i]].bind(element);
    }
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
  setSource() {
    this.source.addEventListener(this.sourceProp + '-changed', this.updateTargets);
    for (let i = this.targets.length; i--;) {
      let targetProps = this.targetsMap.get(this.targets[i]);
      for (let j = targetProps.length; j--;) {
        this.targets[i].__props[targetProps[j]].value = this.source[this.sourceProp];
        // TODO: test observers on binding hot-swap!
      }
    }
  }
  setTarget(target, targetProp) {
    if (this.targets.indexOf(target) === -1) this.targets.push(target);
    if (this.targetsMap.has(target)) {
      let targetProps = this.targetsMap.get(target);
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
      let targetProps = this.targetsMap.get(target);
      let index = targetProps.indexOf(targetProp);
      if (index !== -1) {
        targetProps.splice(index, 1);
      }
      if (targetProps.length === 0) this.targets.splice(this.targets.indexOf(target), 1);
      // TODO: remove from WeakMap?
      target.removeEventListener(targetProp + '-changed', this.updateSource);
    }
  }
  updateSource(event) {
    if (this.targets.indexOf(event.target) === -1) return;
    let value = event.detail.value;
    if (this.source[this.sourceProp] !== value) {
      this.source[this.sourceProp] = value;
    }
  }
  updateTargets(event) {
    if (event.target != this.source) return;
    let value = event.detail.value;
    for (let i = this.targets.length; i--;) {
      let targetProps = this.targetsMap.get(this.targets[i]);
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
}

// Creates a list of listeners passed to element instance as arguments.
// TODO: apply top native HTMLElement
// TODO: prune from properties
class PropListeners {
  setListeners(props) {
    // TODO remove old listeners
    for (let l in props) {
      if (l.startsWith('on-')) {
        this[l.slice(3, l.length)] = props[l];
      }
    }
  }
  connect(element) {
    for (let i in this) {
      let listener = typeof this[i] === 'function' ? this[i] : element[this[i]];
      element.addEventListener(i, listener);
    }
  }
  disconnect(element) {
    for (let i in this) {
      let listener = typeof this[i] === 'function' ? this[i] : element[this[i]];
      element.removeEventListener(i, listener);
    }
  }
}

const IoCore = (superclass) => class extends superclass {
  static get properties() {
    return {
      // TODO: is this necessary?
      id: {
        type: String,
        enumerable: false
      }
    };
  }
  constructor(initProps = {}) {
    super();
    Object.defineProperty(this, '__bindings', {value: {}});
    Object.defineProperty(this, '__listeners', {value: {}});
    Object.defineProperty(this, '__observeQueue', {value: []});
    Object.defineProperty(this, '__notifyQueue', {value: []});

    Object.defineProperty(this, '__props', {value: this.__props.clone()});

    Object.defineProperty(this, '$', {value: {}}); // TODO: consider clearing in template. possible memory leak!

    this.__protoFunctions.bind(this);

    Object.defineProperty(this, '__propListeners', {value: new PropListeners()});
    this.__propListeners.setListeners(initProps);

    // TODO: is this necessary?
    // TODO: test!
    this.setProperties(initProps);
    if (this.__observeQueue.indexOf('changed') === -1) this.__observeQueue.push('changed');
  }
  changed() {}
  dispose() {
    // TODO: test dispose!
    this.__protoListeners.disconnect(this);
    this.__propListeners.disconnect(this);
    this.removeListeners();
    for (let p in this.__props) {
      if (this.__props[p].binding) {
        this.__props[p].binding.removeTarget(this, p);
        // TODO: this breaks binding for transplanted elements.
        delete this.__props[p].binding;
        // TODO: possible memory leak!
      }
    }
  }
  bind(prop) {
    this.__bindings[prop] = this.__bindings[prop] || new Binding(this, prop);
    return this.__bindings[prop];
  }
  set(prop, value) {
    let oldValue = this[prop];
    this[prop] = value;
    if (oldValue !== value) {
      this.dispatchEvent(prop + '-set', {value: value, oldValue: oldValue}, false);
    }
  }
  setProperties(props) {

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
        if (this.__props[p].reflect) this.setAttribute(p, value);
        this.queue(this.__props[p].observer, p, value, oldValue);
        if (this.__props[p].observer) this.queue(this.__props[p].observer, p, value, oldValue);
        // TODO: decouple observer and notify queue // if (this[p + 'Changed'])
        this.queue(p + 'Changed', p, value, oldValue);
      }

      if (binding !== oldBinding) {
        if (binding) binding.setTarget(this, p);
        if (oldBinding) {
          oldBinding.removeTarget(this, p);
          // TODO: test extensively
          // console.warn('Disconnect!', oldBinding);
        }
      }

    }

    if (props['className']) {
      this.className = props['className'];
    }

    if (props['style']) {
      for (let s in props['style']) {
        this.style[s] = props['style'][s];
        this.style.setProperty(s, props['style'][s]);
      }
    }
  }
  objectMutated(event) {
    for (let i = this.__objectProps.length; i--;) {
      if (this.__props[this.__objectProps[i]].value === event.detail.object) {
        this.changed();
      }
    }
  }
  connectedCallback() {
    this.__protoListeners.connect(this);
    this.__propListeners.connect(this);
    this.queueDispatch();
    for (let p in this.__props) {
      if (this.__props[p].binding) {
        this.__props[p].binding.setTarget(this, p); //TODO: test
      }
    }
    if (this.__objectProps.length) {
      window.addEventListener('io-object-mutated', this.objectMutated);
    }
  }
  disconnectedCallback() {
    this.__protoListeners.disconnect(this);
    this.__propListeners.disconnect(this);
    for (let p in this.__props) {
      if (this.__props[p].binding) {
        this.__props[p].binding.removeTarget(this, p);
        // TODO: this breaks binding for transplanted elements.
        // delete this.__props[p].binding;
        // TODO: possible memory leak!
      }
    }
    if (this.__objectProps.length) {
      window.removeEventListener('io-object-mutated', this.objectMutated);
    }
  }
  addEventListener(type, listener) {
    this.__listeners[type] = this.__listeners[type] || [];
    let i = this.__listeners[type].indexOf(listener);
    if (i === - 1) {
      if (superclass === HTMLElement) HTMLElement.prototype.addEventListener.call(this, type, listener);
      this.__listeners[type].push(listener);
    }
  }
  hasEventListener(type, listener) {
    return this.__listeners[type] !== undefined && this.__listeners[type].indexOf(listener) !== - 1;
  }
  removeEventListener(type, listener) {
    if (this.__listeners[type] !== undefined) {
      let i = this.__listeners[type].indexOf(listener);
      if (i !== - 1) {
        if (superclass === HTMLElement) HTMLElement.prototype.removeEventListener.call(this, type, listener);
        this.__listeners[type].splice(i, 1);
      }
    }
  }
  removeListeners() {
    // TODO: test
    for (let i in this.__listeners) {
      for (let j = this.__listeners[i].length; j--;) {
        if (superclass === HTMLElement) HTMLElement.prototype.removeEventListener.call(this, i, this.__listeners[i][j]);
        this.__listeners[i].splice(j, 1);
      }
    }
  }
  dispatchEvent(type, detail = {}, bubbles = true, src = this) {
    if (src instanceof HTMLElement || src === window) {
      HTMLElement.prototype.dispatchEvent.call(src, new CustomEvent(type, {
        type: type,
        detail: detail,
        bubbles: bubbles,
        composed: true
      }));
    } else {
      // TODO: fix path/src argument
      let path = [src];
      if (this.__listeners[type] !== undefined) {
        let array = this.__listeners[type].slice(0);
        for (let i = 0, l = array.length; i < l; i ++) {
          path = path || [this];
          const payload = {detail: detail, target: this, bubbles: bubbles, path: path};
          array[i].call(this, payload);
          // TODO: test bubbling
          if (bubbles) {
            let parent = this.parent;
            while (parent) {
              path.push(parent);
              parent.dispatchEvent(type, detail, true, path);
              parent = parent.parent;
            }
          }
        }
      }
    }
  }
  queue(observer, prop, value, oldValue) {
    // JavaScript is weird NaN != NaN
    if (typeof value == 'number' && typeof oldValue == 'number' && isNaN(value) && isNaN(oldValue)) {
      return;
    }
    if (observer && this[observer]) {
      if (this.__observeQueue.indexOf(observer) === -1) {
        this.__observeQueue.push(observer);
      }
    }
    this.__notifyQueue.push([prop + '-changed', {value: value, oldValue: oldValue}]);
  }
  queueDispatch() {
    if (this.__observeQueue.length || this.__notifyQueue.length) {
      this.__observeQueue.push('changed');
    }
    for (let j = 0; j < this.__observeQueue.length; j++) {
      this[this.__observeQueue[j]]();
    }
    for (let j = 0; j < this.__notifyQueue.length; j++) {
      this.dispatchEvent(this.__notifyQueue[j][0], this.__notifyQueue[j][1]);
    }
    this.__observeQueue.length = 0;
    this.__notifyQueue.length = 0;
  }
};

IoCore.Register = function () {
  Object.defineProperty(this.prototype, '__prototypes', {value: new Prototypes(this)});
  Object.defineProperty(this.prototype, '__props', {value: new ProtoProperties(this.prototype.__prototypes)});
  Object.defineProperty(this.prototype, '__protoFunctions', {value: new ProtoFunctions(this.prototype.__prototypes)});
  Object.defineProperty(this.prototype, '__protoListeners', {value: new ProtoListeners(this.prototype.__prototypes)});

  // TODO: rewise
  Object.defineProperty(this.prototype, '__objectProps', {value: []});
  const ignore = [Boolean, String, Number, HTMLElement, Function];
  for (let prop in this.prototype.__props) {
    let type = this.prototype.__props[prop].type;
    if (ignore.indexOf(type) == -1) {
      this.prototype.__objectProps.push(prop);
    }
  }

  defineProperties(this.prototype);
};

class IoNode extends IoCore(Object) {
  connect() {
    this.connectedCallback();
  }
  disconnect() {
    this.disconnectedCallback();
  }
  dispose() {
    // TODO implement properly and test
    delete this.parent;
    this.children.lenght = 0;
    for (let l in this.__listeners) this.__listeners[l].lenght = 0;
    for (let p in this.__props) delete this.__props[p];
  }
}

IoNode.Register = function() {

  IoCore.Register.call(this);

};

IoNode.Register();

class IoElement extends IoCore(HTMLElement) {
  static get properties() {
    return {
      tabindex: {
        type: String,
        reflect: true,
        enumerable: false
      },
      contenteditable: {
        type: Boolean,
        reflect: true,
        enumerable: false
      }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    for (let prop in this.__props) {
      if (this.__props[prop].reflect) {
        this.setAttribute(prop, this.__props[prop].value);
      }
    }
  }
  template(children, host) {
    this.traverse(buildTree()(['root', children]).children, host || this);
  }
  traverse(vChildren, host) {
    const children = host.children;
    // remove trailing elements
    while (children.length > vChildren.length) {
      let child = children[children.length - 1];
      // TODO: is this necessary (disconnected callback redundancy)
      let nodes = Array.from(child.querySelectorAll('*'));
      for (let i = nodes.length; i--;) {
        if (nodes[i].dispose) nodes[i].dispose();
        // TODO: dispose propListeners from native elements
      }
      // console.log('removing', child);
      host.removeChild(child);
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
        host.removeChild(oldElement);

      // update existing elements
      } else {
        // Io Elements
        if (children[i].hasOwnProperty('__props')) {
          children[i].setProperties(vChildren[i].props); // TODO: test
          children[i].queueDispatch();
          children[i].__propListeners.setListeners(vChildren[i].props);
          children[i].__propListeners.connect(children[i]);
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
          children[i].__propListeners.setListeners(vChildren[i].props);
          children[i].__propListeners.connect(children[i]);
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
  static get observedAttributes() { return this.prototype.__observedAttributes; }
  attributeChangedCallback(name, oldValue, newValue) {
    const type = this.__props[name].type;
    if (type === Boolean) {
      if (newValue === null || newValue === '') {
        this[name] = newValue === '' ? true : false;
      }
    } else if (type) {
      this[name] = type(newValue);
    }
  }
}

IoElement.Register = function() {

  IoCore.Register.call(this);

  const localName = this.name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

  Object.defineProperty(this, 'localName', {value: localName});
  Object.defineProperty(this.prototype, 'localName', {value: localName});

  Object.defineProperty(this.prototype, '__observedAttributes', {value: []});
  for (let i in this.prototype.__props) {
    if (this.prototype.__props[i].reflect) this.prototype.__observedAttributes.push(i);
  }

  customElements.define(localName, this);

  initStyle(this.prototype.__prototypes);

};

IoElement.Register();

function html() {return arguments[0][0];}

const constructElement = function(vDOMNode) {
 let ConstructorClass = customElements.get(vDOMNode.name);
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
 Object.defineProperty(element, '__propListeners', {value: new PropListeners()});
 element.__propListeners.setListeners(vDOMNode.props);
 element.__propListeners.connect(element);
 ///
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
      if (i < prototypes.length - 1 && style == prototypes[i + 1].constructor.style) continue;
      style = style.replace(new RegExp(':host', 'g'), localName);
      _stagingElement.innerHTML = style;
      let element = _stagingElement.querySelector('style');
      element.setAttribute('id', 'io-style-' + localName + '-' + i);
      document.head.appendChild(element);
    }
  }
}

const nodes = {};

class StoreNode extends IoNode {
  static get properties() {
    return {
      key: String,
      value: undefined,
    };
  }
  constructor(props) {
    super(props);
    const value = localStorage.getItem(this.key);
    if (value !== null) {
      this.value = JSON.parse(value);
    }
  }
  valueChanged() {
    localStorage.setItem(this.key, this.value);
  }
}

StoreNode.Register();

function storage(key, value) {
  let store = nodes[key];
  if (!store) {
    store = new StoreNode({key: key});
    nodes[key] = store;
    store.connect();
    store.binding = store.bind('value');
  }
  if (store.value === undefined && value !== undefined) {
    store.value = value;
  }
  return store.binding;
}

const _clickmask = document.createElement('div');
_clickmask.style = "position: fixed; top:0; left:0; bottom:0; right:0; z-index:2147483647;";

let _mousedownPath = null;

class Vector2 {
  constructor(vector = {}) {
    this.x = vector.x || 0;
    this.y = vector.y || 0;
  }
  set(vector) {
    this.x = vector.x;
    this.y = vector.y;
    return this;
  }
  sub(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  distanceTo(vector) {
    let dx = this.x - vector.x, dy = this.y - vector.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

class Pointer {
  constructor(pointer = {}) {
    this.position = new Vector2(pointer.position);
    this.previous = new Vector2(pointer.previous);
    this.movement = new Vector2(pointer.movement);
    this.distance = new Vector2(pointer.distance);
    this.start = new Vector2(pointer.start);
  }
  getClosest(array) {
    let closest = array[0];
    for (let i = 1; i < array.length; i++) {
      if (this.position.distanceTo(array[i].position) < this.position.distanceTo(closest.position)) {
        closest = array[i];
      }
    }
    return closest;
  }
  changed(pointer) {
    this.previous.set(this.position);
    this.movement.set(pointer.position).sub(this.position);
    this.distance.set(pointer.position).sub(this.start);
    this.position.set(pointer.position);
  }
}

const IoInteractiveMixin = (superclass) => class extends superclass {
  static get properties() {
    return {
      pointers: Array, // TODO: remove from properties
      pointermode: 'relative',
      cursor: 'all-scroll'
    };
  }
  static get listeners() {
    return {
      'mousedown': '_onMousedown',
      'touchstart': '_onTouchstart',
      'mousemove': '_onMousehover'
    };
  }
  constructor(params) {
    super(params);
    this._clickmask = _clickmask;
  }
  getPointers(event, reset) {
    let touches = event.touches ? event.touches : [event];
    let foundPointers = [];
    let rect = this.getBoundingClientRect();
    for (let i = 0; i < touches.length; i++) {
      if (touches[i].target === event.target || event.touches === undefined) {
        let position = new Vector2({
          x: touches[i].clientX,
          y: touches[i].clientY
        });
        if (this.pointermode === 'relative') {
          position.x -= rect.left;
          position.y -= rect.top;
        } else if (this.pointermode === 'viewport') {
          position.x = (position.x - rect.left) / rect.width * 2.0 - 1.0;
          position.y = (position.y - rect.top) / rect.height * 2.0 - 1.0;
        }
        if (this.pointers[i] === undefined) this.pointers[i] = new Pointer({start: position});
        let newPointer = new Pointer({position: position});
        let pointer = newPointer.getClosest(this.pointers);
        if (reset) pointer.start.set(position);
        pointer.changed(newPointer);
        foundPointers.push(pointer);
      }
    }
    for (let i = this.pointers.length; i--;) {
      if(foundPointers.indexOf(this.pointers[i]) === -1) {
        this.pointers.splice(i, 1);
      }
    }
  }
  _onMousedown(event) {
    // TODO: unhack
    _mousedownPath = event.composedPath();
    this.getPointers(event, true);
    this._fire('io-pointer-start', event, this.pointers);
    window.addEventListener('mousemove', this._onMousemove);
    window.addEventListener('mouseup', this._onMouseup);
    window.addEventListener('blur', this._onMouseup); //TODO: check pointer data
    // TODO: clickmask breaks scrolling
    if (_clickmask.parentNode !== document.body) {
      document.body.appendChild(_clickmask);
      _clickmask.style.setProperty('cursor', this.cursor);
    }
  }
  _onMousemove(event) {
    this.getPointers(event);
    this._fire('io-pointer-move', event, this.pointers, _mousedownPath);
  }
  _onMouseup(event) {
    this.getPointers(event);
    this._fire('io-pointer-end', event, this.pointers, _mousedownPath);
    window.removeEventListener('mousemove', this._onMousemove);
    window.removeEventListener('mouseup', this._onMouseup);
    window.removeEventListener('blur', this._onMouseup);
    if (_clickmask.parentNode === document.body) {
      document.body.removeChild(_clickmask);
      _clickmask.style.setProperty('cursor', null);
    }
  }
  _onMousehover(event) {
    this.getPointers(event);
    this._fire('io-pointer-hover', event, this.pointers);
  }
  _onTouchstart(event) {
    this.getPointers(event, true);
    this._fire('io-pointer-hover', event, this.pointers);
    this._fire('io-pointer-start', event, this.pointers);
    this.addEventListener('touchmove', this._onTouchmove);
    this.addEventListener('touchend', this._onTouchend);
  }
  _onTouchmove(event) {
    this.getPointers(event);
    this._fire('io-pointer-move', event, this.pointers);
  }
  _onTouchend(event) {
    this.removeEventListener('touchmove', this._onTouchmove);
    this.removeEventListener('touchend', this._onTouchend);
    this._fire('io-pointer-end', event, this.pointers);

  }
  _fire(eventName, event, pointer, path) {
    path = path || event.composedPath();
    this.dispatchEvent(eventName, {event: event, pointer: pointer, path: path}, false);
  }
};
class IoInteractive extends IoInteractiveMixin(IoElement) {}
IoInteractive.Register();

// core classes

/**
 * @author arodic / https://github.com/arodic
 *
 * Minimal implementation of io mixin: https://github.com/arodic/io
 * Includes event listener/dispatcher and defineProperties() method.
 * Changed properties trigger "[prop]-changed" event, and execution of changed() and [prop]Changed() functions.
 */

const IoLiteMixin = (superclass) => class extends superclass {
	addEventListener(type, listener) {
		this._listeners = this._listeners || {};
		this._listeners[type] = this._listeners[type] || [];
		if (this._listeners[type].indexOf(listener) === -1) {
			this._listeners[type].push(listener);
		}
	}
	hasEventListener(type, listener) {
		if (this._listeners === undefined) return false;
		return this._listeners[type] !== undefined && this._listeners[type].indexOf(listener) !== -1;
	}
	removeEventListener(type, listener) {
		if (this._listeners === undefined) return;
		if (this._listeners[type] !== undefined) {
			let index = this._listeners[type].indexOf(listener);
			if (index !== -1) this._listeners[type].splice(index, 1);
		}
	}
	dispatchEvent(type, detail = {}) {
		const event = {
			path: [this],
			target: this,
			detail: detail,
		};
		if (this._listeners && this._listeners[type] !== undefined) {
			const array = this._listeners[type].slice(0);
			for (let i = 0, l = array.length; i < l; i ++) {
				array[i].call(this, event);
			}
		}
		// TODO: bubbling
		// else if (this.parent && event.bubbles) {}
	}
	defineProperties(props) {
		if (!this.hasOwnProperty('_properties')) {
			Object.defineProperty(this, '_properties', {
				value: {},
				enumerable: false
			});
		}
		for (let prop in props) {
			let propDef = props[prop];
			if (propDef === null || propDef === undefined) {
				propDef = {value: propDef};
			} else if (typeof propDef !== 'object') {
				propDef = {value: propDef};
			} else if (typeof propDef === 'object' && propDef.constructor.name !== 'Object') {
				propDef = {value: propDef};
			}else if (typeof propDef === 'object' && propDef.value === undefined) {
				propDef = {value: propDef};
			}
			defineProperty(this, prop, propDef);
		}
	}
	// TODO: dispose
};

const defineProperty = function(scope, prop, def) {
	const observer = prop + 'Changed';
	const changeEvent = prop + '-changed';
	const isPublic = prop.charAt(0) !== '_';
	const isEnumerable = !(def.enumerable === false);
	scope._properties[prop] = def.value;
	if (!scope.hasOwnProperty(prop)) { // TODO: test
		Object.defineProperty(scope, prop, {
			get: function() {
				return scope._properties[prop];// !== undefined ? scope._properties[prop] : initValue;
			},
			set: function(value) {
				if (scope._properties[prop] === value) return;
				const oldValue = scope._properties[prop];
				scope._properties[prop] = value;
				if (isPublic) {
					if (def.observer) scope[def.observer](value, oldValue);
					if (typeof scope[observer] === 'function') scope[observer](value, oldValue);
					if (typeof scope.changed === 'function') scope.changed.call(scope);
					scope.dispatchEvent(changeEvent, {property: prop, value: value, oldValue: oldValue, bubbles: true});
				}
			},
			enumerable: isEnumerable && isPublic,
			configurable: true,
		});
	}
	scope[prop] = def.value;
};

class IoLite extends IoLiteMixin(Object) {}

class IoObjectProps extends IoElement {
  static get style() {
    return html`<style>:host {display: flex;flex-direction: column;flex: 0 0;line-height: 1em;}:host > div.io-object-group {font-weight: bold;}:host > div.io-object-prop {display: flex !important;flex-direction: row;}:host > div > span {padding: 0 0.2em 0 0.5em;flex: 0 0 auto;}:host > div > io-number,:host > div > io-string,:host > div > io-boolean {border: none;background: none;margin: 0;padding: 0;}:host > div > io-number {color: rgb(28, 0, 207);}:host > div > io-string {color: rgb(196, 26, 22);}:host > div > io-boolean {color: rgb(170, 13, 145);}:host > div > io-option {color: rgb(32,135,0);}</style>`;
  }
  static get properties() {
    return {
      value: Object,
      config: Object,
      props: Array,
      _config: Object,
    };
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('io-object-mutated', this._onIoObjectMutated);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('io-object-mutated', this._onIoObjectMutated);
  }
  _onIoObjectMutated(event) {
    let key = event.detail.key;
    if (event.detail.object === this.value) {
      if (key && this.$[key]) {
        this.$[key].__props.value.value = this.value[key];
        this.$[key].changed();
      } else if (!key || key === '*') {
        for (let k in this.$) {
          this.$[k].__props.value.value = this.value[k];
          this.$[k].changed();
        }
      }
    }
  }
  _onValueSet(event) {
    const path = event.composedPath();
    if (path[0] === this) return;
    if (event.detail.object) return; // TODO: unhack
    event.stopPropagation();
    let key = path[0].id;
    if (key !== null) {
      this.value[key] = event.detail.value;
      let detail = Object.assign({object: this.value, key: key}, event.detail);
      this.dispatchEvent('io-object-mutated', detail, false, window);
      this.dispatchEvent('value-set', detail, false); // TODO
    }
  }
  changed() {
    const config = this.config;
    const elements = [];
    for (let c in config) {
      if (!this.props.length || this.props.indexOf(c) !== -1) {
        if (config[c]) {
          const tag = config[c][0];
          const protoConfig = config[c][1];
          const itemConfig = {id: c, value: this.value[c], 'on-value-set': this._onValueSet};
          elements.push(['div', {className: 'io-object-prop'}, [['span', config[c].label || c + ':'], [tag, Object.assign(itemConfig, protoConfig)]]]);
        }
      }
    }
    this.template(elements);
  }
}

IoObjectProps.Register();

class IoCollapsable extends IoElement {
  static get style() {
    return html`<style>:host {display: flex;flex-direction: column;border: 1px solid #999;border-radius: 3px;background: #ccc;}:host > io-boolean {border: none;border-radius: 0;background: none;}:host > io-boolean::before {content: '▸';display: inline-block;width: 0.65em;margin: 0 0.25em;}:host[expanded] > io-boolean::before{content: '▾';}:host > :nth-child(2) {display: block;border: 1px solid #999;border-radius: 3px;padding: 2px;background: #eee;}</style>`;
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
      this.expanded ? ['div', this.elements] : null
    ]);
  }
}

IoCollapsable.Register();

class IoObject extends IoCollapsable {
  static get properties() {
    return {
      value: Object,
      props: Array,
      config: Object,
      _config: Object,
    };
  }
  valueChanged() {
    this._config = this.__proto__.__configs.getConfig(this.value, this.config);
  }
  configChanged() {
    this._config = this.__proto__.__configs.getConfig(this.value, this.config);
  }
  changed() {
    const label = this.label || this.value.constructor.name;
    this.template([
      ['io-boolean', {true: label, false: label, value: this.bind('expanded')}],
      this.expanded ? [
        ['io-object-props', {
          value: this.value,
          props: this.props.length ? this.props : Object.keys(this._config),
          config: this._config,
        }]
      ] : null
    ]);
  }
  static get config() {
    return {
      'Object': {
        'type:string': ['io-string', {}],
        'type:number': ['io-number', {step: 0.01}],
        'type:boolean': ['io-boolean', {}],
        'type:object': ['io-object', {}],
        'value:null': ['io-string', {}],
        'value:undefined': ['io-string', {}],
      },
      'Array': {
        'type:number': ['io-number', {step: 0.1}],
      },
    };
  }
}

class Config {
  constructor(prototypes) {
    for (let i = 0; i < prototypes.length; i++) {
      const config = prototypes[i].constructor.config || {};
      for (let cstr in config) {
        this[cstr] = this[cstr] || {};
        this.extend(this[cstr], config[cstr]);
      }
    }
  }
  extend(configs, configsEx) {
    for (let c in configsEx) {
      configs[c] = configs[c] || [];
      configs[c] = [configs[c][0] || configsEx[c][0], Object.assign(configs[c][1] || {}, configsEx[c][1] || {})];
    }
  }
  getConfig(object, instanceConfig = {}) {
    const keys = Object.keys(object);
    const prototypes = [];

    let proto = object.__proto__;
    while (proto) {
      keys.push(...Object.keys(proto));
      prototypes.push(proto.constructor.name);
      proto = proto.__proto__;
    }

    const protoConfigs = {};
    for (let i = prototypes.length; i--;) {
      this.extend(protoConfigs, this[prototypes[i]]);
    }
    this.extend(protoConfigs, instanceConfig);

    const config = {};

    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      const value = object[k];
      const type = typeof value;
      const cstr = (value && value.constructor) ? value.constructor.name : 'null';

      const typeStr = 'type:' + type;
      const cstrStr = 'constructor:' + cstr;
      const keyStr = k;
      const valueStr = 'value:' + String(value); // TODO: consider optimizing against large strings.

      if (type == 'function') continue;

      config[k] = {};

      if (protoConfigs[typeStr]) config[k] = protoConfigs[typeStr];
      if (protoConfigs[cstrStr]) config[k] = protoConfigs[cstrStr];
      if (protoConfigs[keyStr]) config[k] = protoConfigs[keyStr];
      if (protoConfigs[valueStr]) config[k] = protoConfigs[valueStr];
    }

    return config;
  }
}

IoObject.Register = function() {
  IoElement.Register.call(this);
  Object.defineProperty(this.prototype, '__configs', {value: new Config(this.prototype.__prototypes)});
};

IoObject.Register();

//TODO: test

class IoArray extends IoObject {
  static get style() {
    return html`<style>:host {display: grid;}:host > io-number {/* margin: 1px;padding: 0.1em 0.2em; */}:host[columns="2"] {grid-template-columns: 50% 50%;}:host[columns="3"] {grid-template-columns: 33.3% 33.3% 33.3%;}:host[columns="4"] {grid-template-columns: 25% 25% 25% 25%;}:host[columns="5"] {grid-template-columns: 20% 20% 20% 20% 20%;}</style>`;
  }
  static get properties() {
    return {
      columns: {
        value: 0
      }
      // TODO: labeled?
    };
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
    return html`<style>:host {display: inline-block;cursor: pointer;white-space: nowrap;-webkit-tap-highlight-color: transparent;border: 1px solid #444;border-radius: 2px;padding: 0 0.25em;background: #ccc;}:host:focus {outline: none;border-color: #09d;background: #def;}:host:hover {background: #aaa;}:host[pressed] {background: rgba(255,255,255,0.5);}</style>`;
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
      'keydown': '_onDown',
      'mousedown': '_onDown',
      'touchstart': '_onDown'
    };
  }
  _onDown(event) {
    event.stopPropagation();
    if (event.which === 13 || event.which === 32 || event.type !== 'keydown') {
      event.preventDefault();
      this.pressed = true;
      document.addEventListener('mouseup', this._onUp);
      document.addEventListener('touchend', this._onUp);
      this.addEventListener('keyup', this._onAction);
      this.addEventListener('mouseup', this._onAction);
      this.addEventListener('touchend', this._onAction);
      this.addEventListener('mouseleave', this._onLeave);
    }
  }
  _onUp(event) {
    event.stopPropagation();
    this.pressed = false;
    document.removeEventListener('mouseup', this._onUp);
    document.removeEventListener('touchend', this._onUp);
    this.removeEventListener('keyup', this._onAction);
    this.removeEventListener('mouseup', this._onAction);
    this.removeEventListener('touchend', this._onAction);
    this.removeEventListener('mouseleave', this._onLeave);
  }
  _onAction(event) {
    event.stopPropagation();
    if (event.which === 13 || event.which === 32 || event.type !== 'keyup') {
      event.preventDefault();
      if (this.pressed && this.action) this.action(this.value);
      this.pressed = false;
      this.dispatchEvent('io-button-clicked', {value: this.value, action: this.action});
    }
    this._onUp(event);
  }
  _onLeave() {
    this.pressed = false;
  }
  changed() {
    this.innerText = this.label;
  }
}

IoButton.Register();

class IoBoolean extends IoButton {
  static get style() {
    return html`<style>:host {background: white;}</style>`;
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

class IoInspectorBreadcrumbs extends IoElement {
  static get style() {
    return html`<style>:host {display: flex;flex: 1 0;flex-direction: row;padding: 0 0.25em;background: #fff;border: 1px solid #999;border-radius: 2px;}:host > io-inspector-link {border: none;overflow: hidden;text-overflow: ellipsis;background: none;padding: 0;}:host > io-inspector-link:first-of-type,:host > io-inspector-link:last-of-type {overflow: visible;text-overflow: clip;}:host > io-inspector-link:not(:first-of-type):before {content: '/';margin: 0 0.1em;opacity: 0.25;}</style>`;
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
    return html`<style>:host {border: none;overflow: hidden;text-overflow: ellipsis;background: none;padding: 0;color: #15e;}:host:focus {outline: none;background: none;text-decoration: underline;}:host:hover {background: none;text-decoration: underline;}:host[pressed] {background: none;}</style>`;
  }
  changed() {
    let name = this.value.constructor.name;
    if (this.value.name) name += ' (' + this.value.name + ')';
    else if (this.value.label) name += ' (' + this.value.label + ')';
    this.template([['span', name]]);
  }
}

IoInspectorLink.Register();

function isValueOfPropertyOf(prop, object) {
  for (let key in object) if (object[key] === prop) return key;
  return null;
}

class IoInspector extends IoObject {
  static get style() {
    return html`<style>:host {padding: 2px;background-color: #eee;}:host > io-inspector-breadcrumbs {margin-bottom: 2px;}:host > io-object {padding: 0 !important;font-size: 0.9em;background-color: #ccc !important;}:host > io-object > io-boolean {display: block;}:host > io-object > io-object-props {padding: 0 !important;margin: 2px;}:host > io-object > io-object-props > div {padding: 2px 0;}:host > io-object > io-object-props > div:not(:last-of-type) {border-bottom: 1px solid rgba(0, 0, 0, 0.5);}:host > io-object > io-object-props > div > :nth-child(1) {overflow: hidden;text-overflow: ellipsis;text-align: right;flex: 0 1 6em;padding-left: 0.5em;min-width: 3em;}:host > io-object > io-object-props > div > :nth-child(2) {flex: 1 0;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;min-width: 3em;}:host > io-object > io-object-props > div > io-inspector-link {flex: 0 0 auto !important;min-width: 0 !important;text-decoration: underline;color: #2233cc;}</style>`;
  }
  static get properties() {
    return {
      // persist: false,
      crumbs: Array,
      groups: Object,
      _groups: Object,
    };
  }
  static get listeners() {
    return {
      'io-button-clicked': '_onLinkClicked',
    };
  }
  _onLinkClicked(event) {
    event.stopPropagation();
    if (event.path[0].localName === 'io-inspector-link') {
      this.value = event.detail.value;
    }
  }
  // valueChanged() {
  //   super.valueChanged();
  //   if (this.persist) {
  //     const groupKey = this.label + '-' + (this.value.uuid || this.value.guid || this.value.constructor.name);
  //     const expanded = localStorage.getItem('io-inspector-group-expanded-' + groupKey);
  //     this.expanded = expanded === null ? this.label === 'properties' ? true : false : expanded === 'true' ? true : false;
  //   } else {
  //     this.expanded = this.label === 'properties';
  //   }
  // }
  // expandedChanged() {
  //   if (this.persist) {
  //     const groupKey = this.label + '-' + (this.value.uuid || this.value.guid || this.value.constructor.name);
  //     localStorage.setItem('io-inspector-group-expanded-' + groupKey, this.expanded);
  //   }
  // }
  valueChanged() {
    super.valueChanged();
    this._groups = this.__proto__.__groups.getGroups(this.value, this.groups);
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
  groupsChanged() {
    this._groups = this.__proto__.__groups.getGroups(this.value, this.groups);
  }
  changed() {
    const elements = [
      ['io-inspector-breadcrumbs', {crumbs: this.crumbs}]
    ];
    // TODO: rewise and document use of storage
    const id = this.value.guid || this.value.uuid || this.value.id;
    const cname = this.value.constructor.name;
    for (let group in this._groups) {
      let expanded = id ? storage('io-inspector-group-' + cname + '-' + id + '-' + group, false) : true;
      elements.push(
        ['io-object', {
          value: this.value,
          label: group,
          expanded: expanded,
          props: this._groups[group],
          config: this._config,
        }],
      );
    }
    this.template(elements);
  }
  static get config() {
    return {
      'Object': {
        'type:object': ['io-inspector-link'],
        'type:boolean': ['io-boolean', {true: '⦿ true', false: '⦾ false'}],
      },
    };
  }
  static get groups() {
    return {
      'Object': {
        'hidden': ['constructor'],
      },
    };
  }
}

class Groups {
  constructor(prototypes) {
    for (let i = 0; i < prototypes.length; i++) {
      const groups = prototypes[i].constructor.groups || {};
      for (let cstr in groups) {
        this[cstr] = this[cstr] || {};
        this.extend(this[cstr], groups[cstr]);
      }
    }
  }
  extend(groups, groupsEx) {
    for (let g in groupsEx) {
      groups[g] = groups[g] || [];
      for (let i = 0; i < groupsEx[g].length; i++) {
        if (groups[g].indexOf(groupsEx[g][i]) === -1) {
          groups[g].push(groupsEx[g][i]);
        }
      }
    }
  }
  getGroups(object, instanceGroups = {}) {
    const keys = Object.keys(object);
    const prototypes = [];

    let proto = object.__proto__;
    while (proto) {
      keys.push(...Object.keys(proto));
      prototypes.push(proto.constructor.name);
      proto = proto.__proto__;
    }

    const protoGroups = {};
    for (let i = prototypes.length; i--;) {
      this.extend(protoGroups, this[prototypes[i]]);
    }
    this.extend(protoGroups, instanceGroups);

    const groups = {};
    const assigned = [];

    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      const value = object[k];
      const type = typeof value;
      const cstr = (value && value.constructor) ? value.constructor.name : 'null';

      const typeStr = 'type:' + type;
      const cstrStr = 'constructor:' + cstr;
      const keyStr = k;
      const valueStr = 'value:' + String(value); // TODO: consider optimizing against large strings.

      if (type == 'function') continue;

      for (let g in protoGroups) {
        groups[g] = groups[g] || [];
        if (protoGroups[g].indexOf(typeStr) !== -1) { groups[g].push(k); assigned.push(k); }
        if (protoGroups[g].indexOf(cstrStr) !== -1) { groups[g].push(k); assigned.push(k); }
        if (protoGroups[g].indexOf(keyStr) !== -1) { groups[g].push(k); assigned.push(k); }
        if (protoGroups[g].indexOf(valueStr) !== -1) { groups[g].push(k); assigned.push(k); }
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
  IoObject.Register.call(this);
  Object.defineProperty(this.prototype, '__groups', {value: new Groups(this.prototype.__prototypes)});
};

IoInspector.Register();

let previousOption;
let previousParent;
let timeoutOpen;
let timeoutReset;
let WAIT_TIME = 1200;
// let lastFocus;

// TODO: make long (scrolling) menus work with touch
// TODO: implement search

class IoMenuLayer extends IoElement {
  static get style() {
    return html`<style>:host {display: block;visibility: hidden;position: fixed;top: 0;left: 0;bottom: 0;right: 0;z-index: 100000;background: rgba(0, 0, 0, 0.2);user-select: none;overflow: hidden;pointer-events: none;}:host[expanded] {visibility: visible;pointer-events: all;}:host io-menu-options:not([expanded]) {display: none;}:host io-menu-options {padding: 0.125em 0 0.25em 0;border: 1px solid #666;box-shadow: 1px 1px 2px rgba(0,0,0,0.33);position: absolute;transform: translateZ(0);top: 0;left: 0;min-width: 6em;}</style>`;
  }
  static get properties() {
    return {
      expanded: {
        type: Boolean,
        reflect: true,
        observer: '_onScrollAnimateGroup'
      },
      $options: Array
    };
  }
  static get listeners() {
    return {
      'mousedown': '_onMouseup',
      'mousemove': '_onMousemove',
    };
  }
  constructor(props) {
    super(props);
    this._hoveredItem = null;
    this._hoveredGroup = null;
    this._x = 0;
    this._y = 0;
    this._v = 0;
    window.addEventListener('scroll', this._onScroll);
    // window.addEventListener('focusin', this._onWindowFocus);
  }
  registerGroup(group) {
    this.$options.push(group);
    group.addEventListener('focusin', this._onMenuItemFocused);
    group.addEventListener('mouseup', this._onMouseup);
    group.addEventListener('keydown', this._onKeydown);
    group.addEventListener('expanded-changed', this._onExpandedChanged);
  }
  unregisterGroup(group) {
    this.$options.splice(this.$options.indexOf(group), 1);
    group.removeEventListener('focusin', this._onMenuItemFocused);
    group.removeEventListener('mouseup', this._onMouseup);
    group.removeEventListener('keydown', this._onKeydown);
    group.removeEventListener('expanded-changed', this._onExpandedChanged);
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
  _onScroll() {
    if (this.expanded) {
      this.collapseAllGroups();
      // if (lastFocus) {
      //   lastFocus.focus();
      // }
    }
  }
  // _onWindowFocus(event) {
  //   if (event.target.localName !== 'io-menu-item') lastFocus = event.target;
  // }
  _onMenuItemFocused(event) {
    const path = event.composedPath();
    const item = path[0];
    const optionschain = item.optionschain;
    for (let i = this.$options.length; i--;) {
      if (optionschain.indexOf(this.$options[i]) === -1) {
        this.$options[i].expanded = false;
      }
    }
  }
  _onTouchmove(event) {
    this._onMousemove(event);
  }
  _onTouchend(event) {
    this._onMouseup(event);
  }
  _onMousemove(event) {
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
  _onMouseup(event) {
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
  _onKeydown(event) {
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
        this._onMouseup(event); // TODO: test
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
  _onExpandedChanged(event) {
    const path = event.composedPath();
    if (path[0].expanded) this._setGroupPosition(path[0]);
    for (let i = this.$options.length; i--;) {
      if (this.$options[i].expanded) {
        return this.expanded = true;
      }
    }
    return this.expanded = false;
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
  _onScrollAnimateGroup() {
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
    requestAnimationFrame(this._onScrollAnimateGroup);
  }
}

IoMenuLayer.Register();

IoMenuLayer.singleton = new IoMenuLayer();

document.body.appendChild(IoMenuLayer.singleton);

class IoMenuOptions extends IoElement {
  static get style() {
    return html`<style>:host {display: flex;flex-direction: column;white-space: nowrap;user-select: none;background: white;color: black;}:host[horizontal] {flex-direction: row;}:host[horizontal] > io-menu-item {padding: 0.25em 0.5em;}:host[horizontal] > io-menu-item > :not(.menu-label) {display: none;}</style>`;
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

// TODO: implement working mousestart/touchstart UX
// TODO: implement keyboard modifiers maybe. Touch alternative?
class IoMenu extends IoElement {
  static get properties() {
    return {
      options: Array,
      expanded: Boolean,
      position: 'pointer',
      listener: 'click'
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
    this._parent.addEventListener(this.listener, this._onExpand);
    IoMenuLayer.singleton.appendChild(this.$['group']);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._parent.removeEventListener(this.listener, this._onExpand);
    IoMenuLayer.singleton.removeChild(this.$['group']);
  }
  getBoundingClientRect() {
    return this._parent.getBoundingClientRect();
  }
  _onExpand(event) {
    event.preventDefault();
    let evt = event.touches ? event.touches[0] : event;
    IoMenuLayer.singleton.collapseAllGroups();
    IoMenuLayer.singleton._x = evt.clientX;
    IoMenuLayer.singleton._y = evt.clientY;
    this.expanded = true;
  }
}

IoMenu.Register();

const selection = window.getSelection();
const range = document.createRange();

class IoNumber extends IoElement {
  static get style() {
    return html`<style>:host {overflow: hidden;text-overflow: ellipsis;white-space: nowrap;border: 1px solid #444;border-radius: 2px;padding: 0 0.25em;background: white;}:host:focus {overflow: hidden;text-overflow: clip;outline: none;border-color: #09d;background: #def;}</style>`;
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

class IoOption extends IoButton {
  static get style() {
    return html`<style>:host::after {width: 0.65em;margin-left: 0.25em;content: '▾';}</style>`;
  }
  static get properties() {
    return {
      options: Array,
    };
  }
  _onUp(event) {
    super._onUp(event);
    this.$['menu'].expanded = true;
    let firstItem = this.$['menu'].$['group'].querySelector('io-menu-item');
    if (firstItem) firstItem.focus();
  }
  _onAction(event) {
    if (event.which == 13 || event.which == 32 || event.type == 'mouseup' || event.type == 'touchend') {
      event.preventDefault();
    }
  }
  _onMenu(event) {
    this.$['menu'].expanded = false;
    this.set('value', event.detail.value);
    if (typeof this.action === 'function') {
      this.action(this.value);
    }
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
      ['span', String(label)],
      ['io-menu', {
        id: 'menu',
        options: this.options,
        position: 'bottom',
        listener: 'click',
        'on-io-menu-item-clicked': this._onMenu}]
    ]);
  }
}

IoOption.Register();

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

class IoSlider extends IoElement {
  static get style() {
    return html`<style>:host {display: flex;flex-direction: row;}:host > io-number {flex: 0 0 auto;/* margin: 1px; *//* padding: 0.1em 0.2em; */}:host > io-slider-knob {/* margin: 1px; */flex: 1 1 auto;margin-left: 0.05em;border: 1px solid #000;border-radius: 2px;padding: 0 1px;background: #999;}</style>`;}static get properties() {return {value: 0,step: 0.001,min: 0,max: 1,strict: true,};}changed() {const charLength = (Math.max(Math.max(String(this.min).length, String(this.max).length), String(this.step).length));this.template([['io-number', {value: this.bind('value'), step: this.step, min: this.min, max: this.max, strict: this.strict, id: 'number'}],['io-slider-knob', {value: this.bind('value'), step: this.step, min: this.min, max: this.max, strict: this.strict, id: 'slider'}]]);this.$.number.style.setProperty('min-width', charLength + 'em');}}IoSlider.Register();class IoSliderKnob extends IoInteractiveMixin(IoElement) {static get style() {return html`<style>:host {display: flex;cursor: ew-resize;overflow: hidden;}:host img {width: 100% !important;}</style>`;
  }
  static get properties() {
    return {
      value: 0,
      step: 0.01,
      min: 0,
      max: 1000,
      strics: true, // TODO: implement
      pointermode: 'absolute',
      cursor: 'ew-resize'
    };
  }
  static get listeners() {
    return {
      'io-pointer-move': '_onPointerMove'
    };
  }
  _onPointerMove(event) {
    event.detail.event.preventDefault();
    let rect = this.getBoundingClientRect();
    let x = (event.detail.pointer[0].position.x - rect.x) / rect.width;
    let pos = Math.max(0,Math.min(1, x));
    let value = this.min + (this.max - this.min) * pos;
    value = Math.round(value / this.step) * this.step;
    value = Math.min(this.max, Math.max(this.min, (Math.round(value / this.step) * this.step)));
    this.set('value', value);
  }
  changed() {
    this.template([['img', {id: 'img'}],]);
    this.$.img.src = this.paint(this.$.img.getBoundingClientRect());
  }

  paint(rect) {
    // TODO: implement in webgl shader
    canvas.width = rect.width;
    canvas.height = rect.height;

    const bgColor = '#444';
    const colorStart = '#2cf';
    const colorEnd = '#2f6';
    const min = this.min;
    const max = this.max;
    const step = this.step;
    const value = this.value;

    if (isNaN(value)) return;

    const w = rect.width, h = rect.height;
    const handleWidth = 4;

    let snap = Math.floor(min / step) * step;
    let pos;

    if (((max - min) / step) < w / 3 ) {
      while (snap < (max - step)) {
        snap += step;
        pos = Math.floor(w * (snap - min) / (max - min));
        ctx.lineWidth = 1;
        ctx.strokeStyle = bgColor;
        ctx.beginPath();
        ctx.moveTo(pos, 0);
        ctx.lineTo(pos, h);
        ctx.stroke();
      }
    }

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, h / 2 - 2, w, 4);

    pos = handleWidth / 2 + (w - handleWidth) * (value - min) / (max - min);
    const gradient = ctx.createLinearGradient(0, 0, pos, 0);
    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(1, colorEnd);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, h / 2 - 2, pos, 4);

    ctx.lineWidth = handleWidth;
    ctx.strokeStyle = colorEnd;
    ctx.beginPath();
    ctx.moveTo(pos, 0);
    ctx.lineTo(pos, h);
    ctx.stroke();

    return canvas.toDataURL();
  }
}

IoSliderKnob.Register();

const selection$1 = window.getSelection();
const range$1 = document.createRange();

class IoString extends IoElement {
  static get style() {
    return html`<style>:host {overflow: hidden;text-overflow: ellipsis;white-space: nowrap;border: 1px solid #444;border-radius: 2px;padding: 0 0.25em;background: white;}:host:focus {overflow: hidden;text-overflow: clip;outline: none;border-color: #09d;background: #def;}</style>`;
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

// elements

export { IoCore, IoNode, IoElement, html, storage, IoInteractive, IoInteractiveMixin, IoLite, IoLiteMixin, IoArray, IoBoolean, IoButton, IoCollapsable, IoInspector, IoMenuOptions, IoMenu, IoNumber, IoObject, IoOption, IoSlider, IoString };
