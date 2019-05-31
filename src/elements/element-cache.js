import {IoElement} from "../core/element.js";

// TODO: document and test
// TODO: consider renaming

export class IoElementCache extends IoElement {
  static get properties() {
    return {
      selected: String,
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
    document.addEventListener('readystatechange', this.precacheChanged);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('readystatechange', this.precacheChanged);
  }
  precacheChanged() {
    if (this.precache && document.readyState === 'complete') {
      for (let i = 0; i < this.elements.length; i++) {
        const name = this.elements[i][1].name;
        if (!this._cache[name]) {
          this.template([this.elements[i]], this.stagingElement);
          this._cache[name] = this.stagingElement.childNodes[0];
          this.stagingElement.innerText = '';
        }
      }
    }
  }
  dispose() {
    super.dispose();
    this.innerHTML = '';
    this.stagingElement.innerHTML = '';
    delete this._cache;
  }
  changed() {
    const element = this.elements.find(element => {
      return element[1].name == this.selected;
    });
    if (!element) {
      // NOTE: Cached elements shound't be removed with `template()` to avoid `dispose()`
      this.innerText = '';
      return;
    }
    if (element[1].cache === false) {
      this.template([element]);
      return;
    }
    if (this.precache || this.cache) {
      this.innerText = '';
      if (this._cache[this.selected]) {
        this.appendChild(this._cache[this.selected]);
      } else {
        this.template([element]);
        this._cache[this.selected] = this.childNodes[0];
      }
    } else {
      this.template([element]);
    }
  }
}

IoElementCache.Register();
