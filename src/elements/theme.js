import {html, IoElement} from "../core/element.js";

export class IoTheme extends IoElement {
  static get style() {
    return html`<style>
      body {
        --io-spacing: 4px;

        --io-border-radius: 4px;
        --io-border-width: 1px;

        --io-background-color: rgb(42, 42, 42);
        --io-background-color-light: rgb(56, 56, 56);
        --io-background-color-dark: rgb(32, 32, 32);
        --io-background-color-field: rgb(16, 16, 16);

        --io-color: rgb(210, 210, 210);
        --io-color-error: rgb(255, 96, 16);
        --io-color-link: rgb(190, 230, 150);
        --io-color-focus: rgb(80, 210, 355);
        --io-color-field: rgb(150, 150, 150);
        --io-color-number: rgb(32, 164, 255);
        --io-color-string: rgb(240, 64, 22);
        --io-color-boolean: rgb(210, 90, 190);

        --io-gradient-button: linear-gradient(0deg, rgba(0, 0, 0, 0.25), transparent 50%), linear-gradient(180deg, rgba(255, 255, 255, 0.075), transparent 50%);
        --io-gradient-collapsable: linear-gradient(100deg, rgba(0, 0, 0, 0.25), transparent 50%), linear-gradient(280deg, rgba(255, 255, 255, 0.075), transparent 50%);

        --io-border-color: rgb(140, 140, 140);
        --io-border: var(--io-border-width) solid var(--io-border-color);
        --io-inset-border-color: rgb(32, 32, 32) var(--io-border-color) var(--io-border-color) rgb(32, 32, 32);
        --io-inset-border: var(--io-border-width) inset var(--io-border-color);
        --io-outset-border-color: var(--io-border-color) rgb(32, 32, 32) rgb(32, 32, 32) var(--io-border-color);
        --io-outset-border: var(--io-border-width) outset var(--io-border-color);

        --io-shadow: 2px 3px 5px rgba(0,0,0,0.2);
      }
    </style>`;
  }
}

IoTheme.Register();
