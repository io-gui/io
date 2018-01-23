
export class IoBase extends HTMLElement {
  static get is() { return 'io-base'; }
  static get template() { return html`<slot></slot>`; }
  static get observedAttributes() {
    // TODO: follow prototype chain
    if (this.properties) {
      return Object.keys(this.properties);
    }
    return [];
  }
  constructor(props = {}) {
    super();
    Object.defineProperty(this, '_notify', {
      value: {}
    });

    // TODO: follow prototype chain
    Object.defineProperty(this, '_properties', {
      value: this.__proto__.constructor.properties || {}
    });
    for (let propKey in this._properties) {
      Io.defineProperty(this, propKey, this._properties[propKey]);
    }

    for (let propKey in props) {
      this['_' + propKey] = props[propKey];
    }

    for (let propKey in this._properties) {
      this.reflectAttribute(propKey);
    }

    Object.defineProperty(this, '_shadowRoot', {
      value: this.attachShadow({mode: 'open'})
    });
    this._shadowRoot.innerHTML = this.__proto__.constructor.template;
  }
  reflectAttribute(propKey) {
    // this._properties = this.__proto__.constructor.properties || {};
    let propConfig = this._properties[propKey];
    let value = this['_' + propKey];
    if (propConfig && propConfig.reflectToAttribute) {
      if (value === true) {
        this.setAttribute(propKey, '');
      } else if (value === false || value === '') {
        this.removeAttribute(propKey);
      } else if (typeof value == 'string' || typeof value == 'number') {
        this.setAttribute(propKey, value);
      }
    }
  }
  appendHTML(string) {
    _stagingEelement.innerHTML = string;
    return this.appendChild(_stagingEelement.querySelector('*'));
  }
  _setValue(value) {
    if (this.disabled || value === this.value) return;
    let oldValue = this.value;
    this.value = value;
    this.dispatchEvent(new CustomEvent('io-value-set', {
      detail: {value: value, oldValue: oldValue},
      bubbles: false,
      composed: true
    }));
  }
  connectedCallback() {}
  disconnectedCallback() {}
  preventDefault(event) {
    event.preventDefault();
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (this._properties[name].type == Boolean) {
      this[name] = newValue == '' ? true : false;
    } else if (this._properties[name].type == Number) {
      this[name] = parseFloat(newValue);
    } else {
      this[name] = newValue;
    }
  }
  bind(sourceProp, target, targetProp, oneWay) {
    this._notify[sourceProp] = true;
    if (!oneWay) target._notify[targetProp] = true;
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
  _update() {}
  _updateJob() {
    // TODO: consider alternative for performance
    clearTimeout(this._updateID);
    this._updateID = setTimeout(() => {
      delete this._updateID;
      this._update();
    });
  }
}

window.Io = {
  defineProperty: function(instanceRef, propKey, propConfig) {
    if (propConfig.value === undefined) {
      switch (propConfig.type) {
        case Boolean:
          propConfig.value = false;
          break;
        case Number:
          propConfig.value = 0;
          break;
        case String:
          propConfig.value = '';
          break;
      }
    }
    Object.defineProperty(instanceRef, '_' + propKey, {
      enumerable: false,
      writable: true,
      value: propConfig.value
    });
    Object.defineProperty(instanceRef, propKey, {
      // TODO: optimize
      get: function() {
        return this['_' + propKey];
      },
      set: function(value) {
        if (this['_' + propKey] === value) return;
        let oldValue = value;
        this['_' + propKey] = value;
        this.reflectAttribute(propKey);
        if (propConfig.observer) {
          this[propConfig.observer](value);
        }
        if (propConfig.notify || this._notify[propKey]) {
          this.dispatchEvent(new CustomEvent(propKey + '-changed', {
            detail: {value: value, oldValue: oldValue},
            bubbles: propConfig.notify,
            composed: true
          }));
        }
        // TODO: type check
      },
      enumerable: true,
      configurable: true
    });
  }
}

window.customElements.define(IoBase.is, IoBase);

// HTML Escape helper utility thanks to Andrea Giammarchi https://developers.google.com/web/updates/2015/01/ES6-Template-Strings
var util = (function () {
  var
    reEscape = /[&<>'"]/g,
    reUnescape = /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34);/g,
    oEscape = { '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'},
    oUnescape = {'&amp;':'&','&#38;':'&','&lt;':'<','&#60;':'<','&gt;':'>','&#62;':'>','&apos;':"'",'&#39;':"'",'&quot;':'"','&#34;':'"'},
    fnEscape = function (m) { return oEscape[m]; },
    fnUnescape = function (m) { return oUnescape[m]; },
    replace = String.prototype.replace
  ;
  return (Object.freeze || Object)({
    escape: function escape(s) { return replace.call(s, reEscape, fnEscape); },
    unescape: function unescape(s) { return replace.call(s, reUnescape, fnUnescape); }
  });
}());

export function html(pieces) {
    var result = pieces[0];
    var substitutions = [].slice.call(arguments, 1);
    for (let i = 0; i < substitutions.length; ++i) {
        result += util.escape(substitutions[i]) + pieces[i + 1];
    }
    return result;
}
var _stagingEelement = document.createElement('div');
