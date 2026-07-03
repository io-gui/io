var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, ReactiveElement, Property, Field, $ThemeID } from '@io-gui/core';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import purify from 'dompurify';
import { MD_DARK_THEME, MD_LIGHT_THEME } from './IoMarkdownTheme.js';
import hljs from '../../lib/highlight.min.js';
const marked = new Marked(markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
    }
}));
const renderer = new marked.Renderer();
renderer.heading = function ({ text, depth }) {
    return `<h${depth} data-heading="${text}">${text}</h${depth}>`;
};
marked.setOptions({ renderer });
const TRUSTED_IFRAME_HOSTS = new Set([
    'www.youtube.com',
    'youtube.com',
    'player.vimeo.com',
]);
function trustedIframeSrc(src) {
    if (!src)
        return false;
    try {
        return TRUSTED_IFRAME_HOSTS.has(new URL(src).hostname);
    }
    catch {
        return false;
    }
}
const PURIFY_CONFIG = {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
};
purify.addHook('uponSanitizeElement', (node, event) => {
    if (event.tagName !== 'iframe')
        return;
    const element = node;
    if (trustedIframeSrc(element.getAttribute('src')))
        return;
    element.parentNode?.removeChild(element);
});
function strip(innerHTML, strip) {
    for (let i = 0; i < strip.length; i++) {
        innerHTML = innerHTML.replace(new RegExp(strip[i], 'g'), '');
    }
    return innerHTML;
}
/**
 * This elements loads a markdown file from path specified as `src` property and renders it as HTML using marked and dompurify.
 */
let IoMarkdown = class IoMarkdown extends ReactiveElement {
    static get Style() {
        return /* css */ `
      :host {
        display: flex;
        flex-direction: column;
        align-self: stretch;
        justify-self: stretch;
        flex: 1 1 auto;
        /* overflow-x: hidden; */
        /* overflow-y: auto; */
        -webkit-overflow-scrolling: touch;
        -webkit-tap-highlight-color: transparent;
        padding: 0 var(--io_lineHeight);
        padding-bottom: var(--io_lineHeight);
        color: var(--io_color);
        background-color: var(--io_bgColor);
        font-size: var(--io_fontSize);
      }
      :host p {
        line-height: 1.45em;
        margin: 0.35em 0;
      }
      :host a {
        text-decoration: none;
        color: var(--io_colorBlue);
      }
      :host h1 {
        padding: 0.7em 0;
        margin: 0;
        border-bottom: var(--io_border);
        color: var(--io_colorStrong);
      }
      :host h2 {
        padding: 0.6em 0;
        margin: 0;
        color: var(--io_colorStrong);
      }
      :host h3 {
        padding: 0.5em 0;
        margin: 0;
        color: var(--io_colorStrong);
      }
      :host h4 {
        padding: 0.4em 0;
        margin: 0;
        color: var(--io_colorStrong);
      }
      :host code {
        background-color: var(--io_bgColorLight);
      }
      :host strong code {}
      :host pre > code {
        line-height: 1.3em;
      }
      
      :host code[class] {
        background-color: var(--io_bgColorLight);
        padding: var(--io_spacing3);
        display: block;
        overflow-x: auto;
        font-size: var(--io-code-size);
      }
      :host blockquote {
        font-size: 0.85em;
        opacity: 0.75;
        margin: var(--io_lineHeight) 0;
        padding: var(--io_spacing3) var(--io_lineHeight);
        background-color: var(--io_bgColorStrong);
        color: var(--io_color);
        border-left: var(--io_border);
        border-left-width: var(--io_spacing2);
      }
      :host blockquote strong {
        color: var(--io_colorStrong);
      }
      :host table  {
        width: 100% !important;
        border: var(--io_border);
        border-collapse: collapse;
        table-layout: auto;
      }
      :host table th {
        background-color: var(--io_bgColorLight);
        color: var(--io_colorStrong);
        font-weight: bold;
      }
      :host table td,
      :host table tr,
      :host table th {
        border: var(--io_border);
        padding: var(--io_spacing) var(--io_spacing2);
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
        border: var(--io_border);
        border-top-color: #000;
        animation: spinner .6s linear infinite;
      }
    `;
    }
    constructor(args = {}) { super(args); }
    onResized() {
        let width = this.getBoundingClientRect().width;
        width = Math.min(Math.max((width - 30) / 45, 11), 14);
        this.style.setProperty('--io-code-size', width + 'px');
    }
    srcChanged() {
        // Capture at fetch start — drawer/layout VDOM may dispose this element before the promise settles.
        const src = this.src;
        const sanitize = this.sanitize;
        const stripList = this.strip;
        this.loading = true;
        this.innerHTML = '';
        void fetch(src)
            .then(response => response.text())
            .then(markdown => {
            if (this._disposed || this.src !== src)
                return;
            let md = marked.parse(markdown);
            if (sanitize)
                md = purify.sanitize(md, PURIFY_CONFIG);
            this.innerHTML = strip(md, stripList);
            this.loading = false;
        })
            .catch(() => {
            if (!this._disposed)
                this.loading = false;
        });
    }
};
__decorate([
    Property({ value: '', reflect: true })
], IoMarkdown.prototype, "src", void 0);
__decorate([
    Property({ type: Array, init: null })
], IoMarkdown.prototype, "strip", void 0);
__decorate([
    Property({ value: false, reflect: true })
], IoMarkdown.prototype, "loading", void 0);
__decorate([
    Property(true)
], IoMarkdown.prototype, "sanitize", void 0);
__decorate([
    Field('document')
], IoMarkdown.prototype, "role", void 0);
IoMarkdown = __decorate([
    Register
], IoMarkdown);
export { IoMarkdown };
export const ioMarkdown = function (arg0) {
    return IoMarkdown.vConstructor(arg0);
};
const styleElement = document.createElement('style');
styleElement.id = 'io-highlight-theme';
document.head.appendChild(styleElement);
function setTheme() {
    if ($ThemeID.value === 'dark') {
        styleElement.innerHTML = MD_DARK_THEME;
    }
    else {
        styleElement.innerHTML = MD_LIGHT_THEME;
    }
}
setTheme();
$ThemeID.node.addEventListener('value-changed', setTheme);
