import {IoValue} from "./io-value.js"
import {IoObject} from "./io-object.js"
import {html, render, svg, bind} from '../node_modules/lit-html-brackets/lit-html-brackets.js';

// Added "export" to export the MyApp symbol from the module
export class MyApp extends HTMLElement {

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
    this.values.object = this.values;
    this.attachShadow({mode: 'open'});
    render(this.render(), this.shadowRoot);
    window.values = this.values;
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
        div.demo > io-value {
          border: 1px solid #eee;
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
          <io-value type="number" [(value)]=${bind(this.values, 'number')} step=0.1></io-value>
          <io-value type="boolean" [value]="${this.values.boolean}"></io-value>
        </div>
        <div class="demo">
          <h3>io-value with disabled attribute.</h3>
          <io-value [value]="${this.values.string}" type="string" disabled></io-value>
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
            <io-value type="number" [(value)]=${bind(this.values, 'number')}></io-value>
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
          <h3>io-object with various property types.</h3>
          <io-object [value]="${this.values}" labeled expanded></io-object>
        </div>
      </div>
    `;

  }

}

customElements.define('my-app', MyApp);
