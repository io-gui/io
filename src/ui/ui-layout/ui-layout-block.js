import {html} from "../../io/ioutil.js"
import {Io} from "../../io/io.js"
import "./ui-layout-tab.js"

export class UiLayoutBlock extends Io {
  static get style() {
    return html`
      <style>
        :host  {
          flex: 1;
        }
        :host ui-layout-tab {

        }
      </style>
    `;
  }
  static get properties() {
    return {
      elements: {
        type: Object
      },
      selected: {
        type: String,
        observer: '_update'
      },
      width: {
        observer: '_update'
      },
      height: {
        observer: '_update'
      }
    }
  }
  constructor(props) {
    super(props);
    if (this.selected === '')
        this.selected = Object.keys(this.elements)[0];
  }
  selectHandler(elem) {
    this.selected = elem;
  }
  _update() {
    this.style.width = typeof this.width === 'number' ? this.width + 'px' : this.width;
    this.style.height = typeof this.height === 'number' ? this.height + 'px' : this.height;

    const Elem = entry => ['ui-layout-tab', {
        value: entry[0],
        action: this.selectHandler,
        selected: entry[0] === this.selected
      }, entry[0]];
    this.render([
      ['div', [
        Object.entries(this.elements).map(Elem),
      ]],
      this.elements[this.selected]
    ]);
  }
}


window.customElements.define('ui-layout-block', UiLayoutBlock);
