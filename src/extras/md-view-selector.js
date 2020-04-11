import './md-view.js';
import {IoSelectorSidebar} from '../io-elements.js';

export class IoMdViewSelector extends IoSelectorSidebar  {
  update() {
    this.template([
      this.getSlotted(),
      ['io-md-view', {id: 'content', class: 'io-content', path: this._selectedID}],
    ]);
  }
}

IoMdViewSelector.Register();