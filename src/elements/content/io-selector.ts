import { IoElement, RegisterIoElement, VDOMArray, IoElementArgs, disposeElementDeep, applyNativeElementProps } from '../../core/element.js';
import { MenuOptions } from '../menus/models/menu-options.js';
import { Property } from '../../core/internals/property.js';

/**
 * Element selector. Displays one of the virtual elements assigned in the `elements` property as its child if the name of the element matches the `value` property.
 * If `cache` property is set to `true`, a reference to the element will be kept fo later use.
 **/

const IMPORTED_PATHS: Record<string, any> = {};

@RegisterIoElement
export class IoSelector extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        flex-direction: column;
        overflow-y: auto;
        position: relative;
      }
      :host > * {
        align-self: stretch;
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
        width: var(--iotFieldHeight2);
        height: var(--iotFieldHeight2);
        margin-top: calc(-1 * var(--iotFieldHeight));
        margin-left: calc(-1 * var(--iotFieldHeight));
        border-radius: 50%;
        border: var(--iotBorder);
        border-color: var(--iotBorderColorDark);
        border-top-color: var(--iotBorderColorFocus);
        animation: io-loading-spinner .6s linear infinite;
      }
    `;
  }

  @Property({type: MenuOptions, observe: true})
  declare options: MenuOptions;

  @Property('leaf')
  declare select: 'root' | 'leaf';

  @Property(Array)
  declare elements: VDOMArray[];

  @Property(false)
  declare cache: boolean;

  @Property({value: false, reflect: true, notify: false})
  declare loading: boolean;

  @Property({type: Object, notify: false})
  declare private _caches: Record<string, HTMLElement>;

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

  dispose() {
    // TODO: check for garbage collection!
    for (const key in this._caches) {
      disposeElementDeep(this._caches[key] as unknown as IoElement);
    }
    super.dispose();
  }

  changed() {
    const selected = this.select === 'root' ? this.options.root : this.options.leaf;

    debug: {
      if (selected && typeof selected !== 'string') {
        console.warn('IoSelector: selected option root is not a string!');
      }
    }

    if (typeof selected !== 'string') return;

    if (!selected) {

      console.log('template', null);
      this.template([]);

    } else {

      if (this.childNodes[0]?.id === selected) return;

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
          this.removeChild(this.firstChild);
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
}
