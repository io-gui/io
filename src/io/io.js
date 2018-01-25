import {h} from "./ioutil.js"

export class Io extends HTMLElement {
  static get template() { return `<style></style>`; }
  static get observedAttributes() {
    let observed = [];
    let proto = this;
    while (proto) {
      if (proto.properties) {
        let keys = Object.keys(proto.properties);
        for (var i = 0; i < keys.length; i++) {
          if (observed.indexOf(keys[i]) === -1) observed.push(keys[i]);
        }
      }
      proto = proto.__proto__;
    }
    return observed;
  }
  constructor(props = {}) {
    super();
    Object.defineProperty(this, '__properties', { value: this.getPrototypeProperties() });
    Object.defineProperty(this, '__listeners', { value: {} });

    // TODO: documentation. Make handler function binding more explicit?
    // TODO: consider folowing prototype chain.
    const proto = Object.getPrototypeOf(this);
    const names = Object.getOwnPropertyNames(proto);
    for (var i = 0; i < names.length; i++) {
      if (names[i].substring(names[i].length-7,names[i].length) === 'Handler') {
        this[names[i]] = this[names[i]].bind(this);
      }
    }

    for (let key in this.__properties) {
      if (key === 'listeners') continue; //TODO ugh
      if (props[key] !== undefined) this.__properties[key].value = props[key];
      this.defineProperty(key, this.__properties[key]);
      this.reflectAttribute(key, this.__properties[key]);
    }
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = this.__proto__.constructor.template;
    this.render([['slot']], this.shadowRoot);
  }
  getPrototypeProperties() {
    let props = {};
    let proto = this.__proto__;
    while (proto) {
      let prop = proto.constructor.properties;
      for (var key in prop) {
        props[key] = Object.assign(prop[key], props[key] || {});
      }
      proto = proto.__proto__;
    }
    for (var key in props) {
      if (props[key].value === undefined) {
        switch (props[key].type) {
          case Boolean:
            props[key].value = false;
            break;
          case Number:
            props[key].value = 0;
            break;
          case String:
            props[key].value = '';
            break;
        }
      }
    }
    return props;
  }
  connectedCallback() {
    let listeners = this.__properties.listeners;
    if (listeners) {
      for (var e in listeners) {
        // TODO: multiple functions and class inheritance
        this.__listeners[e] = this[listeners[e]];
        this.addEventListener(e, this.__listeners[e]);
      }
    }
    if (typeof this._update == 'function') this._update();
  }
  disconnectedCallback() {
    for (var e in this.__listeners) {
      this.removeEventListener(e, this.__listeners[e]);
      delete this.__listeners[e];
    }
  }
  createElement(vDOMNode) {
    let ConstructorClass = customElements.get(vDOMNode.name);
    let element;
    if (ConstructorClass) {
      element = new ConstructorClass(vDOMNode.props);
    } else {
      element = document.createElement(vDOMNode.name);
      for (var prop in vDOMNode.props) {
        element[prop] = vDOMNode.props[prop];
      }
    }
    return element;
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

    for (var i = 0; i < vChildren.length; i++) {

      let element;
      let oldElement;

      if (children[i] && children[i].localName === vChildren[i].name) {

        element = children[i];

        for (var prop in vChildren[i].props) {
          if (vChildren[i].props[prop] !== element[prop]) {
            element[prop] = vChildren[i].props[prop];
          }
        }

      } else if (children[i] && children[i].localName !== vChildren[i].name) {

        oldElement = children[i];
        element = this.createElement(vChildren[i]);

        host.insertBefore(element, oldElement);
        host.removeChild(oldElement);

      } else {

        element = this.createElement(vChildren[i]);
        host.appendChild(element);

        // TODO: handle chldren better
        if (vChildren[i].children && typeof vChildren[i].children === 'string') {
          element.innerHTML = vChildren[i].children;
        } else if (vChildren[i].children &&  typeof vChildren[i].children === 'object') {
          // TODO: test extensively
          this.traverse(vChildren[i].children, element);
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
       for (var i = children.length - 1; children.length > vChildren.length; i--) {
         host.removeChild(children[i]);
       }
     }
   }
  defineProperty(key, propConfig) {
    Object.defineProperty(this, key, {
      get: function() {
        return propConfig.value;
      },
      set: function(value) {
        if (propConfig.value === value) return;
        // TODO: type check?
        let oldValue = value;
        propConfig.value = value;
        this.reflectAttribute(key, propConfig);
        if (propConfig.observer) {
          this[propConfig.observer](value, key);
        }
        if (propConfig.notify) {
          this.dispatchEvent(new CustomEvent(key + '-changed', {
            detail: {value: value, oldValue: oldValue},
            bubbles: propConfig.bubbles,
            composed: true
          }));
        }
      },
      enumerable: true,
      configurable: true
    });
  }
  reflectAttribute(key, propConfig) {
    if (propConfig.reflectToAttribute) {
      if (propConfig.value === true) {
        this.setAttribute(key, '');
      } else if (propConfig.value === false || propConfig.value === '') {
        this.removeAttribute(key);
      } else if (typeof propConfig.value == 'string' || typeof propConfig.value == 'number') {
        this.setAttribute(key, propConfig.value);
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
    for (var prop in binding) { delete binding[prop]; }
  }
}

var _stagingEelement = document.createElement('div');
