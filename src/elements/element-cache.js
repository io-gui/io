import {IoElement} from "../io-core.js";

// TODO: document and test

const stagingElement = document.createElement('div');

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
  precacheChanged() {
    if (this.precache) {
      this.template(this.elements, stagingElement);
      for (var i = 0; i < stagingElement.childNodes.length; i++) {
        this._cache[i] = stagingElement.childNodes[i];
      }
      stagingElement.innerHTML = '';
    }
  }
  dispose() {
    super.dispose();
    this.innerHTML = '';
    stagingElement.innerHTML = '';
    delete this._cache;
  }
  changed() {
    if ((this.precache || this.cache) && this._cache[this.selected]) {
      this.innerHTML = '';
      this.appendChild(this._cache[this.selected]);
    } else {
      if (this.cache) {
        this.innerHTML = '';
        this.template([this.elements[this.selected]], stagingElement);
        this._cache[this.selected] = stagingElement.childNodes[0];
        this.appendChild(this._cache[this.selected]);
        stagingElement.innerHTML = '';
      } else {
        this.template([this.elements[this.selected]]);
      }
    }
  }
}

IoElementCache.Register();
