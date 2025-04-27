import { IoElement, VDOMElement, Register, Property, div, IoElementProps, PropsWithBinding, Default } from 'io-gui';
import { ioBoolean } from 'io-inputs';

export type IoCollapsibleProps = IoElementProps & PropsWithBinding<{
  elements?: VDOMElement[];
  label?: string;
  direction?: 'column' | 'row';
  icon?: string;
  expanded?: boolean;
}>;
/**
 * An element with collapsible content.
 * When clicked or activated by space/enter key, it toggles the visibility of the child elements defined as `elements` property.
 **/

@Register
export class IoCollapsible extends IoElement {
  static vConstructor: (arg0?: IoCollapsibleProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
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
    :host > div.io-collapsible-content {
      position: relative;
      display: flex;
      align-items: flex-start;
      flex-direction: column;
      overflow: auto;
      background-color: var(--io_bgColorStrong);
    }
    :host[direction=row] > div.io-collapsible-content {
      flex-direction: row;
    }
    :host > div.io-collapsible-content:not(:empty) {
      margin: var(--io_spacing);
      margin-top: 0;
      padding: var(--io_spacing);
      border-radius: var(--io_borderRadius);
    }
    `;
  }

  @Property(Array)
  declare elements: VDOMElement[];

  @Property('')
  declare label: string;

  @Property({value: 'column', reflect: true})
  declare direction: 'column' | 'row';

  @Property('')
  declare icon: string;

  @Property({value: false, reflect: true})
  declare expanded: boolean;

  @Default('region')
  declare role: string;

  changed() {
    this.template([
      // TODO: consider implementing caching
      ioBoolean({icon: this.icon, true: this.label, false: this.label, value: this.bind('expanded')}),
      div({class: 'io-collapsible-content'}, this.expanded ? this.elements : []),
    ]);
  }
}
export const ioCollapsible = IoCollapsible.vConstructor;