var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, ReactiveProperty, IoElement, ThemeSingleton } from '@io-gui/core';
let IoTabDropMarker = class IoTabDropMarker extends IoElement {
    static get Style() {
        return /* css */ `
      :host {
        position: fixed;
        height: calc(var(--io_fieldHeight) - var(--io_borderWidth) - var(--io_borderRadius));
        width: var(--io_spacing);
        background-color: var(--io_bgColorBlue);
        margin-bottom: var(--io_borderWidth);
        z-index: 100000;
        display: none;
      }
      :host:not([dropindex="-1"]) {
        display: block;
      }
      :host:not([splitdirection="none"]) {
        display: block;
        opacity: 0.25;
      }
    `;
    }
    constructor(args = {}) { super(args); }
    changed() {
        if (this.dropTarget && this.dropIndex !== -1) {
            const tabs = this.dropTarget.querySelectorAll('io-tab');
            this.style.width = '';
            this.style.height = '';
            if (tabs.length === 0) {
                const rect = this.dropTarget.getBoundingClientRect();
                this.style.top = `${rect.top + ThemeSingleton.borderRadius}px`;
                this.style.left = `${rect.left}px`;
            }
            else if (this.dropIndex > tabs.length - 1) {
                const tab = tabs[tabs.length - 1];
                const rect = tab.getBoundingClientRect();
                this.style.top = `${rect.top + ThemeSingleton.borderRadius}px`;
                this.style.left = `${rect.left + rect.width}px`;
            }
            else {
                const tab = tabs[this.dropIndex];
                const rect = tab.getBoundingClientRect();
                this.style.top = `${rect.top + ThemeSingleton.borderRadius}px`;
                this.style.left = `${rect.left - ThemeSingleton.spacing}px`;
            }
        }
        else if (this.dropTarget && this.splitDirection !== 'none') {
            const rect = this.dropTarget.getBoundingClientRect();
            if (this.splitDirection === 'top') {
                this.style.top = `${rect.top}px`;
                this.style.left = `${rect.left}px`;
                this.style.width = `${rect.width}px`;
                this.style.height = `${rect.height / 2}px`;
            }
            else if (this.splitDirection === 'bottom') {
                this.style.top = `${rect.top + rect.height / 2}px`;
                this.style.left = `${rect.left}px`;
                this.style.width = `${rect.width}px`;
                this.style.height = `${rect.height / 2}px`;
            }
            else if (this.splitDirection === 'left') {
                this.style.top = `${rect.top}px`;
                this.style.left = `${rect.left}px`;
                this.style.width = `${rect.width / 2}px`;
                this.style.height = `${rect.height}px`;
            }
            else if (this.splitDirection === 'right') {
                this.style.top = `${rect.top}px`;
                this.style.left = `${rect.left + rect.width / 2}px`;
                this.style.width = `${rect.width / 2}px`;
                this.style.height = `${rect.height}px`;
            }
            else if (this.splitDirection === 'center') {
                this.style.top = `${rect.top}px`;
                this.style.left = `${rect.left}px`;
                this.style.width = `${rect.width}px`;
                this.style.height = `${rect.height}px`;
            }
        }
    }
};
__decorate([
    ReactiveProperty(null)
], IoTabDropMarker.prototype, "dropTarget", void 0);
__decorate([
    ReactiveProperty({ type: String, value: 'none', reflect: true })
], IoTabDropMarker.prototype, "splitDirection", void 0);
__decorate([
    ReactiveProperty({ type: Number, value: -1, reflect: true })
], IoTabDropMarker.prototype, "dropIndex", void 0);
IoTabDropMarker = __decorate([
    Register
], IoTabDropMarker);
export const tabDropMarkerSingleton = new IoTabDropMarker();
setTimeout(() => {
    document.body.appendChild(tabDropMarkerSingleton);
}, 100);
//# sourceMappingURL=IoTabDropMarker.js.map