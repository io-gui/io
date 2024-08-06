import { Register } from '../../core/node.js';
import { IoElement } from '../../core/element.js';
import { Property } from '../../core/internals/property.js';
import { IoThemeSingleton } from '../../core/theme.js';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import purify from 'dompurify';
import hljs from '../../../lib/highlight.min.js';

const marked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    }
  })
);

/**
 * This elements loads a markdown file from path specified as `src` property and renders it as HTML using marked and dompurify.
 */
@Register
class IoMdView extends IoElement {
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
        background-color: var(--iotBgColor);
      }
      :host p {
        line-height: 1.45em;
        margin: 0.35em 0;
      }
      :host a {
        text-decoration: none;
        color: var(--iotColorBlue);
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
        color: var(--iotColorStrong);
      }
      :host h3 {
        padding: 0.5em 0;
        margin: 0;
        color: var(--iotColorStrong);
      }
      :host h4 {
        padding: 0.4em 0;
        margin: 0;
        color: var(--iotColorStrong);
      }
      :host code {
        background-color: var(--iotBgColorDimmed);
      }
      :host strong code {}
      :host pre > code {
        line-height: 1.3em;
      }
      
      :host code[class] {
        background-color: var(--iotBgColorDimmed);
        padding: var(--iotSpacing3);
        display: block;
        overflow-x: auto;
        font-size: var(--io-code-size);
      }
      :host blockquote {
        font-size: 0.85em;
        opacity: 0.75;
        margin: var(--iotLineHeight) 0;
        padding: var(--iotSpacing3) var(--iotLineHeight);
        background-color: var(--iotBgColorStrong);
        color: var(--iotColor);
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
        background-color: var(--iotBgColorDimmed);
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

const styleElement = document.createElement('style');
styleElement.id = 'io-highlight-theme';
document.head.appendChild(styleElement);

const LIGHT_THEME = /* css */`
/* a11y-light theme */
/* Based on the Tomorrow Night Eighties theme: https://github.com/isagalaev/highlight.js/blob/master/src/styles/tomorrow-night-eighties.css */
/* @author: ericwbailey */

/* Comment */
.hljs-comment, .hljs-quote {
  color: #666;
}

/* Red */
.hljs-variable, .hljs-template-variable, .hljs-tag, .hljs-name, .hljs-selector-id, .hljs-selector-class, .hljs-regexp, .hljs-deletion {
  color: #d91e18;
}

/* Orange */
.hljs-number, .hljs-built_in, .hljs-builtin-name, .hljs-literal, .hljs-type, .hljs-params, .hljs-meta, .hljs-link {
  color: #aa5d00;
}

/* Yellow */
.hljs-attribute {
  color: #aa5d00;
}

/* Green */
.hljs-string, .hljs-symbol, .hljs-bullet, .hljs-addition {
  color: #008000;
}

/* Blue */
.hljs-title, .hljs-section {
  color: #007faa;
}

/* Purple */
.hljs-keyword, .hljs-selector-tag {
  color: #c928a1;
}

.hljs {
  display: block;
  overflow-x: auto;
  background: #fefefe;
  color: #545454;
  padding: 0.5em;
}

.hljs-emphasis {
  font-style: italic;
}

.hljs-strong {
  font-weight: bold;
}

@media screen and (-ms-high-contrast: active) {
  .hljs-addition, .hljs-attribute, .hljs-built_in, .hljs-builtin-name, .hljs-bullet, .hljs-comment, .hljs-link, .hljs-literal, .hljs-meta, .hljs-number, .hljs-params, .hljs-string, .hljs-symbol, .hljs-type, .hljs-quote {
    color: highlight;
  }
  .hljs-keyword, .hljs-selector-tag {
      font-weight: bold;
  }
}
`;

const DARK_THEME = /* css */`
/* a11y-dark theme */
/* Based on the Tomorrow Night Eighties theme: https://github.com/isagalaev/highlight.js/blob/master/src/styles/tomorrow-night-eighties.css */
/* @author: ericwbailey */

/* Comment */
.hljs-comment, .hljs-quote {
  color: #d4d0ab;
}

/* Red */
.hljs-variable, .hljs-template-variable, .hljs-tag, .hljs-name, .hljs-selector-id, .hljs-selector-class, .hljs-regexp, .hljs-deletion {
  color: #ffa07a;
}

/* Orange */
.hljs-number, .hljs-built_in, .hljs-builtin-name, .hljs-literal, .hljs-type, .hljs-params, .hljs-meta, .hljs-link {
  color: #f5ab35;
}

/* Yellow */
.hljs-attribute {
  color: #ffd700;
}

/* Green */
.hljs-string, .hljs-symbol, .hljs-bullet, .hljs-addition {
  color: #abe338;
}

/* Blue */
.hljs-title, .hljs-section {
  color: #00e0e0;
}

/* Purple */
.hljs-keyword, .hljs-selector-tag {
  color: #dcc6e0;
}

.hljs {
  display: block;
  overflow-x: auto;
  background: #2b2b2b;
  color: #f8f8f2;
  padding: 0.5em;
}

.hljs-emphasis {
  font-style: italic;
}

.hljs-strong {
  font-weight: bold;
}

@media screen and (-ms-high-contrast: active) {
  .hljs-addition, .hljs-attribute, .hljs-built_in, .hljs-builtin-name, .hljs-bullet, .hljs-comment, .hljs-link, .hljs-literal, .hljs-meta, .hljs-number, .hljs-params, .hljs-string, .hljs-symbol, .hljs-type, .hljs-quote {
    color: highlight;
  }
  .hljs-keyword, .hljs-selector-tag {
    font-weight: bold;
  }
}
`;

function setTheme() {
  if (IoThemeSingleton.themeID === 'dark') {
    styleElement.innerHTML = DARK_THEME;
  } else {
    styleElement.innerHTML = LIGHT_THEME;
  }
}
setTheme();
IoThemeSingleton.addEventListener('themeID-changed', setTheme);

export { IoMdView };
