import { IoElement, RegisterIoElement } from '../../core/element.js';
import { MenuOptions } from '../menus/models/menu-options.js';

/**
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

const IMPORTED_PATHS: Record<string, any> = {};

@RegisterIoElement
export class IoSelector extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      @apply --io-content;
      color: var(--io-color);
      background-color: var(--io-background-color);
    }

    @keyframes io-selector-spinner {
      to {
        transform: rotate(360deg);
      }
    }

    :host > .io-loading:after {
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
        type: MenuOptions,
        observe: true,
      },
      elements: {
        type: Array,
        observe: true,
      },
      selected: {
        reflect: 'prop',
      },
      cache: Boolean,
      _caches: Object,
      _selectedID: {
        type: String,
        notify: false,
      },
      lazy: true // TODO: reconsider
    };
  }
  constructor(props?: any) {
    super(props);
    this.optionsChanged();
  }
  _selectDefault() {
    // setTimeout(()=> {
      if (!this.selected && this.options[0]) {
        this.selected = this.options[0].value;
      }
    // }, 100);
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
    const oldSelectedID = this._selectedID;
    this._selectedID = this.selected.split('#')[0] || '';
    if (this._selectedID !== oldSelectedID) {
      this.update();
    }
  }
  getSlotted(): any {
    return null;
  }
  importModule(path: string) {
    const importPath = new URL(path, String(window.location)).href;
    return new Promise(resolve => {
      if (!path || IMPORTED_PATHS[importPath]) {
        resolve(importPath);
      } else {
        void import(importPath)
        .then(() => {
          IMPORTED_PATHS[importPath] = true;
          resolve(importPath);
        });
      }
    });
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
        const _import = element[1].import;
        delete element[1].import;
        void this.importModule(_import).then(() => {
          if (element[1].name === this.selected.split('#')[0]) {
            this.$.content.classList.toggle('io-loading', false);
            this.template([element], this.$.content as HTMLElement);
            this._caches[selected] = this.$.content.childNodes[0];
          }
        });
      }
    }

  }
}
