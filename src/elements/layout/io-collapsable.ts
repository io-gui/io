import { IoElement, RegisterIoElement } from '../../core/element.js';

/**
 * An element with collapsable content.
 *
 * Extends `IoElement`. Implements `IoBoolean` and `IoContent`.
 *
 * <io-element-demo element="io-collapsable"
 *     properties='{
 *         "elements": [["div", "Content"]],
 *         "label": "Collapsable",
 *         "expanded": true}'>
 * </io-element-demo>
 *
 * When clicked or activated by space/enter key, it toggles the visibility of the child elements defined as `elements` property.
 **/
@RegisterIoElement
export class IoCollapsable extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      display: flex;
      flex-direction: column;
      align-self: stretch;
      justify-self: stretch;
    }
    :host > io-boolean {
      text-align: left;
      align-self: stretch;
      width: auto;
      border-radius: 0;
      background-color: var(--ioBackgroundColorDark);
    }
    :host > io-boolean:before {
      display: inline-block;
      width: 1.125em;
      content: "▸"
    }
    :host > io-boolean[value]:before {
      content: "▾";
    }
    :host > :nth-child(n+2) {
      margin-top: var(--ioSpacing);
    }
    `;
  }
  static get Properties(): any {
    return {
      elements: Array,
      label: {
        reflect: true,
      },
      expanded: {
        type: Boolean,
        reflect: true,
      },
      role: 'region',
    };
  }
  changed() {
    this.template([
      ['io-boolean', {true: this.label, false: this.label, value: this.bind('expanded')}],
      this.expanded ? ['io-content', this.elements] : null,
    ]);
  }
}
