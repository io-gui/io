var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, ReactiveProperty, Property, span } from '@io-gui/core';
import { IoField } from '@io-gui/inputs';
import { ioIcon } from '@io-gui/icons';
import { ioTabDropMarkerSingleton } from './IoTabDropMarker.js';
import { Tab } from '../nodes/Tab.js';
import { IoPanel } from './IoPanel.js';
let IoTabDragIcon = class IoTabDragIcon extends IoField {
    static get Style() {
        return /* css */ `
      :host {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        transform: translate(-50%, -50%);
        z-index: 100000;
        pointer-events: none;
        border-color: var(--io_borderColorLight);
        background-color: var(--io_bgColorLight) !important;
        opacity: 0.75;
      }
      :host[dragging] {
        display: flex;
      }
      :host > * {
        display: inline-block;
        white-space: nowrap;
        padding: 0 var(--io_spacing);
      }
    `;
    }
    constructor(args = {}) { super(args); }
    changed() {
        ioTabDropMarkerSingleton.setProperties({
            dropTarget: this.dropTarget,
            splitDirection: this.splitDirection,
            dropIndex: this.dropIndex,
        });
        this.render([
            ioIcon({ value: this.tab?.icon || ' ' }),
            span({ class: 'label' }, this.tab?.label || ''),
        ]);
    }
};
__decorate([
    ReactiveProperty({ type: Boolean, reflect: true })
], IoTabDragIcon.prototype, "dragging", void 0);
__decorate([
    ReactiveProperty({ type: Tab })
], IoTabDragIcon.prototype, "tab", void 0);
__decorate([
    ReactiveProperty({ type: IoPanel })
], IoTabDragIcon.prototype, "dropSource", void 0);
__decorate([
    ReactiveProperty({ type: IoPanel })
], IoTabDragIcon.prototype, "dropTarget", void 0);
__decorate([
    ReactiveProperty({ type: String, value: 'none', reflect: true })
], IoTabDragIcon.prototype, "splitDirection", void 0);
__decorate([
    ReactiveProperty({ type: Number, value: -1 })
], IoTabDragIcon.prototype, "dropIndex", void 0);
__decorate([
    Property({ type: Number, value: -1 })
], IoTabDragIcon.prototype, "tabIndex", void 0);
IoTabDragIcon = __decorate([
    Register
], IoTabDragIcon);
export const tabDragIconSingleton = new IoTabDragIcon();
document.body.appendChild(tabDragIconSingleton);
//# sourceMappingURL=IoTabDragIcon.js.map