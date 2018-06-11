// Get a list of io prototypes by walking down the inheritance chain. 
class Prototypes extends Array {
  constructor(_constructor) {
    super();
    let proto = _constructor.prototype;
    // Stop at HTMLElement for io-element and Object for io-node.
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
    Object.defineProperty(prototype, prop, {
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
}

/*
Creates a property object from properties defined in the prototype chain.
{
  value: <property value>
  type: <constructor of the value>
  observer: <neme of the vunction to be called when value changes>
  reflect: <reflection to HTML element attribute>
  binding: <binding object if bound>
  config: <optional configutation for GUI>
}
 */
class Property {
  constructor(propDef) {
    if (propDef === null || propDef === undefined) {
      propDef = {};
    } else if (typeof propDef === 'function') {
      // Shorthand property definition by constructor.
      propDef = {type: propDef};
    } else if (typeof propDef !== 'object') {
      // Shorthand property definition by value
      propDef = {value: propDef, type: propDef.constructor};
    }
    // Set default value if type is defined but value is not.
    if (propDef.value === undefined && propDef.type) {
      if (propDef.type === Boolean) propDef.value = false;
      else if (propDef.type === String) propDef.value = '';
      else if (propDef.type === Number) propDef.value = 0;
      else if (propDef.type === Array) propDef.value = [];
      else if (propDef.type === Object) propDef.value = {};
      else if (propDef.type !== HTMLElement && propDef.type !== Function) propDef.value = new propDef.type();
    }
    this.value = propDef.value;
    this.type = propDef.type;
    this.observer = propDef.observer;
    this.reflect = propDef.reflect;
    this.binding = propDef.binding;
    this.config = propDef.config;
  }
  // Helper function to assign new values as we walk up the inheritance chain.
  assign(propDef) {
    if (propDef.value !== undefined) this.value = propDef.value;
    if (propDef.type !== undefined) this.type = propDef.type;
    if (propDef.observer !== undefined) this.observer = propDef.observer;
    if (propDef.reflect !== undefined) this.reflect = propDef.reflect;
    if (propDef.binding !== undefined) this.binding = propDef.binding;
    if (propDef.config !== undefined) this.config = propDef.config;
  }
  // Clones the property. If property value is objects it does one level deep object clone.
  clone() {
    let prop = new Property(this);
    if (prop.value instanceof Array) {
      prop.value = [ ...prop.value ];
    } else if (prop.value instanceof Object) {
      let value = prop.value;
      if (typeof value.clone === 'function') {
        prop.value = value.clone();
      } else {
        prop.value = prop.type ? new prop.type() : {};
        for (let p in value) prop.value[p] = value[p];
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
      HTMLElement.prototype.addEventListener.call(element, i, element[this[i]]);
    }
  }
  disconnect(element) {
    for (let i in this) {
      HTMLElement.prototype.removeEventListener.call(element, i, element[this[i]]);
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

// Creates a list of listeners passed to element instance as arguments.
class InstanceListeners {
  setListeners(props) {
    for (let l in props['listeners']) {
      this[l] = props['listeners'][l];
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

const renderNode = function(vDOMNode) {
  let ConstructorClass = customElements.get(vDOMNode.name);
  let element;
  if (ConstructorClass) {
    element = new ConstructorClass(vDOMNode.props);
  } else {
    element = document.createElement(vDOMNode.name);
    updateNode(element, vDOMNode);
  }
  return element;
};

const updateNode = function(element, vDOMNode) {
  for (let prop in vDOMNode.props) {
    element[prop] = vDOMNode.props[prop];
  }
  // TODO: handle special cases cleaner
  // TODO: use attributeStyleMap when implemented in browser
  // https://developers.google.com/web/updates/2018/03/cssom
  if (vDOMNode.props['style']) {
    for (let s in vDOMNode.props['style']) {
      element['style'][s] = vDOMNode.props['style'][s];
    }
  }
  return element;
};

// https://github.com/lukejacksonn/ijk
const clense = (a, b) => !b ? a : typeof b[0] === 'string' ? [...a, b] : [...a, ...b];
// TODO: understand!
const buildTree = () => node => !!node && typeof node[1] === 'object' && !Array.isArray(node[1]) ? {
    ['name']: node[0],
    ['props']: node[1],
    ['children']: Array.isArray(node[2]) ? node[2].reduce(clense, []).map(buildTree()) : node[2] || ''
  } : buildTree()([node[0], {}, node[1] || '']);

const IoBindingMixin = (superclass) => class extends superclass {
  constructor() {
    super();
    Object.defineProperty(this, '__bindings', {value: {}});
  }
  bind(prop) {
    this.__bindings[prop] = this.__bindings[prop] || new Binding(this, prop);
    return this.__bindings[prop];
  }
};

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
      // TODO: remove from WeakMap?
      target.removeEventListener(targetProp + '-changed', this.updateSource);
    }
  }
  updateSource(event) {
    if (this.targets.indexOf(event.srcElement) === -1) return;
    if (this.source[this.sourceProp] !== event.detail.value) {
      this.source[this.sourceProp] = event.detail.value;
    }
  }
  updateTargets(event) {
    if (event.srcElement != this.source) return;
    for (let i = this.targets.length; i--;) {
      let targetProps = this.targetsMap.get(this.targets[i]);
      for (let j = targetProps.length; j--;) {
        if (this.targets[i][targetProps[j]] !== event.detail.value) {
          this.targets[i][targetProps[j]] = event.detail.value;
        }
      }
    }
  }
}

const IoElementListenersMixin = (superclass) => class extends superclass {
  constructor() {
    super();
    Object.defineProperty(this, '__listeners', {value: {}});
  }
  addEventListener(type, listener) {
    this.__listeners[type] = this.__listeners[type] || [];
    let i = this.__listeners[type].indexOf(listener);
    if (i === -1) {
      this.__listeners[type].push(listener);
      HTMLElement.prototype.addEventListener.call(this, type, listener);
    }
  }
  hasEventListener(type, listener) {
    return this.__listeners[type] !== undefined && this.__listeners[type].indexOf(listener) !== -1;
  }
  removeEventListener(type, listener) {
    if (this.__listeners[type] !== undefined) {
      let i = this.__listeners[type].indexOf(listener);
      if (i !== -1) {
        this.__listeners[type].splice(i, 1);
        HTMLElement.prototype.removeEventListener.call(this, type, listener);
      }
    }
  }
  dispatchEvent(type, detail, bubbles = true, src = this) {
    HTMLElement.prototype.dispatchEvent.call(src, new CustomEvent(type, {
      detail: detail,
      bubbles: bubbles,
      composed: true
    }));
  }
};

const IoNodeListenersMixin = (superclass) => class extends superclass {
  constructor() {
    super();
    Object.defineProperty(this, '__listeners', {value: {}});
  }
  addEventListener(type, listener) {
    this.__listeners[type] = this.__listeners[type] || [];
    let i = this.__listeners[type].indexOf(listener);
    if (i === - 1) {
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
        this.__listeners[type].splice(i, 1);
      }
    }
  }
  dispatchEvent(type, detail, bubbles, path) {
    if (this.__listeners[type] !== undefined) {
      let array = this.__listeners[type].slice(0);
      for (let i = 0, l = array.length; i < l; i ++) {
        path = path || [this];
        array[i].call(this, {detail: detail, target: this, bubbles: bubbles, path: path});
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
};

function html() {return arguments[0][0];}

class IoElement extends IoBindingMixin(IoElementListenersMixin(HTMLElement)) {
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

class IoNode extends IoBindingMixin(IoNodeListenersMixin(Object)) {
  constructor() {
    super();
    this.__proto__.constructor.Register();
    this.__proto__.__protoFunctions.bind(this);
    Object.defineProperty(this, '__props', {value: this.__props.clone()});
  }
  connectedCallback() {
    // TODO: implement connected
    this.__proto__.__protoListeners.connect(this);
  }
  disconnectedCallback() {
    // TODO: implement disconnected
    this.__proto__.__protoListeners.disconnect(this);
  }
  dispose() {
    // TODO test
    delete this.parent;
    this.children.lenght = 0;
    for (let l in this.__listeners) this.__listeners[l].lenght = 0;
    for (let p in this.__props) delete this.__props[p];
  }
  setAttribute() {
    console.warn('io-node: setAttribute not suppoerted!');
  }
  update() {}
}

IoNode.Register = function() {
  if (!this.registered) {
    const prototypes = new Prototypes(this);

    Object.defineProperty(this.prototype, '__props', {value: new ProtoProperties(prototypes) });
    Object.defineProperty(this.prototype, '__protoFunctions', {value: new ProtoFunctions(prototypes)});
    Object.defineProperty(this.prototype, '__protoListeners', { value: new ProtoListeners(prototypes) });

    defineProperties(this.prototype);

    // TODO: implement children io-nodes via properties
    // Object.defineProperty(this, 'parent', {value: null});
    // Object.defineProperty(this, 'children', {value: null});

  }
  this.registered = true;
};

const __debounceTimeout = new WeakMap();

function debounce(func, wait) {
  clearTimeout(__debounceTimeout.get(func));
  __debounceTimeout.set(func, setTimeout(func, wait));
}

function path(path, importurl) {
  return new URL(path, importurl).pathname;
}

const _clickmask = document.createElement('div');
_clickmask.style = "position: fixed; top:0; left:0; bottom:0; right:0; z-index:2147483647;";

let mousedownPath = null;

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
  update(pointer) {
    this.previous.set(this.position);
    this.movement.set(pointer.position).sub(this.position);
    this.distance.set(pointer.position).sub(this.start);
    this.position.set(pointer.position);
  }
}

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
  getClosest(array) {
    let closest = array[0];
    for (let i = 1; i < array.length; i++) {
      if (this.distanceTo(array[i]) < this.distanceTo(closest)) {
        closest = array[i];
      }
    }
    return closest;
  }
}

const IoPointerMixin = (superclass) => class extends superclass {
  static get properties() {
    return {
      pointers: Array,
      pointermode: 'relative'
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
        pointer.update(newPointer);
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
    event.preventDefault();
    this.focus();
    // TODO: fix
    mousedownPath = event.path;
    this.getPointers(event, true);
    this._fire('io-pointer-start', event, this.pointers);
    window.addEventListener('mousemove', this._onMousemove);
    window.addEventListener('mouseup', this._onMouseup);
    window.addEventListener('blur', this._onMouseup); //TODO: check pointer data
    // TODO: clickmask breaks scrolling
    if (_clickmask.parentNode !== document.body) {
      document.body.appendChild(_clickmask);
    }
  }
  _onMousemove(event) {
    this.getPointers(event);
    this._fire('io-pointer-move', event, this.pointers, mousedownPath);
  }
  _onMouseup(event) {
    this.getPointers(event);
    this._fire('io-pointer-end', event, this.pointers, mousedownPath);
    window.removeEventListener('mousemove', this._onMousemove);
    window.removeEventListener('mouseup', this._onMouseup);
    window.removeEventListener('blur', this._onMouseup);
    if (_clickmask.parentNode === document.body) {
      document.body.removeChild(_clickmask);
    }
  }
  _onMousehover(event) {
    this.getPointers(event);
    this._fire('io-pointer-hover', event, this.pointers);
  }
  _onTouchstart(event) {
    event.preventDefault();
    this.focus();
    this.getPointers(event, true);
    this._fire('io-pointer-hover', event, this.pointers);
    this._fire('io-pointer-start', event, this.pointers);
    this.addEventListener('touchmove', this._onTouchmove);
    this.addEventListener('touchend', this._onTouchend);
  }
  _onTouchmove(event) {
    event.preventDefault();
    this.getPointers(event);
    this._fire('io-pointer-move', event, this.pointers);
  }
  _onTouchend(event) {
    event.preventDefault();
    this.removeEventListener('touchmove', this._onTouchmove);
    this.removeEventListener('touchend', this._onTouchend);
    this._fire('io-pointer-end', event, this.pointers);

  }
  _fire(eventName, event, pointer, path) {
    this.dispatchEvent(eventName, {event: event, pointer: pointer, path: path || event.path}, false);
  }
};

// export * from "./elements/io-boolean/io-boolean.js";
// export * from "./elements/io-button/io-button.js";
// export * from "./elements/io-menu/io-menu.js";
// export * from "./elements/io-number/io-number.js";
// export * from "./elements/io-object/io-object.js";
// export * from "./elements/io-option/io-option.js";
// export * from "./elements/io-slider/io-slider.js";
// export * from "./elements/io-string/io-string.js";

export { html, IoElement, IoNode, debounce, path, Vector2, IoPointerMixin };
