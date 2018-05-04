import {Io, html} from "../../iocore.js";
import {IoPointerMixin} from "../../mixins/iopointer.js";

const _dragIcon = document.createElement('div');
_dragIcon.style = "position: absolute; width: 40px; height: 40px; background: rgba(0,0,0,0.5);";

export class UiTabSelector extends IoPointerMixin(Io) {
  static get style() {
    return html`
      <style>
        :host {
          display: inline-block;
          cursor: pointer;
          white-space: nowrap;
          padding: 0 0.2em;
        }
        :host[selected] {
          font-weight: bold;
        }
      </style>
    `;
  }
  static get properties() {
    return {
      value: {
        type: String,
        observer: 'update'
      },
      host: {
        type: HTMLElement
      },
      selected: {
        type: Boolean,
        reflect: true
      },
      action: {
        type: Function
      },
      listeners: {
        'io-pointer-end': '_pointerEndHandler',
        'io-pointer-move': '_pointerMoveHandler'
      }
    };
  }
  _pointerEndHandler(event) {
    if (event.detail.pointer[0].distance.length() < 4 && !this._dragging) {
      if (typeof this.action === 'function') this.action(this.value);
    }
    if (_dragIcon.parentNode) {
      _dragIcon.parentNode.removeChild(_dragIcon);
    }
    if (this._dragging) {
      this.fire('ui-tab-drag-end', {tab: this.value, host: this.host});
      this._dragging = false;
    }
  }
  _pointerMoveHandler(event) {
    if (event.detail.pointer[0].distance.length() > 32 || this._dragging) {
      if (!this._dragging) {
        this._rect = this.getBoundingClientRect();
        this._dragging = true;
        this._clickmask.appendChild(_dragIcon);

        this.fire('ui-tab-drag-start', {tab: this.value, host: this.host});

      } else {
        let x = this._rect.left + event.detail.pointer[0].position.x;
        let y = this._rect.top + event.detail.pointer[0].position.y;

        this.fire('ui-tab-drag', {x: x, y: y, tab: this.value, host: this.host});

        _dragIcon.style.left = x - 8 + 'px';
        _dragIcon.style.top = y - 8 + 'px';
      }
    }
  }
}

window.customElements.define('ui-tab-selector', UiTabSelector);















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
  //   UiLayoutTab.dragged = this;
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
  //     if (event.path[i].localName === 'ui-layout-block') {
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
