import {Io, html} from "../../../iocore.js";
import "./app-block-label.js";
import "./app-block-tabs.js";

export class AppBlock extends Io {
  static get style() {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: column;
          background: #ccc;
        }
        /* :host > .app-split-drop-highlight {
          position: absolute;
          background: rgba(0, 0, 0, 0.25);
          width: 100%;
          height: 100%;
        }
        :host:not([dropzone]) > .app-split-drop-highlight {
          pointer-events: none;
          opacity: 0;
        }
        :host[dropzone=top] > .app-split-drop-highlight {
          background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 99.9px, transparent 100px);
        }
        :host[dropzone=bottom] > .app-split-drop-highlight {
          background: linear-gradient(to top, rgba(0, 0, 0, 0.5) 99.9px, transparent 100px);
        }
        :host[dropzone=left] > .app-split-drop-highlight {
          background: linear-gradient(to right, rgba(0, 0, 0, 0.5) 99.9px, transparent 100px);
        }
        :host[dropzone=right] > .app-split-drop-highlight {
          background: linear-gradient(to left, rgba(0, 0, 0, 0.5) 99.9px, transparent 100px);
        } */
      </style>
    `;
  }
  static get properties() {
    return {
      elements: {
        type: Object
      },
      tabs: {
        type: Array
      },
      selected: {
        type: String
      }
    };
  }
  update() {
    this.render([
      ['app-block-tabs', {element: this.elements[this.selected], tabs: this.tabs, selected: this.selected}],
      this.elements[this.selected]
    ]);
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('app-block-drag-start', this._tabDragStartHandler);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('app-block-drag-start', this._tabDragStartHandler);
    window.removeEventListener('app-block-drag', this._tabDragHandler);
    window.removeEventListener('app-block-drag-end', this._tabDragEndHandler);
  }
  _tabDragStartHandler() {
    this._rect = this.getBoundingClientRect();
    window.addEventListener('app-block-drag', this._tabDragHandler);
    window.addEventListener('app-block-drag-end', this._tabDragEndHandler);
  }
  _tabDragHandler(event) {
    // let dx = event.detail.x;
    // let dy = event.detail.y;
    // let x = 2 * (((dx - this._rect.x) / this._rect.width) - 0.5);
    // let y = 2 * (((dy - this._rect.y) / this._rect.height) - 0.5);
    // if (Math.abs(y) < 1 && Math.abs(x) < 1) {
    //   if (Math.abs(y) < 0.5 && Math.abs(x) < 0.5) this.dropzone = 'center';
    //   else if (y < -Math.abs(x)) this.dropzone = 'top';
    //   else if (y > +Math.abs(x)) this.dropzone = 'bottom';
    //   else if (x < -Math.abs(y)) this.dropzone = 'left';
    //   else if (x > +Math.abs(y)) this.dropzone = 'right';
    //   else this.dropzone = 'center';
    // } else {
    //   this.dropzone = '';
    // }
  }
  _tabDragEndHandler(event) {
    // window.removeEventListener('app-block-drag', this._tabDragHandler);
    // window.removeEventListener('app-block-drag-end', this._tabDragEndHandler);
    // if (this.dropzone === 'center') {
    //   if (event.detail.host !== this) {
    //     this.addTab(event.detail.tab);
    //     event.detail.host.removeTab(event.detail.tab);
    //   }
    // } else {
    //   // this.addSplit(event.detail.tab, this.dropzone);
    // }
    // this.dropzone = '';
  }
  // addTab(tab, index) {
  //   // TODO: implement indexed insertion on tab hover.
  //   let tabs = this.tabs;
  //   console.log(index);
  //   if (tabs.indexOf(tab) === -1) tabs.push(tab);
  //   this.fire('app-tab-added', this.tabs);
  //   this._selectHandler(tab);
  // }
  // removeTab(tab) {
  //   let tabs = this.tabs;
  //   if (tabs.indexOf(tab) !== -1) tabs.splice(tabs.indexOf(tab), 1);
  //   let selected = this.selected || tabs[tabs.length - 1];
  //   if (selected === tab) selected = tabs[tabs.length - 1];
  //   this.fire('app-tab-removed', this.tabs);
  //   this._selectHandler(selected);
  // }
  // // addSplit(tab, split) {
  // //   console.log(tab, split);
  // // }
  // _optionSelectHandler(tab) {
  //   this.addTab(tab);
  // }
  // _selectHandler(elem) {
  //   this.selected = elem;
  //   this.fire('app-tab-selected', this.tabs);
  //   this.update();
  // }
  // update() {
  //   let tabs = this.tabs;
  //   this.render([
  //     ['app-block', {selected: this.selected, tabs: this.tabs, elements: this.elements}]
  //   ]);
  // }
}

AppBlock.Register();









// listeners: {
//   'dragstart': '_dragstartHandler',
//   'dragend': '_dragendHandler'
// },
// droptarget: {
//   type: HTMLElement,
//   observer: '_dropTargetChanged'
// },
// attributes: {
//   draggable: true
// }
// _dragstartHandler() {
//   UiAppTab.dragged = this;
// }
// _dropTargetChanged(value, oldValue) {
//   if (oldValue) oldValue.dropzone = '';
// }
// _dragendHandler(event) {
//   if (this.droptarget && this.droptarget.dropzone === 'center') {
//     this.droptarget.tabs.push(this.value);
//     //TODO: ugh
//     this.parentElement.parentElement.tabs.splice(this.parentElement.parentElement.tabs.indexOf(this.value), 1);
//     this.droptarget.update();
//     this.parentElement.parentElement.update();
//   }
//   if (this.droptarget) this.droptarget.dropzone = '';
// }
// _dragHandler(event) {
//   let blocks = [];
//   for (let i = 0; i < event.path.length; i++) {
//     if (event.path[i].localName === 'app-split-block') {
//       blocks.push(event.path[i]);
//     }
//   }
//   console.log(event)
//   for (let i = 0; i < blocks.length; i++) {
//     console.log(blocks[i])
//   }
//
//   if (this.targetBlock !== blocks[0]) {
//     // if (this.targetBlock) this.targetBlock.droptarget = '';
//     this.targetBlock = blocks[0];
//   }
//
//
// }
// _dragoverHandler(event) {
//   // console.log(event.srcElement)
// }

// /* events fired on the draggable target */
// document.addEventListener("drag", function( event ) {
// }, false);
// document.addEventListener("dragstart", function( event ) {
//     // store a ref. on the dragged elem
//     dragged = event.target;
//     // make it half transparent
//     event.target.style.opacity = .5;
// }, false);
// document.addEventListener("dragend", function( event ) {
//     // reset the transparency
//     event.target.style.opacity = "";
// }, false);
// /* events fired on the drop targets */
// document.addEventListener("dragover", function( event ) {
//     // prevent default to allow drop
//     event.preventDefault();
// }, false);
// document.addEventListener("dragenter", function( event ) {
//     // highlight potential drop target when the draggable element enters it
//     if ( event.target.className == "dropzone" ) {
//         event.target.style.background = "purple";
//     }
// }, false);
// document.addEventListener("dragleave", function( event ) {
//     // reset background of potential drop target when the draggable element leaves it
//     if ( event.target.className == "dropzone" ) {
//         event.target.style.background = "";
//     }
// }, false);
// document.addEventListener("drop", function( event ) {
//     // prevent default action (open as link for some elements)
//     event.preventDefault();
//     // move dragged elem to the selected drop target
//     if ( event.target.className == "dropzone" ) {
//         event.target.style.background = "";
//         dragged.parentNode.removeChild( dragged );
//         event.target.appendChild( dragged );
//     }
// }, false);
