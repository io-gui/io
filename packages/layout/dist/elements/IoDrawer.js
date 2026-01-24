var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, ReactiveProperty, IoElement, div, ThemeSingleton } from '@io-gui/core';
import { ioIcon } from '@io-gui/icons';
import { MenuOption } from '@io-gui/menus';
import { Split } from '../nodes/Split.js';
import { Panel } from '../nodes/Panel.js';
import { ioSplit, parseFlexBasis } from './IoSplit.js';
import { ioPanel } from './IoPanel.js';
let IoDrawer = class IoDrawer extends IoElement {
    static get Style() {
        return /* css */ `
      :host {
        z-index: 2;
        pointer-events: auto;
        position: relative;
      }
      :host[orientation="horizontal"] {
        top: 0;
        bottom: 0;
        width: var(--io_lineHeight) !important;
        cursor: ew-resize;
      }
      :host[orientation="vertical"] {
        left: 0;
        right: 0;
        height: var(--io_lineHeight) !important;
        cursor: ns-resize;
      }
      :host[orientation="horizontal"][direction="trailing"] {
        /* flex-direction: row-reverse; */
      }
      :host[orientation="vertical"][direction="trailing"] {
        /* flex-direction: column-reverse; */
      }

      :host > .io-drawer-content {
        position: relative;
        overflow: hidden;
        inset: 0;
        display: flex;
      }
      :host[orientation="horizontal"] > .io-drawer-content {
        transform: translateX(0);
        position: relative;
        flex-direction: row;
        height: 100%;
        width: var(--io-drawer-size);
        transition: transform 0.125s ease-out;
      }
      :host[orientation="horizontal"][direction="leading"][expanded] > .io-drawer-content {
        transform: translateX(calc(var(--io-drawer-size) - var(--io_lineHeight)));
      }
      :host[orientation="horizontal"][direction="trailing"][expanded] > .io-drawer-content {
        transform: translateX(calc(var(--io-drawer-size) * -1 + var(--io_lineHeight)));
      }

      :host > .io-drawer-content > .io-drawer-handle {
        display: flex;
        align-items: center;
        background-color: var(--io_bgColorLight);
        border: var(--io_border);
        border-top: 0;
        border-bottom: 0;
        border-color: var(--io_borderColorInset);
        @apply --unselectable;
      }

      :host > .io-drawer-content > io-panel,
      :host > .io-drawer-content > io-split {
        flex: 0 0 auto;
      }
      /* :host[orientation="horizontal"] > .io-drawer-handle {
        width: var(--io_lineHeight);
        border-width: 0 var(--io_borderWidth);
      }
      :host[orientation="vertical"] > .io-drawer-handle {
        height: var(--io_lineHeight);
        border-width: var(--io_borderWidth) 0;
      }
      :host > .io-drawer-handle:hover {
        background-color: var(--io_bgColorLight);
      }
      :host > .io-drawer-handle:active {
        background-color: var(--io_bgColorBlue);
      }
      :host > .io-drawer-handle > io-icon {
        opacity: 0.5;
        transition: transform 0.2s ease-out;
      }
      :host[expanded] > .io-drawer-handle > io-icon {
        opacity: 1;
      }
      
      :host[orientation="horizontal"] > .io-drawer-content {
        width: 0;
        height: 100%;
      }
      :host[orientation="horizontal"][expanded] > .io-drawer-content {
        width: var(--io-drawer-size);
      }
      :host[orientation="vertical"] > .io-drawer-content {
        height: 0;
        width: 100%;
      }
      :host[orientation="vertical"][expanded] > .io-drawer-content {
        height: var(--io-drawer-size);
      }
      :host > .io-drawer-content > io-panel,
      :host > .io-drawer-content > io-split {
        flex: 1 1 auto;
      }
      :host[orientation="horizontal"] > .io-drawer-content > io-panel,
      :host[orientation="horizontal"] > .io-drawer-content > io-split {
        min-width: var(--io-drawer-size);
      }
      :host[orientation="vertical"] > .io-drawer-content > io-panel,
      :host[orientation="vertical"] > .io-drawer-content > io-split {
        min-height: var(--io-drawer-size);
      } */
    `;
    }
    constructor(args) {
        super(args);
    }
    onClick(event) {
        event.preventDefault();
        event.stopPropagation();
        this.expanded = !this.expanded;
    }
    expandedChanged() {
        console.log('onExpandedChanged', this.expanded);
        this.dispatch('io-drawer-expanded-changed', undefined, true);
    }
    changed() {
        const drawerSize = parseFlexBasis(this.child.flex);
        this.style.setProperty('--io-drawer-size', `${drawerSize + ThemeSingleton.lineHeight}px`);
        const style = this.orientation === 'horizontal' ? { width: `${drawerSize}px` } : { height: `${drawerSize}px` };
        let childVDOM = null;
        if (this.child) {
            if (this.child instanceof Split) {
                childVDOM = ioSplit({
                    split: this.child,
                    style: style,
                    elements: this.elements,
                    addMenuOption: this.addMenuOption,
                });
            }
            else if (this.child instanceof Panel) {
                childVDOM = ioPanel({
                    panel: this.child,
                    style: style,
                    elements: this.elements,
                    addMenuOption: this.addMenuOption,
                });
            }
        }
        let icon = '';
        if (this.orientation === 'horizontal') {
            icon = this.direction === 'leading' ? 'io:triangle_right' : 'io:triangle_left';
        }
        else {
            icon = this.direction === 'leading' ? 'io:triangle_down' : 'io:triangle_up';
        }
        this.render([
            div({ class: 'io-drawer-content' }, [
                div({ class: 'io-drawer-handle', '@click': this.onClick }, [
                    ioIcon({ value: icon, size: 'small' })
                ]),
                childVDOM
            ])
        ]);
    }
};
__decorate([
    ReactiveProperty({ type: String, value: 'horizontal', reflect: true })
], IoDrawer.prototype, "orientation", void 0);
__decorate([
    ReactiveProperty({ type: String, value: 'leading', reflect: true })
], IoDrawer.prototype, "direction", void 0);
__decorate([
    ReactiveProperty({ type: Boolean, value: false, reflect: true })
], IoDrawer.prototype, "expanded", void 0);
__decorate([
    ReactiveProperty({ type: Object })
], IoDrawer.prototype, "child", void 0);
__decorate([
    ReactiveProperty(Array)
], IoDrawer.prototype, "elements", void 0);
__decorate([
    ReactiveProperty({ type: MenuOption })
], IoDrawer.prototype, "addMenuOption", void 0);
IoDrawer = __decorate([
    Register
], IoDrawer);
export { IoDrawer };
export const ioDrawer = function (args) {
    return IoDrawer.vConstructor(args);
};
//# sourceMappingURL=IoDrawer.js.map