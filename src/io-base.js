
class IoBase extends HTMLElement {
  static get is() { return 'io-base'; }
  static get template() { return ``; }
  static get observedAttributes() {
    // TODO: follow prototype chain
    if (this.properties) {
      return Object.keys(this.properties);
    }
    return [];
  }
  constructor(props = {}) {
    super();
    // TODO: follow prototype chain
    this._properties = this.__proto__.constructor.properties || {};
    for (let propKey in this._properties) {
      Io.defineProperty(this, propKey, this._properties[propKey]);
    }
    for (let propKey in props) {
      this['_' + propKey] = props[propKey];
    }
    for (let propKey in this._properties) {
      this.reflectAttribute(propKey);
    }
    this._shadowRoot = this.attachShadow({mode: 'open'});
    this._shadowRoot.innerHTML = this.__proto__.constructor.template;
  }
  reflectAttribute(propKey) {
    this._properties = this.__proto__.constructor.properties || {};
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
    _element.innerHTML = string;
    return this.appendChild(_element.querySelector('*'));
  }
  /* Used to set value from the input (editor). */
  _setValue(value) {
    if (this.disabled || value === this.value) {
      return;
    }
    let oldValue = this.value;
    this.value = value;
    /**
      * Fired when value is set by user interaction (editor).
      * @event io-value-set
      * @param {Object} detail value change data
      * @param {Object} detail.value new value
      * @param {Object} detail.oldValue old value
      */
    this.dispatchEvent(new CustomEvent('io-value-set', {
      detail: {value: value, oldValue: oldValue},
      bubbles: false,
      composed: true
    }));

  }
  connectedCallback() {
  }
  disconnectedCallback() {
  }
  preventDefault(event) {
    event.preventDefault();
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name == 'value') {
      console.warn('io-base: Avoid setting attributes. Set propetries instead.')
      this.value = newValue;
    } else {
      if (this._properties[name].type == Boolean) {
        this[name] = newValue == '' ? true : false;
      } else if (this._properties[name].type == Number) {
        this[name] = parseFloat(newValue);
      } else {
        this[name] = newValue;
      }
    }
  }
  _update() {}
  _updateJob() {
    clearTimeout(this._updateID);
    this._updateID = setTimeout(() => {
      delete this._updateID;
      this._update();
    });
  }
}

window.Io = {
  defineProperty: function(instanceRef, propKey, propConfig) {
    Object.defineProperty(instanceRef, propKey, {
      // TODO: optimize
      get: function() {
        return this['_' + propKey];
      },
      set: function(value) {
        if (this['_' + propKey] === value) return;
        this['_' + propKey] = value;
        this.reflectAttribute(propKey);
        if (propConfig.observer) {
          this[propConfig.observer](value);
        }
        // TODO: notify
        // TODO: type check
      },
      enumerable: true,
      configurable: true
    });
    instanceRef['_' + propKey] = propConfig.value;
  }
}

window.customElements.define(IoBase.is, IoBase);

export { IoBase };

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
var _element = document.createElement('div');
