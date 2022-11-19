import { RegisterIoElement } from '../../core/element.js';
import './io-md-view.js';
import {IoSelectorSidebar} from '../layout/io-selector-sidebar.js';

/*

 **/
@RegisterIoElement
export class IoMdViewSelector extends IoSelectorSidebar  {
  static get Properties(): any {
    return {
      sanitize: true,
    };
  }
  update() {
    this.template([
      this.getSlotted(),
      ['io-md-view', {id: 'content', class: 'io-content', sanitize: this.sanitize, path: this._selectedID}],
    ]);
  }
}