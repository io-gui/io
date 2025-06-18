import { Register, IoElement, VDOMElement, IoElementProps, disposeChildren, ReactiveProperty, WithBinding, Property } from 'io-gui';
import { MenuOptions } from 'io-menus';
import { ioField } from 'io-inputs';

const dummyElement = document.createElement('div');
/**
 * Element selector. Displays one of the virtual elements assigned in the `elements` property as its child if the name of the element matches the `value` property.
 * If `cache` property is set to `true`, a reference to the element will be kept fo later use.
 **/

// TODO: consider moving io-selectior to core elements

const IMPORTED_PATHS: Record<string, any> = {};
function importModule(path: string) {
  const importPath = new URL(path, String(window.location)).pathname;
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
};

export type SelectType = 'shallow' | 'deep' | 'none';
export type CachingType = 'proactive' | 'reactive' | 'none';

export type IoSelectorProps = IoElementProps & {
  options?: MenuOptions,
  elements?: VDOMElement[],
  select?: SelectType,
  caching?: CachingType,
  loading?: WithBinding<boolean>,
  import?: string, // TODO: move to core?
};

@Register
export class IoSelector extends IoElement {
  static vConstructor: (arg0?: IoSelectorProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;

  static get Style() {
    return /* css */`
      :host {
        display: flex;
        flex-direction: column;
        position: relative;
        overflow-y: auto !important;
        flex: 1 1 auto;
        justify-content: stretch;
      }
      @keyframes io-loading-spinner {
        to {
          transform: rotate(360deg);
        }
      }
      :host[loading]:after {
        content: '';
        box-sizing: border-box;
        position: absolute;
        top: 50%;
        left: 50%;
        width: var(--io_fieldHeight2);
        height: var(--io_fieldHeight2);
        margin-top: calc(-1 * var(--io_fieldHeight));
        margin-left: calc(-1 * var(--io_fieldHeight));
        border-radius: 50%;
        border: var(--io_border);
        border-color: var(--io_borderColorDark);
        border-top-color: var(--io_colorBlue);
        animation: io-loading-spinner .6s linear infinite;
      }
    `;
  }

  @ReactiveProperty({type: MenuOptions, init: null})
  declare options: MenuOptions;

  @ReactiveProperty(Array)
  declare elements: VDOMElement[];

  @ReactiveProperty({value: 'shallow', type: String})
  declare select: SelectType;

  @ReactiveProperty({value: 'reactive', type: String})
  declare caching: CachingType;

  @ReactiveProperty({value: false, type: Boolean, reflect: true})
  declare loading: boolean;

  @Property(Object)
  declare private _caches: Record<string, IoElement | HTMLElement>;

  @Property(false)
  declare private _preaching: boolean;

  // TODO: Perhaps caching and selection should be irrelevant if select === 'none'!

  constructor(args: IoSelectorProps = {}) { super(args); }

  init() {
    this.preacheNext = this.preacheNext.bind(this);
    this.startPreache = this.startPreache.bind(this);
    this.renderSelected = this.renderSelected.bind(this);
    this.renderDebounced = this.renderDebounced.bind(this);
  }

  optionsChanged() {
    this.debounce(this.renderSelected);
  }
  optionsMutated() {
    this.debounce(this.renderSelected);
  }

  elementsChanged() {
    // TODO: make sure all elements have props and id if selectable!
    // if (!id) {
    //   console.warn('IoSelector: Missing id on element!', vElement);
    //   continue;
    // }
    // TODO: fix and test edge case where reusing element in templete() might return cache from the previous element if keys collide!
    this.startPreache();
  }

  renderSelected() {
    if (this.select === 'shallow') {
      for (let i = 0; i < this.options.items.length; i++) {
        if (this.options.items[i].selected) {
          this.renderSelectedId(this.options.items[i].id);
          return;
        }
      }
    } else if (this.select === 'deep') {
      this.renderSelectedId(this.options.selected);
    } else if (this.select === 'none') {
      this.render(this.elements);
    }
  }

  renderSelectedId(id: string) {
    const cache = this.caching === 'proactive' || this.caching === 'reactive';

    if (!id) {
      this.render([], this, cache);
      return;
    }

    // TODO: what if <io-selector> is reused in template() and ID collides?
    if (id === this.childNodes[0]?.id) return;

    this.render([], this, cache);

    const vElement = this.elements.find((element: VDOMElement) => { return element.props?.id === id; });

    if (!vElement) {
      console.warn(`IoSelector: Could not find elements with id: ${id}!`, this.elements);
      this.render([ioField({label: `Could not find elements with id: ${id}!`})], this, cache);
      return;
    }

    const importPath = vElement.props?.import;

    if (!importPath) {
      this.debounce(this.renderDebounced, vElement);
    } else {
      this.loading = true;
      this._preaching = false;
      void importModule(importPath).then(() => {
        this.loading = false;
        this.debounce(this.renderDebounced, vElement);
        this.debounce(this.startPreache);
      });
    }
  }

  renderDebounced(vElement: VDOMElement) {
    const cache = this.caching === 'proactive' || this.caching === 'reactive';
    const id = vElement.props?.id;
    const cachedElement = this._caches[id];

    if (cache && cachedElement) {
      if ((cachedElement.parentElement as IoElement) !== this) {
        if (this.firstChild) this.removeChild(this.firstChild);
        this.appendChild(cachedElement);
      }
    } else {
      this.render([vElement], this, cache);
      if (cache) this._caches[id] = this.childNodes[0];
    }
  }

  startPreache() {
    if (this.caching === 'proactive' && !this._preaching) {
      this._preaching = true;
      this.debounce(this.preacheNext);
    }
  }

  preacheNext() {
    // TODO: Test this!
    if (!this._preaching) return;
    for (let i = 0; i < this.elements.length; i++) {
      const vElement = this.elements[i];
      const props = vElement.props!;
      const id = props.id;
      if (id && this._caches[id] === undefined) {
        if (!props.import) {
          this.render([vElement], dummyElement, true);
          this._caches[id] = dummyElement.childNodes[0] as HTMLElement;
          dummyElement.removeChild(dummyElement.childNodes[0]);
          this.debounce(this.preacheNext);
          return;
        } else {
          void importModule(props.import).then(() => {
            if (!this._preaching) return;
            this.render([vElement], dummyElement, true);
            this._caches[id] = dummyElement.childNodes[0] as HTMLElement;
            dummyElement.removeChild(dummyElement.childNodes[0]);
            this.debounce(this.preacheNext);
            delete props.import;
          });
          return;
        }
      }
    }
    this._preaching = false;
  }

  dispose() {
    for (const key in this._caches) {
      // Dispose cached elements not in the DOM.
      if (!this._caches[key].parentElement) {
        disposeChildren(this._caches[key] as IoElement);
      }
      delete this._caches[key];
    }
    super.dispose();
  }
}
export const ioSelector = IoSelector.vConstructor;