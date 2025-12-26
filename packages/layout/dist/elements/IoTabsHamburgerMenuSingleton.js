var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IoOverlaySingleton, NodeArray, IoElement, Register, ReactiveProperty, nudge } from '@io-gui/core';
import { ioTab } from './IoTab.js';
let IoTabsHamburgerMenu = class IoTabsHamburgerMenu extends IoElement {
    static vConstructor;
    static get Style() {
        return /* css */ `
      :host {
        display: flex;
        flex-direction: column;
        border: var(--io_border);
        border-radius: calc(var(--io_borderRadius) + var(--io_spacing2));
        border-color: var(--io_borderColorOutset);
        background-color: var(--io_bgColorLight);
        padding: calc(var(--io_spacing) + var(--io_borderWidth));
        position: absolute;
        overflow-y: auto;
        box-shadow: 1px 1px 16px var(--io_shadowColor),
                    1px 1px 8px var(--io_shadowColor), 
                    1px 1px 4px var(--io_shadowColor);
      }
      :host:not([expanded]) {
        visibility: hidden;
        opacity: 0;
      }
      :host > io-tab {
        border-color: transparent !important;
        background-color: var(--io_bgColorLight) !important;
        border-radius: var(--io_borderRadius) !important;
      }
      :host > io-tab[selected] {
        background-color: var(--io_bgColor) !important;
      }
      :host > io-tab > .marker {
        border-radius: 0;
      }
    `;
    }
    static get Listeners() {
        return {
            'touchstart': ['stopPropagation', { passive: false }], // TODO: why?
            'io-focus-to': 'onIoFocusTo',
            'io-edit-tab': 'onEditTabCapture',
        };
    }
    constructor(args = {}) { super(args); }
    stopPropagation(event) {
        event.stopPropagation();
    }
    onIoFocusTo(event) {
        const source = event.detail.source;
        const cmd = event.detail.command;
        const siblings = Array.from(this.querySelectorAll('io-tab'));
        const index = siblings.indexOf(source);
        let cmdOverride = '';
        if (cmd === 'ArrowDown')
            cmdOverride = 'Next';
        if (cmd === 'ArrowUp')
            cmdOverride = 'Prev';
        if (cmd === 'ArrowLeft')
            cmdOverride = 'First';
        if (cmd === 'ArrowRight')
            cmdOverride = 'Last';
        if (cmdOverride) {
            if (cmdOverride === 'Next') {
                siblings[(index + 1) % siblings.length].focus();
            }
            else if (cmdOverride === 'Prev') {
                siblings[(index - 1 + siblings.length) % siblings.length].focus();
            }
            else if (cmdOverride === 'First') {
                siblings[0].focus();
            }
            else if (cmdOverride === 'Last') {
                siblings[siblings.length - 1].focus();
            }
            event.stopPropagation();
        }
    }
    onEditTabCapture(event) {
        event.stopPropagation();
        this.onEditTab(event);
        this.expanded = false;
    }
    expand(props) {
        this.setProperties({
            tabs: props.tabs,
            expanded: true,
        });
        this.onEditTab = props.onEditTab;
        nudge(this, props.source, props.direction);
        this.debounce(this.onExpand);
    }
    onExpand() {
        this.querySelector('[selected]')?.focus();
    }
    changed() {
        this.render([
            ...this.tabs.map(tab => ioTab({ tab: tab })),
        ]);
    }
};
__decorate([
    ReactiveProperty({ type: NodeArray, init: 'this' })
], IoTabsHamburgerMenu.prototype, "tabs", void 0);
__decorate([
    ReactiveProperty({ type: Boolean, reflect: true })
], IoTabsHamburgerMenu.prototype, "expanded", void 0);
IoTabsHamburgerMenu = __decorate([
    Register
], IoTabsHamburgerMenu);
export const IoTabsHamburgerMenuSingleton = new IoTabsHamburgerMenu();
setTimeout(() => {
    IoOverlaySingleton.appendChild(IoTabsHamburgerMenuSingleton);
}, 100);
//# sourceMappingURL=IoTabsHamburgerMenuSingleton.js.map