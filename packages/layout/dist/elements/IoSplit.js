var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var IoSplit_1;
import { Register, Property, ReactiveElement, ThemeSingleton } from '@io-gui/core';
import { ioPanel } from './IoPanel.js';
import { ioDivider } from './IoDivider.js';
import { ioDrawer } from './IoDrawer.js';
import { Split } from '../nodes/Split.js';
import { Panel } from '../nodes/Panel.js';
import { isAutoSize, parseSizeBudgetPx, sizeToFlex } from '../utils/layoutSize.js';
let IoSplit = IoSplit_1 = class IoSplit extends ReactiveElement {
    static get Style() {
        return /* css */ `
      :host {
        display: flex;
        flex: 1 1 100%;
        max-width: 100%;
        max-height: 100%;
        position: relative;
        overflow: hidden;
      }
      :host[orientation='horizontal'] {
        flex-direction: row;
      }
      :host[orientation='vertical'] {
        flex-direction: column;
      }
      :host:not([hasvisibleautosize]) > .io-split-last-visible {
        flex: 1 1 auto !important;
      }
      :host[orientation='horizontal']:has(> io-drawer[direction="leading"]) {
        padding-left: calc(2 * var(--io_borderWidth) + var(--io_lineHeight));
      }
      :host[orientation='horizontal']:has(> io-drawer[direction="trailing"]) {
        padding-right: calc(2 * var(--io_borderWidth) + var(--io_lineHeight));
      }
      :host[orientation='vertical']:has(> io-drawer[direction="leading"]) {
        padding-top: calc(2 * var(--io_borderWidth) + var(--io_lineHeight));
      }
      :host[orientation='vertical']:has(> io-drawer[direction="trailing"]) {
        padding-bottom: calc(2 * var(--io_borderWidth) + var(--io_lineHeight));
      }
    `;
    }
    static get Listeners() {
        return {
            'io-divider-move': 'onDividerMove',
            'io-divider-move-end': 'onDividerMoveEnd',
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
        let size;
        let minSize = 0;
        const sizes = [];
        if (orientation === 'horizontal') {
            size = rect.width;
        }
        else {
            size = rect.height;
        }
        children.forEach(child => {
            const childMinSize = parseSizeBudgetPx(child.size, size);
            minSize += childMinSize;
            sizes.push(childMinSize);
        });
        let collapsePriority = 'end';
        const lastIndex = children.length - 1;
        const firstGrows = isAutoSize(children[0].size);
        const lastGrows = isAutoSize(children[lastIndex].size);
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
        leftSplit.style.setProperty('flex', `0 0 ${leftSize}px`);
        rightSplit.style.setProperty('flex', `0 0 ${rightSize}px`);
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
            // TODO: Consider preserving % units
            childmodel.size = `${childSize}px`;
        }
        // this.split.normalize() // IMPORTANT: Do not remove commented out code. It is used in the future.
        this.updateVisibleAutoSize();
        this.debounce(this.calculateCollapsedDrawersDebounced);
    }
    updateVisibleAutoSize() {
        this.hasVisibleAutoSize = this.split.children.some((child, i) => {
            if (i === 0 && this.leadingDrawer !== null)
                return false;
            if (i === this.split.children.length - 1 && this.trailingDrawer !== null)
                return false;
            return isAutoSize(child.size);
        });
    }
    ensureOneHasAutoSize() {
        this.updateVisibleAutoSize();
    }
    onDrawerExpandedChanged(event) {
        event.stopPropagation();
        const srcDrawer = event.detail.element;
        if (srcDrawer.expanded) {
            const drawers = [...this.querySelectorAll(':scope > io-drawer')];
            drawers.forEach(drawer => drawer !== srcDrawer && (drawer.expanded = false));
        }
    }
    collapseAllDrawers() {
        const drawers = [...this.querySelectorAll(':scope > io-drawer')];
        drawers.forEach(drawer => drawer.expanded = false);
    }
    leadingDrawerChanged() {
        this.collapseAllDrawers();
    }
    trailingDrawerChanged() {
        this.collapseAllDrawers();
    }
    onVeilClick(event) {
        event.stopPropagation();
        this.collapseAllDrawers();
    }
    splitMutated() {
        this.calculateCollapsedDrawers();
        this.updateVisibleAutoSize();
        this.mutated();
    }
    splitChanged() {
        this.calculateCollapsedDrawers();
    }
    mutated() {
        this.updateVisibleAutoSize();
        this.setAttribute('orientation', this.split.orientation);
        const childCount = this.split.children.length;
        const lastIndex = childCount - 1;
        const orientation = this.split.orientation;
        const vChildren = [];
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
                    style: { flex: sizeToFlex(child.size) },
                    class: isLastVisible ? 'io-split-last-visible' : '',
                    elements: this.elements,
                }));
            }
            else if (child instanceof Panel) {
                vChildren.push(ioPanel({
                    panel: child,
                    style: { flex: sizeToFlex(child.size) },
                    class: isLastVisible ? 'io-split-last-visible' : '',
                    elements: this.elements,
                }));
            }
            if (!isLastVisible) {
                vChildren.push(ioDivider({
                    orientation: orientation,
                }));
            }
        }
        if (this.leadingDrawer !== null) {
            vChildren.push(ioDrawer({
                orientation: orientation,
                direction: 'leading',
                parent: this,
                child: this.leadingDrawer,
                elements: this.elements,
            }));
        }
        if (this.trailingDrawer !== null) {
            vChildren.push(ioDrawer({
                orientation: orientation,
                direction: 'trailing',
                parent: this,
                child: this.trailingDrawer,
                elements: this.elements,
            }));
        }
        this.render(vChildren);
    }
};
__decorate([
    Property({ type: Object })
], IoSplit.prototype, "split", void 0);
__decorate([
    Property(Array)
], IoSplit.prototype, "elements", void 0);
__decorate([
    Property({ type: Object, value: null })
], IoSplit.prototype, "leadingDrawer", void 0);
__decorate([
    Property({ type: Object, value: null })
], IoSplit.prototype, "trailingDrawer", void 0);
__decorate([
    Property({ type: Boolean, value: true, reflect: true })
], IoSplit.prototype, "hasVisibleAutoSize", void 0);
__decorate([
    Property({ type: Boolean, value: false, reflect: true })
], IoSplit.prototype, "showVeil", void 0);
IoSplit = IoSplit_1 = __decorate([
    Register
], IoSplit);
export { IoSplit };
export const ioSplit = function (arg0) {
    return IoSplit.vConstructor(arg0);
};
