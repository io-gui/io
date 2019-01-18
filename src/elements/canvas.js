// TODO: document, demo, test

import {html, IoElement} from "../io-core.js";

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

let ro;
if (window.ResizeObserver !== undefined) {
  ro = new ResizeObserver(entries => {
    for (let entry of entries) entry.target.changed();
  });
}

export class IoCanvas extends IoElement {
  static get style() {
    return html`<style>
      :host {
        overflow: hidden;
      }
      :host img {
        width: 100% !important;
        touch-action: none;
        user-select: none;
      }
    </style>`;
  }
  connectedCallback() {
    super.connectedCallback();
    if (ro) ro.observe(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    if (ro) ro.unobserve(this);
  }
  changed() {
    this.template([['img', {id: 'img'}]]);

    const rect = this.$.img.getBoundingClientRect();
    // TODO: implement in webgl shader
    canvas.width = rect.width;
    canvas.height = rect.height;

    this.paint(ctx, rect);

    this.$.img.src = canvas.toDataURL();
  }
  paint(ctx, rect) {}
}

IoCanvas.Register();
