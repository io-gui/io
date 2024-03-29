import { Register } from '../../core/node.js';
import { IoElement } from '../../core/element.js';
import { Property } from '../../core/internals/property.js';
import { Marked } from 'marked';
// import { markedHighlight } from 'marked-highlight';
// import hljs from 'highlight.js';
import purify from 'dompurify';

const marked = new Marked(
  // markedHighlight({
  //   langPrefix: 'hljs language-',
  //   highlight(code, lang) {
  //     const language = hljs.getLanguage(lang) ? lang : 'plaintext';
  //     return hljs.highlight(code, { language }).value;
  //   }
  // })
);
/**
 * This elements loads a markdown file from path specified as `src` property and renders it as HTML using marked and dompurify.
 */
@Register
export class IoMdView extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        flex-direction: column;
        align-self: stretch;
        justify-self: stretch;
        flex: 1 1 auto;
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        -webkit-tap-highlight-color: transparent;
        padding: 0 var(--iotLineHeight);
        padding-bottom: var(--iotLineHeight);
        color: var(--iotColor);
        background-color: var(--iotBackgroundColor);
      }
      :host p {
        line-height: 1.45em;
        margin: 0.35em 0;
      }
      :host a {
        text-decoration: none;
        color: var(--iotColorLink);
      }
      :host h1 {
        padding: 0.7em 0;
        margin: 0;
        border-bottom: var(--iotBorder);
        color: var(--iotColorStrong);
      }
      :host h2 {
        padding: 0.6em 0;
        margin: 0;
        color: var(--iotColorLink);
        color: var(--iotColorDimmed);
      }
      :host h3 {
        padding: 0.5em 0;
        margin: 0;
        color: var(--iotColorDimmed);
      }
      :host h4 {
        padding: 0.4em 0;
        margin: 0;
        color: var(--iotColorDimmed);
      }
      :host code {
        background-color: var(--iotBackgroundColorFaint);
      }
      :host strong code {}
      :host pre > code {
        line-height: 1.3em;
      }
      
      :host code[class] {
        background-color: var(--iotBackgroundColorDimmed);
        padding: var(--iotSpacing4);
        display: block;
        overflow-x: auto;
        font-size: var(--io-code-size);
      }
      :host blockquote code {
        background-color: transparent;
      }
      :host blockquote {
        font-size: 0.85em;
        opacity: 0.75;
        margin: var(--iotLineHeight) 0;
        padding: var(--iotSpacing4) var(--iotLineHeight);
        background-color: var(--iotBackgroundColorDimmed);
        color: var(--iotColorDimmed);
        border-left: var(--iotBorder);
        border-left-width: var(--iotSpacing2);
      }
      :host blockquote strong {
        color: var(--iotColorStrong);
      }
      :host table  {
        width: 100% !important;
        border: var(--iotBorder);
        border-collapse: collapse;
        table-layout: auto;
      }
      :host table th {
        background-color: var(--iotBackgroundColorDimmed);
        color: var(--iotColorStrong);
        font-weight: bold;
      }
      :host table td,
      :host table tr,
      :host table th {
        border: var(--iotBorder);
        padding: var(--iotSpacing) var(--iotSpacing2);
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        width: auto;
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
        border: var(--iotBorder);
        border-top-color: #000;
        animation: spinner .6s linear infinite;
      }
    `;
  }

  @Property('document')
  declare role: string;

  @Property({value: '', reflect: true})
  declare src: string;

  @Property({type: Array})
  declare strip: string[];

  @Property({value: false, reflect: true})
  declare loading: boolean;

  @Property(true)
  declare sanitize: boolean;

  protected _strip(innerHTML: string) {
    for (let i = 0; i < this.strip.length; i++) {
      innerHTML = innerHTML.replace(new RegExp(this.strip[i], 'g'),'');
    }
    return innerHTML;
  }

  protected _parseMarkdown(markdown: string) {
    // if (this._disposed) return;
    const md = marked.parse(markdown) as string;
    this.loading = false;
    if (this.sanitize) {
      this.innerHTML = this._strip(purify.sanitize(md));
    } else {
      this.innerHTML = this._strip(md);
    }
  }

  onResized() {
    let width = this.getBoundingClientRect().width;
    width = Math.min(Math.max((width - 30) / 45, 11), 14);
    this.style.setProperty('--io-code-size', width + 'px');
  }

  srcChanged() {
    this.loading = true;
    this.innerHTML = '';
    void fetch(this.src)
      .then(response => response.text())
      .then(text => { this._parseMarkdown(text); });
  }

  changed() {}
}
