import {RegisterIoElement} from '../../iogui.js';
import './md-view.js';
import {IoSelectorSidebar} from '../layout/selector-sidebar.js';

/*

 **/

export class IoMdViewSelector extends IoSelectorSidebar  {
  update() {
    this.template([
      this.getSlotted(),
      ['io-md-view', {id: 'content', class: 'io-content', path: this._selectedID}],
    ]);
  }
}

RegisterIoElement(IoMdViewSelector);