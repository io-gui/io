import { Register, IoElement, Property, IoElementProps, PropsWithBinding, VDOMElement, div } from 'io-gui';
import { ioPropertyLink } from './IoPropertyLink';
import { ioButton, ioString } from 'io-inputs';
export type IoBreadcrumbsProps = IoElementProps & PropsWithBinding<{
  value?: Object;
  selected?: Object;
  crumbs?: Array<Object>;
  search?: string;
}>;

/**
 * Breadcrumbs select element.
 * When breadcrumb item is clicked or activated by space/enter key, it sets the value to corresponding option value.
 * Optionally, it can trim the `options` array to selected option index.
 **/
@Register
export class IoBreadcrumbs extends IoElement {
  static vConstructor: (arg0?: IoBreadcrumbsProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
  static get Style() {
    return /* css */`
    :host {
      display: flex;
      overflow: hidden;
    }
    :host > div {
      display: flex;
      flex-direction: row;
      align-items: center;
      flex: 1 1 auto;
      border: var(--io_border);
      border-color: var(--io_borderColorInset);
      border-radius: var(--io_borderRadius);
      background-color: var(--io_bgColorInput);
      overflow: hidden;
    }
    :host > io-button {
      padding-left: var(--io_spacing);
      padding-right: var(--io_spacing);
      flex: 0 0 auto;
    }
    :host:not([search]) > io-button.clear-button {
      display: none;
    }
    :host > div > io-property-link:last-of-type {
      flex-shrink: 0;
    }
    :host > div > io-property-link:last-of-type > span {
      flex-shrink: 0;
      text-overflow: clip;
    }
    :host > div > io-property-link:not(:first-of-type):before {
      content: '>';
      padding-right: calc(var(--io_fontSize) / 2);
      color: var(--io_colorStrong);
      opacity: 0.5;
    }
    :host > .search-input {
      flex: 0 0 auto;
      overflow: hidden;
      min-width: calc(var(--io_fieldHeight) + var(--io_borderWidth) * 2);
      height: calc(var(--io_fieldHeight) + var(--io_borderWidth) * 2);
    }
    :host > .search-input:empty::before {
      content: '🔍';
    }
    `;
  }
  @Property({type: Object})
  declare value: Object;

  @Property({type: Object})
  declare selected: Object;

  @Property({type: Array})
  declare crumbs: Array<Object>;

  @Property({type: String, reflect: true})
  declare search: string;

  valueChanged() {
    this.crumbs.length = 0;
    this.crumbs.push(this.value);
  }
  selectedChanged() {
    const index = this.crumbs.indexOf(this.selected);
    if (index !== -1) {
      this.crumbs.length = index + 1;
    } else {
      this.crumbs.push(this.selected);
    }
  }
  onClearSearch() {
    this.search = '';
  }
  changed() {
    const elements = [];
    if (this.crumbs.length > 1) {
      elements.push(ioButton({
        icon: 'io:arrow_left',
        class: 'back-button',
        value: this.crumbs[this.crumbs.length - 2],
      }));
    }
    const crumbs = div();
    crumbs.children = [];
    for (let i = Math.max(0, this.crumbs.length - 2); i < this.crumbs.length; i++) {
      crumbs.children.push(ioPropertyLink({
        value: this.crumbs[i],
        showName: i === this.crumbs.length - 1,
      }));
    }
    elements.push(
      crumbs,
      ioButton({icon: 'io:close', class: 'clear-button', action: this.onClearSearch}),
      ioString({id: 'search', class: 'search-input', value: this.bind('search'), live: true}),
    );
    this.template(elements);
  }
}
export const ioBreadcrumbs = IoBreadcrumbs.vConstructor;