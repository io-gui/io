import {IoElement} from "../core/element.js";

// TODO: document and test
// TODO: consider renaming

export class IoElementCache extends IoElement {
  static get properties() {
    return {
      selected: Number,
      elements:  Array,
      precache: Boolean,
      cache: Boolean,
      _cache: Object,
    };
  }
  constructor(props) {
    super(props);
    this.stagingElement = document.createElement('io-element-cache-staging');
    document.head.appendChild(this.stagingElement);
  }
  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('readystatechange', this.readystatechange);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('readystatechange', this.readystatechange);
  }
  readystatechange() {
    this.precacheChanged();
  }
  precacheChanged() {
    if (this.precache && document.readyState === 'complete') {
      // console.log(this.elements)
      this.template(this.elements, this.stagingElement);
      for (let i = 0; i < this.stagingElement.childNodes.length; i++) {
        this._cache[i] = this.stagingElement.childNodes[i];
      }
    }
    this.stagingElement.innerHTML = '';
  }
  dispose() {
    super.dispose();
    this.innerHTML = '';
    this.stagingElement.innerHTML = '';
    delete this._cache;
  }
  changed() {
    if (!this.elements[this.selected]) return;
    if ((this.precache || this.cache) && (this.elements[this.selected].cache === true) && this._cache[this.selected]) {
      this.innerHTML = '';
      this.appendChild(this._cache[this.selected]);
    } else {
      if (this.cache) {
        this.innerHTML = '';
        this.template([this.elements[this.selected]], this.stagingElement);
        this._cache[this.selected] = this.stagingElement.childNodes[0];
        this.appendChild(this._cache[this.selected]);
        this.stagingElement.innerHTML = '';
      } else {
        this.template([this.elements[this.selected]]);
      }
    }
  }
}

IoElementCache.Register();
