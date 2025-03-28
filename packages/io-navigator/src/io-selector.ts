import { Register, IoElement, VDOMArray, IoElementArgs, disposeElementDeep, applyNativeElementProps, Property, MenuOptions } from 'io-gui';

const dummyElement = document.createElement('div');
/**
 * Element selector. Displays one of the virtual elements assigned in the `elements` property as its child if the name of the element matches the `value` property.
 * If `cache` property is set to `true`, a reference to the element will be kept fo later use.
 **/

const IMPORTED_PATHS: Record<string, any> = {};

@Register
export class IoSelector extends IoElement {
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

  @Property({type: MenuOptions})
  declare options: MenuOptions;

  @Property('first')
  declare select: 'first' | 'last';

  @Property(Array)
  declare elements: VDOMArray[];

  @Property({value: false})
  declare cache: boolean;

  @Property({value: false})
  declare precache: boolean;

  @Property({value: 1000})
  declare precacheDelay: number;

  @Property({value: false, reflect: true})
  declare loading: boolean;

  @Property({type: Object})
  declare private _caches: Record<string, HTMLElement>;

  private _selected?: any;

  init() {
    this.optionsMutated();
  }

  optionsMutated() {
    const selected = this.select === 'first' ? this.options.first : this.options.last;

    if (selected !== this._selected) {
      this._selected = selected;
      this.renderSelected();
    }

    this.debounce(this.onLoadPrecache, undefined, this.precacheDelay);
  }

  importModule(path: string) {
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
  }

  protected renderSelected() {
    const selected = this._selected;

    debug: if (selected && typeof selected !== 'string') {
      console.warn('IoSelector: selected option first is not a string!');
    }

    if (typeof selected !== 'string') return;

    if (!selected) {

      this.template([]);

    } else if (this.childNodes[0]?.id !== selected) {

      let element = this.elements.find((element: any) => {return element[1].id === selected;}) as VDOMArray;

      if (!element) {
        const warning = `Could not find element with id: ${selected}!`;
        console.warn(`IoSelector: ${warning}!`);
        element = ['span', warning];
      }

      const args: IoElementArgs = typeof element[1] !== 'object' ? {} : element[1] as IoElementArgs;

      const explicitlyCache = args.cache === true;
      const explicitlyDontCache = args.cache === false;
      const importPath = args.import;
      delete args.import;

      const cache = !explicitlyDontCache && (this.cache || explicitlyCache);

      // TODO: test this!
      if (cache && this._caches[selected]) {
        const cachedElement = this._caches[selected] as unknown as IoElement;
        if (this._caches[selected].parentElement !== this as unknown as HTMLElement) {
          if (this.firstChild) this.removeChild(this.firstChild);
          this.appendChild(cachedElement);
          // Update properties
          cachedElement.removeAttribute('className');
          if (cachedElement._isIoElement) {
            // Set IoElement element properties
            cachedElement.applyProperties(args);
          } else {
            // Set native HTML element properties
            applyNativeElementProps(cachedElement as unknown as HTMLElement, args);
          }

          this.loading = false;
        }
      } else if (!importPath) {
        this.template([element], this as unknown as HTMLElement, cache);
        this._caches[selected] = this.childNodes[0];
        this.loading = false;
      } else {
        this.loading = true;
        void this.importModule(importPath).then(() => {
          if (this.loading) {
            this.template([element], this as unknown as HTMLElement, cache);
            this._caches[selected] = this.childNodes[0];
          }
          this.loading = false;
        });
      }
    }
  }

  onLoadPrecache() {
    // TODO: Test this!
    // TODO: consider precaching imports!
    if (this.precache) {
      for (let i = 0; i < this.elements.length; i++) {
        const element = this.elements[i];
        const args: IoElementArgs = typeof element[1] !== 'object' ? {} : element[1] as IoElementArgs;
        if (!args.import && args.id && this._caches[args.id] === undefined) {
          this.template([element], dummyElement, true);
          this._caches[args.id] = dummyElement.childNodes[0] as HTMLElement;
          dummyElement.removeChild(dummyElement.childNodes[0]);
          this.debounce(this.onLoadPrecache, undefined, this.precacheDelay);
          return;
        }
      }
    }
  }

  dispose() {
    // TODO: check for garbage collection!
    for (const key in this._caches) {
      disposeElementDeep(this._caches[key] as unknown as IoElement);
    }
    super.dispose();
  }
}
