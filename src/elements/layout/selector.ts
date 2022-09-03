import {IoElement, RegisterIoElement} from '../../iogui.js';
import {Options} from '../../models/options.js';
// TODO: use IoContent for caching and display.

/*
 * Extends `IoElement` and `IoContent`.
 *
 * Element selector. Displays one of the virtual elements assigned in the `elements` property as its child if the name of the element matches the `value` property.
 *
 * <io-element-demo element="io-selector"
 *     properties='{
 *         "elements": [
 *             ["div", {"name": "first"}, "First content"],
 *             ["div", {"name": "second"}, "Second content"],
 *             ["div", {"name": "third"}, "Third content"],
 *             ["div", {"name": "fourth"}, "Fourth content"]],
 *         "selected": "first",
 *         "cache": false}'
 *     config='{
 *         "selected": ["io-option-menu", {"options": [
 *             "first",
 *             "second",
 *             "third",
 *             "fourth"]}]}'>
 * </io-element-demo>
 *
 * If `cache` property is set to `true`, a reference to the element will be kept fo later use.
 **/

export class IoSelector extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      display: flex;
      flex: 1 1;
      flex-direction: column;
      align-self: stretch;
      justify-self: stretch;
      overflow-x: hidden;
      overflow-y: auto;
      color: var(--io-color);
      background-color: var(--io-background-color);
    }
    @keyframes io-selector-spinner {
      to {
        transform: rotate(360deg);
      }
    }
    :host .io-loading {
      background-image: repeating-linear-gradient(135deg, var(--io-background-color-light), var(--io-background-color) 3px, var(--io-background-color) 7px, var(--io-background-color-light) 10px) !important;
      background-repeat: repeat;
      position: relative;
    }
    :host .io-loading:after {
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
      animation: io-selector-spinner .6s linear infinite;
    }
    `;
  }
  static get Properties(): any {
    return {
      options: {
        type: Options,
        observe: true,
      },
      elements: {
        type: Array,
        observe: true,
      },
      selected: {
        reflect: 1,
      },
      cache: Boolean,
      _caches: Object,
      _selectedID: {
        type: String,
        notify: false,
      },
      _scrollID: {
        type: String,
        notify: false,
      },
      lazy: true // TODO: reconsider
    };
  }
  static get Listeners() {
    return {
      'scroll': ['_onScroll', {capture: true, passive: true}],
      'content-ready': '_onIoContentReady',
    };
  }
  constructor(props?: any) {
    super(props);
    this._selectDefault();
  }
  _selectDefault() {
    // setTimeout(()=> {
      if (!this.selected && this.options[0]) {
        this.selected = this.options[0].value;
      }
    // }, 100);
  }
  _onIoContentReady(event: CustomEvent) {
    event.stopImmediatePropagation();
    this.scrollTo(this._scrollID, false);
  }
  connectedCallback() {
    super.connectedCallback();
    this.scrollTo(this._scrollID, false);
  }
  scrollTo(id: string, smooth?: boolean) {
    if (!id) return;
    setTimeout(()=>{
      const elem = this.$.content.querySelector('#' + id.toLowerCase());
      if (elem) elem.scrollIntoView({behavior: smooth ? 'smooth' : 'auto'});
    }, 250); // TODO: unhack!
  }
  _onScroll() {
    if (this._scrollID === undefined) return;
    clearTimeout(this._scrollThrottle);
    this._scrollThrottle = setTimeout(() => {
      delete this._scrollThrottle;
      const scrollableElements = [...this.$.content.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]')];
      const top = this.$.content.scrollTop || this.$.content.children[0].scrollTop;
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
        this._scrollID = scrollID || '';
        const oldSelected = this.selected;
        const selected = this._selectedID + '#' + this._scrollID;
        this.setProperty('selected', selected);
        this.dispatchEvent('selected-changed', {value: selected, oldValue: oldSelected});
      }
    }, 100);
  }
  selectedChanged() {
    this._selectDefault();
    this.updateScroll();
  }
  optionsChanged() {
    this._selectDefault();
    this.updateScroll();
  }
  elementsChanged() {
    this.updateScroll();
  }
  updateScroll() {
    if (!this.selected) return;
    const oldScrollID = this._scrollID;
    const oldSelectedID = this._selectedID;
    this._selectedID = this.selected.split('#')[0] || '';
    this._scrollID = this.selected.split('#')[1] || '';
    if (this._selectedID !== oldSelectedID) {
      this.update();
      this.scrollTo(this._scrollID);
    } else if (this._scrollID !== oldScrollID) {
      this.scrollTo(this._scrollID, true);
    }
  }
  getSlotted(): any {
    return null;
  }
  update() {
    const selected = this._selectedID;

    let element = this.elements.find((element: any) => {return element[1].name === selected;});
    if (!element) {
      console.warn(`Could not find element with name:${selected}!`);
      element = ['span', `Could not find element with name:${selected}!`];
    }
    if (typeof element[1] !== 'object') element.splice(1, 0, {});

    const explicitlyCache = element[1].cache === true;
    const explicitlyDontCache = element[1].cache === false;

    this.template([
      this.getSlotted(),
      ['div', {id: 'content', class: 'io-content'}],
    ]);

    if (this.$.content) {
      this.$.content.textContent = '';
      this.$.content.classList.toggle('io-loading', true);
      if (!explicitlyDontCache && (this.cache || explicitlyCache) && this._caches[selected]) {
        this.$.content.appendChild(this._caches[selected]);
        this.$.content.classList.toggle('io-loading', false);
      } else {
        void this.import(element[1].import).then(() => {
          if (element[1].name === this.selected.split('#')[0]) {
            this.$.content.classList.toggle('io-loading', false);
            this.template([element], this.$.content);
            this._caches[selected] = this.$.content.childNodes[0];
          }
        });
      }
    }

  }
}

RegisterIoElement(IoSelector);
