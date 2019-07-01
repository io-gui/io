import {IoElement, html} from "../core/element.js";

const importedPaths = {};

export class IoSelector extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: column;
        align-self: stretch;
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
  static get attributes() {
    return {
    };
  }
  static get properties() {
    return {
      elements:  Array,
      selected: String,
      cache: Boolean,
      precache: Boolean,
      _loading: {
        type: Boolean,
        reflect: 1,
      },
      _caches: Object,
      _selectedID: String,
      _scrollID: {
        type: String,
        notify: true,
      }
    };
  }
  static get listeners() {
    return {
      'scroll': '_onScroll',
      'content-ready': '_onIoContentReady',
    };
  }
  _onIoContentReady(event) {
    event.stopImmediatePropagation();
    this.scrollIDChanged();
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
    const importPath = path ? new URL(path, window.location).href : undefined;
    if (!path || importedPaths[importPath]) {
      callback();
    } else {
      this.__callback = callback;
      if (importPath && !importedPaths[importPath]) {
        import(importPath)
        .then(() => {
          importedPaths[importPath] = true;
          this.__callback();
          delete this.__callback;
        });
      }
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
    this.template([['div', {id: 'content', class: 'io-content'}]]);
  }
  scrollTo(id) {
    if (id) {
      const elem = this.$.content.querySelector('#' + id);
      if (elem) {
        elem.scrollIntoView({behavior: 'smooth'});
      }
    }
  }
  _onScroll() {
    if (this._scrollID === undefined) return;
    clearTimeout(this.__scrollDebounce);
    this.__scrollDebounce = setTimeout(() => {
      delete this.__scrollDebounce;
      const scrollableElements = [...this.$.content.querySelectorAll('[id]')];
      const top = this.$.content.scrollTop;
      const bottom = top + this.$.content.getBoundingClientRect().height / 2;
      const oldScrollID = this._scrollID;
      let scrollID;
      for (let i = scrollableElements.length; i--;) {
        const elem = scrollableElements[i];
        const nextElem = scrollableElements[i + 1];
        const elemTop = elem.offsetTop;
        const elemBottom = nextElem ? nextElem.offsetTop : elemTop;
        if ((elemTop < top - 5) && (elemBottom < bottom)) {
          break;
        }
        scrollID = elem.id;
      }
      if (scrollID !== oldScrollID) {
        this._scrollID = scrollID;
        const oldSelected = this.selected;
        const selected = this._selectedID + '#' + this._scrollID;
        this.__properties.selected.value = selected;
        this.dispatchEvent('selected-changed', {value: selected, oldValue: oldSelected});
      }
    }, 100);
  }
  scrollIDChanged() {
    if (this._scrollID === undefined) return;
    setTimeout(() => {
      this.scrollTo(this._scrollID);
    }, 100);
  }
  selectedChanged() {
    const oldScrollID = this._scrollID;
    const scrollID = this.selected.split('#')[1];
    if (scrollID !== oldScrollID) {
      this._scrollID = scrollID;
      this.scrollIDChanged();
    }
    const oldSelectedID = this._selectedID;
    const selectedID = this.selected.split('#')[0];
    if (selectedID !== oldSelectedID) {
      this._selectedID = selectedID;
      this.update();
    }
  }
  elementsChanged() {
    this.selectedChanged();
  }
  update() {
    const selected = this._selectedID;

    let element = this.elements.find(element => {return element[1].name === selected;});
    if (!element) element = ['div', {}];
    if (typeof element[1] !== 'object') element.splice(1, 0, {});

    const explicitlyCache = element[1].cache === true;
    const explicitlyDontCache = element[1].cache === false;

    this.renderShadow();
    if (this.$.content) {
      this.$.content.innerText = '';
    }

    if (!explicitlyDontCache && (this.precache || this.cache || explicitlyCache) && this._caches[selected]) {
      // NOTE: Cached elements shound't be removed with `template()` to avoid `dispose()`
      this.$.content.appendChild(this._caches[selected]);
    } else {
      this._loading = true;
      this.checkImport(element[1].import, () => {
        this._loading = false;
        this.template([element], this.$.content);
        this._caches[selected] = this.$.content.childNodes[0];
      });
    }
  }
}

IoSelector.Register();
