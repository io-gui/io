import {html} from "../ioutil.js"
import {Io} from "../io.js"
import {IoCollapsable} from "../io-collapsable/io-collapsable.js"
import {IoObject} from "../io-object/io-object.js"
import {IoInspectorProp} from "./io-inspector-prop.js"
import {IoInspectorLabel} from "./io-inspector-label.js"

export class IoInspectorGroup extends IoObject {
  static get style() {
    return html`
      <style>
        :host .io-wrapper {
          margin: 2px;
          border-radius: 2px;
          background: #444;
        }
        :host .io-row {
          display: flex;
          flex-direction: row;
        }
        :host io-inspector-prop {
          flex: 1;
          display: block;
        }
      </style>
    `;
  }
  static get shadowStyle() {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: column;
          border-radius: 2px;
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
  _mousedownHandler(event) {
    console.log(event, this);
  }
  _update() {
    let propConfigs = this.getPropConfigs(this.props);
    const Prop = entry => ['div', {className: 'io-row'}, [
      ['io-inspector-label', {key: entry[0], value: this.value}],
      ['io-inspector-prop', {key: entry[0], value: this.value, config: entry[1]}]
    ]];
    this.render([
      this.label === 'main' ? Object.entries(propConfigs).map(Prop) :
      ['io-collapsable', {label: this.label, expanded: false}, [
        ['div', {className: 'io-wrapper'}, [
          Object.entries(propConfigs).map(Prop)
        ]]
      ]]
    ]);
  }
}


window.customElements.define('io-inspector-group', IoInspectorGroup);
