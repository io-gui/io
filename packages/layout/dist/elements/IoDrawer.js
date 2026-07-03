var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, Property, ReactiveElement, div, ThemeSingleton } from '@io-gui/core';
import { ioIcon } from '@io-gui/icons';
import { Split } from '../nodes/Split.js';
import { Panel } from '../nodes/Panel.js';
import { ioSplit } from './IoSplit.js';
import { parseSizeBudgetPx } from '../utils/layoutSize.js';
import { ioPanel } from './IoPanel.js';
import { ioDivider } from './IoDivider.js';
let IoDrawer = class IoDrawer extends ReactiveElement {
    static get Style() {
        return /* css */ `
      :host {
        --io_drawerHandleSize: calc(var(--io_lineHeight) + var(--io_borderWidth) * 2);
        pointer-events: none;
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        z-index: 1;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
      :host[orientation="horizontal"] {
        flex-direction: row;
      }
      :host[orientation="vertical"] {
        flex-direction: column;
      }

      :host > .io-drawer-veil {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transition: backdrop-filter 0.25s ease-out;
        transition: background-color 0.25s ease-out;
      }
      :host[expanded] > .io-drawer-veil {
        pointer-events: auto;
        background-color: rgba(0, 0, 0, 0.25);
        backdrop-filter: blur(3px);
      }

      :host > .io-drawer-content {
        position: relative;
        display: flex;
        overflow: visible;
        transition: transform 0.125s ease-out;
        justify-content: flex-end;
        background-color: var(--io_bgColorStrong);
      }

      :host > .io-drawer-content > .io-drawer-child {
        display: flex;
        flex: 0 0 var(--io_drawerSize);
        overflow: hidden;
        pointer-events: auto;
      }
      :host[orientation="horizontal"] > .io-drawer-content > .io-drawer-child {
        width: var(--io_drawerSize);
      }
      :host[orientation="vertical"] > .io-drawer-content > .io-drawer-child {
        height: var(--io_drawerSize);
      }

      :host[orientation="horizontal"] > .io-drawer-content {
        height: 100%;
        flex-direction: row;
      }
      :host[orientation="vertical"] > .io-drawer-content {
        position: absolute;
        width: 100%;
        flex-direction: column;
      }

      :host > .io-drawer-content > .io-drawer-handle {
        pointer-events: auto;
        display: flex;
        overflow: hidden;
        flex-basis: var(--io_drawerHandleSize);
        align-items: center;
        background-color: var(--io_bgColorLight);
        border: var(--io_border);
        border-color: var(--io_borderColorStrong);
        @apply --io-unselectable;
        z-index: 2;
      }
      :host[orientation="horizontal"] > .io-drawer-content > .io-drawer-handle {
        border-top: 0;
        border-bottom: 0;
        flex-direction: row;
      }
      :host[orientation="horizontal"][direction="leading"] > .io-drawer-content {
        margin-left: calc(-1 * var(--io_drawerSize) - var(--io_drawerHandleSize) - var(--io_spacing3));
        transform: translateX(calc(var(--io_drawerHandleSize) * 1));
        flex-direction: row-reverse;
      }
      :host[orientation="horizontal"][direction="leading"][expanded] > .io-drawer-content {
        transform: translateX(calc(var(--io_drawerSize) + var(--io_drawerHandleSize)));
      }

      :host[orientation="horizontal"][direction="trailing"] > .io-drawer-content {
        margin-left: 100%;
        transform: translateX(calc(var(--io_drawerHandleSize) * -1));
      }
      :host[orientation="horizontal"][direction="trailing"][expanded] > .io-drawer-content {
        transform: translateX(calc(var(--io_drawerSize) * -1 - var(--io_drawerHandleSize)));
      }

      :host[orientation="vertical"] > .io-drawer-content > .io-drawer-handle {
        border-left: 0;
        border-right: 0;
        flex-direction: column;
      }
      :host[orientation="vertical"][direction="leading"] > .io-drawer-content {
        margin-top: auto;
        transform: translateY(calc(var(--io_drawerHandleSize) - 100%));
        flex-direction: column-reverse;
      }
      :host[orientation="vertical"][direction="leading"][expanded] > .io-drawer-content {
        transform: translateY(calc(var(--io_drawerSize) + var(--io_drawerHandleSize) - 100%));
      }
      :host[orientation="vertical"][direction="trailing"] > .io-drawer-content > .io-drawer-child {
        margin-bottom: auto;
      }
      :host[orientation="vertical"][direction="trailing"] > .io-drawer-content {
        height: 100%;
        transform: translateY(calc(100% - var(--io_drawerHandleSize)));
      }
      :host[orientation="vertical"][direction="trailing"][expanded] > .io-drawer-content {
        transform: translateY(calc(100% - var(--io_drawerHandleSize) - var(--io_drawerSize)));
      }
    `;
    }
    constructor(args) {
        super(args);
    }
    onToggleExpanded(event) {
        event.preventDefault();
        event.stopPropagation();
        this.expanded = !this.expanded;
    }
    onStopPropagation(event) {
        event.preventDefault();
        event.stopPropagation();
    }
    expandedChanged() {
        this.dispatch('io-drawer-expanded-changed', { element: this }, true);
    }
    childMutated() {
        this.mutated();
    }
    mutated() {
        if (!this.child) {
            this.render([]);
            return;
        }
        let availableSize = Infinity;
        const parent = this.parent;
        if (parent) {
            const parentRect = parent.getBoundingClientRect();
            availableSize = this.orientation === 'horizontal' ? parentRect.width : parentRect.height;
        }
        const handleSize = ThemeSingleton.lineHeight - ThemeSingleton.borderWidth;
        const dividerSize = ThemeSingleton.spacing3;
        const minSize = availableSize - handleSize * 2 - dividerSize;
        const drawerSize = Math.min(parseSizeBudgetPx(this.child.size, availableSize), minSize);
        this.style.setProperty('--io_drawerSize', `${drawerSize}px`);
        let childVDOM = null;
        if (this.child instanceof Split) {
            childVDOM = ioSplit({
                split: this.child,
                elements: this.elements,
            });
        }
        else if (this.child instanceof Panel) {
            childVDOM = ioPanel({
                panel: this.child,
                elements: this.elements,
            });
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
            div({ class: 'io-drawer-veil', '@click': this.onToggleExpanded }),
            div({ class: 'io-drawer-content' }, [
                div({ class: 'io-drawer-handle', '@click': this.onToggleExpanded }, [
                    ioIcon({ value: icon, size: 'small' })
                ]),
                ioDivider({ orientation: this.orientation }),
                div({ class: 'io-drawer-child', '@click': this.onStopPropagation }, [
                    childVDOM,
                ])
            ])
        ]);
    }
};
__decorate([
    Property({ type: String, value: 'horizontal', reflect: true })
], IoDrawer.prototype, "orientation", void 0);
__decorate([
    Property({ type: String, value: 'leading', reflect: true })
], IoDrawer.prototype, "direction", void 0);
__decorate([
    Property({ type: Boolean, value: false, reflect: true })
], IoDrawer.prototype, "expanded", void 0);
__decorate([
    Property({ type: Object })
], IoDrawer.prototype, "parent", void 0);
__decorate([
    Property({ type: Object })
], IoDrawer.prototype, "child", void 0);
__decorate([
    Property(Array)
], IoDrawer.prototype, "elements", void 0);
IoDrawer = __decorate([
    Register
], IoDrawer);
export { IoDrawer };
export const ioDrawer = function (args) {
    return IoDrawer.vConstructor(args);
};
