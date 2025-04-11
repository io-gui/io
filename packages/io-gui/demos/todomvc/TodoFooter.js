import { IoElement, Register, span, ul, li, a, button } from 'io-gui';
import {TodoModel} from './TodoModel.js';

export class TodoFooter extends IoElement {
  static get Style() {
    return /* css */`
      :host a {
        cursor: pointer;
      }
    `;
  }
  static get Properties() {
    return {
      model: {
        type: TodoModel,
      },
      route: 'all',
    };
  }
  _onClear() {
    this.model.clearCompletedItems();
  }
  _onSetRoute(event) {
    this.route = event.target.innerText.toLowerCase();
  }
  changed() {
    const activeLeft = this.model.getActiveCount();
    const completedCount = this.model.getCompletedCount();
    this.template([
      span({class: 'todo-count'}, String(activeLeft) + (activeLeft === 1 ? ' item' : ' items') + ' left'),
      ul({class: 'filters'}, [
        li([
          a({'@click': this._onSetRoute, class: this.route === 'all' ? 'selected' : ''}, 'All')
        ]),
        li([
          a({'@click': this._onSetRoute, class: this.route === 'active' ? 'selected' : ''}, 'Active')
        ]),
        li([
          a({'@click': this._onSetRoute, class: this.route === 'completed' ? 'selected' : ''}, 'Completed')
        ]),
      ]),
      completedCount ? button({class: 'clear-completed', '@click': this._onClear}, 'Clear completed') : null
    ]);
  }
}
Register(TodoFooter);
export const todoFooter = TodoFooter.vConstructor;