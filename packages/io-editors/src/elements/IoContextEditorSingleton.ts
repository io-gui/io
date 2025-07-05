import { IoOverlaySingleton, ReactiveProperty, Register, VDOMElement } from 'io-gui';
import { IoPropertyEditor, IoPropertyEditorProps } from './IoPropertyEditor.js';

type IoContextEditorProps = IoPropertyEditorProps & {
  expanded?: boolean,
};

interface IoContextEditorExpandProps {
  value: any,
  properties?: string[],
  labeled?: boolean,
  orientation?: 'vertical' | 'horizontal',
}

@Register
class IoContextEditor extends IoPropertyEditor {
  static vConstructor: (arg0?: IoContextEditorProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
  static get Style() {
    return /* css */`
    :host:not([expanded]) {
      visibility: hidden;
    }
    `;
  }

  @ReactiveProperty({type: Boolean, value: false, reflect: true})
  declare expanded: boolean;

  static get Listeners() {
    return {
      'keydown': 'onKeydown',
      'io-focus-to': 'onIoFocusTo',
    };
  }
  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.expanded = false;
    }
  }
  onIoFocusTo(event: CustomEvent) {
    const source = event.detail.source;
    const cmd = event.detail.command;
    const siblings = this.querySelectorAll('[tabindex="0"]')
    const index = [...siblings].indexOf(source);

    let cmdOverride = '';
    if (this.horizontal) {
      if (cmd === 'ArrowRight') cmdOverride = 'next';
      if (cmd === 'ArrowLeft') cmdOverride = 'prev';
    } else {
      if (cmd === 'ArrowDown') cmdOverride = 'next';
      if (cmd === 'ArrowUp') cmdOverride = 'prev';
    }

    if (cmdOverride) {
      if (cmdOverride === 'next') {
        siblings[(index + 1) % siblings.length].focus();
      } else if (cmdOverride === 'prev') {
        siblings[(index - 1 + siblings.length) % siblings.length].focus();
      } else if (cmdOverride === 'out') {
        if (this.$parent) this.$parent.focus();
      }
      event.stopPropagation();
    }
  }
  expand(props: IoContextEditorExpandProps) {
    this.setProperties({
      value: props.value,
      properties: props.properties || [],
      labeled: props.labeled || true,
      orientation: props.orientation || 'vertical',
      expanded: true,
    });
    this.debounce(this.onExpand);
  }
  onExpand() {
    this.querySelector('[tabindex="0"]')?.focus();
    // TODO: keyboard focus navigation
  }
  expandedChanged() {
    if (!this.expanded) {
      this.setProperties({
        value: {},
        properties: [],
        labeled: true,
        orientation: 'vertical',
      });
    }
  }
}

export const IoContextEditorSingleton = new IoContextEditor();
IoOverlaySingleton.appendChild(IoContextEditorSingleton as unknown as HTMLElement);
