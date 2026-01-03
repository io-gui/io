var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, IoElement, disposeChildren, ReactiveProperty, Property, span } from '@io-gui/core';
const dummyElement = document.createElement('div');
/**
 * Element selector. Displays one of the virtual elements assigned in the `elements` property as its child if the name of the element matches the `value` property.
 * If `cache` property is set to `true`, a reference to the element will be kept fo later use.
 **/
// TODO: consider moving io-selectior to core elements
const IMPORTED_PATHS = {};
function importModule(path) {
    const importPath = new URL(path, String(window.location)).pathname;
    return new Promise(resolve => {
        if (!path || IMPORTED_PATHS[importPath]) {
            resolve(importPath);
        }
        else {
            void import(/* @vite-ignore */ importPath)
                .then(() => {
                IMPORTED_PATHS[importPath] = true;
                resolve(importPath);
            });
        }
    });
}
;
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
        width: 4em;
        height: 4em;
        margin-top: calc(-1 * var(--io_fieldHeight));
        margin-left: calc(-1 * var(--io_fieldHeight));
        border-radius: 50%;
        border: var(--io_border);
        border-color: var(--io_borderColorStrong);
        border-top-color: var(--io_colorBlue);
        animation: io-loading-spinner .6s linear infinite;
      }
    `;
    }
    static get Listeners() {
        return {
            scroll: 'onScrollChanged',
        };
    }
    constructor(args = {}) { super(args); }
    init() {
        this.preacheNext = this.preacheNext.bind(this);
        this.startPreache = this.startPreache.bind(this);
        this.scrollToUnsuspend = this.scrollToUnsuspend.bind(this);
        this.onScrollUnsuspend = this.onScrollUnsuspend.bind(this);
    }
    anchorChanged() {
        if (!this.scrollToSuspended) {
            this.onScrollSuspended = true;
            this.debounce(this.onScrollUnsuspend, undefined, 120);
        }
        this.debounce(this.anchorChangedDebounced, undefined, 3);
    }
    anchorChangedDebounced() {
        const anchor = this.anchor.split('#')[1] || this.anchor;
        if (!anchor || this.scrollToSuspended)
            return;
        const heading = this.querySelector(`[data-heading="${anchor}"]`);
        if (heading) {
            const style = window.getComputedStyle(heading);
            const top = heading.offsetTop - parseInt(style.marginTop);
            this.scrollTo({ top: top, behavior: 'smooth' });
        }
        else {
            this.scrollTo(0, 0);
        }
    }
    scrollToUnsuspend() {
        this.scrollToSuspended = false;
    }
    onScrollUnsuspend() {
        this.onScrollSuspended = false;
    }
    onScrollChanged() {
        if (this.onScrollSuspended)
            return;
        const anchor = this.anchor.split('#')[1] || this.anchor;
        const headings = this.querySelectorAll('[data-heading]');
        const closestHeading = Array.from(headings).reduce((prev, curr) => {
            return (Math.abs(curr.offsetTop - this.scrollTop) < Math.abs(prev.offsetTop - this.scrollTop) ? curr : prev);
        }, headings[0]);
        if (closestHeading) {
            const current = closestHeading.getAttribute('data-heading');
            if (current && current !== anchor) {
                this.scrollToSuspended = true;
                if (this.anchor.split('#').length === 2) {
                    // TODO: triggers missing id warning if menuoptions dont include id when you scroll dcs to the top
                    this.anchor = this.anchor.split('#')[0] + '#' + current;
                }
                else {
                    this.anchor = current;
                }
                this.debounce(this.scrollToUnsuspend, undefined, 120);
            }
        }
    }
    elementsChanged() {
        // TODO: make sure all elements have props and id if selectable!
        // TODO: fix and test edge case where reusing element in templete() might return cache from the previous element if keys collide!
        this.startPreache();
    }
    selectedChanged() {
        if (!this.selected) {
            this.render([], this, true);
        }
        else if (this.selected === '*') {
            this.render(this.elements);
        }
        else {
            this.renderSelectedId(this.selected);
        }
        this.debounce(this.anchorChangedDebounced, undefined, 2);
    }
    renderSelectedId(id) {
        const cache = this.caching === 'proactive' || this.caching === 'reactive';
        if (!id) {
            this.render([], this, cache);
            this.scrollTo(0, 0);
            return;
        }
        id = id.split('#')[0];
        // TODO: what if <io-selector> is reused in template() and ID collides?
        if (id === this.childNodes[0]?.id)
            return;
        this.render([], this, cache);
        this.scrollTo(0, 0);
        const vElement = this.elements.find((element) => { return element.props?.id === id; });
        if (!vElement) {
            console.warn(`IoSelector: Could not find elements with id: "${id}"!`);
            this.render([span(`Could not find elements with id: "${id}"!`)], this, cache);
            return;
        }
        const importPath = vElement.props?.import;
        if (!importPath) {
            this.debounce(this.renderDebounced, vElement);
        }
        else {
            this.loading = true;
            this._preaching = false;
            void importModule(importPath).then(() => {
                this.loading = false;
                this.debounce(this.renderDebounced, vElement);
                this.debounce(this.startPreache);
            });
        }
    }
    renderDebounced(vElement) {
        const cache = this.caching === 'proactive' || this.caching === 'reactive';
        const id = vElement.props?.id;
        const cachedElement = this._caches[id];
        if (cache && cachedElement) {
            if (cachedElement.parentElement !== this) {
                if (this.firstChild)
                    this.removeChild(this.firstChild);
                this.appendChild(cachedElement);
            }
        }
        else {
            this.render([vElement], this, cache);
            if (cache) {
                this._caches[id] = this.childNodes[0];
            }
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
        if (!this._preaching)
            return;
        for (let i = 0; i < this.elements.length; i++) {
            const vElement = this.elements[i];
            const props = vElement.props;
            const id = props.id;
            if (id && this._caches[id] === undefined) {
                if (!props.import) {
                    this.render([vElement], dummyElement, true);
                    this._caches[id] = dummyElement.childNodes[0];
                    dummyElement.removeChild(dummyElement.childNodes[0]);
                    this.debounce(this.preacheNext);
                    return;
                }
                else {
                    void importModule(props.import).then(() => {
                        if (!this._preaching)
                            return;
                        this.render([vElement], dummyElement, true);
                        this._caches[id] = dummyElement.childNodes[0];
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
                disposeChildren(this._caches[key]);
            }
            delete this._caches[key];
        }
        super.dispose();
    }
};
__decorate([
    ReactiveProperty(Array)
], IoSelector.prototype, "elements", void 0);
__decorate([
    ReactiveProperty({ value: '', type: String })
], IoSelector.prototype, "selected", void 0);
__decorate([
    ReactiveProperty({ value: '', type: String })
], IoSelector.prototype, "anchor", void 0);
__decorate([
    ReactiveProperty({ value: 'reactive', type: String })
], IoSelector.prototype, "caching", void 0);
__decorate([
    ReactiveProperty({ value: false, type: Boolean, reflect: true })
], IoSelector.prototype, "loading", void 0);
__decorate([
    Property(Object)
], IoSelector.prototype, "_caches", void 0);
__decorate([
    Property(false)
], IoSelector.prototype, "_preaching", void 0);
__decorate([
    Property(false)
], IoSelector.prototype, "scrollToSuspended", void 0);
__decorate([
    Property(false)
], IoSelector.prototype, "onScrollSuspended", void 0);
IoSelector = __decorate([
    Register
], IoSelector);
export { IoSelector };
export const ioSelector = function (arg0) {
    return IoSelector.vConstructor(arg0);
};
//# sourceMappingURL=IoSelector.js.map