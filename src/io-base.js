
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
  constructor() {
    super();
    // TODO: follow prototype chain
    this._properties = this.__proto__.constructor.properties || {};
    for (let propKey in this._properties) {
      let propConfig = this._properties[propKey];
      Io.defineProperty(this, propKey, propConfig);
    }
    this._shadowRoot = this.attachShadow({mode: 'open'});
    this._shadowRoot.innerHTML = this.__proto__.constructor.template;
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
      *
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
        // reflect to attribute
        if (propConfig.reflectToAttribute) {
          this.setAttribute(propKey, value === true ? '' : value);
        };
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

export const html = (string) => { return String(string).trim(); };
