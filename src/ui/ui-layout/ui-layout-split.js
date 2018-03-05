import {Io, html} from "../../io.js";
import "../ui-tabs/ui-tabs.js";
import "./ui-layout-divider.js";

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
        :host > ui-layout-divider:last-of-type {
          display: none;
        }
      </style>
    `;
  }
  static get properties() {
    return {
      splits: {
        type: Array,
        observer: 'update'
      },
      elements: {
        type: Object
      },
      orientation: {
        value: 'horizontal',
        type: String,
        reflectToAttribute: true
      },
      listeners: {
        'ui-layout-divider-move': '_dividerMoveHandler',
        'ui-tab-added': '_tabChangedHandler',
        'ui-tab-removed': '_tabRemovedHandler',
        'ui-tab-selected': '_tabChangedHandler'
      }
    };
  }
  _dividerMoveHandler(event) {
    event.stopPropagation();
    let movement = event.detail.movement;

    let i = event.detail.index;
    let d = this.orientation === 'horizontal' ? 'width' : 'height';
    let splits = this.splits;

    let $blocks = [].slice.call(this.children).filter(element => element.localName !== 'ui-layout-divider');
    let prev = splits[i];
    let next = splits[i+1];

    if (next[1][d] !== undefined && prev[1][d] !== undefined) {
      next[1][d] = $blocks[i+1].getBoundingClientRect()[1][d];
    }

    prev = splits[i];
    next = splits[i+1];

    if (prev[1][d] !== undefined) prev[1][d] = Math.max(0, prev[1][d] + movement);
    if (next[1][d] !== undefined) next[1][d] = Math.max(0, next[1][d] - movement);

    this.fire('layout-changed', this.splits);
    this.update();
  }
  _tabRemovedHandler(event) {
    event.stopPropagation();
    if (event.detail.length === 0) {
      this.removeSplit(event.detail);
    }
  }
  _tabChangedHandler(event) {
    event.stopPropagation();
    this.fire('layout-changed', this.splits);
  }
  addSplit(split, index, orientation) {
    console.log(split, index, orientation);
    // insert if orientation match
    // Add new split if orientation different.
  }
  removeSplit(split) {
    this.splits.splice(this.splits.indexOf(split), 1);
    this.update();
  }
  update() {
    let d = this.orientation === 'horizontal' ? 'width' : 'height';
    let splits = this.splits;
    // let elements = [];
    let styles = [];

    // Make sure at least one is flex (no size).
    let hasFlex = false;
    for (let i = 0; i < splits.length; i++) {
      let size = splits[i][1][d];
      if (size === undefined) hasFlex = true;
    }
    if (!hasFlex) delete splits[parseInt(splits.length / 2)][1][d];

    for (let i = 0; i < splits.length; i++) {
      let size = splits[i][1][d];
      styles[i] = {
        'flex-basis': 'auto',
        'flex-shrink': '10000',
        'flex-grow': '1'
      };
      if (size !== undefined) styles[i] = {
        'flex-basis': size + 'px',
        'flex-shrink': '1',
        'flex-grow': '0'
      };
    }
    this.render([
      [].concat(...this.splits.map((entry, i) => [
        [entry[0], Object.assign({elements: this.elements, style: styles[i]}, entry[1])],
        ['ui-layout-divider', {orientation: this.orientation, index: i}]
      ]))
    ]);
  }
}


window.customElements.define('ui-layout-split', UiLayoutSplit);
