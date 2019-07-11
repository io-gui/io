import {IoElement, html} from "./core/element.js";

const importedPaths = {};

export class IoSelector extends IoElement {
  static get Style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: column;
        align-self: stretch;
        overflow: auto;
      }
      :host[loading] > .io-content {
        background: repeating-linear-gradient(135deg, var(--io-background-color-light), var(--io-background-color) 3px, var(--io-background-color) 7px, var(--io-background-color-light) 10px);
        background-repeat: repeat;
        position: relative;
      }
      @keyframes spinner {
        to {transform: rotate(360deg);}
      }
      :host[loading]:after {
        content: '';
        box-sizing: border-box;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 40px;
        height: 40px;
        margin-top: -20px;
        margin-left: -20px;
        border-radius: 50%;
        border: var(--io-border);
        border-top-color: #000;
        animation: spinner .6s linear infinite;
      }
      :host > .io-content {
        background: var(--io-background-color);
        color: var(--io-color);
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
        overflow: auto;
      }
    </style>`;
  }
  static get Attributes() {
    return {
      loading: Boolean,
    };
  }
  static get Properties() {
    return {
      elements:  Array,
      selected: String,
      cache: Boolean,
      precache: Boolean,
      _caches: Object,
      _selectedID: String,
      _scrollID: {
        type: String,
        notify: true,
      }
    };
  }
  static get Listeners() {
    return {
      'scroll': '_onScroll',
      'content-ready': '_onIoContentReady',
    };
  }
  _onIoContentReady(event) {
    event.stopImmediatePropagation();
    this.scrollTo(this._scrollID, false);
  }
  constructor(props) {
    super(props);
    this.stagingElement = document.createElement('io-selector-staging');
  }
  connectedCallback() {
    super.connectedCallback();
    document.head.appendChild(this.stagingElement);
    document.addEventListener('readystatechange', this.onReadyStateChange);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    document.head.removeChild(this.stagingElement);
    document.removeEventListener('readystatechange', this.onReadyStateChange);
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
  onReadyStateChange() {
    this.precacheChanged();
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
            this.stagingElement.textContent = '';
          });
        }
      }
    }
  }
  renderShadow() {
    this.template([['div', {id: 'content', class: 'io-content'}]]);
  }
  scrollTo(id, smooth) {
    setTimeout(()=>{
      const elem = this.$.content.querySelector('#' + id);
      if (elem) elem.scrollIntoView({behavior: smooth ? 'smooth' : 'auto'});
    }, 100); // TODO: unhack!
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
        if ((elemTop < top - 5) && (elemBottom < bottom) && i !== scrollableElements.length - 1) {
          break;
        }
        scrollID = elem.id;
      }
      if (scrollID !== undefined && scrollID !== oldScrollID) {
        this._scrollID = scrollID;
        const oldSelected = this.selected;
        const selected = this._selectedID + '#' + this._scrollID;
        this.__properties.selected.value = selected;
        this.dispatchEvent('selected-changed', {value: selected, oldValue: oldSelected});
      }
    }, 100);
  }
  selectedChanged() {
    const oldScrollID = this._scrollID;
    const oldSelectedID = this._selectedID;
    this._selectedID = this.selected.split('#')[0];
    this._scrollID = this.selected.split('#')[1];
    if (this._selectedID !== oldSelectedID) {
      this.update();
      this.scrollTo(this._scrollID);
    } else if (this._scrollID !== oldScrollID) {
      this.scrollTo(this._scrollID, true);
    }
  }
  elementsChanged() {
    this.selectedChanged();
  }
  update() {
    const selected = this._selectedID;

    let element = this.elements.find(element => {return element[1].name === selected;});
    if (!element) {
      console.warn(`Could not find element with id:${selected}!`);
      element = ['span', `Could not find element with id:${selected}!`];
    }
    if (typeof element[1] !== 'object') element.splice(1, 0, {});

    const explicitlyCache = element[1].cache === true;
    const explicitlyDontCache = element[1].cache === false;

    this.renderShadow();
    if (this.$.content) {
      this.$.content.textContent = '';
    }

    this.loading = true;
    if (!explicitlyDontCache && (this.precache || this.cache || explicitlyCache) && this._caches[selected]) {
      // NOTE: Cached elements shound't be removed with `template()` to avoid `dispose()`
      this.$.content.appendChild(this._caches[selected]);
      this.loading = false;
    } else {
      this.checkImport(element[1].import, () => {
        this.loading = false;
        this.template([element], this.$.content);
        this._caches[selected] = this.$.content.childNodes[0];
      });
    }
  }
}

IoSelector.Register();
