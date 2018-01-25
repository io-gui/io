import {html, iftrue} from "../ioutil.js"
import {Io} from "../io.js"

export class IoCollapsable extends Io {
  static get is() { return 'io-collapsable'; }
  static get template() {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: column;
        }
        .io-collapsable {
          cursor: pointer;
        }
      </style>
    `;
  }
  static get properties() {
    return {
      value: {
        type: Object,
        observer: '_update',
      },
      label: {
        type: String,
        observer: '_update'
      },
      expanded: {
        type: Boolean,
        observer: '_update',
        reflectToAttribute: true
      }
    }
  }
  constructor(props) {
    super(props);
    this._update();
  }
  connectedCallback() {
    this.addEventListener('click', this._toggleHandler);
    this.addEventListener('keydown', this._toggleHandler);
    this.addEventListener('mousedown', this._preventHandler);
  }
  disconnectedCallback() {
    this.removeEventListener('click', this._toggleHandler);
    this.removeEventListener('keydown', this._toggleHandler);
    this.removeEventListener('mousedown', this._preventHandler);
  }
  _preventHandler(event) {
    event.preventDefault();
  }
  _toggleHandler(event) {
    if (event.path[0].className !== 'io-collapsable') return;
    if (event.which == 13 || event.which == 32 || event.type == 'click') {
      event.preventDefault();
      this.expanded = !this.expanded;
      setTimeout(() => {
        let focusable = this.querySelector('[tabindex="0"]');
        if (focusable) {
          focusable.focus();
        } else {
          this.shadowRoot.querySelector('.io-collapsable').focus();
        }
      });
    }
  }
  _update() {
    this.render([
      ['span', {className: 'io-collapsable', tabindex: '0'}, (this.expanded ? '▾' : '▸') + this.label ],
      iftrue(this.expanded, ['slot'])
    ], this.shadowRoot);
  }
}


window.customElements.define(IoCollapsable.is, IoCollapsable);
