import { Register, IoElement, VDOMElement, IoElementProps, disposeChildren, applyNativeElementProps, ReactiveProperty, WithBinding, NativeElementProps, Property, Change } from 'io-gui';
import { MenuOptions } from 'io-menus';
import { ioField } from 'io-inputs';

const dummyElement = document.createElement('div');
/**
 * Element selector. Displays one of the virtual elements assigned in the `elements` property as its child if the name of the element matches the `value` property.
 * If `cache` property is set to `true`, a reference to the element will be kept fo later use.
 **/

// TODO: consider moving io-selectior to core elements

const IMPORTED_PATHS: Record<string, any> = {};

export type SelectType = 'shallow' | 'deep' | 'none';

export type IoSelectorProps = IoElementProps & {
  options?: MenuOptions,
  select?: SelectType,
  elements?: VDOMElement[],
  cache?: boolean,
  precache?: boolean,
  loading?: WithBinding<boolean>,
  import?: string, // TODO: move to core?
  precacheDelay?: number,
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

  @ReactiveProperty({value: 'shallow', type: String})
  declare select: SelectType;

  @ReactiveProperty(Array)
  declare elements: VDOMElement[];

  @ReactiveProperty({value: false})
  declare cache: boolean;

  @ReactiveProperty({value: false})
  declare precache: boolean;

  @ReactiveProperty({value: false, reflect: true})
  declare loading: boolean;

  @Property(Object)
  declare private _caches: Record<string, HTMLElement>;

  @Property(1000)
  declare precacheDelay: number;

  private _selected?: any;

  optionsChanged() {
    this.optionsMutated();
  }

  optionsMutated() {
    let selected;

    if (this.select === 'shallow') {
      for (let i = 0; i < this.options.length; i++) {
        if (this.options[i].selected) {
          selected = this.options[i].id;
          break;
        }
      }

    } else if (this.select === 'deep') {
      selected = this.options.selected;

    } else if (this.select === 'none') {
      this.template(this.elements, this, this.cache);
      return;
    }

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
    let selected = this._selected;

    if (!selected) {

      this.template([], this, this.cache);

    } else if (this.childNodes[0]?.id !== selected) {
      
      const element = this.elements.find((element: VDOMElement) => { return element.props?.id === selected });

      if (!element) {
        const warning = `Could not find elements with id: ${selected}!`;
        console.warn(`IoSelector: ${warning}!`, this.options);
        this.template([ioField({label: warning})], this, this.cache);
        return;
      }

      let args: IoSelectorProps = element.props || {};

      const explicitlyCache = args.cache === true;
      const explicitlyDontCache = args.cache === false;
      const importPath = args.import;
      delete args.import;

      const cache = !explicitlyDontCache && (this.cache || explicitlyCache);
      const cachedElement = this._caches[selected] as unknown as IoElement;

      // TODO: test this!
      if (cache && cachedElement) {
        if (cachedElement.parentElement !== this as unknown as HTMLElement) {
          if (this.firstChild) this.removeChild(this.firstChild);
          this.appendChild(cachedElement);
          // Update properties
          cachedElement.removeAttribute('className');
          if (cachedElement._isIoElement) {
            // Set IoElement element properties
            cachedElement.applyProperties(args);
          } else {
            // Set native HTML element properties
            applyNativeElementProps(cachedElement as unknown as HTMLElement, args as NativeElementProps);
          }
          this.loading = false;
        }
      } else if (!importPath) {
        this.template([element], this, cache);
        if (cache) this._caches[selected] = this.childNodes[0];
        this.loading = false;
      } else {
        this.loading = true;
        void this.importModule(importPath as string).then(() => {
          if (this.loading) {
            this.template([element], this, cache);
            if (cache) this._caches[selected] = this.childNodes[0];
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
        let args: IoSelectorProps = element.props || {};
        if (!args.import && args.id && this._caches[args.id as string] === undefined) {
          this.template([element], dummyElement, true);
          this._caches[args.id as string] = dummyElement.childNodes[0] as HTMLElement;
          dummyElement.removeChild(dummyElement.childNodes[0]);
          this.debounce(this.onLoadPrecache, undefined, this.precacheDelay);
          return;
        }
      }
    }
  }

  // elementsChanged(change: Change) {
  //   // TODO: fix and test edge case where reusing element in templete() might return cache from the previous element if keys collide!
  //   // debug: if (change.oldValue.length > 0) {}
  // }

  dispose() {
    // TODO: check for garbage collection!
    for (const key in this._caches) {
      disposeChildren(this._caches[key] as unknown as IoElement);
      delete this._caches[key];
    }
    super.dispose();
  }
}
export const ioSelector = IoSelector.vConstructor;