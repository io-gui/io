var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { RegisterIoElement } from '../../core/element.js';
import { IoSelector } from './selector.js';
import './sidebar.js';
/*
 * Extends `IoSelector`. Implements `IoSidebar`.
 *
 * Element selector with selectable sidebar interfce.
 *
 * <io-element-demo element="io-selector-sidebar"
 *     properties='{
 *         "elements": [
 *             ["div", {"name": "first"}, "First content"],
 *             ["div", {"name": "second"}, "Second content"],
 *             ["div", {"name": "third"}, "Third content"],
 *             ["div", {"name": "fourth"}, "Fourth content"]],
 *         "selected": "first",
 *         "cache": false,
 *         "options": [
 *             "first",
 *             "second",
 *             "third",
 *             "fourth"],
 *         "right": false,
 *         "collapseWidth": 410}'
 *     config='{"options": ["io-properties"]}'>
 * </io-element-demo>
 **/
let IoSelectorSidebar = class IoSelectorSidebar extends IoSelector {
    static get Style() {
        return /* css */ `
    :host {
      flex-direction: row;
    }
    :host[right] {
      flex-direction: row-reverse;
    }
    :host[collapsed] {
      flex-direction: column;
    }
    :host > io-sidebar {
      flex: 0 0 auto;
      background-color: var(--io-background-color-dark);
      border: var(--io-border);
      border-width: 0 var(--io-border-width) 0 0;
    }
    :host[right] > io-sidebar {
      border-width: 0 0 0 var(--io-border-width);
    }
    :host[collapsed] > io-sidebar {
      flex: 0 0 auto;
      border-width: 0 0 var(--io-border-width) 0;
    }
    `;
    }
    static get Properties() {
        return {
            collapseWidth: 410,
            collapsed: {
                type: Boolean,
                reflect: 'prop',
            },
            right: {
                type: Boolean,
                reflect: 'prop',
            },
        };
    }
    onResized() {
        this.collapsed = this.getBoundingClientRect().width < this.collapseWidth;
    }
    collapsedChanged() { this.update(); }
    getSlotted() {
        return ['io-sidebar', {
                selected: this.bind('selected'),
                options: this.options,
                collapsed: this.collapsed,
            }];
    }
};
IoSelectorSidebar = __decorate([
    RegisterIoElement
], IoSelectorSidebar);
export { IoSelectorSidebar };
//# sourceMappingURL=selector-sidebar.js.map