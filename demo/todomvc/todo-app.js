import {html, IoElement} from "../../src/io.js";
import {TodoModel} from "./todo-model.js";
import "./todo-item.js";

const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

export class TodoApp extends IoElement {
  static get style() {
    return html`
    <style>
    :host {
      display: block;
      padding: 1em;
      font: 14px 'Helvetica Neue', Helvetica, Arial, sans-serif;
      line-height: 1.4em;
      background: #f5f5f5;
      color: #4d4d4d;
      margin: 0 auto;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      font-weight: 300;
    }
    :host button,
    :host input[type="checkbox"] {
      outline: none;
      margin: 0;
      padding: 0;
      border: 0;
      background: none;
      font-size: 100%;
      vertical-align: baseline;
      font-family: inherit;
      font-weight: inherit;
      color: inherit;
      -webkit-appearance: none;
      appearance: none;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    :host > .todoapp {
      background: #fff;
      margin: 130px 0 40px 0;
      position: relative;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2),
                  0 25px 50px 0 rgba(0, 0, 0, 0.1);
    }

    :host > .todoapp input::-webkit-input-placeholder {
      font-style: italic;
      font-weight: 300;
      color: #e6e6e6;
    }

    :host > .todoapp input::-moz-placeholder {
      font-style: italic;
      font-weight: 300;
      color: #e6e6e6;
    }

    :host > .todoapp input::input-placeholder {
      font-style: italic;
      font-weight: 300;
      color: #e6e6e6;
    }

    :host > .todoapp h1 {
      position: absolute;
      top: -155px;
      width: 100%;
      font-size: 100px;
      font-weight: 100;
      text-align: center;
      color: rgba(175, 47, 47, 0.15);
      -webkit-text-rendering: optimizeLegibility;
      -moz-text-rendering: optimizeLegibility;
      text-rendering: optimizeLegibility;
    }

    :host .hidden {
      display: none;
    }

    :host .new-todo,
    :host .edit {
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

    :host .new-todo {
      padding: 16px 16px 16px 60px;
      border: none;
      background: rgba(0, 0, 0, 0.003);
      box-shadow: inset 0 -2px 1px rgba(0,0,0,0.03);
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

    :host .todo-list li {
      position: relative;
      font-size: 24px;
      border-bottom: 1px solid #ededed;
    }

    :host .todo-list li:last-child {
      border-bottom: none;
    }

    :host .todo-list li.editing {
      border-bottom: none;
      padding: 0;
    }

    :host .todo-list li.editing button,
    :host .todo-list li.editing label,
    :host .todo-list li.editing .toggle{
      display: none;
    }

    :host .todo-list li.editing .edit {
      display: block;
      width: 506px;
      padding: 12px 16px;
      margin: 0 0 0 43px;
    }

    :host .todo-list li .toggle {
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

    :host .todo-list li .toggle:after {
      content: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-10 -18 100 135"><circle cx="50" cy="50" r="50" fill="none" stroke="#ededed" stroke-width="3"/></svg>');
    }

    :host .todo-list li .toggle:checked:after {
      content: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-10 -18 100 135"><circle cx="50" cy="50" r="50" fill="none" stroke="#bddad5" stroke-width="3"/><path fill="#5dc2af" d="M72 25L42 71 27 56l-4 4 20 20 34-52z"/></svg>');
    }

    :host .todo-list li label {
      white-space: pre-line;
      word-break: break-all;
      padding: 15px 60px 15px 15px;
      margin-left: 45px;
      display: block;
      line-height: 1.2;
      transition: color 0.4s;
    }

    :host .todo-list li.completed label {
      color: #d9d9d9;
      text-decoration: line-through;
    }

    :host .todo-list li .destroy {
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

    :host .todo-list li .destroy:hover {
      color: #af5b5e;
    }

    :host .todo-list li .destroy:after {
      content: '×';
    }

    :host .todo-list li:hover .destroy {
      display: block;
    }

    :host .todo-list li .edit {
      display: none;
    }

    :host .todo-list li.editing:last-child {
      margin-bottom: -1px;
    }

    :host .footer {
      color: #777;
      padding: 10px 15px;
      height: 20px;
      text-align: center;
      border-top: 1px solid #e6e6e6;
    }

    :host .footer:before {
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

    :host .todo-count {
      float: left;
      text-align: left;
    }

    :host .todo-count strong {
      font-weight: 300;
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
    }

    :host .filters a.selected,
    :host .filters a:hover {
      border-color: rgba(175, 47, 47, 0.1);
    }

    :host .filters a.selected {
      border-color: rgba(175, 47, 47, 0.2);
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

    :host .info {
      margin: 65px auto 0;
      color: #bfbfbf;
      font-size: 10px;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
      text-align: center;
    }

    :host .info p {
      line-height: 1;
    }

    :host .info a {
      color: inherit;
      text-decoration: none;
      font-weight: 400;
    }

    :host .info a:hover {
      text-decoration: underline;
    }

    /*
      Hack to remove background from Mobile Safari.
      Can't use it globally since it destroys checkboxes in Firefox
    */
    @media screen and (-webkit-min-device-pixel-ratio:0) {
      :host .toggle-all,
      :host .todo-list li .toggle {
        background: none;
      }

      :host .todo-list li .toggle {
        height: 40px;
      }

      :host .toggle-all {
        -webkit-transform: rotate(90deg);
        transform: rotate(90deg);
        -webkit-appearance: none;
        appearance: none;
      }
    }

    @media (max-width: 430px) {
      :host .footer {
        height: 50px;
      }

      :host .filters {
        bottom: 10px;
      }
    }
    </style>
    `;
  }
  static get properties() {
    return {
      model: TodoModel,
      route: String
    };
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('hashchange', this.hashChange);
    this.hashChange();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('hashchange', this.hashChange);
  }
  hashChange() {
    this.route = window.location.hash.replace('#/', '');
  }
  changed() {
    const itemCount = this.model.items.length;
    const activeLeft = this.model.getActiveCount();
    const completedCount = this.model.getCompletedCount();
    const allCompleted = itemCount === completedCount;

    const items = this.model.items.filter(this.model.filters[this.route]);

    this.template([
      ['section', {className: 'todoapp'}, [
        ['header', {className: 'header'}, [
          ['h1', 'todos'],
        ]],
        ['input', {id: 'input', className: 'new-todo', placeholder: 'What needs to be done?', 'on-keyup': this.onInputKey, autofocus: true}],
        ['section', {className: 'main'}, [
          ['input', {type: 'checkbox', className: 'toggle-all', checked: allCompleted, 'on-click': this.model.toggleItemsCompleted}],
          ['ul', {className: 'todo-list'}, [
            items.map((item, i) => ['todo-item', {item: item, model: this.model}])
          ]]
        ]],
        itemCount ? ['footer', {className: 'footer'}, [
          ['span', {className: 'todo-count'}, String(activeLeft) + (activeLeft === 1 ? ' item' : ' items') + ' left'],
          ['div', {className: 'filters'}, [
            ['a', {'href': '#/', className: !this.route ? 'selected' : ''}, 'All'],
            ['a', {'href': '#/active', className: this.route === 'active' ? 'selected' : ''}, 'Active'],
            ['a', {'href': '#/completed', className: this.route === 'completed' ? 'selected' : ''}, 'Completed']
          ]],
          completedCount? ['button', {className: 'clear-completed', 'on-click': this.model.clearCompletedItems}, 'Clear completed'] : null
        ]] : null
      ]],
      ['footer', {className: 'info'}, [
        ['p', 'Double-click to edit a todo'],
        ['p', 'Created by Aki Rodić'],
        ['p', 'Part of TodoMVC'],
      ]]
    ]);
  }
  onInputKey(event) {
    if (event.which === ENTER_KEY) {
      this.model.newItem(this.$.input.value);
      this.$.input.value = '';
      this.$.input.focus();
    }
    if (event.which === ESCAPE_KEY) {
      this.$.input.value = '';
      this.$.input.focus();
    }
  }
}

TodoApp.Register();
