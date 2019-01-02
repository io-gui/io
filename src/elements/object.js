import {IoElement} from "../core/element.js";
import "./object-props.js";
import {IoCollapsable} from "./collapsable.js";

export class IoObject extends IoCollapsable {
  static get properties() {
    return {
      value: Object,
      props: Array,
      config: null,
      labeled: true,
    };
  }
  changed() {
    const label = this.label || this.value.constructor.name;
    this.template([
      ['io-boolean', {true: label, false: label, value: this.bind('expanded')}],
      this.expanded ? [
        ['io-object-props', {
          value: this.value,
          props: this.props.length ? this.props : Object.keys(this.value),
          config: this.config,
          // config: [this.config, this.constructor.config],
          labeled: this.labeled,
        }]
      ] : null
    ]);
  }
}

IoObject.Register();
