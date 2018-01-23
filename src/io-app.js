import {IoValue} from "./io-value.js"
import {IoObject} from "./io-object.js"
import {IoOption} from "./io-option.js"
import {IoMenu} from "./io-menu.js"
import {html, render, bind} from '../node_modules/lit-html-brackets/lit-html-brackets.js';

export class IoApp extends HTMLElement {
  constructor() {
    super();
    this.values = {
      "number": 1337,
      "string": 'hello',
      "boolean": true,
      "null": null,
      "NaN": NaN,
      "undef": undefined,
      "array": [1,2,3,4,"apple"]
    }
    var suboptions1 = [
      {label: 'sub_sub_one', value: 1, action: console.log},
      {label: 'sub_sub_two', value: 2, action: console.log},
      {label: 'sub_sub_three', value: 3, action: console.log},
      {label: 'sub_sub_four', value: 4, action: console.log},
      {label: 'sub_sub_five', value: 5, action: console.log}
    ]
    var suboptions0 = [
      {label: 'sub_one', options: suboptions1},
      {label: 'sub_two', options: suboptions1},
      {label: 'sub_three', options: suboptions1},
      {label: 'sub_four', options: suboptions1},
      {label: 'sub_five', options: suboptions1}
    ]
    var longOptions = [];
    for (var i = 0; i < 1000; i++) {
      let r = Math.random();
      longOptions[i] = {label: r, value: r, action: console.log, icon: 'ξ', hint: 'log'};
    }
    this.menuoptions = [
      {label: 'one', options: suboptions0},
      {label: 'two', value: 2, action: console.log},
      {label: 'three', value: 3, action: console.log},
      {label: 'four', value: 4, action: console.log},
      {label: 'five', options: suboptions0},
      {label: 'long', options: longOptions, hint: 'list', icon: '⚠'}
    ]
    this.options = [
      {label: 'one', value: 1},
      {label: 'two', value: 2},
      {label: 'three', value: 3},
      {label: 'four', value: 4}
    ]
    this.values.object = this.values;
    this.attachShadow({mode: 'open'});
    render(this.render(), this.shadowRoot);
    window.values = this.values;
  }
  connectedCallback() {
    let ioObjectIstances = this.shadowRoot.querySelectorAll('io-object');
    for (var i = 0; i < ioObjectIstances.length; i++) {
      ioObjectIstances[i].value = this.values.object;
    }
    let ioMenuIstances = this.shadowRoot.querySelectorAll('io-menu');
    for (var i = 0; i < ioMenuIstances.length; i++) {
      ioMenuIstances[i].options = this.menuoptions;
    }
    let ioOptionIstances = this.shadowRoot.querySelectorAll('io-option');
    for (var i = 0; i < ioOptionIstances.length; i++) {
      ioOptionIstances[i].options = this.options;
    }
  }

  render() {
    return html`
      <style>
        div.demo {
          font-family: "Lucida Grande", sans-serif;
        }
        div.row {
          display: flex;
          flex-direction: row;
        }
        div.header, span.rowlabel {
          color: rgba(128, 122, 255, 0.75);
        }
        span.rowlabel {
          text-align: right;
          padding-right: 0.2em;;
        }
        div.row * {
          margin: 1px;
          flex: 1;
        }
        div.demo > io-value,
        div.demo > io-object {
          border: 1px solid #eee;
          vertical-align: top;
        }
        div.area {
          height: 2em;
          background: rgba(128,128,128,0.2);
        }
        .narrow {
          width: 22em;
        }
        .io-label {
          /* background: rgba(0,0,0,0.2); */
        }
        /* io-value[type=string] {
          color: green;
        } */
      </style>
      <div class="vertical-section-container centered">
        <div class="demo">
          <h3>io-value with three attribute types.</h3>
          <io-value type="string" [value]="${this.values.string}"></io-value>
          <io-value type="number" [value]=${this.values.number} step=0.1></io-value>
          <io-value type="boolean" [value]="${this.values.boolean}"></io-value>
        </div>
        <div class="demo">
          <h3>io-value matrix with various data types and type attributes.</h3>
          <div class="row narrow header">
            <span class="rowlabel"></span>
            <span>string</span>
            <span>number</span>
            <span>boolean</span>
          </div>
          <div class="row narrow">
            <span class="rowlabel">string:</span>
            <io-value type="string" [value]=${this.values.string}></io-value>
            <io-value type="number" [value]=${this.values.string}></io-value>
            <io-value type="boolean" [value]=${this.values.string}></io-value>
          </div>
          <div class="row narrow">
            <span class="rowlabel">number:</span>
            <io-value type="string" [value]=${this.values.number}></io-value>
            <io-value type="number" [value]=${this.values.number}></io-value>
            <io-value type="boolean" [value]=${this.values.number}></io-value>
          </div>
          <div class="row narrow">
            <span class="rowlabel">boolean:</span>
            <io-value type="string" [value]=${this.values.boolean}></io-value>
            <io-value type="number" [value]=${this.values.boolean}></io-value>
            <io-value type="boolean" [value]=${this.values.boolean}></io-value>
          </div>
          <div class="row narrow">
            <span class="rowlabel">NaN:</span>
            <io-value type="string" [value]=${this.values.NaN}></io-value>
            <io-value type="number" [value]=${this.values.NaN}></io-value>
            <io-value type="boolean" [value]=${this.values.NaN}></io-value>
          </div>
          <div class="row narrow">
            <span class="rowlabel">null:</span>
            <io-value type="string" [value]=${this.values.null}></io-value>
            <io-value type="number" [value]=${this.values.null}></io-value>
            <io-value type="boolean" [value]=${this.values.null}></io-value>
          </div>
          <div class="row narrow">
            <span class="rowlabel">undefined:</span>
            <io-value type="string" [value]=${this.values.undef}></io-value>
            <io-value type="number" [value]=${this.values.undef}></io-value>
            <io-value type="boolean" [value]=${this.values.undef}></io-value>
          </div>
        </div>
        <div class="demo">
          <h3>io-option</h3>
          <io-option value="1"></io-option>
          <io-option value="2"></io-option>
          <io-option value="3"></io-option>
          <io-option value="4"></io-option>
          <io-option value="5"></io-option>
        </div>
        <div class="demo area">
          <h3>io-menu (click to expand)</h3>
          <io-menu position="pointer"></io-menu>
        </div>
        <div class="demo">
          <h3>io-object with various property types.</h3>
          <io-object expanded labeled></io-object>
          <io-object expanded labeled></io-object>
          <io-object expanded labeled></io-object>
          <io-object expanded labeled></io-object>
          <io-object expanded labeled></io-object>
        </div>
      </div>
    `;
  }
}

customElements.define('io-app', IoApp);
