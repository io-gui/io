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

      :host > .io-drawer-content {
        position: relative;
        display: flex;
        overflow: hidden;
        transition: transform 0.125s ease-out;
        justify-content: flex-end;
      }
      :host[orientation="horizontal"] > .io-drawer-content {
        height: 100%;
        width: var(--io-drawer-size);
      }
      :host[orientation="vertical"] > .io-drawer-content {
        width: 100%;
        height: var(--io-drawer-size);
        flex-direction: column;
      }

      :host[orientation="horizontal"][direction="leading"] > .io-drawer-content {
        transform: translateX(calc(var(--io-drawer-size) * -1 + var(--io_lineHeight)));
        flex-direction: row;
      }
      :host[orientation="horizontal"][direction="leading"][expanded] > .io-drawer-content {
        transform: translateX(0);
      }

      :host[orientation="horizontal"][direction="trailing"] > .io-drawer-content {
        transform: translateX(0);
        flex-direction: row-reverse;
      }
      :host[orientation="horizontal"][direction="trailing"][expanded] > .io-drawer-content {
        transform: translateX(calc(var(--io-drawer-size) * -1 + var(--io_lineHeight)));
      }

      :host[orientation="vertical"][direction="leading"] > .io-drawer-content {
        transform: translateY(calc(var(--io-drawer-size) * -1 + var(--io_lineHeight)));
        flex-direction: column;
      }
      :host[orientation="vertical"][direction="leading"][expanded] > .io-drawer-content {
        transform: translateY(0);
      }

      :host[orientation="vertical"][direction="trailing"] > .io-drawer-content {
        transform: translateY(0);
        flex-direction: column-reverse;
      }
      :host[orientation="vertical"][direction="trailing"][expanded] > .io-drawer-content {
        transform: translateY(calc(var(--io-drawer-size) * -1 + var(--io_lineHeight)));
      }

      :host > .io-drawer-content > .io-drawer-handle {
        display: flex;
        align-items: center;
        background-color: var(--io_bgColorLight);
        border: var(--io_border);
        border-color: var(--io_borderColorStrong);
        @apply --unselectable;
      }
      :host[orientation="horizontal"] > .io-drawer-content > .io-drawer-handle {
        border-top: 0;
        border-bottom: 0;
        flex-direction: row;
      }
      :host[orientation="vertical"] > .io-drawer-content > .io-drawer-handle {
        border-left: 0;
        border-right: 0;
        flex-direction: column;
      }

      :host > .io-drawer-content > io-panel,
      :host > .io-drawer-content > io-split {
        flex: 0 0 auto;
      }
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
        this.dispatch('io-drawer-expanded-changed', { element: this }, true);
    }
    changed() {
        const drawerSize = parseFlexBasis(this.child.flex);
        const contentSize = drawerSize + ThemeSingleton.lineHeight;
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
            div({ class: 'io-drawer-content', style: { '--io-drawer-size': `${contentSize}px` } }, [
                childVDOM,
                div({ class: 'io-drawer-handle', '@click': this.onClick }, [
                    ioIcon({ value: icon, size: 'small' })
                ]),
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