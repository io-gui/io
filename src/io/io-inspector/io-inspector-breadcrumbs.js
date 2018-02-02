import {html} from "../ioutil.js"
import {Io} from "../io.js"

function isPropertyOf(prop, object) {
  for (var p in object) if (object[p] === prop) return true;
  return false;
}

export class IoInspectorBreadcrumbs extends Io {
  static get shadowStyle() {
    return html`
      <style>
        ::slotted(span):after {
          content: ' / '
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
      path: {
        type: Array,
        value: []
      }
    }
  }
  _update() {
    if (this.path.indexOf(this.value) !== -1) {
      this.path.length = this.path.indexOf(this.value) + 1;
    } else if (this.path.length && isPropertyOf(this.value, this.path[this.path.length - 1])) {
      this.path.push(this.value);
    } else if (this.path.indexOf(this.value) === -1) {
      this.path = [this.value];
    }
    const Prop = (elem, i) => ['span', this.path[i].__proto__.constructor.name];
    this.render([
      this.path.map(Prop),
      ['span', '<']
    ]);
  }
}


window.customElements.define('io-inspector-breadcrumbs', IoInspectorBreadcrumbs);
