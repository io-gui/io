import {html} from "../ioutil.js"
import {Io} from "../io.js"
import {IoCollapsable} from "../io-collapsable/io-collapsable.js"
import {IoObject} from "../io-object/io-object.js"
import {IoInspectorProp} from "./io-inspector-prop.js"

export class IoInspectorGroup extends IoObject {
  static get template() {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: column;
          background: rgba(0,128,64,0.2);
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
      props: {
        type: Array,
        observer: '_update',
      },
      label: {
        type: String,
        observer: '_update'
      }
    }
  }
  _update() {
    let propConfigs = this.getPropConfigs(this.props);
    const Prop = entry => ['io-inspector-prop', {key: entry[0], value: this.value, config: entry[1]}];
    this.render([
      ['io-collapsable', {value: this.value, label: this.label, expanded: true}, [
        Object.entries(propConfigs).map(Prop)
      ]]
    ])
  }
}


window.customElements.define('io-inspector-group', IoInspectorGroup);
