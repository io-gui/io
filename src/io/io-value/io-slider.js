import {html} from "../ioutil.js"
import {Io} from "../io.js"

export class IoSlider extends Io {
  static get shadowStyle() {
    return html`
      <style>
        :host {
          display: inline-block;
          cursor: ew-resize;
          min-width: 100px;
          position: relative;
        }
        ::slotted(.io-slider-slit) {
          position: absolute;
          width: 100%;
          height: 0.2em;
          background: #111;
          top: calc(50% - 0.1em);
        }
        ::slotted(.io-slider-knob) {
          position: absolute;
          width: 0.4em;
          height: 100%;
          background: #999;
          left: calc(50%);
        }
      </style>
    `;
  }
  static get properties() {
    return {
      value: {
        type: Number,
        observer: '_update'
      },
      step: {
        type: Number,
        value: 0.01,
        observer: '_update'
      },
      min: {
        type: Number,
        value: 0,
        observer: '_update'
      },
      max: {
        type: Number,
        value: 1,
        observer: '_update'
      },
      listeners: {
        'mousedown': '_preventHandler'
      },
      attributes: {
        'tabindex': 0
      }
    }
  }
  _preventHandler(event) {
    event.preventDefault();
  }
  _update() {
    this.render([
      ['div', {className: 'io-slider-slit'}],
      ['div', {className: 'io-slider-knob'}],
      ['span', '\u00A0']
    ])
  }
}

window.customElements.define('io-slider', IoSlider);
