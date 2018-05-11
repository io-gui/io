import {Io, html} from "../../../iocore.js";
import "./app-split-divider.js";

export class AppSplit extends Io {
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
        :host > .app-split-flex {
          flex-basis: auto;
          flex-shrink: 10000;
          flex-grow: 1;
        }
        :host > .app-split-fixed {
          flex-shrink: 1;
          flex-grow: 0;
        }
        :host[orientation=horizontal] {
          flex-direction: row;
        }
        :host[orientation=vertical] {
          flex-direction: column;
        }
        :host[orientation=horizontal] > app-split-divider {
          width: 6px;
        }
        :host[orientation=vertical] > app-split-divider {
          height: 6px;
        }
      </style>
    `;
  }
  static get properties() {
    return {
      splits: Array,
      elements: Object,
      orientation: {
        value: 'horizontal',
        type: String,
        reflect: true
      },
      listeners: {
        'app-split-divider-move': '_dividerMoveHandler'
      }
    };
  }
  addSplit(elementID, droppedSplit, target) {
    let hor = this.orientation === 'horizontal';
    let ver = this.orientation === 'vertical';

    let $blocks = [].slice.call(this.children).filter(element => element.localName !== 'app-split-divider');
    let index = $blocks.indexOf(droppedSplit);
    let divide = -1;

    if ((hor && target == 'left') || (ver && target == 'top')) index += 0;
    else if ((hor && target == 'right') || (ver && target == 'bottom')) index += 1;
    else if ((hor && target == 'top') || (ver && target == 'left')) divide = 0;
    else if ((hor && target == 'bottom') || (ver && target == 'right')) divide = 1;

    let newBlock = ['app-block', {'tabs': [elementID], 'selected': 0}];
    if (divide !== -1) {
      let split = this.splits[index];
      this.splits.splice(index, 1, ['app-split', {'orientation': hor ? 'vertical' : 'horizontal', 'splits': [
        divide ? split : newBlock,
        divide ? newBlock : split
      ]}]);
    } else {
      this.splits.splice(index, 0, newBlock);
    }
    this.update();
  }
  update() {
    let hasFlex = false;
    for (let i = 0; i < this.splits.length; i++) {
      if (this.splits[i][2] === undefined) hasFlex = true;
    }
    // Make sure at least one is flex.
    if (!hasFlex) this.splits[parseInt(this.splits.length / 2)].length = 2;

    let splits = [];
    for (let i = 0; i < this.splits.length; i++) {
      let isFlex = this.splits[i][2] !== undefined;
      splits.push([this.splits[i][0], Object.assign({
        elements: this.elements,
        style: isFlex ? {'flex-basis': this.splits[i][2] + 'px'} : null,
        class: isFlex ? 'app-split-fixed' : 'app-split-flex'},
        this.splits[i][1])]);
      if (i < this.splits.length - 1) splits.push(['app-split-divider', {orientation: this.orientation, index: i}]);
    }
    this.render([splits]);
  }
  _dividerMoveHandler(event) {
    event.stopPropagation();

    let i = event.detail.index;

    let $blocks = [].slice.call(this.children).filter(element => element.localName !== 'app-split-divider');
    let prev = this.splits[i];
    let next = this.splits[i+1];

    if (next[2] !== undefined && prev[2] !== undefined) {
      next[2] = $blocks[i+1].getBoundingClientRect()[2];
    }

    if (prev[2] !== undefined) prev[2] = Math.max(0, prev[2] + event.detail.movement);
    if (next[2] !== undefined) next[2] = Math.max(0, next[2] - event.detail.movement);

    this.fire('app-split-changed', this.splits);
    this.update();
  }
  // addSplit(split, index, orientation) {
  //   console.log(split, index, orientation);
  //   // insert if orientation match
  //   // Add new split if orientation different.
  // }
  // removeSplit(split) {
  //   this.splits.splice(this.splits.indexOf(split), 1);
  //   this.update();
  // }
}

AppSplit.Register();
