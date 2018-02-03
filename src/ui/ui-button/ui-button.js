import {html} from "../../io/ioutil.js"
import {Io} from "../../io/io.js"

export class UiButton extends Io {
  static get shadowStyle() {
    return html`
      <style>
        :host {
          cursor: pointer;
        }
      </style>
    `;
  }
  static get properties() {
    return {
      action: {
        type: Function
      },
      value: {},
      listeners: {
        'click': '_actionHandler',
        'keyup': '_actionHandler',
        'mousedown': '_preventHandler'
      },
      attributes: {
        tabindex: 0
      }
    }
  }
  _actionHandler(event) {
    if (event.which == 13 || event.which == 32 || event.type == 'click') {
      if (typeof this.action === 'function') {
        this.action(this.value !== undefined ? this.value : event);
      }
    }
  }
  _preventHandler(event) {
    event.preventDefault();
    this.focus();
  }
}


window.customElements.define('ui-button', UiButton);
