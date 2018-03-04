import {html} from "../io.js";
import "../../ui/ui-collapsable/ui-collapsable.js";
import "../../ui/ui-button/ui-button.js";
import {IoObject} from "../io-object/io-object.js";
import "../io-object/io-object-prop.js";

export class IoInspectorGroup extends IoObject {
  static get style() {
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
        :host .io-wrapper > .io-row > .io-label {
          width: 8em;
          text-align: right;
          overflow: hidden;
          text-overflow: ellipsis;
          padding: 0.3em 0;
          padding-right: 0.5em;
        }
        :host .io-wrapper > .io-row > ui-button {
          padding: 0.3em 0;
          color: #fd9;
          flex: none;
          font-weight: bold;

        }
        :host io-object-prop {
          flex: 1;
          display: flex;
        }
        :host io-option {
          display: inline-block;
          color: #ddd;
          background: #444;
          color: #ddd !important;
          border-radius: 0.2em;
          padding: 0.3em;
        }
        :host io-slider {
          border-radius: 0.2em;
          background: #444;
        }
        :host io-object-prop > io-matrix > io-object-prop > io-number {
          margin: 0 0.3em 0.3em 0;
        }
        :host io-object-prop > io-color > io-object-prop > io-number,
        :host io-object-prop > io-vector > io-object-prop:not(:last-of-type) > io-number {
          margin-right: 0.3em;
        }
        :host io-string,
        :host io-number {
          border-radius: 0.3em;
          background: #222;
          padding: 0.3em;
        }
        :host io-color-picker,
        :host io-boolean {
          padding: 0.3em;
          border-radius: 0.3em;
        }
        :host io-object-prop > io-boolean {
          flex: none;
        }
        :host io-color,
        :host io-slider,
        :host io-matrix {
          flex: 1;
        }
        :host io-boolean,
        :host io-string,
        :host io-vector,
        :host io-number {
          display: flex;
          color: #bef !important;
          flex: 1;
        }
        :host :focus {
          outline: 0;
          box-shadow: 0 0 0.5em #2ff;
        }
      </style>
    `;
  }
  static get properties() {
    return {
      value: {
        type: Object,
        observer: 'update'
      },
      props: {
        type: Array,
        observer: 'update',
      },
      label: {
        type: String,
        observer: 'update'
      },
      expanded: {
        type: Boolean,
        value: true,
        observer: 'update'
      }
    };
  }
  _clickHandler(value) {
    // TODO: consider bubbling event from button
    this.fire('io-link-clicked', {value: value});
  }
  update() {
    let propConfigs = this.getPropConfigs(this.props);
    const Prop = entry => ['div', {class: 'io-row'}, [
      ['span', {class: 'io-label'}, entry[0]],
      entry[1].tag !== 'io-object' ?
          ['io-object-prop', {key: entry[0], value: this.value, config: entry[1]}] :
          ['ui-button', {action: this._clickHandler, value: this.value[entry[0]]}, this.value[entry[0]].constructor.name]
    ]];
    this.render([
      this.label === 'main' ? ['div', {class: 'io-wrapper'}, [
        Object.entries(propConfigs).map(Prop)
      ]] :
      ['ui-collapsable', {label: this.label, expanded: this.bind('expanded'), elements:
        ['div', {class: 'io-wrapper'}, [
          Object.entries(propConfigs).map(Prop)
        ]]
      }]
    ]);
  }
}


window.customElements.define('io-inspector-group', IoInspectorGroup);
