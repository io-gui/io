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
      selected: {
        type: Boolean,
        reflectToAttribute: true
      },
      listeners: {
        'drag': '_dragHandler',
        'dragover': '_dragoverHandler'
      },
      attributes: {
        draggable: true
      }
    }
  }
  _dragHandler(event) {
    // console.log(event);
  }
  _dragoverHandler(event) {
    // console.log(event.srcElement)
  }
}

var dragged;
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
