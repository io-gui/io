var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, ReactiveElement, Property } from '@io-gui/core';
import { ioSelector } from '@io-gui/navigation';
import { ioTabs } from './IoTabs.js';
let IoPanel = class IoPanel extends ReactiveElement {
    static get Style() {
        return /* css */ `
      :host {
        display: flex;
        overflow: hidden;
        flex-direction: column;
        flex: 1 1 auto;
        background-color: var(--io_bgColor);
      }
    `;
    }
    static get Listeners() {
        return {
            'io-tab-action': 'onTabAction',
            'io-add-tab-clicked': 'onAddTabClicked',
            'io-panel-tab-selected': 'onPanelTabSelected'
        };
    }
    onTabAction(event) {
        event.stopPropagation();
        const tabModel = event.detail.model;
        const action = event.detail.action;
        const index = this.model.tabs.indexOf(tabModel);
        if (index === -1)
            return;
        switch (action) {
            case 'select': {
                this.model.selectByIndex(index);
                break;
            }
            case 'delete': {
                this.model.removeTab(tabModel);
                break;
            }
            case 'move-left': {
                this.model.moveTab(tabModel, index - 1);
                break;
            }
            case 'move-right': {
                this.model.moveTab(tabModel, index + 1);
                break;
            }
            case 'move-start': {
                this.model.moveTab(tabModel, 0);
                break;
            }
            case 'move-end': {
                this.model.moveTab(tabModel, this.model.tabs.length - 1);
                break;
            }
        }
    }
    onPanelTabSelected(event) {
        event.stopPropagation();
        this.debounce(this.focusTabDebounced, event.detail.index);
    }
    onAddTabClicked(event) {
        event.stopPropagation();
        this.dispatch('io-add-tab-request', { model: this.model }, true);
    }
    focusTabDebounced(index) {
        const tabs = Array.from(this.querySelectorAll('io-tab'));
        index = Math.min(index, tabs.length - 1);
        if (tabs[index])
            tabs[index].focus();
    }
    modelMutated() {
        this.debounce(this.mutated);
    }
    mutated() {
        this.render([
            ioTabs({
                tabs: this.model.tabs,
            }),
            ioSelector({
                // TODO: Investigate caching for edge cases
                caching: 'reactive',
                selected: this.model.selectedID,
                elements: this.elements,
                anchor: '',
            })
        ]);
    }
};
__decorate([
    Property({ type: Object })
], IoPanel.prototype, "model", void 0);
__decorate([
    Property(Array)
], IoPanel.prototype, "elements", void 0);
IoPanel = __decorate([
    Register
], IoPanel);
export { IoPanel };
export const ioPanel = function (arg0) {
    return IoPanel.vConstructor(arg0);
};
