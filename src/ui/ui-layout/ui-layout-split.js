import {html} from "../../io/ioutil.js"
import {Io} from "../../io/io.js"
import "./ui-layout-divider.js"

export class UiLayoutSplit extends Io {
  static get style() {
    return html`
      <style>
        :host  {
          flex: 1;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        :host[width],
        :host[height] {
          flex: none;
        }
        :host[orientation=horizontal] {
          flex-direction: row;
        }
        :host[orientation=vertical] {
          flex-direction: column;
        }
      </style>
    `;
  }
  static get properties() {
    return {
      data: {
        type: Object
      },
      elements: {
        type: Object
      },
      blocks: {
        type: Array
      },
      orientation: {
        value: 'horizontal',
        type: String,
        reflectToAttribute: true
      },
      width: {
        typr: String,
        observer: '_resize',
        reflectToAttribute: true
      },
      height: {
        typr: String,
        observer: '_resize',
        reflectToAttribute: true
      }
    }
  }
  _resize() {
    // TODO: implement sizing in flex
    this.style.width = this.width ? this.width + 'px' : '';
    this.style.height = this.height ? this.height + 'px' : '';
    // TODO:
    if (!this.data) return;
    this.data.width = this.width;
    this.data.height = this.height;
    if (!this.data.width) delete this.data.width;
    if (!this.data.height) delete this.data.height;
    this.dispatchEvent(new CustomEvent('layout-changed', {
      detail: this.data,
      bubbles: true,
      composed: true
    }));
  }
  _update() {
    this._resize();
    let elements = [];
    for (var i = 0; i < this.blocks.length; i++) {
      if (this.blocks[i].tabs) {
        elements.push(['ui-layout-block', {
            data: this.blocks[i], // TODO
            height: this.blocks[i].height,
            width: this.blocks[i].width,
            selected: this.blocks[i].selected,
            elements: this.elements,
            tabs: this.blocks[i].tabs}]);
      } else {
        elements.push(['ui-layout-split', {
            data: this.blocks[i], // TODO
            height: this.blocks[i].height,
            width: this.blocks[i].width,
            elements: this.elements,
            blocks: this.blocks[i].horizontal || this.blocks[i].vertical,
            orientation: this.blocks[i].horizontal ? 'horizontal' : 'vertical'}]);
      }
      if (i < this.blocks.length - 1) {
        elements.push(['ui-layout-divider', {orientation: this.orientation}]);
      }
    }
    this.render(elements);
  }
}


window.customElements.define('ui-layout-split', UiLayoutSplit);
