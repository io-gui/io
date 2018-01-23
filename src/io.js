
export class Io extends HTMLElement {
  static get template() { return `<slot></slot>`; }
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
  attributeChangedCallback(name, oldValue, newValue) {
    if (this.__properties[name].type === Boolean) {
      this[name] = newValue === '' ? true : false;
    } else if (this.__properties[name].type === Number) {
      this[name] = parseFloat(newValue);
    } else {
      this[name] = newValue;
    }
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
  constructor(props = {}) {
    super();
    Object.defineProperty(this, '__properties', {
      value: this.getPrototypeProperties()
    });
    for (let key in this.__properties) {
      if (props[key] !== undefined) this.__properties[key].value = props[key];
      this.defineProperty(key, this.__properties[key]);
      this.reflectAttribute(key, this.__properties[key]);
    }
    this.attachShadow({mode: 'open'}).innerHTML = this.__proto__.constructor.template;
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
  appendHTML(string) {
    _stagingEelement.innerHTML = string;
    return this.appendChild(_stagingEelement.querySelector('*'));
  }
  _setValue(value) {
    let oldValue = this.value;
    this.value = value;
    this.dispatchEvent(new CustomEvent('io-value-set', {
      detail: {value: value, oldValue: oldValue},
      bubbles: false,
      composed: true
    }));
  }
  preventDefault(event) {
    event.preventDefault();
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
