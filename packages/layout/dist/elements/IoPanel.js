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
      }
    `;
    }
    static get Listeners() {
        return {
            'io-tab-action': 'onTabAction',
        };
    }
    get layout() {
        return this.closest('io-layout').layout;
    }
    onTabAction(event) {
        event.stopPropagation();
        const tab = event.detail.tab;
        const action = event.detail.action;
        switch (action) {
            case 'Select': {
                this.selectTab(tab);
                break;
            }
            // case 'Backspace': {
            //   this.removeTab(tab)
            //   break
            // }
            // case 'ArrowLeft': {
            //   this.moveTab(tab, index - 1)
            //   break
            // }
            // case 'ArrowRight': {
            //   this.moveTab(tab, index + 1)
            //   break
            // }
        }
    }
    selectTab(tab) {
        const index = this.panel.tabs.indexOf(tab);
        this.panel.setSelected(tab.id);
        this.debounce(this.focusTabDebounced, index);
    }
    // moveTabToSplit(sourcePanel: IoPanel, tab: Tab, direction: SplitDirection) {
    //   const layout = this.layout
    //   if (direction === 'center') {
    //     sourcePanel.panel.removeTab(tab)
    //     this.panel.addTab(tab)
    //   } else if (layout) {
    //     layout.moveTab(tab, this.panel, direction, sourcePanel.panel)
    //   }
    // }
    // addTab(tab: Tab, index?: number) {
    //   this.panel.addTab(tab, index)
    //   this.debounce(this.focusTabDebounced as CallbackFunction, this.panel.tabs.indexOf(tab))
    // }
    // removeTab(tab: Tab) {
    //   const index = this.panel.tabs.indexOf(tab)
    //   this.panel.removeTab(tab)
    //   if (this.panel.tabs.length > 0) {
    //     this.debounce(this.focusTabDebounced as CallbackFunction, Math.min(index, this.panel.tabs.length - 1))
    //   }
    // }
    // moveTab(tab: Tab, index: number) {
    //   this.panel.moveTab(tab, index)
    //   this.debounce(this.focusTabDebounced as CallbackFunction, this.panel.tabs.indexOf(tab))
    // }
    focusTabDebounced(index) {
        const tabs = Array.from(this.querySelectorAll('io-tab'));
        index = Math.min(index, tabs.length - 1);
        if (tabs[index])
            tabs[index].focus();
    }
    panelMutated() {
        this.debounce(this.mutated);
    }
    mutated() {
        this.render([
            ioTabs({
                tabs: this.panel.tabs,
            }),
            ioSelector({
                // TODO: Make caching work with mutable elements
                // caching: 'reactive',
                caching: 'none',
                selected: this.panel.getSelected(),
                elements: this.elements,
                anchor: '',
            })
        ]);
    }
};
__decorate([
    Property({ type: Object })
], IoPanel.prototype, "panel", void 0);
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
