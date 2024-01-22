var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register } from '../../core/node.js';
import { IoElement } from '../../core/element.js';
import { Property } from '../../core/internals/property.js';
import { marked } from 'marked';
import purify from 'dompurify';
/**
 * This elements loads a markdown file from path specified as `src` property and renders it as HTML using marked and dompurify.
 */
let IoMdView = class IoMdView extends IoElement {
    static get Style() {
        return /* css */ `
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
    _strip(innerHTML) {
        for (let i = 0; i < this.strip.length; i++) {
            innerHTML = innerHTML.replace(new RegExp(this.strip[i], 'g'), '');
        }
        return innerHTML;
    }
    _parseMarkdown(markdown) {
        // if (this._disposed) return;
        if (marked) {
            marked.setOptions({
                sanitize: false,
                highlight: function (code) {
                    return window.hljs ? window.hljs.highlightAuto(code).value : null;
                },
            });
            this.loading = false;
            if (this.sanitize) {
                this.innerHTML = this._strip(purify.sanitize(marked(markdown)));
            }
            else {
                this.innerHTML = this._strip(marked(markdown));
            }
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
    changed() { }
};
__decorate([
    Property('document')
], IoMdView.prototype, "role", void 0);
__decorate([
    Property({ value: '', reflect: true })
], IoMdView.prototype, "src", void 0);
__decorate([
    Property({ type: Array })
], IoMdView.prototype, "strip", void 0);
__decorate([
    Property({ value: false, reflect: true })
], IoMdView.prototype, "loading", void 0);
__decorate([
    Property(true)
], IoMdView.prototype, "sanitize", void 0);
IoMdView = __decorate([
    Register
], IoMdView);
export { IoMdView };
//# sourceMappingURL=io-md-view.js.map