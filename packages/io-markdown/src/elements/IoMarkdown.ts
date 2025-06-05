import { Register, IoElement, ReactiveProperty, ThemeSingleton, IoElementProps, WithBinding, VDOMElement, Property } from 'io-gui';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import purify from 'dompurify';
import { MD_DARK_THEME, MD_LIGHT_THEME } from './IoMarkdownTheme.js';
import hljs from '../../lib/highlight.min.js';

const marked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    }
  })
);

const renderer = new marked.Renderer();
renderer.heading = function({ tokens, depth }: { tokens: any[], depth: number }) {
  const text = tokens.map(token => token.text).join('');
  return `<h${depth} data-heading="${text}">${text}</h${depth}>`;
};

marked.setOptions({ renderer });

function strip(innerHTML: string, strip: string[]) {
  for (let i = 0; i < strip.length; i++) {
    innerHTML = innerHTML.replace(new RegExp(strip[i], 'g'),'');
  }
  return innerHTML;
}

export type IoMarkdownProps = IoElementProps & {
  src?: string,
  strip?: string[],
  loading?: WithBinding<boolean>,
  sanitize?: boolean,
  scroll?: WithBinding<string>,
};

/**
 * This elements loads a markdown file from path specified as `src` property and renders it as HTML using marked and dompurify.
 */
@Register
export class IoMarkdown extends IoElement {
  static vConstructor: (arg0?: IoMarkdownProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
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
        background-color: var(--io_bgColorDimmed);
      }
      :host strong code {}
      :host pre > code {
        line-height: 1.3em;
      }
      
      :host code[class] {
        background-color: var(--io_bgColorDimmed);
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
        background-color: var(--io_bgColorDimmed);
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

  @ReactiveProperty({value: '', reflect: true})
  declare src: string;

  @ReactiveProperty({type: Array})
  declare strip: string[];

  @ReactiveProperty({value: false, reflect: true})
  declare loading: boolean;

  @ReactiveProperty(true)
  declare sanitize: boolean;

  @ReactiveProperty({value: '', type: String})
  declare scroll: string;

  @Property('document')
  declare role: string;

  @Property(false)
  declare private scrollToSuspended: boolean;

  @Property(false)
  declare private onScrollSuspended: boolean;

  static get Listeners() {
    return {
      scroll: 'onScrollChanged',
    };
  }

  constructor(args: IoMarkdownProps = {}) { super(args) }

  init() {
    this.scrollChangedDebounced = this.scrollChangedDebounced.bind(this);
    this.scrollToUnsuspend = this.scrollToUnsuspend.bind(this);
    this.onScrollUnsuspended = this.onScrollUnsuspended.bind(this);
  }

  scrollChanged() {
    if (!this.scrollToSuspended) {
      this.onScrollSuspended = true;
      this.debounce(this.onScrollUnsuspended, undefined, 120);
    }
    this.debounce(this.scrollChangedDebounced);
  }

  scrollChangedDebounced() {
    if (!this.scroll || this.scrollToSuspended) return;
    const heading = this.querySelector(`[data-heading="${this.scroll}"]`);
    if (heading) {
      this.scrollTo({top: heading.offsetTop, behavior: 'smooth'});
    } else {
      this.scrollTo(0, 0);
    }
  }

  scrollToUnsuspend() {
    this.scrollToSuspended = false;
  }

  onScrollUnsuspended() {
    this.onScrollSuspended = false;
  }

  onScrollChanged() {
    if (this.onScrollSuspended) return;
    const headings = this.querySelectorAll(`[data-heading]`) as NodeListOf<HTMLElement>;
    const closestHeading = Array.from(headings).reduce((prev, curr) => {
      return (Math.abs(curr.offsetTop - this.scrollTop) < Math.abs(prev.offsetTop - this.scrollTop) ? curr : prev);
    }, headings[0]);
    if (closestHeading) {
      const current = closestHeading.textContent;
      if (current && current !== this.scroll) {
        this.scrollToSuspended = true;
        this.scroll = current;
        this.debounce(this.scrollToUnsuspend, 120);
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
      .then(markdown => {
        let md = marked.parse(markdown) as string;
        if (this.sanitize) md = purify.sanitize(md);
        this.innerHTML = strip(md, this.strip);
        this.loading = false;
      })
      .then(this.scrollChanged);
  }
}
export const ioMarkdown = IoMarkdown.vConstructor;

const styleElement = document.createElement('style');
styleElement.id = 'io-highlight-theme';
document.head.appendChild(styleElement);

function setTheme() {
  if (ThemeSingleton.themeID === 'dark') {
    styleElement.innerHTML = MD_DARK_THEME;
  } else {
    styleElement.innerHTML = MD_LIGHT_THEME;
  }
}
setTheme();
ThemeSingleton.addEventListener('themeID-changed', setTheme);
