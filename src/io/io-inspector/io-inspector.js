import {html} from "../ioutil.js"
import {Io} from "../io.js"

export class IoInspector extends Io {
  static get is() { return 'io-inspector'; }
  static get template() {
    return html`
      <style>
        :host {
          display: inline-block;
          min-width: 10em;
          position: relative;
        }
      </style>
    `;
  }
  static get properties() {
    return {
      value: {
        type: Object,
        observer: '_update'
      },
      expanded: {
        type: Boolean,
        observer: '_update',
        reflectToAttribute: true
      }
    }
  }
  _update() {
    if (this.value instanceof Object === false) return;
  }
}

IoInspector.GROUPS = {
  'constructor:Object' : {
    'type:string': {tag: 'io-value', props: {type: 'string'}},
    'type:number': {tag: 'io-value', props: {type: 'number', step: 0.1}},
    'type:boolean': {tag: 'io-value', props: {type: 'boolean'}},
    'type:object': {tag: 'io-object', props: {}},
    'type:function': {tag: 'io-function', props: {}},
    'value:null': {tag: 'io-value', props: {}},
    'value:undefined': {tag: 'io-value', props: {}},
    // TODO
    'instanceof:Array': {tag: 'io-object', props: {expanded: true}},
  }
};

window.customElements.define(IoInspector.is, IoInspector);
