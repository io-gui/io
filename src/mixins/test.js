import {IoElement} from "../core.js";

export const IoTestMixin = (ElementClass) => class extends IoElement {
  static get properties() {
    return {
      element: HTMLElement
    };
  }
  constructor() {
    super();
    this.render([[ElementClass.localName, {id: 'element'}]]);
    this.element = this.$.element;
    // this.element = new ElementClass();
    // this.appendChild(this.element);
    // TODO: consider triggering update automatically.
    // this.element.update();
  }
  connectedCallback() {
    super.connectedCallback();
    this.run();
  }
  run() {}
};
