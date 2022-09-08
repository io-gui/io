import { RegisterIoElement } from '../../iogui.js';
import './md-view.js';
import { IoSelectorSidebar } from '../layout/selector-sidebar.js';
/*

 **/
export class IoMdViewSelector extends IoSelectorSidebar {
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
}
RegisterIoElement(IoMdViewSelector);
//# sourceMappingURL=md-view-selector.js.map