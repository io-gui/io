import {IoElement} from "../core/element.js";

export const IoTest = (Constructor) => class extends IoElement {
  static get properties() {
    return {
      element: HTMLElement
    };
  }
  constructor() {
    super();
    this.appendChild(this.element = new Constructor());
  }
  connectedCallback() {
    super.connectedCallback();
    this.run();
  }
  run() {}
};
