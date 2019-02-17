import {html, IoElement} from "../build/io.js";

import "./marked.min.js";

if (window.marked) window.marked.setOptions({sanitize: true});

export class MdView extends IoElement {
  static get style() {
    return html`
      <style>
      :host {
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        letter-spacing: 0.04em;
        line-height: 1.4em;
        font-weight: 300;
        display: block;
        padding: 0.5em 1em;
        background: #fff;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3),
                    0 15px 20px 0 rgba(0, 0, 0, 0.1);
        border-radius: var(--io-theme-border-radius);
        overflow: hidden;
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
      :host .videocontainer {
          width: 100%;
          height: 0;
          position: relative;
          padding-bottom: 56.25%;
      }
      :host .videocontainer > iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
      }
      :host .publishdate {
        text-align: right;
        opacity: 0.5;
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
      // TODO: WIP concept
      // this.vars = {};
      // let vars = this.responseText.match(/(?!\[comment\]: \<)([a-z]*)\> \(.*(?=\))/gi);
      // if (vars) {
      //   for (let i = 0; i < vars.length; i++) {
      //     let v = vars[i].split('> (');
      //     this.vars[v[0]] = v[1];
      //   }
      // }
      // scope.template([
      //   ['div', {id: 'content'}],
      //   ['div', this.vars.date],
      // ]);
      // scope.$.content.innerHTML = marked(this.responseText);
      if (window.marked) scope.innerHTML = window.marked(this.responseText);
    }
    req.addEventListener("load", loaded);
    req.open("GET", this.path);
    req.send();
  }
}

MdView.Register();
