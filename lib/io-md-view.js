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
        margin: 0.25em;
        padding: 0.5em 1em;
        background: #fff;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3),
                    0 15px 20px 0 rgba(0, 0, 0, 0.1);
        border-radius: var(--io-theme-border-radius);
      }
      :host a {
        font-weight: bold;
        text-decoration: none;
        color: var(--io-theme-link-color);
      }
      :host code {
        background: rgba(0,0,0,0.05);
        overflow: auto;
      }
      :host code.language-html,
      :host code.language-javascript {
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
      },
      vars: Object
    };
  }
  pathChanged() {
    const req = new XMLHttpRequest();
    const scope = this;
    function loaded() {
      this.vars = {};
      let vars = this.responseText.match(/(?!\[comment\]: \<)([a-z]*)\> \(.*(?=\))/gi);
      if (vars) {
        for (let i = 0; i < vars.length; i++) {
          let v = vars[i].split('> (');
          this.vars[v[0]] = v[1];
        }
      }
      scope.innerHTML = marked(this.responseText);
    }
    req.addEventListener("load", loaded);
    req.open("GET", this.path);
    req.send();
  }
}

IoMdView.Register();
