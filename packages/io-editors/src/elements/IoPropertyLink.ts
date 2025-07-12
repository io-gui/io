import { ReactiveProperty, Register, span, VDOMElement } from 'io-gui';
import { IoButton, IoButtonProps } from 'io-inputs';

export type IoPropertyLinkProps = IoButtonProps & {
  value?: Object,
  showName?: boolean,
};

@Register
export class IoPropertyLink extends IoButton {
  static get Style() {
    return /* css */`
    :host {
      display: flex;
    }
    :host > span {
      color: var(--io_colorBlue);
      flex: 0 1 auto;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    :host:hover > span {
      text-decoration: underline;
    }
    `;
  }

  @ReactiveProperty()
  declare value: Object;

  @ReactiveProperty({value: false, type: Boolean})
  declare showName: boolean;

  @ReactiveProperty({value: 'neutral', type: String, reflect: true})
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
    this.render([span(label)]);
  }
}

export const ioPropertyLink = function(arg0?: IoPropertyLinkProps) {
  return IoPropertyLink.vConstructor(arg0);
};