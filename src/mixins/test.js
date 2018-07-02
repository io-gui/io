import {IoElement} from "../core.js";

export const IoTestMixin = (ElementClass) => class extends IoElement {
  static get properties() {
    return {
      element: HTMLElement
    };
  }
  constructor() {
    super();
    this.appendChild(this.element = new ElementClass());
  }
  connectedCallback() {
    super.connectedCallback();
    this.run();
  }
  run() {}
};
