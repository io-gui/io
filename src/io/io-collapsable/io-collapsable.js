import {html} from "../ioutil.js"
import {Io} from "../io.js"

export class IoCollapsable extends Io {
  static get rootStyle() {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: column;
        }
        .io-label {
          cursor: pointer;
          line-height: 1em;
          padding: 2px;
        }
      </style>
    `;
  }
  static get properties() {
    return {
      label: {
        type: String,
        observer: '_update'
      },
      expanded: {
        type: Boolean,
        observer: '_update'
      },
      listeners: {
        'click': '_toggleHandler',
        'keydown': '_toggleHandler'
      }
    }
  }
  _toggleHandler(event) {
    if (event.path[0] !== this.shadowRoot.querySelector('.io-label')) return;
    if (event.which == 13 || event.which == 32 || event.type == 'click') {
      event.preventDefault();
      this.expanded = !this.expanded;
    }
  }
  _update() {
    this.render([
      ['span', {className: 'io-label', tabindex: '0'}, (this.expanded ? '▾' : '▸') + this.label],
      this.expanded ? ['slot'] : null
    ], this.shadowRoot);
  }
}


window.customElements.define('io-collapsable', IoCollapsable);
