import {html} from "../ioutil.js"
import {IoPointer} from "../iopointer.js"
import {Io} from "../io.js"

export class IoSlider extends IoPointer {
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
          top: calc(50% - 0.1em);
        }
        ::slotted(.io-slider-knob) {
          position: absolute;
          width: 0.4em;
          margin-left: -0.2em;
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
        value: 100,
        observer: '_update'
      },
      attributes: {
        'tabindex': 0
      },
      listeners: {
        'io-pointer-move': '_pointerMoveHandler'
      }
    }
  }
  _pointerMoveHandler(event) {
    let pos = Math.max(0,Math.min(1, event.detail.pointers[0].position.x / 2 + 0.5));
    // TODO: implement step
    this._setValue(this.min + (this.max - this.min) * pos);
  }
  _update() {
    let pos = 100 * (this.value - this.min) / (this.max - this.min);
    this.render([
      ['div', {className: 'io-slider-slit', style: {background: 'linear-gradient(to right, #2cf, #2c9 ' + pos + '%, #333 ' + (pos + 1) + '%)'}}],
      ['div', {className: 'io-slider-knob', style: {left: pos + '%'}}],
      ['span', '\u00A0']
    ]);
  }
}

window.customElements.define('io-slider', IoSlider);
