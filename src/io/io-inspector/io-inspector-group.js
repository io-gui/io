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
          border-radius: 0.2em;
          background: #333;
          margin: 2px;
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
      this.label === 'main' ? Object.entries(propConfigs).map(Prop) :
      ['io-collapsable', {label: this.label, expanded: true}, [
        ['div', {className: 'io-wrapper'}, [
          Object.entries(propConfigs).map(Prop)
        ]]
      ]]
    ]);
  }
}


window.customElements.define('io-inspector-group', IoInspectorGroup);
