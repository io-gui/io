var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, IoElement, ReactiveProperty, Property } from '@io-gui/core';
import { ioSelector } from '@io-gui/navigation';
import { MenuOption } from '@io-gui/menus';
import { ioTabs } from './IoTabs.js';
import { Tab } from '../nodes/Tab.js';
import { IoLayout } from './IoLayout.js';
let IoPanel = class IoPanel extends IoElement {
    static get Style() {
        return /* css */ `
      :host {
        display: flex;
        overflow: hidden;
        flex-direction: column;
        flex: 1 1 auto;
        background-color: var(--io_bgColorLight);
      }
      :host > io-selector {
        margin-top: calc(-1 * var(--io_borderWidth));
        border-top: var(--io_border);
        border-top-color: var(--io_borderColorStrong);
      }
    `;
    }
    static get Listeners() {
        return {
            'io-edit-tab': 'onEditTab',
        };
    }
    onEditTab(event) {
        event.stopPropagation();
        const tab = event.detail.tab;
        const key = event.detail.key;
        const index = this.panel.tabs.indexOf(tab);
        if (index === -1) {
            debug: console.warn('IoTabs:Tab not found in panel', tab);
            return;
        }
        switch (key) {
            case 'Select': {
                this.selectTab(tab);
                break;
            }
            case 'Backspace': {
                this.removeTab(tab);
                break;
            }
            case 'ArrowLeft': {
                this.moveTab(tab, index - 1);
                break;
            }
            case 'ArrowRight': {
                this.moveTab(tab, index + 1);
                break;
            }
        }
    }
    onNewTabClicked(event) {
        event.stopPropagation();
        const option = event.detail.option;
        if (option.id && option.options.length === 0) {
            const tab = new Tab({ id: option.id, label: option.label, icon: option.icon });
            this.addTab(tab);
            const addMenuOption = this.querySelector('.add-tab');
            if (addMenuOption)
                addMenuOption.expanded = false;
        }
    }
    selectIndex(index) {
        index = Math.min(index, this.panel.tabs.length - 1);
        this.panel.setSelected(this.panel.tabs[index].id);
        this.debounce(this.focusTabDebounced, index);
    }
    selectTab(tab) {
        const index = this.panel.tabs.indexOf(tab);
        this.panel.setSelected(tab.id);
        this.debounce(this.focusTabDebounced, index);
    }
    moveTabToSplit(sourcePanel, tab, direction) {
        const parentSplit = this.parentElement;
        if (direction === 'center') {
            sourcePanel.removeTab(tab);
            this.addTab(tab);
        }
        else {
            parentSplit.moveTabToSplit(sourcePanel, this.panel, tab, direction);
        }
    }
    addTab(tab, index) {
        const existingIndex = this.panel.tabs.findIndex(t => t.id === tab.id);
        if (existingIndex !== -1) {
            console.warn(`IoPanel.addTab: Duplicate tab id "${tab.id}", removing duplicate tab.`);
            this.panel.tabs.splice(existingIndex, 1);
        }
        index = index ?? this.panel.tabs.length;
        index = Math.min(index, this.panel.tabs.length);
        this.panel.tabs.splice(index, 0, tab);
        this.selectIndex(index);
    }
    removeTab(tab) {
        const index = this.panel.tabs.indexOf(tab);
        this.panel.tabs.splice(index, 1);
        if (this.panel.tabs.length > 0) {
            const newIndex = Math.min(index, this.panel.tabs.length - 1);
            this.selectIndex(newIndex);
        }
        else {
            const parentSplit = this.parentElement;
            const isRootPanel = parentSplit.parentElement instanceof IoLayout &&
                parentSplit.split.children.length === 1;
            // If this is the last panel at root level, don't remove
            if (!isRootPanel) {
                this.dispatch('io-panel-remove', { panel: this.panel }, true);
            }
        }
    }
    moveTab(tab, index) {
        index = Math.max(Math.min(index, this.panel.tabs.length - 1), 0);
        const currIndex = this.panel.tabs.findIndex(t => t.id === tab.id);
        this.panel.tabs.splice(currIndex, 1);
        index = Math.min(index, this.panel.tabs.length);
        this.panel.tabs.splice(index, 0, tab);
        this.selectIndex(index);
    }
    focusTabDebounced(index) {
        const tabs = Array.from(this.querySelectorAll('io-tab'));
        index = Math.min(index, tabs.length - 1);
        if (tabs[index])
            tabs[index].focus();
    }
    panelMutated() {
        this.debounce(this.changed);
    }
    getAddMenuOption() {
        if (this.addMenuOption && this.addMenuOption.options?.length > 0) {
            return this.addMenuOption;
        }
        if (!this.elements || this.elements.length === 0)
            return undefined;
        const existingTabIds = new Set(this.panel.tabs.map(tab => tab.id));
        const options = this.elements
            .filter(el => el.props?.id && !existingTabIds.has(el.props.id))
            .map(el => new MenuOption({
            id: el.props.id,
            label: el.props.label ?? el.props.id,
            icon: el.props.icon ?? '',
        }));
        if (options.length === 0)
            return undefined;
        return new MenuOption({ options });
    }
    changed() {
        this.render([
            ioTabs({
                tabs: this.panel.tabs,
                addMenuOption: this.getAddMenuOption(),
                '@io-menu-option-clicked': this.onNewTabClicked,
            }),
            ioSelector({
                selected: this.panel.getSelected(),
                elements: this.elements,
                anchor: '',
            })
        ]);
    }
};
__decorate([
    ReactiveProperty({ type: Object })
], IoPanel.prototype, "panel", void 0);
__decorate([
    ReactiveProperty(Array)
], IoPanel.prototype, "elements", void 0);
__decorate([
    Property({ type: MenuOption })
], IoPanel.prototype, "addMenuOption", void 0);
IoPanel = __decorate([
    Register
], IoPanel);
export { IoPanel };
export const ioPanel = function (arg0) {
    return IoPanel.vConstructor(arg0);
};
//# sourceMappingURL=IoPanel.js.map