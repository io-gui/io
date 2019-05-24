import {html, IoElement} from "../core/element.js";

export class IoTheme extends IoElement {
  static get style() {
    return html`<style>
      body {
        --io-background-color: rgb(64, 64, 64);
        --io-background-color-light: rgb(96, 96, 96);
        --io-background-color-dark: rgb(32, 32, 32);

        --io-color: rgb(210, 210, 210);
        --io-spacing: 2px;
        --io-padding: 3px;

        --io-border-radius: 3px;
        --io-border-width: 0.5px;
        --io-border-color: rgb(140, 140, 140);
        --io-border: var(--io-border-width) solid var(--io-border-color);

        --io-inset-border: var(--io-border-width) inset var(--io-border-color);
        --io-inset-border-color: rgb(32, 32, 32) var(--io-border-color) var(--io-border-color) rgb(32, 32, 32);

        --io-outset-border: var(--io-border-width) outset var(--io-border-color);
        --io-outset-border-color: var(--io-border-color) rgb(32, 32, 32) rgb(32, 32, 32) var(--io-border-color);

        --io-field-bg: rgb(32, 32, 32);
        --io-field-color: rgb(150, 150, 150);

        --io-button-bg: rgb(55, 55, 55);
        --io-button-gradient: linear-gradient(0deg, rgba(0, 0, 0, 0.25), transparent 50%),
                         linear-gradient(180deg, rgba(255, 255, 255, 0.075), transparent 50%);

         --io-frame-bg: rgb(47, 47, 47);

        --io-number-color: rgb(32, 164, 255);
        --io-string-color: rgb(240, 64, 22);
        --io-boolean-color: rgb(210, 90, 190);

        --io-link-color: rgb(190, 230, 150);
        --io-focus-color: rgb(80, 210, 355);
        --io-active-bg: rgb(210, 255, 128);
        --io-hover-bg: rgba(255, 255, 255, 0.2);
        --io-pressed-bg: rgb(32, 32, 32);
        --io-shadow: 2px 3px 5px rgba(0,0,0,0.2);
      }
      @media (-webkit-min-device-pixel-ratio: 2) {
        body {
          --io-spacing: 4px;
          --io-padding: 4px;
        }
      }
    </style>`;
  }
}

IoTheme.Register();
