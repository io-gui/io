import {html, IoElement} from "../core/element.js";

export class IoTheme extends IoElement {
  static get style() {
    return html`<style>
      body {
        --bg: #eee;
        --radius: 5px 5px 5px 5px;
        --spacing: 3px;
        --padding: 3px;
        --border-radius: 2px;
        --border: 1px solid rgba(128, 128, 128, 0.25);
        --color: #000;

        --number-color: rgb(28, 0, 207);
        --string-color: rgb(196, 26, 22);
        --boolean-color: rgb(170, 13, 145);

        --link-color: #09d;
        --focus-border: 1px solid #09d;
        --focus-bg: #def;
        --active-bg: #ef8;
        --hover-bg: #fff;

        --frame-border: 1px solid #aaa;
        --frame-bg: #ccc;

        --content-border: 1px solid #aaa;
        --content-bg: #eee;

        --button-border: 1px solid #999;
        --button-bg: #bbb;

        --field-border: 1px solid #ccc;
        --field-color: #333;
        --field-bg: white;

        --menu-border: 1px solid #999;
        --menu-bg: #bbb;
        --menu-shadow: 2px 3px 5px rgba(0,0,0,0.2);
      }
      @media (-webkit-min-device-pixel-ratio: 2) {
        body {
          --radius: 7px 7px 7px 7px;
          --spacing: 4px;
          --padding: 4px;
          --border-radius: 4px;
        }
      }
    </style>`;
  }
}

IoTheme.Register();
