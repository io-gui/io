import { Register, IoElement, ReactiveProperty, IoElementProps, WithBinding, VDOMElement, div, Property } from 'io-gui';
import { ioPropertyLink } from './IoPropertyLink';
import { ioButton, ioString } from 'io-inputs';

export type IoBreadcrumbsProps = IoElementProps & {
  value?: Object,
  selected?: WithBinding<Object>,
  search?: WithBinding<string>,
};

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
      margin: var(--io_borderWidth);
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
      margin-left: var(--io_spacing);
    }
    :host > .search-input:empty::before {
      content: '🔍';
      font-size: 0.9em;
    }
    `;
  }
  @ReactiveProperty({type: Object})
  declare value: Object;

  @ReactiveProperty({type: Object})
  declare selected: Object;

  @ReactiveProperty({type: String, reflect: true})
  declare search: string;

  @Property(Array)
  declare _crumbs: Array<Object>;

  valueChanged() {
    this._crumbs.length = 0;
    this._crumbs.push(this.value);
  }
  selectedChanged() {
    const index = this._crumbs.indexOf(this.selected);
    if (index !== -1) {
      this._crumbs.length = index + 1;
    } else {
      this._crumbs.push(this.selected);
    }
  }
  onClearSearch() {
    this.search = '';
  }
  changed() {
    const elements = [];
    if (this._crumbs.length > 1) {
      elements.push(ioButton({
        icon: 'io:arrow_left',
        class: 'back-button',
        value: this._crumbs[this._crumbs.length - 2],
      }));
    }
    const crumbs = div();
    crumbs.children = [];
    for (let i = Math.max(0, this._crumbs.length - 2); i < this._crumbs.length; i++) {
      crumbs.children.push(ioPropertyLink({
        value: this._crumbs[i],
        showName: i === this._crumbs.length - 1,
      }));
    }
    elements.push(
      crumbs,
      ioButton({icon: 'io:close', class: 'clear-button', action: this.onClearSearch}),
      ioString({id: 'search', class: 'search-input', value: this.bind('search'), live: true}),
    );
    this.render(elements);
  }
}
export const ioBreadcrumbs = IoBreadcrumbs.vConstructor;