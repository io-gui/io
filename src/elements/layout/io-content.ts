import { IoElement, RegisterIoElement } from '../../core/element.js';

// TODO: test and documentation

/*

 **/
@RegisterIoElement
export class IoContent extends IoElement {
  static get Style() {
    return /* css */`
    --io-content: {
      display: flex;
      flex-direction: column;
      align-self: stretch;
      justify-self: stretch;
      flex: 1 1 auto;
      overflow-x: hidden;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      -webkit-tap-highlight-color: transparent;
    }
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
        reflect: 'prop',
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
