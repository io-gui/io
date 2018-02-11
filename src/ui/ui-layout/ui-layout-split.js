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
          overflow: hidden;
        }
        :host[orientation=horizontal] {
          flex-direction: row;
        }
        :host[orientation=vertical] {
          flex-direction: column;
        }
        :host[orientation=horizontal] > ui-layout-divider {
          width: 10px;
        }
        :host[orientation=vertical] > ui-layout-divider {
          height: 10px;
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
      listeners: {
        'ui-layout-divider-move': '_dividerMoveHandler'
      }
    }
  }
  _dividerMoveHandler(event) {
    event.stopPropagation();
    let movement = event.detail.movement;

    let i = event.detail.index;
    let d = this.orientation === 'horizontal' ? 'width' : 'height';

    var blocks = [].slice.call(this.children).filter(element => element.className === 'ui-layout-block');
    let prev = this.blocks[i];
    let next = this.blocks[i+1];

    if (!next[d] && !prev[d]) {
      next[d] = blocks[i+1].getBoundingClientRect()[d];
    }

    prev = this.blocks[i];
    next = this.blocks[i+1];

    if (prev[d]) prev[d] = Math.max(6, Math.min(Infinity, prev[d] + movement));
    if (next[d]) next[d] = Math.max(6, Math.min(Infinity, next[d] - movement));
    this.dispatchEvent(new CustomEvent('layout-changed', {
      detail: this.data,
      bubbles: true,
      composed: true
    }));
    this._update();
  }
  _update() {
    let d = this.orientation === 'horizontal' ? 'width' : 'height';
    let elements = [];
    for (var i = 0; i < this.blocks.length; i++) {
      let size = this.blocks[i][d];
      let style = {
        'flex-basis': 'auto',
        'flex-shrink': '10000',
        'flex-grow': '1'
      };
      if (size) style = {
        'flex-basis': size + 'px',
        'flex-shrink': '1',
        'flex-grow': '0'
      };
      if (this.blocks[i].tabs) {
        elements.push(['ui-layout-block', {
            class: 'ui-layout-block',
            style: style,
            data: this.blocks[i], // TODO
            selected: this.blocks[i].selected,
            elements: this.elements,
            tabs: this.blocks[i].tabs
          }]);
      } else {
        elements.push(['ui-layout-split', {
            class: 'ui-layout-block',
            style: style,
            data: this.blocks[i], // TODO
            elements: this.elements,
            blocks: this.blocks[i].horizontal || this.blocks[i].vertical,
            orientation: this.blocks[i].horizontal ? 'horizontal' : 'vertical'
          }]);
      }
      if (i < this.blocks.length - 1) {
        elements.push(['ui-layout-divider', {orientation: this.orientation, index: i}]);
      }
    }
    this.render(elements);
  }
}


window.customElements.define('ui-layout-split', UiLayoutSplit);
