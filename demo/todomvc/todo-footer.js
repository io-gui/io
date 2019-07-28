import {IoElement, html} from "../../dist/io.js";
import {TodoModel} from "./todo-model.js";

export class TodoFooter extends IoElement {
  static get Style() {
    return html`<style>
    :host {
      display: block;
      color: #777;
      padding: 10px 15px;
      height: 20px;
      text-align: center;
      border-top: 1px solid #e6e6e6;
    }
    :host .filters {
      margin: 0;
      padding: 0;
      list-style: none;
      position: absolute;
      right: 0;
      left: 0;
    }

    :host .filters a {
      color: inherit;
      margin: 3px;
      padding: 3px 7px;
      text-decoration: none;
      border: 1px solid transparent;
      border-radius: 3px;
      cursor: pointer;
    }

    :host .filters a.selected,
    :host .filters a:hover {
      border-color: rgba(175, 47, 47, 0.1);
    }

    :host .filters a.selected {
      border-color: rgba(175, 47, 47, 0.2);
    }
    :host .todo-count {
      float: left;
      text-align: left;
    }

    :host .todo-count strong {
      font-weight: 300;
    }

    :host .clear-completed,
    :host .clear-completed:active {
      float: right;
      position: relative;
      line-height: 20px;
      text-decoration: none;
      cursor: pointer;
    }

    :host .clear-completed:hover {
      text-decoration: underline;
    }
    :host:before {
      content: '';
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      height: 50px;
      overflow: hidden;
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2),
                  0 8px 0 -3px #f6f6f6,
                  0 9px 1px -3px rgba(0, 0, 0, 0.2),
                  0 16px 0 -6px #f6f6f6,
                  0 17px 2px -6px rgba(0, 0, 0, 0.2);
    }
    @media (max-width: 430px) {
      :host {
        height: 50px;
      }
      :host .filters {
        bottom: 10px;
      }
    }
    </style>`;
  }
  static get Properties() {
    return {
      model: TodoModel,
      route: 'all',
    };
  }
  _clear(event) {
    this.model.clearCompletedItems();
  }
  _setRoute(event) {
    this.route = event.target.innerText.toLowerCase();
  }
  changed() {
    const itemCount = this.model.items.length;
    const activeLeft = this.model.getActiveCount();
    const completedCount = this.model.getCompletedCount();
    this.template([
      ['span', {class: 'todo-count'}, String(activeLeft) + (activeLeft === 1 ? ' item' : ' items') + ' left'],
      ['div', {class: 'filters'}, [
        ['a', {'on-click': this._setRoute, class: this.route === 'all' ? 'selected' : ''}, 'All'],
        ['a', {'on-click': this._setRoute, class: this.route === 'active' ? 'selected' : ''}, 'Active'],
        ['a', {'on-click': this._setRoute, class: this.route === 'completed' ? 'selected' : ''}, 'Completed']
      ]],
      completedCount? ['button', {class: 'clear-completed', 'on-click': this._clear}, 'Clear completed'] : null
    ]);
  }
}

TodoFooter.Register();
