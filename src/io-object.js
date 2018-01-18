import {IoBase, html} from "./io-base.js"
import {IoObjectConstructor} from "./io-object-constructor.js"
import {IoObjectProperty} from "./io-object-property.js"

class IoObject extends IoBase {
  static get is() { return 'io-object'; }
  static get template() {
    return html`
      <style>
        :host {
          display: inline-block;
          /* background: rgba(255,0,0,0.1); */
          position: relative;
        }
        ::slotted(io-object-property):before {
          content: "\\00a0\\00a0─\\00a0";
        }
        :host #tree-line {
          display: none;
        }
        :host([expanded]) > #tree-line {
          display: inline-block;
          position: absolute;
          pointer-events: none;
          width: 0.5em;
          border-right: 1px solid black;
          top: 1.5em;
          bottom: 0.5em;
        }
      </style><div id="tree-line"></div><slot></slot>
    `;
  }
  static get properties() {
    return {
      value: {
        type: Object,
        observer: '_updateJob'
      },
      expanded: {
        value: false,
        type: Boolean,
        observer: '_expandedChanged',
        reflectToAttribute: true
      },
      label: {
        value: '',
        type: String
      }
    }
  }
  constructor(props) {
    super(props);
    this.$constructor = new IoObjectConstructor({object: this.value || {}, expanded: this.expanded, label: this.label});
    this.$property = {};
    this.appendChild(this.$constructor);
    this._updateJob();
  }
  _expandedChanged() {
    this.$constructor.expanded = this.expanded;
    this._updateJob();
  }
  _update() {
    this.$constructor.object = this.value;
    this.$constructor.expanded = this.expanded;
    this.$constructor.label = this.label;

    let _keys = Object.keys(this.value);
    let _$keys = Object.keys(this.$property);

    if (this.expanded) {
      for (let i = 0; i < _keys.length; i++) {
        if (!this.$property[_keys[i]]) {
          this.$property[_keys[i]] = new IoObjectProperty({value: this.value, key: _keys[i]});
        }
        this.appendChild(this.$property[_keys[i]]);
      }
    } else {
      for (let i = 0; i < _$keys.length; i++) {
        this.$property[_$keys[i]] = this.$property[_$keys[i]].parentElement.removeChild(this.$property[_$keys[i]]);
      }
      // TODO: remove unused and take care of garbage.
    }

  }
}

window.customElements.define(IoObject.is, IoObject);

export { IoObject }
