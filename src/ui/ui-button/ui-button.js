import {html} from "../../io/ioutil.js"
import {Io} from "../../io/io.js"

export class UiButton extends Io {
  static get style() {
    return html`
      <style>
        :host {
          cursor: pointer;
          display: inline-block;
          white-space: nowrap;
        }
      </style>
    `;
  }
  static get properties() {
    return {
      value: {
      },
      label: {
        type: String
      },
      action: {
        type: Function
      },
      listeners: {
        'keyup': '_actionHandler',
        'click': '_actionHandler',
        'keydown': '_preventHandler',
        'mousedown': '_preventHandler'
      },
      attributes: {
        tabindex: 0
      }
    }
  }
  _actionHandler(event) {
    if (event.which == 13 || event.which == 32 || event.type == 'click') {
      event.preventDefault();
      if (typeof this.action === 'function') this.action(this.value);
    }
  }
  _preventHandler(event) {
    if (event.type === 'keydown' && event.which !== 9) {
      event.preventDefault();
    } else if (event.type == 'mousedown') {
      event.preventDefault();
    }
  }
  update() {
    this.render([['span', this.label]]);
  }
}


window.customElements.define('ui-button', UiButton);
