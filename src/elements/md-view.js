import {html, IoElement} from "../core/element.js";
import "../../lib/marked.min.js";

if (window.marked) window.marked.setOptions({sanitize: false});

export class IoMdView extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: block;
        background: var(--io-background-color);
        color: var(--io-color);
      }
      :host p {
        line-height: 1.4em;
      }
      :host a {
        font-weight: bold;
        text-decoration: none;
        color: var(--io-link-color);
      }
      :host h1 {
        margin: 0;
        padding: 1em 0;
      }
      :host h2 {
        margin: 0;
        padding: 0.75em 0;
      }
      :host h3 {
        margin: 0;
        padding: 0.5em 0;
      }
      :host h4 {
        margin: 0;
        padding: 0.25em 0;
      }
      :host code {
        background: rgba(0,0,0,0.25);
        overflow: auto;
        font-weight: bold;
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
        width: 100% !important;
        border: 1px solid black;
        border-collapse: collapse;
        table-layout: fixed;
      }
      :host table td,
      :host table tr,
      :host table th {
        border: 1px solid gray;
        padding: 0.25em;
        text-overflow: ellipsis;
        overflow: hidden;
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
    </style>`;
  }
  static get properties() {
    return {
      path: {
        type: String,
        reflect: true
      },
      vars: Object,
      role: 'document',
    };
  }
  pathChanged() {
    const scope = this;
    fetch(this.path)
    .then(response => {
      return response.text();
    })
    .then(text => {
      if (window.marked) scope.innerHTML = window.marked(text);
      this.dispatchEvent('content-ready', {}, true);
    });
  }
}

IoMdView.Register();
