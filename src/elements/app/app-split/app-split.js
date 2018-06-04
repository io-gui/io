import {html, IoElement} from "../../../io-element.js";
import "./app-split-divider.js";

export class AppSplit extends IoElement {
  static get style() {
    return html`<style>
      :host  {
        flex: 1;
        display: flex;
        overflow: hidden;
      }
      :host[orientation=horizontal] {
        flex-direction: row;
      }
      :host[orientation=vertical] {
        flex-direction: column;
      }
    </style>`;
  }
  static get properties() {
    return {
      splits: Array,
      elements: Object,
      orientation: {
        value: 'horizontal',
        reflect: true
      }
    };
  }
  static get listeners() {
    return {
      'app-split-divider-move': '_onDividerMove',
      'app-block-changed': '_onAppBlockChanged'
    };
  }
  _onAppBlockChanged(event) {
    for (let i = this.splits.length; i--;) {
      if (this.splits[i][1].tabs == event.detail.tabs) {
        this.splits[i][1].selected = event.detail.selected;
        // if (event.detail.tabs.length === 0) {
        //   this.splits.splice(i, 1);
        //   console.log(event.detail.tabs);
        // }
      }
    }
    this.update();
  }
  addSplit(elementID, srcBlock, target) {
    let hor = this.orientation === 'horizontal';
    let ver = this.orientation === 'vertical';

    let $blocks = [].slice.call(this.children).filter(element => element.localName !== 'app-split-divider');
    let spliceIndex = $blocks.indexOf(srcBlock);
    let divideIndex = -1;

    if ((hor && target == 'right') || (ver && target == 'bottom')) spliceIndex += 1;
    else if ((hor && target == 'top') || (ver && target == 'left')) divideIndex = 0;
    else if ((hor && target == 'bottom') || (ver && target == 'right')) divideIndex = 1;

    let newBlock = ['app-block', {'tabs': [elementID], 'selected': 0}];
    if (divideIndex !== -1) {
      let split = this.splits[spliceIndex];
      this.splits.splice(spliceIndex, 1, ['app-split', {'orientation': hor ? 'vertical' : 'horizontal', 'splits': [
        divideIndex ? split : newBlock,
        divideIndex ? newBlock : split
      ]}]);
    } else {
      this.splits.splice(spliceIndex, 0, newBlock);
    }
    this.update();
  }
  update() {
    // let dim = this.orientation === 'horizontal' ? 'width' : 'height';
    // let SPLIT_SIZE = 5;
    // let rectSize = this.getBoundingClientRect()[dim];
    // let maxFlex = rectSize - (this.splits.length - 1) * SPLIT_SIZE;

    let flexBasis = new Array(this.splits.length);

    // let flexCount = 0;
    for (let i = 0; i < this.splits.length; i++) {
      if (this.splits[i][2] !== undefined) {
        // maxFlex -= this.splits[i][2];
        flexBasis[i] = this.splits[i][2] + 'px';
      } else {
        // flexCount++;
      }
    }

    let children = [];
    for (let i = 0; i < this.splits.length; i++) {
      children.push([this.splits[i][0], Object.assign({
        elements: this.elements,
        style: {
          'flex-basis': flexBasis[i] ? flexBasis[i] : 'auto',
          'flex-grow': flexBasis[i] ? 0 : 1,
          'flex-shrink': 1
          // 'flex-shrink': flexBasis[i] ? 1 : 0
        }},
        this.splits[i][1])]);
      if (i < this.splits.length - 1) children.push(['app-split-divider', {orientation: this.orientation, index: i}]);
    }
    this.render([children]);

    let sizes = [];
    for (let j = 0; j < this.splits.length; j++) {
      sizes.push(this.splits[j][2]);
    }
    // console.log(sizes);
  }
  _onDividerMove(event) {
    event.stopPropagation();

    let pi = event.detail.index;
    let ni = event.detail.index + 1;

    let prev = this.splits[pi];
    let next = this.splits[ni];

    // TODO: better clipping and snapping
    let dp = prev[2] === undefined ? undefined : (prev[2] + event.detail.movement);
    let dn = next[2] === undefined ? undefined : (next[2] - event.detail.movement);

    // console.log(dp, dn);
    if ((dp !== undefined && dp >= 0) && (dn === undefined || dn >= 0)) {
      this.splits[pi][2] = Math.max(0, dp);
    }
    if ((dn !== undefined && dn >= 0) && (dp === undefined || dp >= 0)) {
      this.splits[ni][2] = Math.max(0, dn);
    }

    if (prev[2] === undefined && next[2] === undefined) {
      let $blocks = [].slice.call(this.children).filter(element => element.localName !== 'app-split-divider');
      let dim = this.orientation === 'horizontal' ? 'width' : 'height';
      let ci = Math.floor(this.splits.length / 2);
      if (Math.abs(ci - pi) <= Math.abs(ci - ni)) {
        for (let j = ni; j < this.splits.length; j++) {
          this.splits[j][2] = parseInt($blocks[j].getBoundingClientRect()[dim]);
        }
      } else {
        for (let j = pi; j >= 0; j--) {
          this.splits[j][2] = parseInt($blocks[j].getBoundingClientRect()[dim]);
        }
      }
    }


    this.dispatchEvent('app-split-changed', this.splits);
    this.update();
  }
}

AppSplit.Register();
