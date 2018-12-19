import {html, IoElement} from "../src/io.js";
import "./marked.min.js";

export class IoMdView extends IoElement {
  static get style() {
    return html`
      <style>
      :host {
        font-family: Arial, Helvetica, sans-serif;
        letter-spacing: 0.05em;
        font-weight: 300;
        display: block;
        margin: 1.5em;
        padding: 1.5em;
        max-width: 50em;
        background: rgba(0,0,0,0.04);
      }
      :host a {
        font-weight: bold;
        text-decoration: none;
        color: #49f;
      }
      :host code {
        font-weight: bold;
        background: rgba(0,0,0,0.1);
      }
      :host code.language-html,
      :host code.language-javascript {
        background: white;
        padding: 1em;
        display: block;
      }
      :host blockquote {
        border: 1px solid rgba(0,0,0,0.25);
        margin: 0.5em 1em;
        padding: 0.5em 1em;
      }
      :host table  {
        width: 100%;
        border: 1px solid black;
        border-collapse: collapse;
      }
      :host table td,
      :host table tr,
      :host table th {
        border: 1px solid gray;
        text-align: left;
        padding: 0.25em;
      }
      </style>
    `;
  }
  static get properties() {
    return {
      path: {
        type: String,
        reflect: true
      }
    };
  }
  pathChanged() {
    const req = new XMLHttpRequest();
    const scope = this;
    function loaded() {
      scope.innerHTML = marked(this.responseText);
    }
    req.addEventListener("load", loaded);
    req.open("GET", this.path);
    req.send();
  }
}

IoMdView.Register();
