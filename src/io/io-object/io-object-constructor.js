import {html, iftrue} from "../ioutil.js"
import {Io} from "../io.js"

export class IoObjectConstructor extends Io {
  static get is() { return 'io-object-constructor'; }
  static get template() {
    return html`
      <style>
      :host {
        display: inline-block;
        cursor: pointer;
        line-height: 1em;
      }
      ::slotted(.io-constructor) {
        color: rgb(23, 128, 41);
      }
      ::slotted(.io-label):after {
        content: ":";
      }
      </style>
    `;
  }
  static get properties() {
    return {
      value: {
        type: Object,
        observer: '_update',
      },
      label: {
        type: String,
        observer: '_update'
      },
      expanded: {
        type: Boolean,
        observer: '_update',
        reflectToAttribute: true
      },
      listeners: {
        'keydown': '_toggleHandler',
        'click': '_toggleHandler'
      }
    }
  }
  constructor(props) {
    super(props);
    this.setAttribute('tabindex', 0);
  }
  _toggleHandler(event) {
    if (event.which == 13 || event.which == 32 || event.type == 'click') {
      event.preventDefault();
      let ioObject = this.parentElement;
      ioObject.expanded = !ioObject.expanded;
      setTimeout(() => {
        ioObject.querySelector('io-object-constructor').focus();
      });
    }
  }
  _update() {
    let _name = this.value.constructor.name || 'Object';
    this.render([
      iftrue(this.label, ['span', {className: 'io-label'} , this.label]),
      ['span', {className: 'io-constructor'}, this.expanded ? '▾' + _name : '▸' + _name + '(' + Object.keys(this.value).length + ')' ]
    ]);
  }
}

window.customElements.define(IoObjectConstructor.is, IoObjectConstructor);
