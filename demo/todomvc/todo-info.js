import {IoElement, html} from "../../dist/io.js";
import {IoMdView} from "../../dist/io-elements-extras.js";

export class TodoInfo extends IoMdView {
  static get Style() {
    return html`<style>
    :host {
      color: #bfbfbf;
      font-size: 10px;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
      text-align: center;
    }
    :host p {
      line-height: 1;
    }
    :host a {
      color: inherit;
      text-decoration: none;
      font-weight: 400;
    }
    :host a:hover {
      text-decoration: underline;
    }
    </style>`;
  }
  changed() {
    this.parseMarkdown(`
Double-click to edit a todo

Created by [Aki Rodić](https://akirodic.com)

Part of [TodoMVC](http://todomvc.com/)
    `);
  }
}

TodoInfo.Register();
