import {html, IoElement} from "../io.js";
import "../../lib/marked.min.js";

export class IoMdView extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: block;
        background-color: var(--io-background-color);
        color: var(--io-color);
        --io-code-size: 12px;
      }
      :host > :first-child {
        margin-top: 0;
      }
      :host > :last-child {
        margin-top: 0;
      }
      :host p {
        line-height: 1.4em;
      }
      :host a {
        font-weight: bold;
        text-decoration: none;
        color: var(--io-color-link);
      }
      :host h1, :host h2, :host h3, :host h4 {
        margin: 0;
        border: var(--io-border);
        border-width: 0 0 var(--io-border-width) 0;
      }
      :host h1 {
        padding: 0.5em 0;
      }
      :host h2 {
        padding: 0.4em 0;
      }
      :host h3 {
        padding: 0.3em 0;
      }
      :host h4 {
        padding: 0.2em 0;
      }
      :host code {
        background-color: var(--io-background-color-dark);
        font-family: "Roboto Mono", Monaco, courier, monospace;
        overflow: auto;
        font-weight: bold;
      }
      :host code.language-html,
      :host code.language-javascript {
        padding: 1em;
        display: block;
        font-size: var(--io-code-size);
      }
      :host blockquote {
        font-size: 0.85em;
        opacity: 0.5;
        margin: 0;
        padding: var(--io-spacing) 0;
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
  static get attributes() {
    return {
      role: 'document',
    };
  }
  static get properties() {
    return {
      path: {
        type: String,
        reflect: 1
      },
      vars: Object,
    };
  }
  resized() {
    const width = this.getBoundingClientRect().width;
    this.style.setProperty('--io-code-size', Math.min((width - 50) / 40, 12) + "px");
  }
  pathChanged() {
    const scope = this;
    fetch(this.path)
    .then(response => {
      return response.text();
    })
    .then(text => {
      if (window.marked) {
        if (window.marked) {
          window.marked.setOptions({
            sanitize: false,
            highlight: function(code) {
              return window.hljs ? window.hljs.highlightAuto(code).value : null;
            },
          });
        }

        scope.innerHTML = window.marked(text);
        this.dispatchEvent('content-ready', {}, true);
      }
    });
  }
}

IoMdView.Register();
