var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { RegisterIoElement } from '../../core/element.js';
import './md-view.js';
import { IoSelectorSidebar } from '../layout/selector-sidebar.js';
/*

 **/
let IoMdViewSelector = class IoMdViewSelector extends IoSelectorSidebar {
    static get Properties() {
        return {
            sanitize: true,
        };
    }
    update() {
        this.template([
            this.getSlotted(),
            ['io-md-view', { id: 'content', class: 'io-content', sanitize: this.sanitize, path: this._selectedID }],
        ]);
    }
};
IoMdViewSelector = __decorate([
    RegisterIoElement
], IoMdViewSelector);
export { IoMdViewSelector };
//# sourceMappingURL=md-view-selector.js.map