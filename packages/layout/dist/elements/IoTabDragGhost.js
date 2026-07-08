var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Property, ReactiveElement, Register, ThemeSingleton, div } from '@io-gui/core';
import { Tab } from '../models/Tab.js';
import { ioTab } from './IoTab.js';
const SPLIT_MARKER_SIZE = 120; // pixels
let IoTabDragGhost = class IoTabDragGhost extends ReactiveElement {
    static get Style() {
        return /* css */ `
      :host {
        display: none;
        background-color: transparent;
        box-shadow: none;
      }
      :host[expanded] {
        display: block;
      }
      :host > io-tab {
        transform: translate(-50%, -50%);
        box-shadow: var(--io_shadow);
      }
      :host > #drop-marker {
        position: fixed;
        display: flex;
        flex-direction: column;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0.5;
      }
      :host > #drop-marker > #drop-marker-tabs {
        flex: 0 1 auto;
        overflow: hidden;
      }
      :host:not([splitDirection="center"]) > #drop-marker > #drop-marker-tabs {
        display: none;
      }
      :host > #drop-marker > #drop-marker-tabs > #drop-marker-tab {
        width: 200px;
        height: calc(var(--io_fieldHeight) * 1.25);
        margin-top: var(--io_spacing);
        margin-bottom: calc(var(--io_spacing) * -1);
        background-color: var(--io_bgColorStrong);
        border-radius: var(--io_borderRadius) var(--io_borderRadius) 0 0;
      }
      :host > #drop-marker > #drop-marker-content {
        flex: 1 1 0;
        background-color: var(--io_bgColorStrong);
      }
    `;
    }
    constructor(args) {
        super(args);
        this.modelChanged();
    }
    setDropTarget(target) {
        if (target) {
            this.splitDirection = target.splitDirection;
            if (target.splitDirection !== 'center') {
                const splitMarkerHeight = Math.min(target.panelRect.height * 0.5, SPLIT_MARKER_SIZE);
                const splitMarkerWidth = Math.min(target.panelRect.width * 0.5, SPLIT_MARKER_SIZE);
                if (target.splitDirection === 'top') {
                    this.$['drop-marker'].style.left = `${target.panelRect.left}px`;
                    this.$['drop-marker'].style.top = `${target.panelRect.top}px`;
                    this.$['drop-marker'].style.width = `${target.panelRect.width}px`;
                    this.$['drop-marker'].style.height = `${splitMarkerHeight}px`;
                    return;
                }
                else if (target.splitDirection === 'bottom') {
                    this.$['drop-marker'].style.left = `${target.panelRect.left}px`;
                    this.$['drop-marker'].style.top = `${target.panelRect.top + target.panelRect.height - splitMarkerHeight}px`;
                    this.$['drop-marker'].style.width = `${target.panelRect.width}px`;
                    this.$['drop-marker'].style.height = `${splitMarkerHeight}px`;
                    return;
                }
                else if (target.splitDirection === 'left') {
                    this.$['drop-marker'].style.left = `${target.panelRect.left}px`;
                    this.$['drop-marker'].style.top = `${target.panelRect.top}px`;
                    this.$['drop-marker'].style.width = `${splitMarkerWidth}px`;
                    this.$['drop-marker'].style.height = `${target.panelRect.height}px`;
                    return;
                }
                else if (target.splitDirection === 'right') {
                    this.$['drop-marker'].style.left = `${target.panelRect.left + target.panelRect.width - splitMarkerWidth}px`;
                    this.$['drop-marker'].style.top = `${target.panelRect.top}px`;
                    this.$['drop-marker'].style.width = `${splitMarkerWidth}px`;
                    this.$['drop-marker'].style.height = `${target.panelRect.height}px`;
                    return;
                }
            }
            const tabInsertMarkerRect = this.$['tab-ghost'].getBoundingClientRect();
            let tabInsertMarkerWidth = tabInsertMarkerRect.width;
            let tabInsertMarkerOffset = 0;
            if (target.dropIndex > -1 && target.dropIndex < target.tabRects.length) {
                const tabRect = target.tabRects[target.dropIndex];
                tabInsertMarkerWidth = tabRect.width;
                tabInsertMarkerOffset = tabRect.left - target.panelRect.left;
            }
            else if (target.dropIndex === target.tabRects.length) {
                const lastTabRect = target.tabRects[target.tabRects.length - 1];
                const lastRectOffset = lastTabRect.right - target.panelRect.left;
                tabInsertMarkerOffset = lastRectOffset + ThemeSingleton.spacing;
            }
            this.$['drop-marker'].style.display = 'flex';
            this.$['drop-marker'].style.left = `${target.panelRect.left}px`;
            this.$['drop-marker'].style.top = `${target.panelRect.top}px`;
            this.$['drop-marker'].style.width = `${target.panelRect.width}px`;
            this.$['drop-marker'].style.height = `${target.panelRect.height}px`;
            this.$['drop-marker-tab'].style.width = `${tabInsertMarkerWidth}px`;
            this.$['drop-marker-tab'].style.marginLeft = `${tabInsertMarkerOffset}px`;
        }
        else {
            this.splitDirection = 'center';
            this.$['drop-marker'].style.display = 'none';
            this.$['drop-marker'].style.left = '0px';
            this.$['drop-marker'].style.top = '0px';
            this.$['drop-marker'].style.width = '100%';
            this.$['drop-marker'].style.height = '100%';
            this.$['drop-marker-tab'].style.width = '0px';
            this.$['drop-marker-tab'].style.marginLeft = `${ThemeSingleton.spacing}px`;
        }
    }
    modelChanged() {
        this.render([
            ioTab({ id: 'tab-ghost', model: this.model }),
            div({ id: 'drop-marker' }, [
                div({ id: 'drop-marker-tabs' }, [
                    div({ id: 'drop-marker-tab' }),
                ]),
                div({ id: 'drop-marker-content' })
            ])
        ]);
    }
};
__decorate([
    Property({ type: Tab, init: { id: 'dummy' } })
], IoTabDragGhost.prototype, "model", void 0);
__decorate([
    Property({ type: String, value: 'none', reflect: true })
], IoTabDragGhost.prototype, "splitDirection", void 0);
__decorate([
    Property({ type: Number, value: -1, reflect: true })
], IoTabDragGhost.prototype, "dropIndex", void 0);
__decorate([
    Property({ type: Boolean, reflect: true })
], IoTabDragGhost.prototype, "expanded", void 0);
IoTabDragGhost = __decorate([
    Register
], IoTabDragGhost);
export { IoTabDragGhost };
