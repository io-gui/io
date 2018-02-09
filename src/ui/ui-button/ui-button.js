import {html} from "../../io/ioutil.js"
import {Io} from "../../io/io.js"

export class UiButton extends Io {
  static get style() {
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
        'keyup': '_actionHandler',
        'mouseup': '_actionHandler',
        'touchend': '_actionHandler',
        'keydown': '_preventHandler',
        'mousedown': '_preventHandler'
      },
      attributes: {
        tabindex: 0
      }
    }
  }
  _actionHandler(event) {
    if (event.which == 13 || event.which == 32 || event.type == 'mouseup' || event.type == 'touchend') {
      event.preventDefault();
      if (typeof this.action === 'function') {
        this.action(this.value !== undefined ? this.value : event);
      }
    }
  }
  _preventHandler(event) {
    if (event.type === 'keydown' && event.which !== 9) {
      event.preventDefault();
    }
  }
}


window.customElements.define('ui-button', UiButton);
