var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, Property, ReactiveElement, div, ThemeSingleton } from '@io-gui/core';
import { Split } from '../models/Split.js';
import { Panel } from '../models/Panel.js';
import { ioSplit } from './IoSplit.js';
import { DEFAULT_MIN_SIZE_PX, parseSizeBudgetPx } from '../utils/layoutSize.js';
import { ioPanel } from './IoPanel.js';
import { ioDivider } from './IoDivider.js';
import { ioDrawerHandle } from './IoDrawerHandle.js';
let IoDrawer = class IoDrawer extends ReactiveElement {
    static get Style() {
        return /* css */ `
      :host {
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
        flex-direction: column;
      }
      :host[orientation="vertical"] {
        flex-direction: row;
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

      :host:not([expanded]) io-divider {
        opacity: 0;
        pointer-events: none;
      }

      :host > .io-drawer-content {
        pointer-events: auto;
        position: relative;
        display: flex;
        background-color: var(--io_bgColorStrong);
        box-sizing: border-box;
      }
      :host[direction="leading"] > .io-drawer-content {
        justify-content: flex-start;
        align-self: flex-start;
      }
      :host[direction="trailing"] > .io-drawer-content {
        justify-content: flex-end;
        align-self: flex-end;
      }
      
      :host:not([dragging]) > .io-drawer-content {
        transition: transform 0.125s ease-out;
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
      }
      :host[orientation="vertical"] > .io-drawer-content {
        width: 100%;
      }

      :host[orientation="horizontal"][direction="leading"] > .io-drawer-content {
        flex-direction: row-reverse;
      }
      :host[orientation="horizontal"][direction="trailing"] > .io-drawer-content {
        flex-direction: row;
      }
      :host:not([expanded])[orientation="horizontal"][direction="leading"] > .io-drawer-content {
        transform: translateX(calc(var(--io_drawerSize) * -1 - var(--io_spacing3) - var(--io_borderWidth)));
      }
      :host:not([expanded])[orientation="horizontal"][direction="trailing"] > .io-drawer-content {
        transform: translateX(calc(var(--io_drawerSize) * 1 + var(--io_spacing3) + var(--io_borderWidth)));
      }

      /* TODO: Simplify calculated values */
      :host[orientation="vertical"][direction="leading"] > .io-drawer-content {
        flex-direction: column-reverse;
      }
      :host[orientation="vertical"][direction="trailing"] > .io-drawer-content {
        flex-direction: column;
      }
      :host:not([expanded])[orientation="vertical"][direction="leading"] > .io-drawer-content {
        transform: translateY(calc(var(--io_drawerSize) * -1 - var(--io_spacing3) - var(--io_borderWidth)));
      }
      :host:not([expanded])[orientation="vertical"][direction="trailing"] > .io-drawer-content {
        transform: translateY(calc(var(--io_drawerSize) * 1 + var(--io_spacing3) + var(--io_borderWidth)));
      }
    `;
    }
    static get Listeners() {
        return {
            'io-divider-move': 'onDividerMove',
            'io-divider-move-end': 'onDividerMoveEnd',
            'io-drawer-toggle': 'onToggleExpanded',
        };
    }
    get availableSize() {
        const parent = this.parent;
        if (parent) {
            const parentRect = parent.getBoundingClientRect();
            return this.orientation === 'horizontal' ? parentRect.width : parentRect.height;
        }
        return Infinity;
    }
    get maxDrawerSize() {
        const handleSize = ThemeSingleton.lineHeight - ThemeSingleton.borderWidth;
        const dividerSize = ThemeSingleton.spacing3;
        return this.availableSize - handleSize * 2 - dividerSize;
    }
    setDrawerSizeCssVar(size) {
        const clampedSize = Math.max(DEFAULT_MIN_SIZE_PX, Math.min(size, this.maxDrawerSize));
        this.style.setProperty('--io_drawerSize', `${clampedSize}px`);
        // const drawerHandleSize = ThemeSingleton.lineHeight + ThemeSingleton.borderWidth * 2;
        // this.style.setProperty('--io_drawerHandleSize', `${drawerHandleSize}px`)
    }
    constructor(args) {
        super(args);
    }
    onToggleExpanded(event) {
        event.preventDefault();
        event.stopPropagation();
        this.expanded = !this.expanded;
        if (this.expanded) {
            this.parent.collapseDrawers(this);
        }
    }
    onDividerMove(event) {
        event.stopPropagation();
        this.setAttribute('dragging', 'true');
        const dividerHalfSize = ThemeSingleton.spacing3 / 2;
        const child = this.$['child'];
        const childRect = child.getBoundingClientRect();
        const leftOffset = childRect.left - dividerHalfSize - event.detail.clientX;
        const topOffset = childRect.top - dividerHalfSize - event.detail.clientY;
        const rightOffset = event.detail.clientX - childRect.right + dividerHalfSize;
        const bottomOffset = event.detail.clientY - childRect.bottom + dividerHalfSize;
        const sizeOffset = this.orientation === 'horizontal'
            ? this.direction === 'leading' ? rightOffset : leftOffset
            : this.direction === 'leading' ? bottomOffset : topOffset;
        const currentDrawerSize = parseFloat(this.style.getPropertyValue('--io_drawerSize'));
        // Temporary CSS-only sizing. Model size will be updated in onDividerMoveEnd.
        this.setDrawerSizeCssVar(currentDrawerSize + sizeOffset);
    }
    onDividerMoveEnd(event) {
        event.stopPropagation();
        this.removeAttribute('dragging');
        const child = this.$['child'];
        const currentDrawerSize = parseFloat(this.style.getPropertyValue('--io_drawerSize'));
        child.model.size = `${currentDrawerSize}px`;
        this.parent.updateVisibleAutoSize();
        this.parent.debounce(this.parent.calculateCollapsedDrawersDebounced);
    }
    modelMutated() {
        this.mutated();
    }
    mutated() {
        if (!this.model) {
            this.render([]);
            return;
        }
        this.setDrawerSizeCssVar(parseSizeBudgetPx(this.model.size, this.availableSize));
        let childVDOM = null;
        if (this.model instanceof Split) {
            childVDOM = ioSplit({
                id: 'child',
                model: this.model,
                elements: this.elements,
            });
        }
        else if (this.model instanceof Panel) {
            childVDOM = ioPanel({
                id: 'child',
                model: this.model,
                elements: this.elements,
            });
        }
        this.render([
            div({ class: 'io-drawer-veil', '@click': this.onToggleExpanded }),
            div({ class: 'io-drawer-content' }, [
                ioDrawerHandle({
                    orientation: this.orientation,
                    direction: this.direction,
                    expanded: this.expanded,
                }),
                ioDivider({ orientation: this.orientation }),
                div({ class: 'io-drawer-child' }, [
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
], IoDrawer.prototype, "model", void 0);
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
