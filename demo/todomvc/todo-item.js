import {IoElement, html} from "../../dist/io.js";

const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

export class TodoItem extends IoElement {
  static get Style() {
    return html`<style>
    :host li {
      position: relative;
      font-size: 24px;
      border-bottom: 1px solid #ededed;
    }

    :host li:last-child {
      border-bottom: none;
    }

    :host li.editing {
      border-bottom: none;
      padding: 0;
    }

    :host li.editing button,
    :host li.editing label,
    :host li.editing .toggle{
      display: none;
    }

    :host li.editing .edit {
      display: block;
      width: 506px;
      padding: 12px 16px;
      margin: 0 0 0 43px;
    }

    :host li input.toggle {
      text-align: center;
      width: 40px;
      /* auto, since non-WebKit browsers doesn't support input styling */
      height: auto;
      position: absolute;
      top: 0;
      bottom: 0;
      margin: auto 0;
      border: none; /* Mobile Safari */
      -webkit-appearance: none;
      appearance: none;
    }

    :host li .toggle:after {
      content: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-10 -18 100 135"><circle cx="50" cy="50" r="50" fill="none" stroke="%23ededed" stroke-width="3"/></svg>');
    }

    :host li .toggle:checked:after {
      content: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-10 -18 100 135"><circle cx="50" cy="50" r="50" fill="none" stroke="%23bddad5" stroke-width="3"/><path fill="%235dc2af" d="M72 25L42 71 27 56l-4 4 20 20 34-52z"/></svg>');
    }

    :host li label {
      white-space: pre-line;
      word-break: break-all;
      padding: 15px 60px 15px 15px;
      margin-left: 45px;
      display: block;
      line-height: 1.2;
      transition: color 0.4s;
    }

    :host li.completed label {
      color: #d9d9d9;
      text-decoration: line-through;
    }

    :host li .destroy {
      display: none;
      position: absolute;
      top: 0;
      right: 10px;
      bottom: 0;
      width: 40px;
      height: 40px;
      margin: auto 0;
      font-size: 30px;
      color: #cc9a9a;
      margin-bottom: 11px;
      transition: color 0.2s ease-out;
    }

    :host li .destroy:hover {
      color: #af5b5e;
    }

    :host li .destroy:after {
      content: '×';
    }

    :host li:hover .destroy {
      display: block;
    }

    :host li .edit {
      display: none;
    }

    :host li.editing:last-child {
      margin-bottom: -1px;
    }

    :host li .edit {
      position: relative;
      margin: 0;
      width: 100%;
      font-size: 24px;
      font-family: inherit;
      font-weight: inherit;
      line-height: 1.4em;
      border: 0;
      outline: none;
      color: inherit;
      padding: 6px;
      border: 1px solid #999;
      box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);
      box-sizing: border-box;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /*
      Hack to remove background from Mobile Safari.
      Can't use it globally since it destroys checkboxes in Firefox
    */
    @media screen and (-webkit-min-device-pixel-ratio:0) {
      :host li input.toggle {
        background: none;
      }
      :host li input.toggle {
        height: 40px;
      }
    }
    </style>`;
  }
  static get Properties() {
    return {
      item: Object,
      model: Object,
      editing: false
    };
  }
  changed() {
    this.template([
      ['li', {class: (this.item.completed ? 'completed' : '') + (this.editing ? ' editing' : '')}, [
        ['input', {type: 'checkbox', class: 'toggle', checked: this.item.completed, 'on-click': this.onToggleItem}],
        ['label', {'on-dblclick': this.onStartEdit}, this.item.title],
        ['button', {class: 'destroy', 'on-click': this.onDestroyItem}],
        this.editing ? ['input', {id: 'input', class: 'edit', value: this.item.title, 'on-blur': this.onEndEdit, 'on-keyup': this.onInputKey}] : null
      ]]
    ]);
  }
  onDestroyItem() {
    this.model.destroyItem(this.item);
  }
  onToggleItem() {
    this.model.toggleItem(this.item);
  }
  onStartEdit() {
    this.editing = true;
    this.querySelector('input.edit').focus();
  }
  onEndEdit() {
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
