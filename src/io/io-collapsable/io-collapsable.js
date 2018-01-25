import {html} from "../ioutil.js"
import {Io} from "../io.js"

export class IoCollapsable extends Io {
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
        observer: '_update'
      },
      listeners: {
        'click': '_toggleHandler',
        'keydown': '_toggleHandler'
      }
    }
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
      this.expanded ? ['slot'] : null
    ], this.shadowRoot);
  }
}


window.customElements.define('io-collapsable', IoCollapsable);
