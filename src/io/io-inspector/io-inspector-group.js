import {html} from "../ioutil.js"
import {Io} from "../io.js"
import {IoCollapsable} from "../io-collapsable/io-collapsable.js"
import {IoObject} from "../io-object/io-object.js"
import {IoObjectProp} from "../io-object/io-object-prop.js"
import {IoObjectLabel} from "../io-object/io-object-label.js"

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
        :host .io-wrapper >.io-row > io-object-label.io-link {
          cursor: pointer;
          color: #fc8;
        }
        :host .io-wrapper > .io-row > io-object-label {
          width: 8em;
          min-width: 8em;
          text-align: right;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        :host .io-wrapper >.io-row > io-object-prop {
          flex: 1;
          display: block;
        }
        :host io-boolean {
          color: #9c8;
        }
        :host io-string,
        :host io-number {
          display: block;
          color: #bef;
          background: #555;
          border-radius: 2px;
          margin: 1px;
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
    this.dispatchEvent(new CustomEvent('io-link-clicked', {
      detail: {key: event.path[0].key},
      bubbles: true,
      composed: true
    }));
  }
  _update() {
    let propConfigs = this.getPropConfigs(this.props);
    const Prop = entry => ['div', {className: 'io-row'}, [
      ['io-object-label', {key: entry[0],
          className: this.value[entry[0]] instanceof Object ? 'io-link' : '',
          listeners: {'mousedown': this._mousedownHandler}
      }],
      entry[1].tag !== 'io-object' ?
          ['io-object-prop', {key: entry[0], value: this.value, config: entry[1]}] :
          ['span', this.value[entry[0]].constructor.name]
    ]];
    this.render([
      this.label === 'main' ? ['div', {className: 'io-wrapper'}, [
        Object.entries(propConfigs).map(Prop)
      ]] :
      ['io-collapsable', {label: this.label, expanded: false}, [
        ['div', {className: 'io-wrapper'}, [
          Object.entries(propConfigs).map(Prop)
        ]]
      ]]
    ]);
  }
}


window.customElements.define('io-inspector-group', IoInspectorGroup);
