//@ts-nocheck
import { IoElement, Register, span, ul, li, a, button } from 'io-gui';
import {TodoListModel} from './TodoListModel.js';

export class TodoFooter extends IoElement {
  static get Style() {
    return /* css */`
      :host a {
        cursor: pointer;
      }
    `;
  }
  static get ReactiveProperties() {
    return {
      model: {
        type: TodoListModel,
      },
      route: 'all',
    };
  }
  onRouteClicked(event) {
    this.route = event.target.innerText.toLowerCase();
  }
  modelMutated() {
    this.changed();
  }
  changed() {
    this.render([
      span({class: 'todo-count'}, String(this.model.activeCount) + (this.model.activeCount === 1 ? ' item' : ' items') + ' left'),
      ul({class: 'filters'}, [
        li([a({'@click': this.onRouteClicked, class: this.route === 'all' ? 'selected' : ''}, 'All')]),
        li([a({'@click': this.onRouteClicked, class: this.route === 'active' ? 'selected' : ''}, 'Active')]),
        li([a({'@click': this.onRouteClicked, class: this.route === 'completed' ? 'selected' : ''}, 'Completed')]),
      ]),
      this.model.completedCount ? button({class: 'clear-completed', '@click': this.model.clearCompleted}, 'Clear completed') : null
    ]);
  }
}
Register(TodoFooter);
export const todoFooter = TodoFooter.vConstructor;