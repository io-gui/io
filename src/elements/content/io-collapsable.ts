import { IoElement, RegisterIoElement, VDOMArray } from '../../core/element.js';
import { Property } from '../../core/internals/property.js';

/**
 * An element with collapsable content.
 * When clicked or activated by space/enter key, it toggles the visibility of the child elements defined as `elements` property.
 **/

@RegisterIoElement
export class IoCollapsable extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      flex-direction: column;
      flex-shrink: 0;
      align-self: stretch;
      box-sizing: content-box;
      align-items: stretch;
      align-self: stretch;
      border: var(--iotBorder);
      border-radius: calc(var(--iotBorderRadius) - var(--iotSpacing));
      border-color: var(--iotBorderColorOutset);
      min-height: var(--iotFieldHeight);
      background-color: var(--iotBackgroundColorDimmed);
    }
    :host > io-boolean {
      flex: 0 0 auto;
      padding-left: 0;
      margin: var(--iotSpacing) var(--iotSpacing2);
      border-radius: 0;
      background-color: transparent;
    }
    :host > io-boolean:before {
      text-align: center;
      width: var(--iotLineHeight);
      content: "▸"
    }
    :host > io-boolean[value]:before {
      content: "▾"
    }
    :host > div.io-collapsable-content {
      position: relative;
      display: flex;
      align-items: flex-start;
      flex-direction: column;
      overflow: auto;
      background-color: var(--iotBackgroundColorStrong);
    }
    :host > div.io-collapsable-content:not(:empty) {
      margin: var(--iotSpacing);
      margin-top: 0;
      padding: var(--iotSpacing);
      border-radius: var(--iotBorderRadius);
    }
    `;
  }

  @Property(Array)
  declare elements: VDOMArray[];

  @Property('')
  declare label: string;

  @Property('')
  declare icon: string;

  @Property({value: false, reflect: true})
  declare expanded: boolean;

  @Property('region')
  declare role: string;

  changed() {
    this.template([
      // TODO: consider implementing caching
      ['io-boolean', {true: this.label, false: this.label, icon: this.icon, value: this.bind('expanded')}],
      ['div', {class: 'io-collapsable-content'}, this.expanded ? this.elements : []],
    ]);
  }
}
