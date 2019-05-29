import {html, IoElement} from "../core/element.js";

export class IoTheme extends IoElement {
  static get style() {
    return html`<style>
      body {

        --io-spacing: 2px;
        --io-padding: 3px;

        --io-border-radius: 3px;
        --io-border-width: 1px;

        --io-background-color: rgb(64, 64, 64);
        --io-background-color-light: rgb(72, 72, 72);
        --io-background-color-dark: rgb(47, 47, 47);

        --io-color: rgb(210, 210, 210);
        --io-error-color: rgb(255, 96, 16);

        --io-field-background-color: rgb(32, 32, 32);
        --io-field-color: rgb(150, 150, 150);

        --io-border-color: rgb(140, 140, 140);
        --io-border: var(--io-border-width) solid var(--io-border-color);
        --io-inset-border-color: rgb(32, 32, 32) var(--io-border-color) var(--io-border-color) rgb(32, 32, 32);
        --io-inset-border: var(--io-border-width) inset var(--io-border-color);
        --io-outset-border-color: var(--io-border-color) rgb(32, 32, 32) rgb(32, 32, 32) var(--io-border-color);
        --io-outset-border: var(--io-border-width) outset var(--io-border-color);

        --io-button-gradient: linear-gradient(0deg, rgba(0, 0, 0, 0.25), transparent 50%), linear-gradient(180deg, rgba(255, 255, 255, 0.075), transparent 50%);

        --io-number-color: rgb(32, 164, 255);
        --io-string-color: rgb(240, 64, 22);
        --io-boolean-color: rgb(210, 90, 190);

        --io-link-color: rgb(190, 230, 150);
        --io-focus-color: rgb(80, 210, 355);
        --io-active-bg: rgb(210, 255, 128);
        --io-hover-bg: rgba(255, 255, 255, 0.2);
        --io-shadow: 2px 3px 5px rgba(0,0,0,0.2);
      }
      /* @media (min-resolution: 192dpi) {
        body {
          --io-spacing: 4px;
          --io-padding: 5px;
          --io-border-radius: 3px;
          --io-border-width: 5px;
        }
      }
      @media (min-resolution: 120dpi) {
        body {
          --io-border-width: calc(5px / 1.25);
        }
      }
      @media (min-resolution: 124.8dpi) {
        body {
          --io-border-width: calc(5px / 1.3);
        }
      }
      @media (min-resolution: 144dpi) {
        body {
          --io-border-width: calc(5px / 1.5);
        }
      } */
    </style>`;
  }
}

IoTheme.Register();
