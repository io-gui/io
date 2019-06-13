import {IoElement} from "../core/element.js";

export class IoElementSelector extends IoElement {
  static get properties() {
    return {
      elements:  Array,
      selected: String,
      cache: Boolean,
      precache: Boolean,
      _caches: Object,
    };
  }
  constructor(props) {
    super(props);
    this.stagingElement = document.createElement('io-element-selector-staging');
  }
  connectedCallback() {
    super.connectedCallback();
    document.head.appendChild(this.stagingElement);
    document.addEventListener('readystatechange', this.precacheChanged);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    document.head.removeChild(this.stagingElement);
    document.removeEventListener('readystatechange', this.precacheChanged);
  }
  precacheChanged() {
    if (this.__connected && this.precache && document.readyState === 'complete') {
      for (let i = 0; i < this.elements.length; i++) {
        const name = this.elements[i][1].name;
        if (!this._caches[name]) {
          this.template([this.elements[i]], this.stagingElement);
          this._caches[name] = this.stagingElement.childNodes[0];
          this.stagingElement.innerText = '';
        }
      }
    }
  }
  changed() {
    const element = this.elements.find(element => {return element[1].name === this.selected;});
    // NOTE: Cached elements shound't be removed with `template()` to avoid `dispose()`
    this.innerText = '';
    const explicitlyCache = (typeof element[1] === 'object' && element[1].cache === true);
    const explicitlyDontCache = (typeof element[1] === 'object' && element[1].cache === false);
    if (!explicitlyDontCache && (this.precache || this.cache || explicitlyCache) && this._caches[this.selected]) {
      this.appendChild(this._caches[this.selected]);
    } else {
      this.template([element]);
      this._caches[this.selected] = this.childNodes[0];
    }
  }
}

IoElementSelector.Register();
