import {html} from "../../io/ioutil.js"
import {Io} from "../../io/io.js"

export class LayoutBlock extends Io {
  static get style() {
    return html`
      <style>
        :host  {
          display: flex;
        }
      </style>
    `;
  }
  static get properties() {
    return {
      width: {
        observer: '_update'
      },
      height: {
        observer: '_update'
      }
    }
  }
  _update() {
    this.style.width = typeof this.width === 'number' ? this.width + 'px' : this.width;
    this.style.height = typeof this.height === 'number' ? this.height + 'px' : this.height;
  }
}


window.customElements.define('layout-block', LayoutBlock);
