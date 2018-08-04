import {IoElement} from "../../build/io.js";

export class TodoFooter extends IoElement {
  static get properties() {
    return {
      model: Object
    };
  }
  changed() {
    let activeLeft = this.model.getActiveCount();
    this.template([
      ['footer', {className: 'footer'}, [
        ['span', {className: 'todo-count'}, String(activeLeft) + (activeLeft === 1 ? ' item' : ' items') + ' left'],
        ['div', {className: 'filters'}, [
          ['a', {'href': '#/', className: 'selected'}, 'All'], // TODO: router
          ['a', {'href': '#/active'}, 'Active'],
          ['a', {'href': '#/completed'}, 'Completed']
        ]],
        this.model.getCompletedCount() ? ['button', {className: 'clear-completed'}, 'Clear completed'] : null
      ]]
    ]);
  }
}

TodoFooter.Register();
