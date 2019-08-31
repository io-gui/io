import {IoElement, html} from "../../io.js";

export class IoPanel extends IoElement {
  static get Style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: column;
        align-self: stretch;
        justify-self: stretch;
        border-radius: calc(var(--io-border-radius) + var(--io-spacing));
        border: var(--io-border);
        border-color: var(--io-color-border-outset);
        color: var(--io-color-field);
        background-color: var(--io-background-color-dark);
        background-image: var(--io-gradient-panel);
        padding: var(--io-spacing);
      }
    </style>`;
  }
}

IoPanel.Register();
