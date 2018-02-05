import {html} from "../ioutil.js"
import {Io} from "../io.js"
import {UiCollapsable} from "../../ui/ui-collapsable/ui-collapsable.js"
import {IoObject} from "../io-object/io-object.js"
import {IoObjectProp} from "../io-object/io-object-prop.js"

export class IoInspectorGroup extends IoObject {
  static get shadowStyle() {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: column;
          margin: 0.2em;
          border-radius: 0.1em;
          background: #333;
          line-height: 1em;
        }
      </style>
    `;
  }
  static get style() {
    return html`
      <style>
        :host .io-wrapper {
          border-radius: 0.1em;
        }
        :host .io-wrapper > .io-row {
          display: flex;
          flex-direction: row;
          margin: 0.3em 0.3em 0 0.3em;
        }
        :host .io-wrapper > .io-row:last-of-type {
          margin-bottom: 0.3em;
        }
        :host .io-wrapper > .io-row > .io-link {
          cursor: pointer;
          padding: 0.3em 0;
          color: #fc8;
        }
        :host .io-wrapper > .io-row > .io-label {
          width: 8em;
          min-width: 8em;
          text-align: right;
          overflow: hidden;
          text-overflow: ellipsis;
          padding: 0.3em 0;
          padding-right: 0.5em;
        }
        :host io-object-prop {
          flex: 1;
          display: flex;
        }
        :host io-object-prop > * {
          flex: 1;
        }
        :host io-option {
          flex: none;
          background: #444;
          color: #ddd;
          border-radius: 0.1em;
          vertical-align: middle;
          padding: 0.3em 0.4em;
        }
        :host io-object-prop[tag=io-slider] {
          border-radius: 0.2em;
          background: #444;
          margin-right: 0.2em;
        }
        :host io-object-prop[tag=io-string],
        :host io-object-prop[tag=io-number],
        :host io-object-prop io-object-prop[tag=io-number] {
          border-radius: 0.2em;
          background: #222;
          padding: 0 0.3em;
          margin-right: 0.2em;
        }
        :host io-object-prop[tag=io-matrix] io-object-prop,
        :host io-object-prop[tag=io-color] io-object-prop,
        :host io-object-prop[tag=io-vector] io-object-prop {
          margin-right: 0.3em;
        }
        :host io-object-prop[tag=io-matrix] io-object-prop {
          margin-bottom: 0.3em;
        }
        :host io-object-prop[tag=io-boolean] {
          display: flex;
        }
        :host io-boolean,
        :host io-string,
        :host io-number {
          display: flex;
          padding: 0.3em 0;
          color: #bef;
          flex: 1;
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
      },
      expanded: {
        type: Boolean,
        observer: '_update'
      },
      listeners: {
        'click': '_clickHandler'
      }
    }
  }
  _clickHandler(event) {
    if (event.path[0].className === 'io-link') {
      this.dispatchEvent(new CustomEvent('io-link-clicked', {
        detail: {key: event.path[0].previousSibling.innerText}, // TODO: yuck
        bubbles: true,
        composed: true
      }));
    }
  }
  _update() {
    let propConfigs = this.getPropConfigs(this.props);
    const Prop = entry => ['div', {className: 'io-row'}, [
      ['span', {className: 'io-label'}, entry[0]],
      entry[1].tag !== 'io-object' ?
          ['io-object-prop', {key: entry[0], value: this.value, config: entry[1]}] :
          ['span', {className: 'io-link'}, this.value[entry[0]].constructor.name]
    ]];
    this.render([
      this.label === 'main' ? ['div', {className: 'io-wrapper'}, [
        Object.entries(propConfigs).map(Prop)
      ]] :
      ['io-collapsable', {label: this.label, expanded: this.bind('expanded')}, [
        ['div', {className: 'io-wrapper'}, [
          Object.entries(propConfigs).map(Prop)
        ]]
      ]]
    ]);
  }
}


window.customElements.define('io-inspector-group', IoInspectorGroup);
