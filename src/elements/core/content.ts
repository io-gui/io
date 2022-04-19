import {IoElement, RegisterIoElement} from '../../iogui.js';

// TODO: test and documentation

/*

 **/

export class IoContent extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      @apply --io-content;
    }
    :host:not([expanded]) {
      display: none;
    }
    `;
  }
  static get Properties(): any {
    return {
      elements: {
        type: Array,
        observe: true,
      },
      expanded: {
        type: Boolean,
        reflect: 1,
      },
      cache: Boolean,
    };
  }
  changed() {
    // TODO: cache outside DOM and disconnect!
    if (this.expanded) {
      this.template([this.elements]);
    } else if (!this.cache) {
      this.template([null]);
    }
  }
}

RegisterIoElement(IoContent);
