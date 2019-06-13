import {IoElement, html} from "../core/element.js";

export class IoSelector extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: column;
        overflow: auto;
        position: relative;
      }
      :host > .io-content {
        color: var(--io-color);
        background: var(--io-background-color);
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
        overflow: auto;
        padding: var(--io-padding);
        border: var(--io-border);
        border-radius: var(--io-border-radius);
      }
    </style>`;
  }
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
    this.stagingElement = document.createElement('io-selector-staging');
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
    let element = this.elements.find(element => {return element[1].name === this.selected;});
    if (!element) element = ['div', {}];
    // NOTE: Cached elements shound't be removed with `template()` to avoid `dispose()`
    this.innerText = '';
    const explicitlyCache = (typeof element[1] === 'object' && element[1].cache === true);
    const explicitlyDontCache = (typeof element[1] === 'object' && element[1].cache === false);
    if (!explicitlyDontCache && (this.precache || this.cache || explicitlyCache) && this._caches[this.selected]) {
      this.template([['div', {id: 'content', className: 'io-content'}]]);
      this.$.content.appendChild(this._caches[this.selected]);
    } else {
      this.template([['div', {id: 'content', className: 'io-content'}, [element]]]);
      this._caches[this.selected] = this.$.content.childNodes[0];
    }
  }
}

IoSelector.Register();
