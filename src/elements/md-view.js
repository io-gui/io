import {html, IoElement} from "../core/element.js";
import "../../lib/marked.min.js";

if (window.marked) window.marked.setOptions({sanitize: false});

export class IoMdView extends IoElement {
  static get style() {
    return html`<style>
      :host {
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        letter-spacing: 0.04em;
        font-weight: 300;
        display: block;
        padding: 0.5em 1em;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3),
                    0 15px 20px 0 rgba(0, 0, 0, 0.1);
        border-radius: var(--io-border-radius);
        overflow: hidden;
        background: var(--io-bg);
        color: var(--io-color);
      }
      :host p {
        line-height: 1.5em;
      }
      :host a {
        font-weight: bold;
        text-decoration: none;
        color: var(--io-link-color);
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
    .then(function(response) {
      return response.text();
    })
    .then(function(text) {
      if (window.marked) scope.innerHTML = window.marked(text);
    });
  }
}

IoMdView.Register();
