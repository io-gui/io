var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var IoSplit_1;
import { Register, ReactiveProperty, IoElement, Property, ThemeSingleton, div } from '@io-gui/core';
import { MenuOption } from '@io-gui/menus';
import { ioPanel } from './IoPanel.js';
import { ioDivider } from './IoDivider.js';
import { ioDrawer } from './IoDrawer.js';
import { Split } from '../nodes/Split.js';
import { Panel } from '../nodes/Panel.js';
export function parseFlexBasis(flex) {
    const parts = flex.trim().split(/\s+/);
    const basis = parts[2] ?? 'auto';
    if (basis === 'auto' || basis === '0')
        return 240;
    const match = basis.match(/^(\d+(?:\.\d+)?)px$/);
    return match ? parseInt(match[1], 10) : 240;
}
export function hasFlexGrow(flex) {
    const grow = parseFloat(flex.trim().split(/\s+/)[0] ?? '0');
    return !isNaN(grow) && grow > 0;
}
let IoSplit = IoSplit_1 = class IoSplit extends IoElement {
    static get Style() {
        return /* css */ `
      :host {
        position: relative;
        display: flex;
        overflow: hidden;
        flex-direction: row;
      }
      :host[orientation='vertical'] {
        flex-direction: column;
      }
      :host:not([hasvisibleflexgrow]) > .io-split-last-visible {
        flex: 1 1 auto !important;
      }
      :host > .io-split-veil {
        position: absolute;
        opacity: 0;
        transition: opacity 0.125s ease-out;
        background-color: rgba(0, 0, 0, 1);
        pointer-events: none;
        z-index: 2;
        inset: 0;
      }
      :host[showveil] > .io-split-veil {
        display: block;
        opacity: 0.5;
        pointer-events: auto;
        cursor: pointer;
      }
    `;
    }
    static get Listeners() {
        return {
            'io-divider-move': 'onDividerMove',
            'io-divider-move-end': 'onDividerMoveEnd',
            'io-panel-remove': 'onPanelRemove',
            'io-split-remove': 'onSplitRemove',
            'io-split-consolidate': 'onSplitConsolidate',
            'io-drawer-expanded-changed': 'onDrawerExpandedChanged',
        };
    }
    // TODO: Make sure one panel is available even when all tabs are removed.
    constructor(args) {
        super(args);
    }
    onResized() {
        this.debounce(this.calculateCollapsedDrawersDebounced);
    }
    calculateCollapsedDrawersDebounced() {
        this.calculateCollapsedDrawers();
    }
    calculateCollapsedDrawers() {
        const rect = this.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0)
            return;
        const split = this.split;
        const children = split.children;
        const orientation = split.orientation;
        let size = Infinity;
        let minSize = 0;
        const sizes = [];
        if (orientation === 'horizontal') {
            size = rect.width;
        }
        else {
            size = rect.height;
        }
        children.forEach(child => {
            const childMinSize = parseFlexBasis(child.flex);
            minSize += childMinSize;
            sizes.push(childMinSize);
        });
        let collapsePriority = 'end';
        const lastIndex = children.length - 1;
        const firstGrows = hasFlexGrow(children[0].flex);
        const lastGrows = hasFlexGrow(children[lastIndex].flex);
        const bothGrow = firstGrows && lastGrows;
        const neitherGrows = !firstGrows && !lastGrows;
        if (neitherGrows) {
            collapsePriority = sizes[0] <= sizes[lastIndex] ? 'start' : 'end';
        }
        else if (!bothGrow) {
            collapsePriority = lastGrows ? 'start' : 'end';
        }
        const collapsedSize = collapsePriority === 'start' ? sizes[0] : sizes[sizes.length - 1];
        if (size < minSize) {
            if (children.length >= 3 && size < (minSize - collapsedSize)) {
                this.setProperties({
                    leadingDrawer: children[0],
                    trailingDrawer: children[lastIndex],
                });
            }
            else if (children.length >= 2) {
                if (collapsePriority === 'start') {
                    this.setProperties({
                        leadingDrawer: children[0],
                        trailingDrawer: null,
                    });
                }
                else {
                    this.setProperties({
                        leadingDrawer: null,
                        trailingDrawer: children[lastIndex],
                    });
                }
            }
        }
        else {
            this.setProperties({
                leadingDrawer: null,
                trailingDrawer: null,
            });
        }
    }
    onDividerMove(event) {
        event.stopPropagation();
        const orientation = this.split.orientation;
        const dividerSize = ThemeSingleton.spacing3;
        const minSize = ThemeSingleton.fieldHeight * 4;
        const leftSplit = event.detail.element.previousElementSibling;
        const rightSplit = event.detail.element.nextElementSibling;
        const leftRect = leftSplit.getBoundingClientRect();
        const rightRect = rightSplit.getBoundingClientRect();
        const combinedSize = orientation === 'horizontal'
            ? leftRect.width + rightRect.width
            : leftRect.height + rightRect.height;
        const pointerPos = orientation === 'horizontal'
            ? event.detail.clientX - leftRect.left - dividerSize / 2
            : event.detail.clientY - leftRect.top - dividerSize / 2;
        const leftSize = Math.max(minSize, Math.min(combinedSize - minSize, pointerPos));
        const rightSize = combinedSize - leftSize;
        leftSplit.style.flex = `0 0 ${leftSize}px`;
        rightSplit.style.flex = `0 0 ${rightSize}px`;
    }
    onDividerMoveEnd(event) {
        event.stopPropagation();
        const orientation = this.split.orientation;
        const childrenElements = this.querySelectorAll(':scope > io-split, :scope > io-panel');
        for (let i = 0; i < childrenElements.length; i++) {
            const child = childrenElements[i];
            const childmodel = child instanceof IoSplit_1 ? child.split : child.panel;
            const childRect = child.getBoundingClientRect();
            const childSize = orientation === 'horizontal' ? childRect.width : childRect.height;
            if (hasFlexGrow(childmodel.flex)) {
                // TODO: Reconsider. Test
                child.style.flex = childmodel.flex;
            }
            else {
                childmodel.flex = `0 0 ${childSize}px`;
            }
        }
        this.ensureOneHasFlexGrow();
        this.debounce(this.calculateCollapsedDrawersDebounced);
    }
    onPanelRemove(event) {
        event.stopPropagation();
        for (let i = this.split.children.length; i--;) {
            const child = this.split.children[i];
            if (child instanceof Panel && child.tabs.length === 0) {
                this.split.children.splice(i, 1);
            }
        }
        if (this.split.children.length === 0) {
            this.dispatch('io-split-remove', { split: this.split }, true);
        }
        else if (this.split.children.length === 1) {
            this.dispatch('io-split-consolidate', { split: this.split }, true);
        }
        this.ensureOneHasFlexGrow();
    }
    onSplitRemove(event) {
        if (event.detail.split === this.split)
            return;
        event.stopPropagation();
        const index = this.split.children.indexOf(event.detail.split);
        if (index === -1)
            return;
        this.split.children.splice(index, 1);
        if (this.split.children.length === 1) {
            this.dispatch('io-split-consolidate', { split: this.split }, true);
        }
        this.ensureOneHasFlexGrow();
    }
    ensureOneHasFlexGrow() {
        const hasGrow = this.split.children.some(child => hasFlexGrow(child.flex));
        if (!hasGrow && this.split.children.length > 0) {
            const i = Math.min(1, this.split.children.length - 1);
            this.split.children[i].flex = '1 1 auto';
        }
        this.hasVisibleFlexGrow = this.split.children.some((child, i) => {
            if (i === 0 && this.leadingDrawer !== null)
                return false;
            if (i === this.split.children.length - 1 && this.trailingDrawer !== null)
                return false;
            return hasFlexGrow(child.flex);
        });
    }
    onSplitConsolidate(event) {
        if (event.detail.split === this.split)
            return;
        event.stopPropagation();
        this.consolidateChild(event.detail.split);
        // Recursive consolidation: if this split now has only 1 child, propagate up the tree
        if (this.split.children.length === 1) {
            this.dispatch('io-split-consolidate', { split: this.split }, true);
        }
    }
    convertToSplit(panel, first, second, orientation) {
        const index = this.split.children.indexOf(panel);
        const newSplit = new Split({ type: 'split', orientation, children: [] });
        newSplit.children.push(first, second);
        this.split.children.splice(index, 1, newSplit);
    }
    consolidateChild(childSplit) {
        const index = this.split.children.indexOf(childSplit);
        if (index === -1 || childSplit.children.length === 0)
            return;
        const soleChild = childSplit.children[0];
        if (soleChild instanceof Panel) {
            soleChild.flex = '1 1 auto';
            this.split.children.splice(index, 1, soleChild);
        }
        else if (soleChild instanceof Split) {
            this.split.orientation = soleChild.orientation;
            this.split.children.splice(index, 1, ...soleChild.children);
            this.ensureOneHasFlexGrow();
        }
    }
    moveTabToSplit(sourcePanel, panel, tab, direction) {
        const index = this.split.children.indexOf(panel);
        let orientation = 'horizontal';
        if (direction === 'top' || direction === 'bottom') {
            orientation = 'vertical';
        }
        let newIndex = ['left', 'top'].includes(direction) ? index - 1 : index + 1;
        if (this.split.orientation === orientation) {
            newIndex = Math.max(0, newIndex);
            this.split.children.splice(newIndex, 0, new Panel({ type: 'panel', tabs: [tab] }));
            sourcePanel.removeTab(tab);
        }
        else {
            if (panel.tabs.length > 1 || panel !== sourcePanel.panel) {
                sourcePanel.removeTab(tab);
                if (newIndex === -1) {
                    this.convertToSplit(panel, new Panel({ type: 'panel', tabs: [tab] }), panel, orientation);
                }
                else {
                    this.convertToSplit(panel, panel, new Panel({ type: 'panel', tabs: [tab] }), orientation);
                }
            }
        }
    }
    onDrawerExpandedChanged(event) {
        const srcDrawer = event.detail.element;
        if (srcDrawer.expanded) {
            const drawers = [...this.querySelectorAll(':scope > io-drawer')];
            drawers.forEach(drawer => drawer !== srcDrawer && (drawer.expanded = false));
        }
        event.stopPropagation();
        this.updateVeil();
    }
    updateVeil() {
        const drawers = [...this.querySelectorAll(':scope > io-drawer')];
        this.showVeil = drawers.some(drawer => drawer.expanded);
    }
    collapseAllDrawers() {
        const drawers = [...this.querySelectorAll(':scope > io-drawer')];
        drawers.forEach(drawer => drawer.expanded = false);
    }
    onVeilClick(event) {
        event.stopPropagation();
        // TODO: this should trigger onDrawerExpandedChanged and updateVeil
        this.collapseAllDrawers();
    }
    splitMutated() {
        this.calculateCollapsedDrawers();
        this.changed();
    }
    splitChanged() {
        this.calculateCollapsedDrawers();
    }
    changed() {
        this.setAttribute('orientation', this.split.orientation);
        const childCount = this.split.children.length;
        const lastIndex = childCount - 1;
        const orientation = this.split.orientation;
        const vChildren = [];
        vChildren.push(div({
            class: 'io-split-veil',
            '@click': this.onVeilClick,
        }));
        if (this.leadingDrawer !== null) {
            vChildren.push(ioDrawer({
                orientation: orientation,
                direction: 'leading',
                child: this.leadingDrawer,
                elements: this.elements,
                addMenuOption: this.addMenuOption,
            }));
        }
        // Render visible children
        for (let i = 0; i < childCount; i++) {
            if (i === 0 && this.leadingDrawer !== null) {
                continue;
            }
            if (i === lastIndex && this.trailingDrawer !== null) {
                continue;
            }
            const isLastVisible = (i === lastIndex - 1 && this.trailingDrawer !== null) || (i === lastIndex && this.trailingDrawer === null);
            const child = this.split.children[i];
            if (child instanceof Split) {
                vChildren.push(ioSplit({
                    split: child,
                    style: { flex: child.flex },
                    class: isLastVisible ? 'io-split-last-visible' : '',
                    elements: this.elements,
                    addMenuOption: this.addMenuOption,
                }));
            }
            else if (child instanceof Panel) {
                vChildren.push(ioPanel({
                    panel: child,
                    style: { flex: child.flex },
                    class: isLastVisible ? 'io-split-last-visible' : '',
                    elements: this.elements,
                    addMenuOption: this.addMenuOption,
                }));
            }
            else
                debug: {
                    console.warn('IOSplit: Invalid child type', child);
                }
            if (!isLastVisible) {
                vChildren.push(ioDivider({
                    orientation: orientation,
                }));
            }
        }
        if (this.trailingDrawer !== null) {
            vChildren.push(ioDrawer({
                orientation: orientation,
                direction: 'trailing',
                child: this.trailingDrawer,
                elements: this.elements,
                addMenuOption: this.addMenuOption,
            }));
        }
        this.render(vChildren);
    }
};
__decorate([
    ReactiveProperty({ type: Object })
], IoSplit.prototype, "split", void 0);
__decorate([
    ReactiveProperty(Array)
], IoSplit.prototype, "elements", void 0);
__decorate([
    ReactiveProperty({ type: Object, value: null })
], IoSplit.prototype, "leadingDrawer", void 0);
__decorate([
    ReactiveProperty({ type: Object, value: null })
], IoSplit.prototype, "trailingDrawer", void 0);
__decorate([
    Property({ type: MenuOption })
], IoSplit.prototype, "addMenuOption", void 0);
__decorate([
    ReactiveProperty({ type: Boolean, value: true, reflect: true })
], IoSplit.prototype, "hasVisibleFlexGrow", void 0);
__decorate([
    ReactiveProperty({ type: Boolean, value: false, reflect: true })
], IoSplit.prototype, "showVeil", void 0);
IoSplit = IoSplit_1 = __decorate([
    Register
], IoSplit);
export { IoSplit };
export const ioSplit = function (arg0) {
    return IoSplit.vConstructor(arg0);
};
//# sourceMappingURL=IoSplit.js.map