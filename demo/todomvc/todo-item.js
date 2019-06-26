import {IoElement} from "../../build/io.min.js";

const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

export class TodoItem extends IoElement {
  static get properties() {
    return {
      item: Object,
      model: Object,
      editing: false
    };
  }
  changed() {
    this.template([
      ['li', {class: (this.item.completed ? 'completed' : '') + (this.editing ? ' editing' : '')}, [
        ['input', {type: 'checkbox', class: 'toggle', checked: this.item.completed, 'on-click': this.toggleItem}],
        ['label', {'on-dblclick': this.startEdit}, this.item.title],
        ['button', {class: 'destroy', 'on-click': this.destroyItem}],
        this.editing ? ['input', {id: 'input', class: 'edit', value: this.item.title, 'on-blur': this.endEdit, 'on-keyup': this.onInputKey}] : null
      ]]
    ]);
  }
  destroyItem() {
    this.model.destroyItem(this.item);
  }
  toggleItem() {
    this.model.toggleItem(this.item);
  }
  startEdit() {
    this.editing = true;
    this.querySelector('input.edit').focus();
  }
  endEdit() {
    this.model.updateItemTitle(this.item, this.querySelector('input.edit').value);
    this.editing = false;
  }
  onInputKey(event) {
    if (event.which === ENTER_KEY) {
      this.$.input.blur();
    }
    if (event.which === ESCAPE_KEY) {
      this.$.input.value = this.item.title;
      this.$.input.blur();
    }
  }
}

TodoItem.Register();
