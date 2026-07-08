var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, Property, ReactiveElement, IoOverlaySingleton as Overlay, ThemeSingleton } from '@io-gui/core';
import { Split } from '../models/Split.js';
import { Panel } from '../models/Panel.js';
import { ioSplit } from './IoSplit.js';
import { ioPanel } from './IoPanel.js';
import { IoMenu, Menu } from '@io-gui/menus';
import { Tab } from '../models/Tab.js';
import { IoTabDragGhost } from './IoTabDragGhost.js';
import { resolveDropIndex, resolveSplitEdge } from '../utils/dropZone.js';
let IoLayout = class IoLayout extends ReactiveElement {
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
    `;
    }
    _targetPanelModel = null;
    _dropTarget = null;
    static get Listeners() {
        return {
            'io-add-tab-request': 'onAddTabRequest',
            'io-tab-drag': 'onTabDrag',
        };
    }
    constructor(args) {
        super(args);
        Overlay.appendChild(this.$addMenu);
        Overlay.appendChild(this.$tabDragGhost);
    }
    onAddTabRequest(event) {
        event.stopPropagation();
        this._targetPanelModel = event.detail.model;
        const rect = event.target.getBoundingClientRect();
        this.$addMenu.style.right = `${window.innerWidth - rect.right}px`;
        this.$addMenu.style.top = `${rect.top + ThemeSingleton.fieldHeight}px`;
        this.$addMenu.expanded = true;
        this.$addMenu.focusFirstOption();
    }
    addTab(element) {
        if (this._targetPanelModel) {
            this._targetPanelModel.addTab(new Tab({
                id: element.props?.id,
                label: element.props?.label || '',
                icon: element.props?.icon || '',
            }));
            this._targetPanelModel = null;
        }
    }
    onTabDrag(event) {
        event.stopPropagation();
        const tabModel = event.detail.model;
        const phase = event.detail.phase;
        if (phase === 'start') {
            this.$tabDragGhost.model = tabModel;
            this.$tabDragGhost.style.left = `${event.detail.x}px`;
            this.$tabDragGhost.style.top = `${event.detail.y}px`;
            this.$tabDragGhost.expanded = true;
        }
        else if (phase === 'move') {
            this._dropTarget = this.getDropTarget(event.detail.x, event.detail.y);
            this.$tabDragGhost.setDropTarget(this._dropTarget);
            this.$tabDragGhost.style.left = `${event.detail.x}px`;
            this.$tabDragGhost.style.top = `${event.detail.y}px`;
        }
        else if (phase === 'end') {
            if (this._dropTarget) {
                this.model.moveTab(tabModel, this._dropTarget.panel.model, this._dropTarget.splitDirection, this._dropTarget.dropIndex);
            }
            this._dropTarget = null;
            this.$tabDragGhost.expanded = false;
            this.$tabDragGhost.style.left = '0px';
            this.$tabDragGhost.style.top = '0px';
            this.$tabDragGhost.setDropTarget(null);
        }
    }
    getDropTarget(x, y) {
        const panels = [...this.querySelectorAll('io-panel')];
        for (const panel of panels) {
            const panelRect = panel.getBoundingClientRect();
            if (x > panelRect.left && x < panelRect.right && y > panelRect.top && y < panelRect.bottom) {
                const tabs = [...panel.querySelectorAll('io-tab')];
                const tabRects = tabs.map(tab => tab.getBoundingClientRect());
                let dropIndex = tabs.length;
                let splitDirection = resolveSplitEdge(x, y, panelRect, tabRects);
                const dropSelfSingle = (panel.model.tabs.length === 1) && (panel.model.tabs[0].id === this.$tabDragGhost.model.id);
                if (dropSelfSingle) {
                    splitDirection = 'center';
                    dropIndex = 0;
                }
                else if (tabRects.length > 0) {
                    const duplicateTabIndex = tabs.findIndex(tab => tab.model.id === this.$tabDragGhost.model.id);
                    if (duplicateTabIndex !== -1) {
                        dropIndex = duplicateTabIndex;
                        splitDirection = 'center';
                    }
                    const pickedTabIndex = resolveDropIndex(x, y, tabRects);
                    if (pickedTabIndex !== -1) {
                        dropIndex = pickedTabIndex;
                        splitDirection = 'center';
                    }
                }
                return {
                    panel: panel,
                    panelRect: panelRect,
                    tabs: tabs,
                    tabRects: tabRects,
                    dropIndex: dropIndex,
                    splitDirection: splitDirection,
                };
            }
        }
        return null;
    }
    modelMutated() {
        this.mutated();
    }
    elementsChanged() {
        this.elementsMutated();
    }
    elementsMutated() {
        // TODO: Improve once Menu models have better (de)serialization
        this.$addMenu.model = new Menu({
            id: 'root',
            options: this.elements.map(element => ({
                id: element.props?.id,
                label: element.props?.label || element.props?.id,
                icon: element.props?.icon || '',
                action: this.addTab.bind(this, element),
            })),
        });
    }
    mutated() {
        const child = this.model.child;
        if (child instanceof Split) {
            this.render([
                ioSplit({
                    model: child,
                    elements: this.elements,
                }),
            ]);
        }
        else if (child instanceof Panel) {
            this.render([
                ioPanel({
                    model: child,
                    elements: this.elements,
                }),
            ]);
        }
    }
    dispose() {
        Overlay.removeChild(this.$addMenu);
        Overlay.removeChild(this.$tabDragGhost);
        this.$addMenu.dispose();
        this.$tabDragGhost.dispose();
        super.dispose();
    }
};
__decorate([
    Property({ type: Object })
], IoLayout.prototype, "model", void 0);
__decorate([
    Property(Array)
], IoLayout.prototype, "elements", void 0);
__decorate([
    Property({ type: IoMenu, init: null })
], IoLayout.prototype, "$addMenu", void 0);
__decorate([
    Property({ type: IoTabDragGhost, init: null })
], IoLayout.prototype, "$tabDragGhost", void 0);
IoLayout = __decorate([
    Register
], IoLayout);
export { IoLayout };
export const ioLayout = function (arg0) {
    return IoLayout.vConstructor(arg0);
};
