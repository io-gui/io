import {IoValue} from "./io-value.js"
import {IoObject} from "./io-object.js"
import {html, render, svg, bind} from '../node_modules/lit-html-brackets/lit-html-brackets.js';

// Added "export" to export the MyApp symbol from the module
export class MyApp extends HTMLElement {

  constructor() {
    super();
    this.values = {
      number: 1337,
      string: 'hello',
      boolean: true,
      null: null,
      NaN: NaN,
      undefined: undefined,
      array: [1,2,3,4,"apple"]
    }
    this.values.object = this.values;
    this.attachShadow({mode: 'open'});
    render(this.render(), this.shadowRoot);
    window.values = this.values;
  }

  render() {
    return html`
      <style>
        div.demo {
          width: 22em;
          font-family: "Lucida Grande", sans-serif;
          /* border: 1px tomato solid; */
          /* padding: 1em 4em; */
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
        io-value {
          border: 1px solid #eee;
        }
        /* io-value[type=string] {
          color: green;
        } */
      </style>
      <div class="vertical-section-container centered">
        <div class="demo">
          <h3>io-value with three attribute types.</h3>
          <io-value type="string" [value]="${this.values.string}"></io-value>
          <io-value type="number" [(value)]=${bind(this.values, 'number')} step=0.1></io-value>
          <io-value type="boolean" [value]="${this.values.boolean}"></io-value>
        </div>
        <div class="demo">
          <h3>io-value with disabled attribute.</h3>
          <io-value [value]="${this.values.string}" type="string" disabled></io-value>
        </div>
        <div class="demo">
          <h3>io-value matrix with various data types and type attributes.</h3>
          <div class="row header">
            <span class="rowlabel"></span>
            <span>string</span>
            <span>number</span>
            <span>boolean</span>
          </div>
          <div class="row">
            <span class="rowlabel">string:</span>
            <io-value type="string" [value]=${this.values.string}></io-value>
            <io-value type="number" [value]=${this.values.string}></io-value>
            <io-value type="boolean" [value]=${this.values.string}></io-value>
          </div>
          <div class="row">
            <span class="rowlabel">number:</span>
            <io-value type="string" [value]=${this.values.number}></io-value>
            <io-value type="number" [(value)]=${bind(this.values, 'number')}></io-value>
            <io-value type="boolean" [value]=${this.values.number}></io-value>
          </div>
          <div class="row">
            <span class="rowlabel">boolean:</span>
            <io-value type="string" [value]=${this.values.boolean}></io-value>
            <io-value type="number" [value]=${this.values.boolean}></io-value>
            <io-value type="boolean" [value]=${this.values.boolean}></io-value>
          </div>
        </div>
        <div class="demo">
          <h3>io-object with various property types.</h3>
          <io-object [value]="${this.values}" labeled expanded></io-object>
        </div>
      </div>
    `;

  }

}

customElements.define('my-app', MyApp);
