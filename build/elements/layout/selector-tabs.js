var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { RegisterIoElement } from '../../core/element.js';
import { IoSelector } from './selector.js';
/*
 * Extends `IoSelector`. Implements `IoMenuOptions`.
 *
 * Element selector with selectable tabs interfce.
 *
 * <io-element-demo element="io-selector-tabs"
 *     properties='{
 *         "elements": [
 *             ["div", {"name": "first"}, "First content"],
 *             ["div", {"name": "second"}, "Second content"],
 *             ["div", {"name": "third"}, "Third content"],
 *             ["div", {"name": "fourth"}, "Fourth content"],
 *             ["div", {"name": "fifth"}, "Fifth content"],
 *             ["div", {"name": "sixth"}, "Sixth content"]],
 *         "selected": "first",
 *         "cache": false,
 *         "options": [
 *             "first",
 *             "second",
 *             "third",
 *             "fourth",
 *             {"label" : "more", "options": ["fifth", "sixth"]}]}'
 *     config='{"options": ["io-properties"]}'>
 * </io-element-demo>
 **/
let IoSelectorTabs = class IoSelectorTabs extends IoSelector {
    static get Style() {
        return /* css */ `
    :host > io-menu-options {
      flex: 0 0 auto;
      border: none;
      border-radius: 0;
      background-color: var(--io-background-color-dark);
      border: var(--io-border);
      border-width: 0 0 var(--io-border-width) 0;
    }
    `;
    }
    static get Properties() {
        return {
            slotted: {
                type: Array,
                observe: true,
            },
            depth: Infinity,
        };
    }
    getSlotted() {
        return ['io-menu-options', {
                role: 'navigation',
                horizontal: true,
                // value: this.bind('selected'), // TODO: Does not exist
                options: this.options,
                depth: this.depth,
                slotted: this.slotted,
                // selectable: true, // TODO: Does not exist
            }];
    }
};
IoSelectorTabs = __decorate([
    RegisterIoElement
], IoSelectorTabs);
export { IoSelectorTabs };
//# sourceMappingURL=selector-tabs.js.map