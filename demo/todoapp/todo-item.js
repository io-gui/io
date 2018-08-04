import {IoElement} from "../../build/io.js";

export class TodoItem extends IoElement {
  static get properties() {
    return {
      item: Object,
      model: Object
    };
  }
  changed() {
    this.template([
      ['input', {type: 'checkbox', className: 'toggle', checked: this.item.completed, 'on-click': this.toggleItem}],
      ['label', this.item.title],
      ['button', {className: 'destroy', 'on-click': this.destroyItem}] // TODO
    ]);
  }
  destroyItem() {
    this.model.destroyItem(this.item);
  }
  toggleItem() {
    this.model.toggleItem(this.item);
  }
}

TodoItem.Register();
