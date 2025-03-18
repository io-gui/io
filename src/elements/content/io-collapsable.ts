import { IoElement, VDOMArray } from '../../core/element.js';
import { Register } from '../../core/decorators/register.js';
import { Property } from '../../core/decorators/property.js';

/**
 * An element with collapsable content.
 * When clicked or activated by space/enter key, it toggles the visibility of the child elements defined as `elements` property.
 **/

@Register
export class IoCollapsable extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      align-self: stretch;
      box-sizing: content-box;
      align-items: stretch;
      align-self: stretch;
      border: var(--io_border);
      border-radius: calc(var(--io_borderRadius) - var(--io_spacing));
      border-color: var(--io_borderColorOutset);
      min-height: var(--io_fieldHeight);
      background-color: var(--io_bgColorDimmed);
    }
    :host > io-boolean {
      flex: 0 0 auto;
      padding-left: 0;
      margin: var(--io_spacing) var(--io_spacing2);
      border-radius: 0;
      background-color: transparent;
    }
    :host > io-boolean:before {
      text-align: center;
      width: var(--io_lineHeight);
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
      background-color: var(--io_bgColorStrong);
    }
    :host[direction=row] > div.io-collapsable-content {
      flex-direction: row;
    }
    :host > div.io-collapsable-content:not(:empty) {
      margin: var(--io_spacing);
      margin-top: 0;
      padding: var(--io_spacing);
      border-radius: var(--io_borderRadius);
    }
    `;
  }

  @Property(Array)
  declare elements: VDOMArray[];

  @Property('')
  declare label: string;

  @Property({value: 'column', reflect: true})
  declare direction: 'column' | 'row';

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
