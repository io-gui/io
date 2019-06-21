import {IoElement, html} from "../core/element.js";

const importedPaths = {};

export class IoSelector extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: column;
        overflow: auto;
        position: relative;
      }
      :host[_loading] > .io-content {
        background: repeating-linear-gradient(135deg, transparent, var(--io-background-color) 3px, var(--io-background-color) 7px, transparent 10px);
        background-repeat: repeat;
      }
      :host > .io-content {
        color: var(--io-color);
        background: var(--io-background-color);
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
        overflow: auto;
        padding: var(--io-spacing);
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
      _loading: {
        type: Boolean,
        reflect: true,
      },
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
  checkImport(path, callback) {
    this.__callback = callback;
    const importPath = path ? new URL(path, window.location).href : undefined;
    if (importPath && !importedPaths[importPath]) {
      importedPaths[importPath] = true;
      import(importPath)
      .then(() => {
        this.__callback();
        delete this.__callback;
      });
    } else {
      this.__callback();
      delete this.__callback;
    }
  }
  precacheChanged() {
    if (this.__connected && this.precache && document.readyState === 'complete') {
      for (let i = 0; i < this.elements.length; i++) {
        const name = this.elements[i][1].name;
        const explicitlyDontCache = this.elements[i][1].cache === false || !!this.elements[i][1].import;
        if (!this._caches[name] && !explicitlyDontCache) {
          this.checkImport(this.elements[i][1].import, () => {
            if (this.stagingElement.parentElement !== document.head) document.head.appendChild(this.stagingElement);
            this.template([this.elements[i]], this.stagingElement);
            this._caches[name] = this.stagingElement.childNodes[0];
            this.stagingElement.innerText = '';
          });
        }
      }
    }
  }
  renderShadow() {
    this.template([['div', {id: 'content', className: 'io-content'}]]);
  }
  changed() {
    let element = this.elements.find(element => {return element[1].name === this.selected;});
    if (!element) element = ['div', {}];
    if (typeof element[1] !== 'object') element.splice(1, 0, {});

    const explicitlyCache = element[1].cache === true;
    const explicitlyDontCache = element[1].cache === false;

    this.renderShadow();
    if (this.$.content) this.$.content.innerText = '';

    if (!explicitlyDontCache && (this.precache || this.cache || explicitlyCache) && this._caches[this.selected]) {
      // NOTE: Cached elements shound't be removed with `template()` to avoid `dispose()`
      this.$.content.appendChild(this._caches[this.selected]);
    } else {
      this._loading = true;
      this.checkImport(element[1].import, () => {
        this._loading = false;
        this.template([element], this.$.content);
        this._caches[this.selected] = this.$.content.childNodes[0];
      });
    }
  }
}

IoSelector.Register();
