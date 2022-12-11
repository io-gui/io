import { IoElement, RegisterIoElement, VDOMArray, IoElementArgs } from '../../core/element.js';
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
        align-items: flex-start;
        overflow-y: auto;
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

  changed() {
    const selected = this.select === 'root' ? this.options.root : this.options.leaf;

    debug: {
      if (selected && typeof selected !== 'string') {
        console.warn('IoSelector: selected option root is not a string!');
      }
    }

    if (typeof selected !== 'string') return;

    if (!selected) {

      this.template([]);

    } else {

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

      this.textContent = '';

      // TODO: test this!
      if (!explicitlyDontCache && (this.cache || explicitlyCache) && this._caches[selected]) {
        if (this._caches[selected].parentElement !== this as unknown as HTMLElement) {
          this.appendChild(this._caches[selected]);
          this.loading = false;
        }
      } else if (!importPath) {
        this.template([element]);
        this._caches[selected] = this.childNodes[0];
        this.loading = false;
      } else {
        this.loading = true;
        void this.importModule(importPath).then(() => {
          if (this.loading) {
            this.template([element]);
            this._caches[selected] = this.childNodes[0];
          }
          this.loading = false;
        });
      }
    }
  }
}