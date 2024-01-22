var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register } from '../../core/node.js';
import { IoElement, disposeElementDeep, applyNativeElementProps } from '../../core/element.js';
import { MenuOptions } from '../menus/models/menu-options.js';
import { Property } from '../../core/internals/property.js';
const dummyElement = document.createElement('div');
/**
 * Element selector. Displays one of the virtual elements assigned in the `elements` property as its child if the name of the element matches the `value` property.
 * If `cache` property is set to `true`, a reference to the element will be kept fo later use.
 **/
const IMPORTED_PATHS = {};
let IoSelector = class IoSelector extends IoElement {
    static get Style() {
        return /* css */ `
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
    _selected;
    init() {
        this.optionsMutated();
    }
    optionsMutated() {
        const selected = this.select === 'first' ? this.options.first : this.options.last;
        if (selected !== this._selected) {
            this._selected = selected;
            this.renderSelected();
        }
        this.throttle(this.onLoadPrecache, undefined, 1000);
    }
    importModule(path) {
        const importPath = new URL(path, String(window.location)).href;
        return new Promise(resolve => {
            if (!path || IMPORTED_PATHS[importPath]) {
                resolve(importPath);
            }
            else {
                void import(importPath)
                    .then(() => {
                    IMPORTED_PATHS[importPath] = true;
                    resolve(importPath);
                });
            }
        });
    }
    renderSelected() {
        const selected = this._selected;
        debug: {
            if (selected && typeof selected !== 'string') {
                console.warn('IoSelector: selected option first is not a string!');
            }
        }
        if (typeof selected !== 'string')
            return;
        if (!selected) {
            this.template([]);
        }
        else if (this.childNodes[0]?.id !== selected) {
            let element = this.elements.find((element) => { return element[1].id === selected; });
            if (!element) {
                const warning = `Could not find element with id: ${selected}!`;
                console.warn(`IoSelector: ${warning}!`);
                element = ['span', warning];
            }
            const args = typeof element[1] !== 'object' ? {} : element[1];
            const explicitlyCache = args.cache === true;
            const explicitlyDontCache = args.cache === false;
            const importPath = args.import;
            delete args.import;
            const cache = !explicitlyDontCache && (this.cache || explicitlyCache);
            // TODO: test this!
            if (cache && this._caches[selected]) {
                const cachedElement = this._caches[selected];
                if (this._caches[selected].parentElement !== this) {
                    if (this.firstChild)
                        this.removeChild(this.firstChild);
                    this.appendChild(cachedElement);
                    // Update properties
                    cachedElement.removeAttribute('className');
                    if (cachedElement._isIoElement) {
                        // Set IoElement element properties
                        cachedElement.applyProperties(args);
                    }
                    else {
                        // Set native HTML element properties
                        applyNativeElementProps(cachedElement, args);
                    }
                    this.loading = false;
                }
            }
            else if (!importPath) {
                this.template([element], this, cache);
                this._caches[selected] = this.childNodes[0];
                this.loading = false;
            }
            else {
                this.loading = true;
                void this.importModule(importPath).then(() => {
                    if (this.loading) {
                        this.template([element], this, cache);
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
                const args = typeof element[1] !== 'object' ? {} : element[1];
                if (!args.import && args.id && this._caches[args.id] === undefined) {
                    this.template([element], dummyElement, true);
                    this._caches[args.id] = dummyElement.childNodes[0];
                    dummyElement.removeChild(dummyElement.childNodes[0]);
                    this.throttle(this.onLoadPrecache, undefined, 1000);
                    return;
                }
            }
        }
    }
    dispose() {
        // TODO: check for garbage collection!
        for (const key in this._caches) {
            disposeElementDeep(this._caches[key]);
        }
        super.dispose();
    }
};
__decorate([
    Property({ type: MenuOptions, observe: true })
], IoSelector.prototype, "options", void 0);
__decorate([
    Property('first')
], IoSelector.prototype, "select", void 0);
__decorate([
    Property(Array)
], IoSelector.prototype, "elements", void 0);
__decorate([
    Property({ value: false, reactive: false })
], IoSelector.prototype, "cache", void 0);
__decorate([
    Property({ value: false, reactive: false })
], IoSelector.prototype, "precache", void 0);
__decorate([
    Property({ value: false, reflect: true, reactive: false })
], IoSelector.prototype, "loading", void 0);
__decorate([
    Property({ type: Object, reactive: false })
], IoSelector.prototype, "_caches", void 0);
IoSelector = __decorate([
    Register
], IoSelector);
export { IoSelector };
//# sourceMappingURL=io-selector.js.map