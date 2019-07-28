import {IoElement, html} from "../../dist/io.js";
import {TodoModel} from "./todo-model.js";

export class TodoList extends IoElement {
  static get Style() {
    return html`<style>
    :host {
      display: block;
    }
    :host .main {
      position: relative;
      z-index: 2;
      border-top: 1px solid #e6e6e6;
    }

    :host label[for='toggle-all'] {
      display: none;
    }

    :host .toggle-all {
      position: absolute;
      top: -55px;
      left: -12px;
      width: 60px;
      height: 34px;
      text-align: center;
      border: none; /* Mobile Safari */
    }

    :host .toggle-all:before {
      content: '❯';
      font-size: 22px;
      color: #e6e6e6;
      padding: 10px 27px 10px 27px;
    }

    :host .toggle-all:checked:before {
      color: #737373;
    }

    :host .todo-list {
      margin: 0;
      padding: 0;
      list-style: none;
    }

    /*
      Hack to remove background from Mobile Safari.
      Can't use it globally since it destroys checkboxes in Firefox
    */
    @media screen and (-webkit-min-device-pixel-ratio:0) {
      :host .toggle-all {
        background: none;
      }
      :host .toggle-all {
        -webkit-transform: rotate(90deg);
        transform: rotate(90deg);
        -webkit-appearance: none;
        appearance: none;
      }
    }

    </style>`;
  }
  static get Properties() {
    return {
      model: TodoModel,
      route: 'all',
      class: 'todo-list',
    };
  }
  changed() {
    const itemCount = this.model.items.length;
    const completedCount = this.model.getCompletedCount();
    const allCompleted = itemCount === completedCount;
    const items = this.model.items.filter(this.model.filters[this.route]);

    this.template([
      ['section', {class: 'main'}, [
        ['input', {type: 'checkbox', class: 'toggle-all', checked: allCompleted, 'on-click': this.model._toggleItemsCompleted}],
        ['ul', {class: 'todo-list'}, [
          items.map((item, i) => ['todo-item', {item: item, model: this.model}])
        ]]
      ]],
    ]);
  }
}

TodoList.Register();
