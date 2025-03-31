import { Register, IoElement } from 'io-gui';

export class IoElementDemo extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      display: flex;
      flex: 0 1 auto;
      min-width: 450px;
      flex-direction: column;
      align-self: flex-start;
      background-color: var(--io_bgColorStrong);
      padding: var(--io_spacing3);
    }
    :host > .element-wrap {
      border: var(--io_border);
      border-color: var(--io_borderColorDark);
      background-color: var(--io_bgColorDimmed);
      padding: var(--io_spacing3);
    }
    :host > io-property-editor {
      border: var(--io_border);
      border-color: var(--io_borderColorDark);
      background-color: var(--io_bgColorDimmed);
      border-top: none;
      padding: 0 var(--io_spacing2);
    }
    :host io-property-editor > div.io-row {
      border-bottom: var(--io_border);
      padding: var(--io_spacing2) 0;
    }
    :host io-property-editor > div.io-row:last-child {
      border-bottom: none;
    }
    :host io-property-editor > div.io-row > io-label {
      width: 130px;
      text-align: right;
    }
    :host io-property-editor > div.io-row > io-number {
      min-width: 60px;
    }
    :host io-property-editor > div.io-row > io-string {
      min-width: 120px;
    }
    `;
  }
  static get Properties() {
    return {
      element: String
    };
  }
  elementChanged() {
    if (this.element) {
      this.template([
        ['div', {class: 'element-wrap'}, [
          [this.element, {$: 'element'}],
        ]],
        ['io-property-editor', {$: 'properties'}]
      ]);
      const element = this.$['element'];
      const properties = this.$['properties'];
      properties.value = element;
    } else {
      this.template([
        ['io-label', {label: 'Element property not set.'}],
      ]);
    }
  }
}
Register(IoElementDemo);

export const ioElementDemo = IoElementDemo._vDOMFactory;
