import { RegisterIoElement } from '../../core/element.js';
import {IoSelectorSidebar} from '../layout/io-selector-sidebar.js';
import './io-md-view.js';

@RegisterIoElement
export class IoMdViewSelector extends IoSelectorSidebar  {
  static get Properties(): any {
    return {
      sanitize: true,
      anchor: '',
      src: '',
    };
  }
  changed() {
    this.template([
      this.getSlotted(),
      ['io-md-view', {id: 'content', sanitize: this.sanitize, src: this.src, anchor: this.anchor}],
    ]);
  }
}