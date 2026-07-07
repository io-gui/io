var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, Property, ReactiveElement } from '@io-gui/core';
import { ioIcon } from '@io-gui/icons';
let IoDrawerHandle = class IoDrawerHandle extends ReactiveElement {
    static get Style() {
        return /* css */ `
      :host {
        --io_drawerHandleSize: calc(var(--io_lineHeight) + var(--io_borderWidth) * 2);
        display: flex;
        overflow: hidden;
        flex: 0 0 var(--io_drawerHandleSize);
        align-items: center;
        background-color: var(--io_bgColorLight);
        border: var(--io_border);
        border-color: var(--io_borderColorStrong);
        @apply --io-unselectable;
        z-index: 1;
      }
      :host[orientation="horizontal"] {
        border-top: 0;
        border-bottom: 0;
        flex-direction: row;
        width: var(--io_drawerHandleSize);
      }
      :host[orientation="vertical"] {
        border-left: 0;
        border-right: 0;
        flex-direction: column;
        height: var(--io_drawerHandleSize);
      }
    `;
    }
    static get Listeners() {
        return {
            'click': 'onClick',
            'contextmenu': 'onContextmenuDisable',
        };
    }
    constructor(args) {
        super(args);
    }
    onContextmenuDisable(event) {
        event.preventDefault();
        event.stopPropagation();
    }
    onClick(event) {
        event.preventDefault();
        event.stopPropagation();
        this.dispatch('io-drawer-toggle', {}, true);
    }
    mutated() {
        const icon = {
            horizontal: {
                leading: this.expanded ? 'io:triangle_left' : 'io:triangle_right',
                trailing: this.expanded ? 'io:triangle_right' : 'io:triangle_left',
            },
            vertical: {
                leading: this.expanded ? 'io:triangle_up' : 'io:triangle_down',
                trailing: this.expanded ? 'io:triangle_down' : 'io:triangle_up',
            }
        }[this.orientation][this.direction];
        this.render([
            ioIcon({ value: icon, size: 'small' })
        ]);
    }
};
__decorate([
    Property({ type: String, value: '', reflect: true })
], IoDrawerHandle.prototype, "orientation", void 0);
__decorate([
    Property({ type: String, value: '', reflect: true })
], IoDrawerHandle.prototype, "direction", void 0);
__decorate([
    Property({ type: Boolean, value: false, reflect: true })
], IoDrawerHandle.prototype, "expanded", void 0);
IoDrawerHandle = __decorate([
    Register
], IoDrawerHandle);
export { IoDrawerHandle };
export const ioDrawerHandle = function (args) {
    return IoDrawerHandle.vConstructor(args);
};
