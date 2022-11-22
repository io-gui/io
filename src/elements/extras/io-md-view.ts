import { RegisterIoElement } from '../../core/element.js';
import { IoContent } from '../layout/io-content.js';
import { Property } from '../../core/internals/property.js';
import { marked } from 'marked';
import purify from 'dompurify';

/**
 * This elements loads a markdown file from path specified as `src` property and renders it as HTML using marked and dompurify.
 */
@RegisterIoElement
export class IoMdView extends IoContent {
  static get Style() {
    return /* css */`
      :host {
        padding: var(--io-line-height) var(--io-line-height2);
      }
      :host > :first-child {
        margin-top: 0;
      }
      :host > :last-child {
        margin-top: 0;
      }
      :host p {
        line-height: 1.4em;
        padding: 0.5em 0;
      }
      :host a {
        text-decoration: underline;
        color: var(--io-color-link);
      }
      :host h1, :host h2, :host h3, :host h4 {
        margin: 0.5em 0;
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
        border: 0;
      }
      :host h4 {
        padding: 0.2em 0;
        border: 0;
      }
      :host code {
        font-family: monospace, monospace;
        -webkit-font-smoothing: auto;
        overflow: auto;
        color: var(--io-color-link);
      }
      :host strong code {
        background: var(--io-background-color-light);
      }
      :host pre > code {
        background: var(--io-background-color-light);
        color: inherit;
        line-height: 1.6em;
      }

      :host code[class] {
        padding: 1em;
        display: block;
      }
      :host blockquote {
        font-size: 0.85em;
        opacity: 0.5;
        margin: 0;
        padding: 0;
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
      @keyframes spinner {
        to {transform: rotate(360deg);}
      }
      :host[loading]:after {
        content: '';
        box-sizing: border-box;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 40px;
        height: 40px;
        margin-top: -20px;
        margin-left: -20px;
        border-radius: 50%;
        border: var(--io-border);
        border-top-color: #000;
        animation: spinner .6s linear infinite;
      }
    `;
  }

  @Property('document')
  declare role: string;

  @Property({value: '', reflect: 'prop'})
  declare src: string;

  @Property({value: false, reflect: 'prop'})
  declare loading: boolean;

  @Property(true)
  declare sanitize: boolean;

  protected _parseMarkdown(markdown: string) {
    if (marked) {
      marked.setOptions({
        sanitize: false,
        highlight: function(code: string) {
          return (window as any).hljs ? (window as any).hljs.highlightAuto(code).value : null;
        },
      });
      this.loading = false;
      if (this.sanitize) {
        this.innerHTML = purify.sanitize(marked(markdown));
      } else {
        this.innerHTML = marked(markdown);
      }
      // this._scrollTo(this.anchor, true);
    }
  }

  srcChanged() {
    this.loading = true;
    void fetch(this.src)
      .then(response => response.text())
      .then(text => { this._parseMarkdown(text); });
  }

  changed() {}
}
