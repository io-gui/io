// TODO: document, demo, test

import {html, IoElement} from "../io-core.js";

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

export class IoCanvas extends IoElement {
  static get style() {
    return html`<style>
      :host {
        overflow: hidden;
        position: relative;
        border: 1px solid black;
      }
      :host img {
        position: absolute;
        /* Hack for border offset */
        top: -1px;
        left: -1px;
        touch-action: none;
        user-select: none;
      }
    </style>`;
  }
  resized() {
    this.changed();
  }
  changed() {
    this.template([['img', {id: 'img'}]]);

    const rect = this.getBoundingClientRect();
    // TODO: implement in webgl shader
    // TODO: unhack border offset.
    canvas.width = rect.width;
    canvas.height = rect.height;

    this.paint(ctx, rect);

    this.$.img.src = canvas.toDataURL();
  }
  paint(ctx, rect) {
    (ctx, rect);
  }
}

IoCanvas.Register();
