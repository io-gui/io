import {Io} from "../../../iocore.js";

export class AppCollapsable extends Io {
  static get properties() {
    return {
      label: String,
      expanded: {
        type: Boolean,
        reflect: true
      },
      elements: Array
    };
  }
  update() {
    this.render([
        ['io-boolean', {true: '▾' + this.label, false: '▸' + this.label, value: this.bind('expanded')}],
        this.expanded ? this.elements : null
    ]);
  }
}

AppCollapsable.Register();
