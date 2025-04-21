import { ArgsWithBinding, Property, Register, span, VDOMElement } from 'io-gui';
import { IoButton, IoButtonArgs } from 'io-inputs';

export type IoPropertyLinkArgs = IoButtonArgs & ArgsWithBinding<{
  value?: Object;
  showName?: boolean;
}>;

@Register
export class IoPropertyLink extends IoButton {
  static vConstructor: (arg0?: IoPropertyLinkArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
  static get Style() {
    return /* css */`
    :host {
      display: flex;
    }
    :host > span {
      color: var(--io_colorBlue);
      flex: 0 1 auto;
      overflow-x: hidden;
      text-overflow: ellipsis;
    }
    :host:hover > span {
      text-decoration: underline;
    }
    `;
  }

  @Property({type: Object})
  declare value: Object;

  @Property({value: false, type: Boolean})
  declare showName: boolean;

  @Property({value: 'neutral', type: String, reflect: true})
  declare appearance: 'inset' | 'outset' | 'neutral';

  valueMutated() {
    this.changed();
  }

  changed() {
    let label = '';
    if (this.value instanceof Array) {
      label = `${this.value.constructor.name} (${this.value.length})`;
    } else {
      label = `${this.value.constructor.name}`;
    }
    if (this.showName) {
      const name = (this.value as any).name;
      if (name) {
        label += ` "${name}"`;
      }
    }
    this.template([span(label)]);
  }
}

export const ioPropertyLink = IoPropertyLink.vConstructor;