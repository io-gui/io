class Attributes {
  constructor(protochain) {
    for (let i = 0; i < protochain.length; i++) {
      let prop = protochain[i].constructor.properties;
      if (prop && prop['attributes']) {
        for (let att in prop['attributes']) this[att] = prop['attributes'][att];
      }
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
    this.updateTarget = this.updateTarget.bind(this);
  }
  clone() {
    return new Binding(this.source, this.sourceProp);
  }
  setTarget(target, targetProp) {
    if (this.targets.indexOf(target) === -1) this.targets.push(target);
    if (this.targetsMap.has(target)) {
      let targetProps = this.targetsMap.get(target);
      if (targetProps.indexOf(targetProp) === -1) targetProps.push(targetProp);
    } else {
      this.targetsMap.set(target, [targetProp]);
    }
  }
  // TODO: implement selective purging in io traverse for garbage collection.
  purgeTargets() {
    for (let i = this.targets.length; i--;) this.targetsMap.delete(this.targets[i]);
    this.targets.length = 0;
  }
  updateSource(event) {
    if (this.targets.indexOf(event.srcElement) === -1) return;
    if (this.source[this.sourceProp] !== event.detail.value)
    this.source[this.sourceProp] = event.detail.value;
  }
  updateTarget(event) {
    if (event.srcElement != this.source) return;
    for (let i = this.targets.length; i--;) {
      let targetProps = this.targetsMap.get(this.targets[i]);
      for (let j = targetProps.length; j--;) {
        if (this.targets[i][targetProps[j]] !== event.detail.value)
            this.targets[i][targetProps[j]] = event.detail.value;
      }
    }
  }
  bind() {
    this.source.__properties[this.sourceProp].notify = true;
    this.source.addEventListener(this.sourceProp + '-changed', this.updateTarget);
    for (let i = this.targets.length; i--;) {
      let targetProps = this.targetsMap.get(this.targets[i]);
      for (let j = targetProps.length; j--;) {
        this.targets[i].__properties[targetProps[j]].notify = true;
        this.targets[i].addEventListener(targetProps[j] + '-changed', this.updateSource);
        this.targets[i][targetProps[j]] = this.source[this.sourceProp];
      }
    }
    return this;
  }
  unbind() {
    if (this.source) this.source.removeEventListener(this.sourceProp + '-changed', this.updateTarget);
    for (let i = this.targets.length; i--;) {
      let targetProps = this.targetsMap.get(this.targets[i]);
      for (let j = targetProps.length; j--;) {
        if (this.targets[i]) this.targets[i].removeEventListener(targetProps[j] + '-changed', this.updateSource);
      }
    }
    return this;
  }
}

class Listeners {
  constructor(protochain) {
    for (let i = 0; i < protochain.length; i++) {
      let prop = protochain[i].constructor.properties;
      if (prop && prop['listeners']) {
        for (let listener in prop['listeners']) {
          this[listener] = this[listener] || [];
          this[listener].push(prop['listeners'][listener]);
        }
      }
    }
  }
}

const protochains = {};

const getProtochain = function(__class) {
  const name = __class.prototype.constructor.name;
  return protochains[name] ? protochains[name] : protochains[name] = new Protochain(__class);
};

class Protochain extends Array {
  constructor(__class) {
    super();
    let proto = __class.prototype;
    while (proto && proto !== Element) {
      this.push(proto);
      proto = proto.__proto__;
    }
  }
}

const handlers = {};

const getHandlers = function(__class) {
  const name = __class.prototype.constructor.name;
  return handlers[name] ? handlers[name] : handlers[name] = new Handlers(__class);
};

class Handlers extends Array {
  constructor(__class) {
    super();
    let protochain = __class.protochain;
    for (let i = 0; i < protochain.length; i++) {
      let names = Object.getOwnPropertyNames(protochain[i]);
      for (let i = 0; i < names.length; i++) {
        if (names[i].substring(names[i].length-7, names[i].length) === 'Handler') {
          this.push(names[i]);
        }
      }
    }
  }
}

class Properties {
  constructor(protochain) {
    for (let i = 0; i < protochain.length; i++) {
      let prop = protochain[i].constructor.properties;
      for (let key in prop) {
        if (key !== 'listeners' && key !== 'attributes') {
          if (prop[key].value === undefined) {
            if (prop[key].type === Boolean) prop[key].value = false;
            if (prop[key].type === Number) prop[key].value = 0;
            if (prop[key].type === String) prop[key].value = '';
          }
          prop[key].notify = prop[key].notify || false;
          prop[key].bubbles = prop[key].bubbles || false;
          this[key] = Object.assign(prop[key], this[key] || {});
        }
      }
    }
  }
}

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

const renderNode = function(vDOMNode) {
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

// https://github.com/lukejacksonn/ijk
const clense = (a, b) => !b ? a : typeof b[0] === 'string' ? [...a, b] : [...a, ...b];
const buildTree = () => node => !!node && typeof node[1] === 'object' && !Array.isArray(node[1]) ? {
    ['name']: node[0],
    ['props']: node[1],
    ['children']: Array.isArray(node[2]) ? node[2].reduce(clense, []).map(buildTree()) : node[2] || ''
  } : buildTree()([node[0], {}, node[1] || '']);

function html() { return arguments[0][0]; }

class Io extends HTMLElement {
  static get style() { return html``;}
  static get protochain() {
    return getProtochain(this);
  }
  static get handlers() {
    return getHandlers(this);
  }
  constructor(props = {}) {
    super();

    initStyle(this.localName, this.__proto__.constructor.style);

    const protochain = this.__proto__.constructor.protochain;
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

    const handlers = this.__proto__.constructor.handlers;
    for (let i = 0; i < handlers.length; i++) {
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
        this.reflectAttribute(prop, this.__properties[prop]);
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
  reflectAttribute(prop, config) {
    if (config.reflectToAttribute) {
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

    // create new elements
    const frag = document.createDocumentFragment();
    for (let i = children.length; i < vChildren.length; i++) {
      frag.appendChild(renderNode(vChildren[i]));
    }
    host.appendChild(frag);

    // update existing elements
    for (let i = 0; i < children.length; i++) {

      if (children[i].localName === vChildren[i].name) {

        let element = children[i];
        let observers = [];
        let reflections = [];

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

        const oldElement = children[i];
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

const IoPropertyMixin = (superclass) => class extends superclass {
  static get properties() {
    return {
      value: {
        type: Object,
        observer: 'update'
      },
      key: {
        type: String,
        observer: 'update'
      }
    };
  }
  constructor(props) {
    super(props);
    this.setProperty = this.setProperty.bind(this);
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('io-object-mutated', this._objectMutatedHandler);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('io-object-mutated', this._objectMutatedHandler);
  }
  _objectMutatedHandler(event) {
    if (event.detail.object === this.value) {
      if (event.detail.key === this.key || event.detail.key === '*' || this.key === '*') {
        this.update();
      }
    }
  }
  setProperty(event) {
    this.value[this.key] = event.detail.value;
    window.dispatchEvent(new CustomEvent('io-object-mutated', {
      detail: {object: this.value, key: this.key},
      bubbles: false,
      composed: true
    }));
  }
};

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

const _clickmask = document.createElement('div');
_clickmask.style = "position: fixed; top:0; left:0; bottom:0; right:0; z-index:2147483647;";

const IoPointerMixin = (superclass) => class extends superclass {
  static get properties() {
    return {
      pointers: {
        value: [],
        type: Array
      },
      listeners: {
        'mousedown': '_mousedownHandler',
        'touchstart': '_touchstartHandler',
        'mousemove': '_mousehoverHandler'
      }
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
          x: touches[i].clientX - rect.left,
          y: touches[i].clientY - rect.top
        });
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
  _mousedownHandler(event) {
    event.preventDefault();
    this.focus();
    this.getPointers(event, true);
    this._fire('io-pointer-start', event, this.pointers);
    window.addEventListener('mousemove', this._mousemoveHandler);
    window.addEventListener('mouseup', this._mouseupHandler);
    if (_clickmask.parentNode !== document.body) {
      document.body.appendChild(_clickmask);
    }
  }
  _mousemoveHandler(event) {
    this.getPointers(event);
    this._fire('io-pointer-move', event, this.pointers);
  }
  _mouseupHandler(event) {
    this.getPointers(event);
    this._fire('io-pointer-end', event, this.pointers);
    window.removeEventListener('mousemove', this._mousemoveHandler);
    window.removeEventListener('mouseup', this._mouseupHandler);
    if (_clickmask.parentNode === document.body) {
      document.body.removeChild(_clickmask);
    }
  }
  _mousehoverHandler(event) {
    this.getPointers(event);
    this._fire('io-pointer-hover', event, this.pointers);
  }
  _touchstartHandler(event) {
    event.preventDefault();
    this.focus();
    this.getPointers(event, true);
    this._fire('io-pointer-hover', event, this.pointers);
    this._fire('io-pointer-start', event, this.pointers);
    this.addEventListener('touchmove', this._touchmoveHandler);
    this.addEventListener('touchend', this._touchendHandler);
  }
  _touchmoveHandler(event) {
    event.preventDefault();
    this.getPointers(event);
    this._fire('io-pointer-move', event, this.pointers);
  }
  _touchendHandler(event) {
    event.preventDefault();
    this.removeEventListener('touchmove', this._touchmoveHandler);
    this.removeEventListener('touchend', this._touchendHandler);
    this._fire('io-pointer-end', event, this.pointers);

  }
  _fire(eventName, event, pointer) {
    this.fire(eventName, {event: event, pointer: pointer}, false);
  }
};

class UiButton extends Io {
  static get style() {
    return html`<style>:host {cursor: pointer;white-space: nowrap;-webkit-tap-highlight-color: transparent;}:host:hover {background: rgba(255,255,255,0.05);}:host[active] {background: rgba(0,0,0,0.05);}</style>`;
  }
  static get properties() {
    return {
      value: {
      },
      label: {
        type: String,
        observer: 'update'
      },
      active: {
        type: Boolean,
        reflectToAttribute: true
      },
      action: {
        type: Function
      },
      listeners: {
        'keydown': '_downHandler',
        'mousedown': '_downHandler',
        'touchstart': '_downHandler',
        'mouseenter': '_enterHandler',
      },
      attributes: {
        'tabindex': 0
      }
    };
  }
  _actionHandler(event) {
    event.stopPropagation();
    if (event.which === 13 || event.which === 32 || event.type !== 'keyup') {
      event.preventDefault();
      if (this.active && typeof this.action === 'function') this.action(this.value);
      this.active = false;
    }
  }
  _downHandler(event) {
    event.stopPropagation();
    if (event.which !== 9) event.preventDefault();
    if (event.which === 13 || event.which === 32 || event.type !== 'keydown') {
      this.active = true;
      document.addEventListener('mouseup', this._upHandler);
      document.addEventListener('touchend', this._upHandler);
      this.addEventListener('keyup', this._actionHandler);
      this.addEventListener('mouseup', this._actionHandler);
      this.addEventListener('touchend', this._actionHandler);
      this.addEventListener('mouseleave', this._leaveHandler);
    }
  }
  _upHandler(event) {
    event.stopPropagation();
    this.active = false;
    document.removeEventListener('mouseup', this._upHandler);
    document.removeEventListener('touchend', this._upHandler);
    this.removeEventListener('keyup', this._actionHandler);
    this.removeEventListener('mouseup', this._actionHandler);
    this.removeEventListener('touchend', this._actionHandler);
    this.removeEventListener('mouseleave', this._leaveHandler);
  }
  _leaveHandler() {
    this.active = false;
  }
  update() {
    this.render([['span', this.label]]);
  }
}


window.customElements.define('io-button', IoButton);

class IoBoolean extends IoButton {
  static get properties() {
    return {
      value: {
        type: Boolean,
        observer: 'update'
      },
      true: {
        value: 'true',
        type: String,
        observer: 'update'
      },
      false: {
        value: 'false',
        type: String,
        observer: 'update'
      }
    };
  }
  constructor(props) {
    super(props);
    this.__properties.action.value = this.toggle;
  }
  toggle() {
    this.set('value', !this.value);
  }
  update() {
    this.render([['span', this.value ? this.true : this.false]]);
  }
}

window.customElements.define('io-boolean', IoBoolean);

class IoObjectProp extends IoPropertyMixin(Io) {
  static get style() {
    return html`<style>:host {display: inline-block;}:host > io-number {color: rgb(28, 0, 207);}:host > io-string {color: rgb(196, 26, 22);}:host > io-boolean {color: rgb(170, 13, 145);}:host > io-option {color: rgb(32,135,0);}</style>`;
  }
  static get properties() {
    return {
      tag: {
        type: String,
        reflectToAttribute: true
      },
      config: {
        type: Array,
        observer: 'update'
      }
    };
  }
  update() {
    this.tag = this.config.tag;
    this.render([
      [this.config.tag, Object.assign({
          value: this.value[this.key],
          label: this.key,
          listeners: {'value-set': this.setProperty}},
          this.config.props)]
    ]);
  }
}

window.customElements.define('io-object-prop', IoObjectProp);

class IoVector extends Io {
  static get style() {
    return html`<style>:host {display: flex;flex-direction: row;}</style>`;
  }
  static get properties() {
    return {
      value: {
        observer: 'update'
      },
      columns: {
        type: Number,
        reflectToAttribute: true
      }
    };
  }
  update() {
    let elements = [];
    if (this.value.x !== undefined) elements.push('x');
    if (this.value.y !== undefined) elements.push('y');
    if (this.value.z !== undefined) elements.push('z');
    if (this.value.w !== undefined) elements.push('w');
    this.columns = elements.length;
    const Prop = i => ['io-object-prop', {key: i, value: this.value, config: {tag: 'io-number'}}];
    this.render([elements.map(Prop)]);
  }
}

window.customElements.define('io-vector', IoVector);

class IoColorPicker extends IoPropertyMixin(Io) {
  static get style() {
    return html`<style>:host {display: flex;flex-direction: row;min-width: 1.22em;}</style>`;
  }
  static get properties() {
    return {
      value: {
        type: Object,
        observer: 'update'
      },
      key: {
        value:'*'
      }
    };
  }
  update() {
    let r = parseInt(this.value.r * 255);
    let g = parseInt(this.value.g * 255);
    let b = parseInt(this.value.b * 255);
    this.style.backgroundColor = 'rgb(' + r + ',' + g + ',' + b + ')';
    this.innerHTML = '&nbsp;';
  }
}

window.customElements.define('io-color-picker', IoColorPicker);

class IoColor extends IoVector {
  static get style() {
    return html`<style>:host {display: flex;flex-direction: row;}:host > span {min-width: 1.22em;}</style>`;
  }
  update() {
    let elements = [];
    if (this.value.r !== undefined) elements.push('r');
    if (this.value.g !== undefined) elements.push('g');
    if (this.value.b !== undefined) elements.push('b');
    if (this.value.a !== undefined) elements.push('a');
    this.columns = elements.length + 1;
    const Prop = i => ['io-object-prop', {key: i, value: this.value, config: {tag: 'io-number'}}];
    this.render([
      elements.map(Prop),
      ['io-color-picker', {value: this.bind('value')}],
    ]);
  }
}

window.customElements.define('io-color', IoColor);

class IoFunction extends Io {
  static get style() {
    return html`<style>:host {display: inline-block;font-style: italic;}</style>`;
  }
  static get properties() {
    return {
      value: {
        observer: 'update'
      }
    };
  }
  update() {
    // https://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically
    let STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    let ARGUMENT_NAMES = /([^\s,]+)/g;
    let fnStr = this.value.toString().replace(STRIP_COMMENTS, '');
    let result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES) || [];
    this.innerText = 'ƒ(' + result + ')';
  }
}

window.customElements.define('io-function', IoFunction);

function isPropertyOf(prop, object) {
  for (let p in object) if (object[p] === prop) return true;
  return false;
}

class IoInspectorBreadcrumbs extends Io {
  static get style() {
    return html`<style>:host {display: flex;flex-direction: row;font-weight: bold;font-size: 1.1em;padding: 0.2em;border-radius: 0.1em;white-space: nowrap;}:host .io-back-button {background: #333;border-radius: 0.2em;padding: 0.2em 0.4em;margin-left: 0.2em;cursor: pointer;white-space: nowrap;}:host .io-flex {flex: 1;display: flex;overflow: hidden;}:host .io-breadcrumb {padding: 0.2em 0;margin: 0 0.2em;cursor: pointer;overflow: hidden;text-overflow: ellipsis;}:host .io-breadcrumb:last-of-type {overflow: visible;text-overflow: clip;}:host .io-breadcrumb:before {content: '/';margin-right: 0.2em;}</style>`;
  }
  static get properties() {
    return {
      value: {
        type: Object,
        observer: 'update'
      },
      path: {
        type: Array,
        value: []
      }
    };
  }
  _backHandler() {
    this.value = this.path[Math.max(0, this.path.length - 2)];
  }
  _gotoHandler(i) {
    this.value = this.path[i];
  }
  update() {
    if (this.path.indexOf(this.value) !== -1) {
      this.path.length = this.path.indexOf(this.value) + 1;
    } else if (this.path.length && isPropertyOf(this.value, this.path[this.path.length - 1])) {
      this.path.push(this.value);
    } else if (this.path.indexOf(this.value) === -1) {
      this.path = [this.value];
    }
    const Prop = (elem, i) => ['io-button',
        {class: 'io-breadcrumb', action: this._gotoHandler, value: i}, this.path[i].__proto__.constructor.name];
    this.render([
      ['div', {class: 'io-flex'}, [
        this.path.map(Prop),
      ]],
      this.path.length > 1 ? ['io-button', {class: 'io-back-button', action: this._backHandlerm, label: '< Back'}] : null
    ]);
  }
}


window.customElements.define('io-inspector-breadcrumbs', IoInspectorBreadcrumbs);

class UiCollapsable extends Io {
  static get properties() {
    return {
      label: {
        type: String
      },
      expanded: {
        type: Boolean,
        reflectToAttribute: true,
        observer: 'update'
      },
      elements: {
        type: Array,
        observer: 'update'
      }
    };
  }
  update() {
    this.render([
        ['io-boolean', {true: '▾' + this.label, false: '▸' + this.label, value: this.bind('expanded')}],
        this.expanded ? this.elements : null
    ]);
  }
}

window.customElements.define('io-collapsable', IoCollapsable);

class IoString extends Io {
  static get properties() {
    return {
      value: {
        type: String,
        observer: 'update'
      },
      listeners: {
        'blur': '_blurHandler',
        'keydown': '_keydownhandler'
      },
      attributes: {
        'tabindex': 0,
        'contenteditable': true
      }
    };
  }
  _blurHandler() {
    this.set('value', this.innerText);
  }
  _keydownhandler(event) {
    if (event.which == 13) {
      event.preventDefault();
      this.set('value', this.innerText);
    }
  }
  update() {
    this.innerText = String(this.value).replace(new RegExp(' ', 'g'), '\u00A0');
  }
}

window.customElements.define('io-string', IoString);

class IoNumber extends IoString {
  static get properties() {
    return {
      value: {
        type: Number,
        observer: 'update'
      },
      step: {
        type: Number,
        value: 0.0001
      },
      min: {
        type: Number,
        value: -Infinity
      },
      max: {
        type: Number,
        value: Infinity
      }
    };
  }
  _blurHandler() {
    let value = Math.round(Number(this.innerText) / this.step) * this.step;
    if (!isNaN(value)) this.set('value', value);
    this.update();
  }
  _keydownhandler(event) {
    if (event.which == 13) {
      event.preventDefault();
      let value = Math.round(Number(this.innerText) / this.step) * this.step;
      if (!isNaN(value)) this.set('value', value);
      this.update();
    }
  }
  update() {
    let value = this.value;
    if (typeof value == 'number' && !isNaN(value)) {
      value = Math.round(value / this.step) * this.step;
      value = value.toFixed(-Math.round(Math.log(this.step) / Math.LN10));
    }
    this.innerText = String(parseFloat(value));
  }
}

window.customElements.define('io-number', IoNumber);

class IoObject extends Io {
  static get style() {
    return html`<style>:host {display: inline-block;}:host > .io-wrapper {margin: 2px;border-radius: 2px;background: #444;}:host > .io-row {display: flex;flex-direction: row;}</style>`;
  }
  static get properties() {
    return {
      value: {
        type: Object,
        observer: 'update'
      },
      expanded: {
        type: Boolean,
        observer: 'update',
        reflectToAttribute: true
      }
    };
  }
  getPropConfigs(keys) {
    let configs = {};
    let proto = this.value.__proto__;

    while (proto) {
      let c = IoObject.CONFIG[proto.constructor.name];
      if (c) configs = Object.assign(configs, c);
      proto = proto.__proto__;
    }

    let propConfigs = {};

    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let value = this.value[key];
      let type = typeof value;
      let cstr = (value && value.constructor) ? value.constructor.name : 'null';

      propConfigs[key] = {};

      if (configs.hasOwnProperty('type:' + type)) {
        propConfigs[key] = configs['type:' + type];
      }
      if (configs.hasOwnProperty('constructor:'+cstr)) {
        propConfigs[key] = configs['constructor:'+cstr];
      }
      if (configs.hasOwnProperty('key:' + key)) {
        propConfigs[key] = configs['key:' + key];
      }
      if (configs.hasOwnProperty('value:' + String(value))) {
        propConfigs[key] = configs['value:' + String(value)];
      }
    }
    return propConfigs;
  }
  update() {
    let propConfigs = this.getPropConfigs(Object.keys(this.value));
    const Prop = entry => ['div', {class: 'io-row'}, [
      ['span', entry[0] + ':'],
      ['io-object-prop', {key: entry[0], value: this.value, config: entry[1]}]
    ]];
    this.render([
      ['io-collapsable', {label: this.value.constructor.name, expanded: this.bind('expanded'), elements:
        Object.entries(propConfigs).map(Prop)
      }]
    ]);
  }
}

IoObject.CONFIG = {
  'Object' : {
    'type:string': {tag: 'io-string', props: {}},
    'type:number': {tag: 'io-number', props: {step: 0.1}},
    'type:boolean': {tag: 'io-boolean', props: {}},
    'type:object': {tag: 'io-object', props: {}},
    'type:function': {tag: 'io-function', props: {}},
    'value:null': {tag: 'io-string', props: {}},
    'value:undefined': {tag: 'io-string', props: {}}
  }
};

window.customElements.define('io-object', IoObject);

class IoInspectorGroup extends IoObject {
  static get style() {
    return html`<style>:host {display: flex;flex-direction: column;margin: 0.2em;border-radius: 0.1em;background: #333;line-height: 1em;}:host .io-wrapper {border-radius: 0.1em;}:host .io-wrapper > .io-row {display: flex;flex-direction: row;margin: 0.3em 0.3em 0 0.3em;}:host .io-wrapper > .io-row:last-of-type {margin-bottom: 0.3em;}:host .io-wrapper > .io-row > .io-label {width: 8em;text-align: right;overflow: hidden;text-overflow: ellipsis;padding: 0.3em 0;padding-right: 0.5em;}:host .io-wrapper > .io-row > io-button {padding: 0.3em 0;color: #fd9;flex: none;font-weight: bold;}:host io-object-prop {flex: 1;display: flex;}:host io-option {display: inline-block;color: #ddd;background: #444;color: #ddd !important;border-radius: 0.2em;padding: 0.3em;}:host io-slider {border-radius: 0.2em;background: #444;}:host io-object-prop > io-matrix > io-object-prop > io-number {margin: 0 0.3em 0.3em 0;}:host io-object-prop > io-color > io-object-prop > io-number,:host io-object-prop > io-vector > io-object-prop:not(:last-of-type) > io-number {margin-right: 0.3em;}:host io-string,:host io-number {border-radius: 0.3em;background: #222;padding: 0.3em;}:host io-color-picker,:host io-boolean {padding: 0.3em;border-radius: 0.3em;}:host io-object-prop > io-boolean {flex: none;}:host io-color,:host io-slider,:host io-matrix {flex: 1;}:host io-boolean,:host io-string,:host io-vector,:host io-number {display: flex;color: #bef !important;flex: 1;}:host :focus {outline: 0;box-shadow: 0 0 0.5em #2ff;}</style>`;
  }
  static get properties() {
    return {
      value: {
        type: Object,
        observer: 'update'
      },
      props: {
        type: Array,
        observer: 'update',
      },
      label: {
        type: String,
        observer: 'update'
      },
      expanded: {
        type: Boolean,
        value: true,
        observer: 'update'
      }
    };
  }
  _clickHandler(value) {
    // TODO: consider bubbling event from button
    this.fire('io-link-clicked', {value: value});
  }
  update() {
    let propConfigs = this.getPropConfigs(this.props);
    const Prop = entry => ['div', {class: 'io-row'}, [
      ['span', {class: 'io-label'}, entry[0]],
      entry[1].tag !== 'io-object' ?
          ['io-object-prop', {key: entry[0], value: this.value, config: entry[1]}] :
          ['io-button', {action: this._clickHandler, value: this.value[entry[0]]}, this.value[entry[0]].constructor.name]
    ]];
    this.render([
      this.label === 'main' ? ['div', {class: 'io-wrapper'}, [
        Object.entries(propConfigs).map(Prop)
      ]] :
      ['io-collapsable', {label: this.label, expanded: this.bind('expanded'), elements:
        ['div', {class: 'io-wrapper'}, [
          Object.entries(propConfigs).map(Prop)
        ]]
      }]
    ]);
  }
}


window.customElements.define('io-inspector-group', IoInspectorGroup);

class IoInspector extends Io {
  static get style() {
    return html`<style>:host {display: flex;flex-direction: column;background: #444;color: #ccc;padding: 0.1em;border-radius: 0.2em;}:host .io-wrapper {flex: 1;overflow-x: hidden;overflow-y: auto;}</style>`;
  }
  static get properties() {
    return {
      value: {
        type: Object,
        observer: 'update'
      },
      expanded: {
        type: Boolean,
        observer: 'update',
        reflectToAttribute: true
      },
      listeners: {
        'io-link-clicked': "_linkClickedHandler"
      }
    };
  }
  _linkClickedHandler(event) {
    event.stopPropagation();
    if (event.detail.value instanceof Object) {
      this.value = event.detail.value;
    }
  }
  update() {
    let groups = {};
    let assigned = [];
    let proto = this.value.__proto__;
    let keys = Object.keys(this.value);
    while (proto) {
      let config = IoInspector.CONFIG[proto.constructor.name] || {};
      for (let group in config) {
        groups[group] = groups[group] || [];
        for (let i = 0; i < config[group].length; i++) {
          let key = config[group][i];
          if (this.value.hasOwnProperty(key) && groups[group].indexOf(key) === -1) {
            groups[group].push(key);
            assigned.push(key);
          }
        }
      }
      proto = proto.__proto__;
    }

    for (let group in groups) {
      if (groups[group].length === 0) delete groups[group];
    }
    delete groups.hidden;

    if (assigned.length === 0) {
      groups.main = keys;
    } else {
      for (let i = 0; i < keys.length; i++) {
        groups['advanced'] = groups['advanced'] || [];
        if (assigned.indexOf(keys[i]) === -1) {
          groups['advanced'].push(keys[i]);
        }
      }
    }
    const GroupItem = entry => ['io-inspector-group', {value: this.value, props: entry[1], label: entry[0]}];
    this.render([
      ['io-inspector-breadcrumbs', {value: this.bind('value')}],
      ['div', {class: 'io-wrapper'}, [
        Object.entries(groups).map(GroupItem)
      ]]
    ]);

  }
}

IoInspector.CONFIG = {};

window.customElements.define('io-inspector', IoInspector);

class IoMatrix extends IoVector {
  static get style() {
    return html`<style>:host {display: grid;line-height: 1em;}:host[columns="2"] {grid-template-columns: 50% 50%;}:host[columns="3"] {grid-template-columns: 33.3% 33.3% 33.3%;}:host[columns="4"] {grid-template-columns: 25% 25% 25% 25%;}:host[columns="5"] {grid-template-columns: 20% 20% 20% 20% 20%;}:host > io-object-prop > io-number {width: 100%;}</style>`;
  }
  update() {
    let elements = this.value;
    this.columns = Math.sqrt(elements.length);
    const Prop = (elem, i) => ['io-object-prop', {key: i, value: elements, config: {tag: 'io-number'}}];
    this.render([elements.map(Prop)]);
  }
}

window.customElements.define('io-matrix', IoMatrix);

let previousOption;
let previousParent;
let timeoutOpen;
let timeoutReset;
let WAIT_TIME = 1000;

class UiMenuLayer extends Io {
  static get style() {
    return html`<style>:host {display: block;visibility: hidden;position: fixed;top: 0;left: 0;bottom: 0;right: 0;z-index: 100000;background: rgba(0, 0, 0, 0.3);-moz-user-select: none;-ms-user-select: none;-webkit-user-select: none;user-select: none;overflow: hidden;font-family: "Lucida Grande", sans-serif;}:host[expanded] {visibility: visible;}</style>`;
  }
  static get properties() {
    return {
      expanded: {
        type: Boolean,
        reflectToAttribute: true,
        observer: '_expandedChanged'
      },
      pointer: {
        value: {x: 0, y: 0, v: 0},
        type: Object
      },
      listeners: {
        'mouseup': '_eventHandler',
        'touchstart': '_eventHandler',
        'keyup': '_eventHandler',
        'expanded-changed': '_expandedHandler',
        'mousemove': '_mousemoveHandler',
        'io-menu-option-clicked': '_menuClickedHandler'
      }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('scroll', this.collapseAll.bind(this));
  }
  collapseAll() {
    let groups = this.querySelectorAll('io-menu-group');
    for (let i = 0; i < groups.length; i++) {
      groups[i].expanded = false;
    }
  }
  _menuClickedHandler(event) {
    event.stopPropagation();
    let option = event.detail.option;
    if (typeof option.action === 'function') {
      option.action.apply(null, [option.value]);
      UiMenuLayer.singleton.collapseAll();
    } else if (option.button) {
      option.button.click(); // TODO: test
      UiMenuLayer.singleton.collapseAll();
    } else if (option.value !== undefined) {
      UiMenuLayer.singleton.collapseAll();
    }
  }
  _eventHandler(event) {
    event.stopPropagation();
    if (event.target === this || event.key === 'Escape' || event.keyCode === 27) {
      this.collapseAll();
    }
  }
  _mousemoveHandler(event) {
    this.pointer.x = event.clientX;
    this.pointer.y = event.clientY;
    this.pointer.v = Math.abs(event.movementY / 2) - Math.abs(event.movementX);
    let groups = this.querySelectorAll('io-menu-group');
    for (let i = groups.length; i--;) {
      if (groups[i].expanded) {
        if (groups[i]._rect.top < this.pointer.y && groups[i]._rect.bottom > this.pointer.y &&
          groups[i]._rect.left < this.pointer.x && groups[i]._rect.right > this.pointer.x) {
            this._hover(groups[i]);
            return groups[i];
        }
      }
    }
  }
  _hover(group) {
    let options = group.querySelectorAll('io-menu-option');
    for (let i = options.length; i--;) {
      options[i]._rect = options[i].getBoundingClientRect();
      if (options[i]._rect.top < this.pointer.y && options[i]._rect.bottom > this.pointer.y &&
        options[i]._rect.left < this.pointer.x && options[i]._rect.right > this.pointer.x) {
          this._focus(options[i]);
          return options[i];
      }
    }
  }
  _focus(option) {
    if (option !== previousOption) {
      clearTimeout(timeoutOpen);
      clearTimeout(timeoutReset);
      if (this.pointer.v > 0.5 || option.parentNode !== previousParent) {
        previousOption = option;
        option.focus();
      } else {
        timeoutOpen = setTimeout(function() {
          previousOption = option;
          option.focus();
        }.bind(this), WAIT_TIME);
      }
      previousParent = option.parentNode;
      timeoutReset = setTimeout(function() {
        previousOption = null;
        previousParent = null;
      }.bind(this), WAIT_TIME + 1);
    }
  }
  _expandedHandler() {
    let groups = this.querySelectorAll('io-menu-group');
    let expanded = false;
    for (let i = 0; i < groups.length; i++) {
      if (groups[i].expanded) expanded = true;
    }
    this.expanded = expanded;
  }
  _expandedChanged() {
    if (this.expanded) {
      // TODO: test
      this._activeElement = document.activeElement;
    } else {
      if (this._activeElement) {
        this._activeElement.focus();
        delete this._activeElement;
      }
    }
  }
}

window.customElements.define('io-menu-layer', IoMenuLayer);

UiMenuLayer.singleton = new UiMenuLayer();

document.body.appendChild(UiMenuLayer.singleton);

// TODO: extend button?
class UiMenuOption extends Io {
  static get style() {
    return html`<style>:host {display: flex;flex-direction: row;cursor: pointer;padding: 0.125em 0.5em 0.125em 1.7em;line-height: 1em;}:host > .io-icon {width: 1.25em;margin-left: -1.25em;line-height: 1em;}:host > .io-label {flex: 1}:host > .io-hint {opacity: 0.5;padding: 0 0.5em;}:host > .io-more {opacity: 0.5;margin: 0 -0.25em 0 0.25em;}</style>`;
  }
  static get properties() {
    return {
      option: {
        type: Object
      },
      $parent: {
        type: HTMLElement
      },
      listeners: {
        'focus': '_focusHandler',
        'click': '_clickHandler',
        'keyup': '_keyupHandler'
      },
      attributes: {
        'tabindex': 1
      }
    };
  }
  constructor(props) {
    super(props);
    this.render([
      this.option.options ? ['io-menu-group', {options: this.option.options, $parent: this, position: 'right'}] : null,
      this.option.icon ? ['span', {class: 'io-icon'}, this.option.icon] : null,
      this.option.label ? ['span', {class: 'io-label'}, this.option.label] : ['span', {class: 'io-label'}, this.option.value],
      this.option.hint ? ['span', {class: 'io-hint'}, this.option.hint] : null,
      this.option.options ? ['span', {class: 'io-more'}, '▸'] : null,
    ]);
  }
  connectedCallback() {
    super.connectedCallback();
    this.$group = this.querySelector('io-menu-group');
    if (this.$group) {
      UiMenuLayer.singleton.appendChild(this.$group);
    }
  }
  _focusHandler() {
    for (let i = 0; i < this.$parent.$options.length; i++) {
      if (this.$parent.$options[i] !== this) {
        if (this.$parent.$options[i].$group)
            this.$parent.$options[i].$group.expanded = false;
      }
    }
    if (this.$group) this.$group.expanded = true;
  }
  _clickHandler() {
    let parent = this.$parent;
    while (parent && parent.localName != 'io-menu') {
      parent = parent.$parent;
    }
    this.fire('io-menu-option-clicked', {option: this.option});
    parent.fire('io-menu-option-clicked', {option: this.option}, false);
  }
  _keyupHandler(event) {
    let siblings = this.$parent.$options;
    let index = siblings.indexOf(this);

    // TODO: handle search.
    // TODO: handle previous focus.
    // TODO: handle tabbed focus marching.
    if (event.which == 13) {
      event.preventDefault();
      this._clickHandler(event); // TODO: test
    } else if (event.which == 37) { // LEFT
      event.preventDefault();
      if (this.$parent && this.$parent.$parent) this.$parent.$parent.focus();
    } else if (event.which == 38) { // UP
      event.preventDefault();
      siblings[(index + siblings.length - 1) % (siblings.length)].focus();
    } else if (event.which == 39) { // RIGHT
      event.preventDefault();
      if (this.option.options && this.option.options.length) {
        this.$group.$options[0].focus();
      }
    } else if (event.which == 40) { // DOWN
      event.preventDefault();
      // TODO: search
      siblings[(index + 1) % (siblings.length)].focus();
    } else if (event.which == 9) { // TAB
      event.preventDefault();
      if (this.option.options && this.option.options.length) {
        this.$group.$options[0].focus();
      } else if (index < siblings.length - 1) {
        siblings[(index + 1)].focus();
      } else if (this.$parent && this.$parent.$parent) {
        // TODO: fix and implement better tabbed focus marching.
        let target = this.$parent.$parent;
        let tSiblings = target.$parent.$options;
        let tIndex = tSiblings.indexOf(target);
        tSiblings[(tIndex + 1) % (tSiblings.length)].focus();
      }

    } else if (event.which == 27) { // ESC
      event.preventDefault();
      UiMenuLayer.singleton.collapseAll();
    }
  }
}

window.customElements.define('io-menu-option', IoMenuOption);

class UiMenuGroup extends Io {
  static get style() {
    return html`<style>:host {display: none;flex-direction: column;position: absolute;transform: translateZ(0);top: 0;left: 0;background: white;white-space: nowrap;padding: 0.125em 0 0.25em 0;border: 1px solid #666;box-shadow: 1px 1px 2px rgba(0,0,0,0.33);min-width: 6em;}:host[expanded] {display: flex;}</style>`;
  }
  static get properties() {
    return {
      options: {
        type: Array,
        observer: 'update'
      },
      expanded: {
        type: Boolean,
        notify: true,
        bubbles: true,
        observer: '_expandedChanged',
        reflectToAttribute: true
      },
      position: {
        type: String,
        value: 'pointer',
        observer: '_setPosition'
      },
      $parent: {
        type: HTMLElement
      }
    };
  }
  constructor(props) {
    super(props);
    this._animate = this._animate.bind(this);
    this.$options = [];
    this._x = 0;
    this._y = 0;
    this.update();
  }
  update() {
    setTimeout(() => {
      if (this.options) {
        for (let i = 0; i < this.$options.length; i++) {
          if (this.$options[i].parentElement) this.removeChild(this.$options[i]);
        }
        let frag = document.createDocumentFragment();
        for (let i = 0; i < this.options.length; i++) {
          if (this.$options[i]) {
            // Consider using render and reuse UiMenuOption elements
            this.$options[i] = new UiMenuOption({option: this.options[i], $parent: this});
          } else {
            this.$options[i] = new UiMenuOption({option: this.options[i], $parent: this});
          }
          this.appendChild(this.$options[i]);
        }
        this.appendChild(frag);
      }
    });
  }
  _expandedChanged() {
    if (this.expanded) {
      this._startAnimation();
      this._setPosition();
    } else {
      this._stopAnimation();
      for (let i = 0; i < this.$options.length; i++) {
        // TODO: redundant???
        if (this.$options[i].$group)
            this.$options[i].$group.expanded = false;
      }
    }
  }
  _startAnimation() {
    if (!this._playing) {
      this._playing = true;
      this._animate();
    }
  }
  _stopAnimation() {
    this._playing = false;
  }
  _animate() {
    if (!this._playing) return;
    requestAnimationFrame(this._animate);
    this._scroll();
  }
  _setPosition() {
    this._rect = this.getBoundingClientRect();
    this._pRect = this.$parent.getBoundingClientRect();
    switch (this.position) {
      case 'pointer':
        this._x = UiMenuLayer.singleton.pointer.x - 2 || this._pRect.x;
        this._y = UiMenuLayer.singleton.pointer.y - 2 || this._pRect.y;
        break;
      case 'bottom':
        this._x = this._pRect.x;
        this._y = this._pRect.bottom;
        break;
      case 'right':
        this._x = this._pRect.right;
        this._y = this._pRect.y;
        if (this._x + this._rect.width > window.innerWidth) {
          this._x = this._pRect.x - this._rect.width;
        }
        break;
      case 'top':
      default:
        this._x = this._pRect.x;
        this._y = this._pRect.y;
        break;
    }
    this._x = Math.min(this._x, window.innerWidth - this._rect.width);
    this._y = Math.min(this._y, window.innerHeight - this._rect.height);
    this.style.left = this._x + 'px';
    this.style.top = this._y + 'px';
  }
  _scroll() {
    this._rect = this.getBoundingClientRect();
    let scrollSpeed, overflow;
    let y = UiMenuLayer.singleton.pointer.y;
    if (this._rect.height > window.innerHeight) {
      if (y < 100 && this._rect.top < 0) {
        scrollSpeed = (100 - y) / 5000;
        overflow = this._rect.top;
        this._y = this._y - Math.ceil(overflow * scrollSpeed) + 1;
      } else if (y > window.innerHeight - 100 && this._rect.bottom > window.innerHeight) {
        scrollSpeed = (100 - (window.innerHeight - y)) / 5000;
        overflow = (this._rect.bottom - window.innerHeight);
        this._y = this._y - Math.ceil(overflow * scrollSpeed) - 1;
      }
      this.style.left = this._x + 'px';
      this.style.top = this._y + 'px';
    }
  }
}

window.customElements.define('io-menu-group', IoMenuGroup);

class UiMenu extends Io {
  static get style() {
    return html`<style>:host {display: inline-block;background: black;}</style>`;
  }
  static get properties() {
    return {
      options: {
        type: Array
      },
      expanded: {
        type: Boolean
      },
      position: {
        value: 'top',
        type: String
      },
      listener: {
        type: String,
        value: 'click'
      }
    };
  }
  constructor(props) {
    super(props);
    this.$group = new UiMenuGroup({
      $parent: this,
      position: this.bind('position'),
      options: this.bind('options'),
      expanded: this.bind('expanded')
    });
  }
  connectedCallback() {
    super.connectedCallback();
    this.$parent = this.parentElement || this.parentNode.host;
    if (this.listener) this.$parent.addEventListener(this.listener, this._expandHandler);
    UiMenuLayer.singleton.appendChild(this.$group);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.listener) this.$parent.removeEventListener(this.listener, this._expandHandler);
    UiMenuLayer.singleton.removeChild(this.$group);
  }
  getBoundingClientRect() {
    if (this.$parent) return this.$parent.getBoundingClientRect();
    else return document.body.getBoundingClientRect();
  }
  _expandHandler(event) {
    UiMenuLayer.singleton.collapseAll();
    UiMenuLayer.singleton.pointer.x = event.clientX;
    UiMenuLayer.singleton.pointer.y = event.clientY;
    this.expanded = true;
  }
}

window.customElements.define('io-menu', IoMenu);

class IoOption extends IoButton {
  static get properties() {
    return {
      value: {
        observer: 'update'
      },
      action: {
        type: Function
      },
      options: {
        type: Array,
        observer: 'update'
      }
    };
  }
  _actionHandler(event) {
    if (event.which == 13 || event.which == 32 || event.type == 'mouseup' || event.type == 'touchend') {
      event.preventDefault();
      this.querySelector('io-menu').expanded = true;
      this.querySelector('io-menu').$group.$options[0].focus();
    }
  }
  _menuHandler(event) {
    event.stopPropagation();
    if (event.detail.option.value !== undefined) {
      this.set('value', event.detail.option.value);
      if (typeof this.action === 'function') {
        this.action(this.value !== undefined ? this.value : event);
      }
    }
  }
  update() {
    let label = this.value;
    if (label instanceof Object) label = label.__proto__.constructor.name;
    if (this.options) {
      for (let i = 0; i < this.options.length; i++) {
        if (this.options[i].value == this.value) {
          label = this.options[i].label || label;
          break;
        }
      }
    }
    this.__properties.label.value = label;
    this.render([
      ['span', String(label)],
      ['io-menu', {
        options: this.options,
        position: 'bottom',
        listeners: {'io-menu-option-clicked': this._menuHandler}}]
    ]);
  }
}

window.customElements.define('io-option', IoOption);

class IoSlider extends IoPointerMixin(Io) {
  static get style() {
    return html`<style>:host {display: inline-block;cursor: ew-resize;min-width: 6em;min-height: 1.22em;position: relative;vertical-align: bottom;}:host > .io-slider-slit {position: absolute;width: 100%;height: 0.2em;top: calc(50% - 0.1em);}:host > .io-slider-knob {position: absolute;width: 0.4em;margin-left: -0.2em;height: 100%;background: #999;left: calc(50%);}</style>`;
  }
  static get properties() {
    return {
      value: {
        type: Number,
        observer: 'update'
      },
      step: {
        type: Number,
        value: 0.01,
        observer: 'update'
      },
      min: {
        type: Number,
        value: 0,
        observer: 'update'
      },
      max: {
        type: Number,
        value: 100,
        observer: 'update'
      },
      attributes: {
        'tabindex': 0
      },
      listeners: {
        'io-pointer-move': '_pointerMoveHandler'
      }
    };
  }
  _pointerMoveHandler(event) {
    let rect = this.getBoundingClientRect();
    let x = event.detail.pointer[0].position.x / rect.width;
    let pos = Math.max(0,Math.min(1, x));
    // TODO: implement step
    this.set('value', this.min + (this.max - this.min) * pos);
  }
  update() {
    let pos = 100 * (this.value - this.min) / (this.max - this.min);
    this.render([
      ['div', {class: 'io-slider-slit', style: {
          background: 'linear-gradient(to right, #2cf, #2f6 ' + pos + '%, #333 ' + (pos + 1) + '%)'}}],
      ['div', {class: 'io-slider-knob', style: {left: pos + '%'}}]
    ]);
  }
}

window.customElements.define('io-slider', IoSlider);

const _dragIcon = document.createElement('div');
_dragIcon.style = "position: absolute; width: 40px; height: 40px; background: rgba(0,0,0,0.5);";

class UiTabSelector extends IoPointerMixin(Io) {
  static get style() {
    return html`<style>:host {display: inline-block;cursor: pointer;white-space: nowrap;padding: 0 0.2em;}:host[selected] {font-weight: bold;}</style>`;
  }
  static get properties() {
    return {
      value: {
        type: String,
        observer: 'update'
      },
      host: {
        type: HTMLElement
      },
      selected: {
        type: Boolean,
        reflectToAttribute: true
      },
      action: {
        type: Function
      },
      listeners: {
        'io-pointer-end': '_pointerEndHandler',
        'io-pointer-move': '_pointerMoveHandler'
      }
    };
  }
  _pointerEndHandler(event) {
    if (event.detail.pointer[0].distance.length() < 4 && !this._dragging) {
      if (typeof this.action === 'function') this.action(this.value);
    }
    if (_dragIcon.parentNode) {
      _dragIcon.parentNode.removeChild(_dragIcon);
    }
    if (this._dragging) {
      this.fire('io-tab-drag-end', {tab: this.value, host: this.host});
      this._dragging = false;
    }
  }
  _pointerMoveHandler(event) {
    if (event.detail.pointer[0].distance.length() > 32 || this._dragging) {
      if (!this._dragging) {
        this._rect = this.getBoundingClientRect();
        this._dragging = true;
        this._clickmask.appendChild(_dragIcon);

        this.fire('io-tab-drag-start', {tab: this.value, host: this.host});

      } else {
        let x = this._rect.left + event.detail.pointer[0].position.x;
        let y = this._rect.top + event.detail.pointer[0].position.y;

        this.fire('io-tab-drag', {x: x, y: y, tab: this.value, host: this.host});

        _dragIcon.style.left = x - 8 + 'px';
        _dragIcon.style.top = y - 8 + 'px';
      }
    }
  }
}

window.customElements.define('io-tab-selector', IoTabSelector);















  // listeners: {
  //   'dragstart': '_dragstartHandler',
  //   'dragend': '_dragendHandler'
  // },
  // droptarget: {
  //   type: HTMLElement,
  //   observer: '_dropTargetChanged'
  // },
  // attributes: {
  //   draggable: true
  // }
  // _dragstartHandler() {
  //   UiLayoutTab.dragged = this;
  // }
  // _dropTargetChanged(value, oldValue) {
  //   if (oldValue) oldValue.dropzone = '';
  // }
  // _dragendHandler(event) {
  //   if (this.droptarget && this.droptarget.dropzone === 'center') {
  //     this.droptarget.tabs.push(this.value);
  //     //TODO: ugh
  //     this.parentElement.parentElement.tabs.splice(this.parentElement.parentElement.tabs.indexOf(this.value), 1);
  //     this.droptarget.update();
  //     this.parentElement.parentElement.update();
  //   }
  //   if (this.droptarget) this.droptarget.dropzone = '';
  // }
  // _dragHandler(event) {
  //   let blocks = [];
  //   for (let i = 0; i < event.path.length; i++) {
  //     if (event.path[i].localName === 'io-layout-block') {
  //       blocks.push(event.path[i]);
  //     }
  //   }
  //   console.log(event)
  //   for (let i = 0; i < blocks.length; i++) {
  //     console.log(blocks[i])
  //   }
  //
  //   if (this.targetBlock !== blocks[0]) {
  //     // if (this.targetBlock) this.targetBlock.droptarget = '';
  //     this.targetBlock = blocks[0];
  //   }
  //
  //
  // }
  // _dragoverHandler(event) {
  //   // console.log(event.srcElement)
  // }

// /* events fired on the draggable target */
// document.addEventListener("drag", function( event ) {
// }, false);
// document.addEventListener("dragstart", function( event ) {
//     // store a ref. on the dragged elem
//     dragged = event.target;
//     // make it half transparent
//     event.target.style.opacity = .5;
// }, false);
// document.addEventListener("dragend", function( event ) {
//     // reset the transparency
//     event.target.style.opacity = "";
// }, false);
// /* events fired on the drop targets */
// document.addEventListener("dragover", function( event ) {
//     // prevent default to allow drop
//     event.preventDefault();
// }, false);
// document.addEventListener("dragenter", function( event ) {
//     // highlight potential drop target when the draggable element enters it
//     if ( event.target.className == "dropzone" ) {
//         event.target.style.background = "purple";
//     }
// }, false);
// document.addEventListener("dragleave", function( event ) {
//     // reset background of potential drop target when the draggable element leaves it
//     if ( event.target.className == "dropzone" ) {
//         event.target.style.background = "";
//     }
// }, false);
// document.addEventListener("drop", function( event ) {
//     // prevent default action (open as link for some elements)
//     event.preventDefault();
//     // move dragged elem to the selected drop target
//     if ( event.target.className == "dropzone" ) {
//         event.target.style.background = "";
//         dragged.parentNode.removeChild( dragged );
//         event.target.appendChild( dragged );
//     }
// }, false);

class UiTabs extends Io {
  static get style() {
    return html`<style>:host{flex: 1;display: flex;flex-direction: column;position: relative;overflow: hidden;background: #ffc;}:host > .io-tabs-wrapper {border-bottom: 1px solid black;margin-top: 0.2em;white-space: nowrap;}:host > .io-tabs-wrapper > io-option,:host > .io-tabs-wrapper > io-tab-selector {margin-left: 0.2em;padding: 0 0.5em 0 0.5em;border: 1px solid black;border-bottom: 0;background: #ddd;}:host > .io-tabs-wrapper > io-tab-selector[selected] {padding-bottom: 1px;margin-bottom: -1px;}:host > .io-tab-content {background: #ddd;display: flex;flex: 1;}:host > .io-tab-content > * {flex: 1;}:host > .io-layout-drop-highlight {position: absolute;background: rgba(0, 0, 0, 0.25);width: 100%;height: 100%;}:host:not([dropzone]) > .io-layout-drop-highlight {pointer-events: none;opacity: 0;}:host[dropzone=top] > .io-layout-drop-highlight {background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 99.9px, transparent 100px);}:host[dropzone=bottom] > .io-layout-drop-highlight {background: linear-gradient(to top, rgba(0, 0, 0, 0.5) 99.9px, transparent 100px);}:host[dropzone=left] > .io-layout-drop-highlight {background: linear-gradient(to right, rgba(0, 0, 0, 0.5) 99.9px, transparent 100px);}:host[dropzone=right] > .io-layout-drop-highlight {background: linear-gradient(to left, rgba(0, 0, 0, 0.5) 99.9px, transparent 100px);}</style>`;
  }
  static get properties() {
    return {
      elements: {
        type: Object,
        observer: 'update'
      },
      tabs: {
        type: Object,
        observer: 'update'
      },
      selected: {
        type: String,
        observer: 'update'
      },
      dropzone: {
        type: String,
        reflectToAttribute: true
      }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('io-tab-drag-start', this._tabDragStartHandler);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('io-tab-drag-start', this._tabDragStartHandler);
  }
  _tabDragStartHandler() {
    this._rect = this.getBoundingClientRect();
    window.addEventListener('io-tab-drag', this._tabDragHandler);
    window.addEventListener('io-tab-drag-end', this._tabDragEndHandler);
  }
  _tabDragHandler(event) {
    let dx = event.detail.x;
    let dy = event.detail.y;
    let x = 2 * (((dx - this._rect.x) / this._rect.width) - 0.5);
    let y = 2 * (((dy - this._rect.y) / this._rect.height) - 0.5);
    if (Math.abs(y) < 1 && Math.abs(x) < 1) {
      if (Math.abs(y) < 0.5 && Math.abs(x) < 0.5) this.dropzone = 'center';
      else if (y < -Math.abs(x)) this.dropzone = 'top';
      else if (y > +Math.abs(x)) this.dropzone = 'bottom';
      else if (x < -Math.abs(y)) this.dropzone = 'left';
      else if (x > +Math.abs(y)) this.dropzone = 'right';
      else this.dropzone = 'center';
    } else {
      this.dropzone = '';
    }
  }
  _tabDragEndHandler(event) {
    window.removeEventListener('io-tab-drag', this._tabDragHandler);
    window.removeEventListener('io-tab-drag-end', this._tabDragEndHandler);
    if (this.dropzone === 'center') {
      if (event.detail.host !== this) {
        this.addTab(event.detail.tab);
        event.detail.host.removeTab(event.detail.tab);
      }
    } else {
      // this.addSplit(event.detail.tab, this.dropzone);
    }
    this.dropzone = '';
  }
  addTab(tab, index) {
    // TODO: implement indexed insertion on tab hover.
    let tabs = this.tabs;
    console.log(index);
    if (tabs.indexOf(tab) === -1) tabs.push(tab);
    this.fire('io-tab-added', this.tabs);
    this._selectHandler(tab);
  }
  removeTab(tab) {
    let tabs = this.tabs;
    if (tabs.indexOf(tab) !== -1) tabs.splice(tabs.indexOf(tab), 1);
    let selected = this.selected || tabs[tabs.length - 1];
    if (selected === tab) selected = tabs[tabs.length - 1];
    this.fire('io-tab-removed', this.tabs);
    this._selectHandler(selected);
  }
  // addSplit(tab, split) {
  //   console.log(tab, split);
  // }
  _optionSelectHandler(tab) {
    this.addTab(tab);
  }
  _selectHandler(elem) {
    this.selected = elem;
    this.fire('io-tab-selected', this.tabs);
    this.update();
  }
  update() {
    let tabs = this.tabs;
    let selected = this.selected || tabs[tabs.length - 1];
    const Elem = (entry) => ['io-tab-selector', {
        value: entry,
        host: this,
        action: this._selectHandler,
        selected: entry === selected
      }, entry];
    this.render([
      ['div', {class: 'io-tabs-wrapper'}, [
        tabs.map(Elem),
        ['io-option', {
          value: '+',
          options: Object.entries(this.elements).map((entry) => ({value: entry[0]})),
          action: this._optionSelectHandler
        }]
      ]],
      ['div', {class: 'io-tab-content'}, [
        tabs.indexOf(selected) !== -1 ? this.elements[selected] : null
      ]],
      ['div', {class: 'io-layout-drop-highlight'}]
    ]);
  }
}

window.customElements.define('io-tabs', IoTabs);

class UiLayoutDivider extends IoPointerMixin(Io) {
  static get style() {
    return html`<style>:host {background: #333;color: #ccc;z-index: 1;display: flex;flex: none;}:host[orientation=horizontal] {cursor: ew-resize;}:host[orientation=vertical] {cursor: ns-resize;}:host > .io-divider-icon {display: flex;flex: 1;align-items: center;justify-content: center;}</style>`;
  }
  static get properties() {
    return {
      orientation: {
        value: 'horizontal',
        type: String,
        reflectToAttribute: true
      },
      index: {
        type: Number
      },
      listeners: {
        'io-pointer-move': '_pointerMoveHandler'
      }
    };
  }
  // TODO: reproduce and fix sticky movement
  _pointerMoveHandler(event) {
    let rect = this.getBoundingClientRect();
    let movement;
    if (this.orientation === 'horizontal') {
      movement = event.detail.pointer[0].position.x - rect.width / 2;
    } else {
      movement = event.detail.pointer[0].position.y - rect.height / 2;
    }
    this.fire('io-layout-divider-move', {movement: movement, index: this.index});
  }
  update() {
    this.render([
      ['div', {class: 'io-divider-icon'}, this.orientation === 'horizontal' ? '⋮' : '⋯']
    ]);
  }
}


window.customElements.define('io-layout-divider', IoLayoutDivider);

class UiLayoutSplit extends Io {
  static get style() {
    return html`<style>:host{flex: 1;display: flex;flex-direction: column;position: relative;overflow: hidden;}:host[orientation=horizontal] {flex-direction: row;}:host[orientation=vertical] {flex-direction: column;}:host[orientation=horizontal] > io-layout-divider {width: 10px;}:host[orientation=vertical] > io-layout-divider {height: 10px;}:host > io-layout-divider:last-of-type {display: none;}</style>`;
  }
  static get properties() {
    return {
      splits: {
        type: Array,
        observer: 'update'
      },
      elements: {
        type: Object
      },
      orientation: {
        value: 'horizontal',
        type: String,
        reflectToAttribute: true
      },
      listeners: {
        'io-layout-divider-move': '_dividerMoveHandler',
        'io-tab-added': '_tabChangedHandler',
        'io-tab-removed': '_tabRemovedHandler',
        'io-tab-selected': '_tabChangedHandler'
      }
    };
  }
  _dividerMoveHandler(event) {
    event.stopPropagation();
    let movement = event.detail.movement;

    let i = event.detail.index;
    let d = this.orientation === 'horizontal' ? 'width' : 'height';
    let splits = this.splits;

    let $blocks = [].slice.call(this.children).filter(element => element.localName !== 'io-layout-divider');
    let prev = splits[i];
    let next = splits[i+1];

    if (next[1][d] !== undefined && prev[1][d] !== undefined) {
      next[1][d] = $blocks[i+1].getBoundingClientRect()[1][d];
    }

    prev = splits[i];
    next = splits[i+1];

    if (prev[1][d] !== undefined) prev[1][d] = Math.max(0, prev[1][d] + movement);
    if (next[1][d] !== undefined) next[1][d] = Math.max(0, next[1][d] - movement);

    this.fire('layout-changed', this.splits);
    this.update();
  }
  _tabRemovedHandler(event) {
    event.stopPropagation();
    if (event.detail.length === 0) {
      this.removeSplit(event.detail);
    }
  }
  _tabChangedHandler(event) {
    event.stopPropagation();
    this.fire('layout-changed', this.splits);
  }
  addSplit(split, index, orientation) {
    console.log(split, index, orientation);
    // insert if orientation match
    // Add new split if orientation different.
  }
  removeSplit(split) {
    this.splits.splice(this.splits.indexOf(split), 1);
    this.update();
  }
  update() {
    let d = this.orientation === 'horizontal' ? 'width' : 'height';
    let splits = this.splits;
    // let elements = [];
    let styles = [];

    // Make sure at least one is flex (no size).
    let hasFlex = false;
    for (let i = 0; i < splits.length; i++) {
      let size = splits[i][1][d];
      if (size === undefined) hasFlex = true;
    }
    if (!hasFlex) delete splits[parseInt(splits.length / 2)][1][d];

    for (let i = 0; i < splits.length; i++) {
      let size = splits[i][1][d];
      styles[i] = {
        'flex-basis': 'auto',
        'flex-shrink': '10000',
        'flex-grow': '1'
      };
      if (size !== undefined) styles[i] = {
        'flex-basis': size + 'px',
        'flex-shrink': '1',
        'flex-grow': '0'
      };
    }
    this.render([
      [].concat(...this.splits.map((entry, i) => [
        [entry[0], Object.assign({elements: this.elements, style: styles[i]}, entry[1])],
        ['io-layout-divider', {orientation: this.orientation, index: i}]
      ]))
    ]);
  }
}


window.customElements.define('io-layout-split', IoLayoutSplit);

class UiLayout extends Io {
  static get style() {
    return html`<style>:host{display: flex;flex: 1;}</style>`;
  }
  static get properties() {
    return {
      elements: {
        type: Object
      },
      layout: {
        type: Array
      }
    };
  }
  update() {
    // TODO: fix layout split
    const Prop = entry => [entry[0], Object.assign({elements: this.elements}, entry[1])];
    this.render([this.layout.map(Prop)]);
  }
}

window.customElements.define('io-layout', IoLayout);

export { html, Io, IoPropertyMixin, IoPointerMixin, IoBoolean, IoColor, IoFunction, IoInspector, IoMatrix, IoNumber, IoObject, IoOption, IoSlider, IoString, IoVector, UiButton, UiCollapsable, UiLayout, UiMenu, UiTabs };
