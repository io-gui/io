import {html, IoElement} from "../core/element.js";
import "./layout-divider.js";
import "./layout-tabs.js";

export class IoLayoutSplits extends IoElement {
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
      elements: Object,
      splits: Object,
      orientation: {
        value: 'horizontal',
        reflect: true
      }
    };
  }
  // static get listeners() {
  //   return {
  //     'layout-divider-move': '_onDividerMove',
  //     'layout-changed': '_onAppBlockChanged'
  //   };
  // }
  // _onAppBlockChanged(event) {
  //   for (let i = this.splits.length; i--;) {
  //     if (this.splits[i][1].tabs == event.detail.tabs) {
  //       this.splits[i][1].selected = event.detail.selected;
  //       // if (event.detail.tabs.length === 0) {
  //       //   this.splits.splice(i, 1);
  //       //   console.log(event.detail.tabs);
  //       // }
  //     }
  //   }
  //   this.changed();
  // }
  // addSplit(elementID, srcBlock, target) {
  //   let hor = this.orientation === 'horizontal';
  //   let ver = this.orientation === 'vertical';
  //
  //   let $blocks = [].slice.call(this.children).filter(element => element.localName !== 'io-layout-divider');
  //   let spliceIndex = $blocks.indexOf(srcBlock);
  //   let divideIndex = -1;
  //
  //   if ((hor && target == 'right') || (ver && target == 'bottom')) spliceIndex += 1;
  //   else if ((hor && target == 'top') || (ver && target == 'left')) divideIndex = 0;
  //   else if ((hor && target == 'bottom') || (ver && target == 'right')) divideIndex = 1;
  //
  //   let newBlock = ['io-layout', {'tabs': [elementID], 'selected': 0}];
  //   if (divideIndex !== -1) {
  //     let split = this.splits[spliceIndex];
  //     this.splits.splice(spliceIndex, 1, ['io-layout', {'orientation': hor ? 'vertical' : 'horizontal', 'splits': [
  //       divideIndex ? split : newBlock,
  //       divideIndex ? newBlock : split
  //     ]}]);
  //   } else {
  //     this.splits.splice(spliceIndex, 0, newBlock);
  //   }
  //   this.changed();
  // }
  changed() {
    // let dim = this.orientation === 'horizontal' ? 'width' : 'height';
    // let SPLIT_SIZE = 5;
    // let rectSize = this.getBoundingClientRect()[dim];
    // let maxFlex = rectSize - (this.splits.length - 1) * SPLIT_SIZE;

    let children = [];
    for (let i = 0; i < this.splits.length; i++) {
      const split = this.splits[i];
      const flexBasis = split.size !== undefined ? split.size + 'px' : null;
      const style = {
        'flex-basis': flexBasis ? flexBasis : 'auto',
        'flex-grow': flexBasis ? 0 : 1,
        'flex-shrink': 1 // flexBasis ? 1 : 0
      };
      if (split.tabs) {
        children.push(['io-layout-tabs', {
          elements: this.elements,
          tabs: split.tabs,
          selected: split.selected,
          style: style,
        }]);
      } else if (split.splits) {
        children.push(['io-layout-splits', {
          elements: this.elements,
          splits: split.splits,
          orientation: split.orientation,
          style: style,
        }]);
      } else {
        children.push(['p', 'Malformed layout data.']);
      }
      if (i < this.splits.length - 1) {
        children.push(['io-layout-divider', {
          orientation: this.orientation || 'horizontal',
          index: i
        }]);
      }
    }
    this.template([children]);
  }
  // _onDividerMove(event) {
  //   event.stopPropagation();
  //
  //   let pi = event.detail.index;
  //   let ni = event.detail.index + 1;
  //
  //   let prev = this.splits[pi];
  //   let next = this.splits[ni];
  //
  //   // TODO: better clipping and snapping
  //   let dp = prev[2] === undefined ? undefined : (prev[2] + event.detail.movement);
  //   let dn = next[2] === undefined ? undefined : (next[2] - event.detail.movement);
  //
  //   // console.log(dp, dn);
  //   if ((dp !== undefined && dp >= 0) && (dn === undefined || dn >= 0)) {
  //     this.splits[pi][2] = Math.max(0, dp);
  //   }
  //   if ((dn !== undefined && dn >= 0) && (dp === undefined || dp >= 0)) {
  //     this.splits[ni][2] = Math.max(0, dn);
  //   }
  //
  //   if (prev[2] === undefined && next[2] === undefined) {
  //     let $blocks = [].slice.call(this.children).filter(element => element.localName !== 'layout-divider');
  //     let dim = this.orientation === 'horizontal' ? 'width' : 'height';
  //     let ci = Math.floor(this.splits.length / 2);
  //     if (Math.abs(ci - pi) <= Math.abs(ci - ni)) {
  //       for (let j = ni; j < this.splits.length; j++) {
  //         this.splits[j][2] = parseInt($blocks[j].getBoundingClientRect()[dim]);
  //       }
  //     } else {
  //       for (let j = pi; j >= 0; j--) {
  //         this.splits[j][2] = parseInt($blocks[j].getBoundingClientRect()[dim]);
  //       }
  //     }
  //   }
  //
  //
  //   this.dispatchEvent('layout-changed', this.splits);
  //   this.changed();
  // }
}

IoLayoutSplits.Register();
