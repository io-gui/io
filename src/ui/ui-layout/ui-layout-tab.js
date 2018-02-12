import {html} from "../../io/ioutil.js"
import {UiButton} from "../ui-button/ui-button.js"

export class UiLayoutTab extends UiButton {
  static get style() {
    return html`
      <style>
        :host {
          cursor: pointer;
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
        observer: '_update'
      },
      selected: {
        type: Boolean,
        reflectToAttribute: true
      },
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
    }
  }
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
  //     this.droptarget._update();
  //     this.parentElement.parentElement._update();
  //   }
  //   if (this.droptarget) this.droptarget.dropzone = '';
  // }
  _update() {
    this.innerText = this.value;
  }
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
}

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

window.customElements.define('ui-layout-tab', UiLayoutTab);
