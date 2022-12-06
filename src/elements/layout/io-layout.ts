import { IoElement, RegisterIoElement } from '../../core/element.js';

/*

 **/
@RegisterIoElement
export class IoLayout extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      flex: 1;
      display: flex;
      overflow: hidden;
      touch-action: none;
    }
    :host[orientation=horizontal] {
      flex-direction: row;
    }
    :host[orientation=vertical] {
      flex-direction: column;
    }
    `;
  }
  static get Properties(): any {
    return {
      elements: Array,
      splits: {
        type: Array,
        observe: true,
      },
      editable: true,
      orientation: {
        value: 'horizontal',
        reflect: true,
      },
    };
  }
  static get Listeners() {
    return {
      'io-layout-divider-move': '_onDividerMove',
      'io-layout-tab-insert': '_onLayoutTabInsert',
    };
  }
  _onSelectedChanged() {
    const $blocks: any = [].slice.call(this.children).filter((element: any) => element.localName !== 'io-layout-divider');
    for (let i = 0; i < $blocks.length; i++) {
      if ($blocks[i].selected) {
        this.splits[i].selected = $blocks[i].selected;
      }
    }
  }
  changed() {
    // let dim = this.orientation === 'horizontal' ? 'width' : 'height';
    // let SPLIT_SIZE = 5;
    // let rectSize = this.getBoundingClientRect()[dim];
    // let maxFlex = rectSize - (this.splits.length - 1) * SPLIT_SIZE;
    const children = [];
    for (let i = 0; i < this.splits.length; i++) {
      const split = this.splits[i];
      const flexBasis = split.size !== undefined ? split.size + 'px' : null;
      const style = {
        'flex-basis': flexBasis ? flexBasis : 'auto',
        'flex-grow': flexBasis ? 0 : 1,
        'flex-shrink': flexBasis ? 0 : 1,
      };
      if (split.tabs) {
        children.push(['io-selector-tabs', {
          elements: this.elements,
          filter: split.tabs, // TODO: reimplement
          selected: split.selected,
          editable: this.editable,
          style: style,
          'on-selected-changed': this._onSelectedChanged
        }]);
        // children.push(['div', {style: style}, ' ' + split.size]);
      } else if (split.splits) {
        children.push(['io-layout', {
          elements: this.elements,
          splits: split.splits,
          orientation: split.orientation,
          editable: this.editable,
          style: style,
        }]);
      } else {
        // TODO: Improve data validation.
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
  // splitsChanged(event) {
  //   // for (let i = this.splits.length; i--;) {
  //   //   if (this.splits[i][1].tabs == event.detail.tabs) {
  //   //     this.splits[i][1].selected = event.detail.selected;
  //   //     // if (event.detail.tabs.length === 0) {
  //   //     //   this.splits.splice(i, 1);
  //   //     //   console.log(event.detail.tabs);
  //   //     // }
  //   //   }
  //   // }
  // }
  // addSplit(elementID, srcBlock, target) {
  //   let hor = this.orientation === 'horizontal';
  //   let ver = this.orientation === 'vertical';
  //
  //   const $blocks = [].slice.call(this.children).filter(element => element.localName !== 'io-layout-divider');
  //   let spliceIndex = $blocks.indexOf(srcBlock);
  //   let divideIndex = -1;
  //
  //   if ((hor && target == 'right') || (ver && target == 'down')) spliceIndex += 1;
  //   else if ((hor && target == 'up') || (ver && target == 'left')) divideIndex = 0;
  //   else if ((hor && target == 'down') || (ver && target == 'right')) divideIndex = 1;
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
  _onLayoutTabInsert(event: CustomEvent) {
    event.stopImmediatePropagation();
    const $blocks: any = [].slice.call(this.children).filter((element: any) => element.localName !== 'io-layout-divider');
    const srcTabs = event.detail.source;
    const destTabs = event.detail.destination;
    const destIndex = $blocks.indexOf(destTabs);
    const tab = event.detail.tab;
    const v = this.orientation === 'vertical';
    const dir = event.detail.direction;

    for (let i = srcTabs.filter.length; i--;) {
      if (srcTabs.filter[i] === tab) {
        srcTabs.filter.splice(i, 1);
        srcTabs.selected = srcTabs.filter[srcTabs.filter.length - 1];
        srcTabs.changed();
      }
    }

    if ((v && dir === 'down') || (!v && dir === 'right')) {
      this.splits.splice(destIndex + 1, 0, {tabs: [tab], selected: tab});
    } else if ((v && dir === 'up') || (!v && dir === 'left')) {
      this.splits.splice(destIndex, 0, {tabs: [tab], selected: tab});
    } else if ((v && dir === 'left') || (!v && dir === 'up')) {
      this.splits[destIndex] = {splits: [
        {tabs: [tab], selected: tab},
        this.splits[destIndex],
      ], orientation: v ? 'horizontal' : 'vertical'};
    } else if ((v && dir === 'right') || (!v && dir === 'down')) {
      this.splits[destIndex] = {splits: [
        this.splits[destIndex],
        {tabs: [tab], selected: tab},
      ], orientation: v ? 'horizontal' : 'vertical'};
    }
    this.changed();
  }
  _onDividerMove(event: CustomEvent) {
    event.stopImmediatePropagation();
    const pi = event.detail.index;
    const ni = event.detail.index + 1;

    const prev = this.splits[pi];
    const next = this.splits[ni];

    // TODO: better clipping and snapping
    const dp = prev.size === undefined ? undefined : (prev.size + event.detail.movement);
    const dn = next.size === undefined ? undefined : (next.size - event.detail.movement);

    // console.log(dp, dn);
    if ((dp !== undefined && dp >= 0) && (dn === undefined || dn >= 0)) {
      this.splits[pi].size = Math.max(0, dp);
    }
    if ((dn !== undefined && dn >= 0) && (dp === undefined || dp >= 0)) {
      this.splits[ni].size = Math.max(0, dn);
    }

    // TODO improve UX to work as expected in all edge cases.

    if (prev.size === undefined && next.size === undefined) {
      const $blocks: any = [].slice.call(this.children).filter((element: any) => element.localName !== 'io-layout-divider');
      const dim = this.orientation === 'horizontal' ? 'width' : 'height';
      const ci = Math.floor(this.splits.length / 2);
      if (Math.abs(ci - pi) <= Math.abs(ci - ni)) {
        for (let j = ni; j < this.splits.length; j++) {
          this.splits[j].size = parseInt($blocks[j].getBoundingClientRect()[dim]);
        }
      } else {
        for (let j = pi; j >= 0; j--) {
          this.splits[j].size = parseInt($blocks[j].getBoundingClientRect()[dim]);
        }
      }
    }
    this.queue('splits', this.splits, this.splits);
    this.dispatchQueue();
  }
}

@RegisterIoElement
export class IoLayoutDivider extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      background: var(--io-background-color);
      color: var(--io-color);
      z-index: 1;
      display: flex;
      flex: none;
      border: var(--io-border);
      border-color: var(--io-border-color-outset);
      user-select: none;
      transition: background-color 0.4s;
    }
    :host:hover {

    }
    :host[orientation=horizontal] {
      cursor: col-resize;
      width: var(--io-spacing);
      border-top: 0;
      border-bottom: 0;
    }
    :host[orientation=vertical] {
      cursor: row-resize;
      height: var(--io-spacing);
      border-left: 0;
      border-right: 0;
    }
    :host > .app-divider {
      flex: 1;
      display: flex;
      margin-left: -0.03em;
      margin-top: -0.06em;
      align-items: center;
      justify-content: center;
    }
    `;
  }
  static get Properties(): any {
    return {
      orientation: {
        value: 'horizontal',
        reflect: true
      },
      index: Number,
      pointermode: 'relative'
    };
  }
  static get Listeners() {
    return {
      'pointermove': '_onPointermove'
    };
  }
  _onPointermove(event: PointerEvent) {
    if (event.buttons) {
      event.preventDefault();
      this.setPointerCapture(event.pointerId);
      this.dispatchEvent('io-layout-divider-move', {
        movement: this.orientation === 'horizontal' ? event.movementX : event.movementY,
        index: this.index
      }, true);
    }
  }
  changed() {
    this.template([
      ['div', {class: 'app-divider'}, this.orientation === 'horizontal' ? '⋮' : '⋯']
    ]);
  }
}
