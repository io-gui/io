var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, Property, ReactiveElement, ThemeSingleton } from '@io-gui/core';
import { ioPanel } from './IoPanel.js';
import { ioDivider } from './IoDivider.js';
import { ioDrawer } from './IoDrawer.js';
import { Split } from '../models/Split.js';
import { Panel } from '../models/Panel.js';
import { isAutoSize, parseSizeBudgetPx, sizeToFlex } from '../utils/layoutSize.js';
let IoSplit = class IoSplit extends ReactiveElement {
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
        };
    }
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
        const split = this.model;
        const children = split.children;
        if (children.length === 0) {
            this.setProperties({
                leadingCollapsedChildModel: null,
                trailingCollapsedChildModel: null,
            });
            return;
        }
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
                    leadingCollapsedChildModel: children[0],
                    trailingCollapsedChildModel: children[lastIndex],
                });
            }
            else if (children.length >= 2) {
                if (collapsePriority === 'start') {
                    this.setProperties({
                        leadingCollapsedChildModel: children[0],
                        trailingCollapsedChildModel: null,
                    });
                }
                else {
                    this.setProperties({
                        leadingCollapsedChildModel: null,
                        trailingCollapsedChildModel: children[lastIndex],
                    });
                }
            }
        }
        else {
            this.setProperties({
                leadingCollapsedChildModel: null,
                trailingCollapsedChildModel: null,
            });
        }
    }
    onDividerMove(event) {
        event.stopPropagation();
        const orientation = this.model.orientation;
        const dividerSize = ThemeSingleton.spacing3;
        const minSize = ThemeSingleton.fieldHeight * 4;
        const prevSibling = event.detail.element.previousElementSibling;
        const nextSibling = event.detail.element.nextElementSibling;
        const prevRect = prevSibling.getBoundingClientRect();
        const nextRect = nextSibling.getBoundingClientRect();
        const combinedSize = orientation === 'horizontal'
            ? prevRect.width + nextRect.width
            : prevRect.height + nextRect.height;
        const dividerPos = orientation === 'horizontal'
            ? event.detail.clientX - prevRect.left - dividerSize / 2
            : event.detail.clientY - prevRect.top - dividerSize / 2;
        const prevTargetSize = Math.max(minSize, Math.min(combinedSize - minSize, dividerPos));
        const nextTargetSize = combinedSize - prevTargetSize;
        // Temporary CSS-only sizing. Model size will be updated in onDividerMoveEnd.
        prevSibling.style.setProperty('flex', `0 0 ${prevTargetSize}px`);
        nextSibling.style.setProperty('flex', `0 0 ${nextTargetSize}px`);
    }
    onDividerMoveEnd(event) {
        event.stopPropagation();
        const orientation = this.model.orientation;
        const prevSibling = event.detail.element.previousElementSibling;
        const nextSibling = event.detail.element.nextElementSibling;
        const prevRect = prevSibling.getBoundingClientRect();
        const nextRect = nextSibling.getBoundingClientRect();
        // Copy target sizes from the DOM to the model.
        const prevTargetSize = orientation === 'horizontal' ? prevRect.width : prevRect.height;
        const nextTargetSize = orientation === 'horizontal' ? nextRect.width : nextRect.height;
        const prevModel = prevSibling.model;
        const nextModel = nextSibling.model;
        const prevIsAutoSize = isAutoSize(prevModel.size);
        const nextIsAutoSize = isAutoSize(nextModel.size);
        // TODO: Consider preserving % units
        if (!prevIsAutoSize) {
            prevModel.size = `${prevTargetSize}px`;
        }
        if (!nextIsAutoSize) {
            nextModel.size = `${nextTargetSize}px`;
        }
        // TODO: Test this logic. Consider extrating to layoutSize.ts
        if (prevIsAutoSize && nextIsAutoSize) {
            const length = this.model.children.length;
            const prevIndex = this.model.children.indexOf(prevModel);
            const nextIndex = this.model.children.indexOf(nextModel);
            const prevIndexDist = Math.abs(prevIndex - length / 2);
            const nextIndexDist = Math.abs(nextIndex - length / 2);
            const closerToEdgeIndex = prevIndexDist < nextIndexDist ? prevIndex : nextIndex;
            const closerToEdgeTargetSize = prevIndexDist < nextIndexDist ? prevTargetSize : nextTargetSize;
            const closerToEdgeModel = this.model.children[closerToEdgeIndex];
            closerToEdgeModel.size = `${closerToEdgeTargetSize}px`;
        }
        this.updateVisibleAutoSize();
        this.debounce(this.calculateCollapsedDrawersDebounced);
    }
    updateVisibleAutoSize() {
        this.hasVisibleAutoSize = this.model.children.some((child, i) => {
            if (i === 0 && this.leadingCollapsedChildModel !== null)
                return false;
            if (i === this.model.children.length - 1 && this.trailingCollapsedChildModel !== null)
                return false;
            return isAutoSize(child.size);
        });
    }
    ensureOneHasAutoSize() {
        this.updateVisibleAutoSize();
    }
    leadingCollapsedChildModelChanged() {
        this.collapseDrawers();
    }
    trailingCollapsedChildModelChanged() {
        this.collapseDrawers();
    }
    onVeilClick(event) {
        event.stopPropagation();
        this.collapseDrawers();
    }
    collapseDrawers(except) {
        const drawers = [...this.querySelectorAll(':scope > io-drawer')];
        drawers.forEach(drawer => drawer !== except && (drawer.expanded = false));
    }
    modelMutated() {
        this.calculateCollapsedDrawers();
        this.updateVisibleAutoSize();
        this.mutated();
    }
    modelChanged() {
        this.calculateCollapsedDrawers();
    }
    mutated() {
        this.updateVisibleAutoSize();
        this.setAttribute('orientation', this.model.orientation);
        const childCount = this.model.children.length;
        const lastIndex = childCount - 1;
        const orientation = this.model.orientation;
        const vChildren = [];
        for (let i = 0; i < childCount; i++) {
            if (i === 0 && this.leadingCollapsedChildModel !== null)
                continue;
            if (i === lastIndex && this.trailingCollapsedChildModel !== null)
                continue;
            const isLastVisible = (i === lastIndex - 1 && this.trailingCollapsedChildModel !== null) || (i === lastIndex && this.trailingCollapsedChildModel === null);
            const child = this.model.children[i];
            if (child instanceof Split) {
                vChildren.push(ioSplit({
                    model: child,
                    style: { flex: sizeToFlex(child.size) },
                    class: isLastVisible ? 'io-split-last-visible' : '',
                    elements: this.elements,
                }));
            }
            else if (child instanceof Panel) {
                vChildren.push(ioPanel({
                    model: child,
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
        if (this.leadingCollapsedChildModel !== null) {
            vChildren.push(ioDrawer({
                orientation: orientation,
                direction: 'leading',
                parent: this,
                model: this.leadingCollapsedChildModel,
                elements: this.elements,
            }));
        }
        if (this.trailingCollapsedChildModel !== null) {
            vChildren.push(ioDrawer({
                orientation: orientation,
                direction: 'trailing',
                parent: this,
                model: this.trailingCollapsedChildModel,
                elements: this.elements,
            }));
        }
        this.render(vChildren);
    }
};
__decorate([
    Property({ type: Object })
], IoSplit.prototype, "model", void 0);
__decorate([
    Property(Array)
], IoSplit.prototype, "elements", void 0);
__decorate([
    Property({ type: Object, value: null })
], IoSplit.prototype, "leadingCollapsedChildModel", void 0);
__decorate([
    Property({ type: Object, value: null })
], IoSplit.prototype, "trailingCollapsedChildModel", void 0);
__decorate([
    Property({ type: Boolean, value: true, reflect: true })
], IoSplit.prototype, "hasVisibleAutoSize", void 0);
__decorate([
    Property({ type: Boolean, value: false, reflect: true })
], IoSplit.prototype, "showVeil", void 0);
IoSplit = __decorate([
    Register
], IoSplit);
export { IoSplit };
export const ioSplit = function (arg0) {
    return IoSplit.vConstructor(arg0);
};
