import {h} from "../lib/ijk.js"

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
  render(children, host) {
    host = host || this;
    let vDOM = h('name', 'props', 'children')(['root', children]).children;
    this.traverse(vDOM, host);
  }
  traverse(vChildren, host) {
    let children = host.children;
    let traverseStart = 0;
    if (host instanceof ShadowRoot) {
      vChildren.unshift(['style'], ['slot']);
    }

    for (var i = 0; i < vChildren.length; i++) {

      if (children[i] && children[i].localName === vChildren[i].name) {

        if (vChildren[i].props) {
          for (var prop in vChildren[i].props) {
            if (vChildren[i].props[prop] !== children[i][prop]) {
              children[i][prop] = vChildren[i].props[prop];
            }
          }
        }

      } else if (children[i] && children[i].localName !== vChildren[i].name) {

        //TODO: remove and swap element if tag changed

      } else {

        let el;
        let ConstructorClass = customElements.get(vChildren[i].name);

        if (ConstructorClass) {

          el = new ConstructorClass(vChildren[i].props);
          host.appendChild(el);

        } else {

          el = document.createElement(vChildren[i].name);
          for (var prop in vChildren[i].props) {
            el[prop] = vChildren[i].props[prop];
          }
          host.appendChild(el);

        }

        // TODO: handle chldren better
        if (vChildren[i].children && typeof vChildren[i].children === 'string') {
          el.innerHTML = vChildren[i].children;
        } else if (vChildren[i].children &&  typeof vChildren[i].children === 'object') {
          // TODO: test extensively
          // console.log(vChildren[i].children, el);
          this.traverse(vChildren[i].children, el);
        }

      }
    }

     // TODO: consider caching elements for reuse
     if (children.length > vChildren.length) {
       for (var i = children.length - 1; children.length > vChildren.length; i--) {
         host.removeChild(children[i]);
       }
     }
   }
  constructor(props = {}) {
    super();
    Object.defineProperty(this, '__properties', {
      value: this.getPrototypeProperties()
    });

    // TODO: documentation. Make more explicit?
    // TODO: consider folowing prototype chain. 
    const proto = Object.getPrototypeOf(this);
    const names = Object.getOwnPropertyNames(proto);
    for (var i = 0; i < names.length; i++) {
      if (names[i].substring(names[i].length-7,names[i].length) === 'Handler') {
        this[names[i]] = this[names[i]].bind(this);
      }
    }

    for (let key in this.__properties) {
      if (props[key] !== undefined) this.__properties[key].value = props[key];
      this.defineProperty(key, this.__properties[key]);
      this.reflectAttribute(key, this.__properties[key]);
    }
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = this.__proto__.constructor.template;
    this.shadowRoot.appendChild(document.createElement('slot'));
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
