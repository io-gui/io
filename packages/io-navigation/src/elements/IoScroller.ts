import { Register, IoElement, ReactiveProperty, IoElementProps, VDOMElement } from 'io-gui';
import { MenuOptions } from 'io-menus';

export type IoScrollerProps = IoElementProps & {
  options?: MenuOptions,
};

@Register
export class IoScroller extends IoElement {
  static vConstructor: (arg0?: IoScrollerProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;

  static get Style() {
    return /* css */`
      :host {
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
        position: relative;
        overflow-y: auto;
        max-width: 100%;
        max-height: 100%;
        scrollbar-gutter: stable;
      }
      :host > * {
        overflow: unset;
      }
    `;
  }

  @ReactiveProperty({type: MenuOptions})
  declare options: MenuOptions;

  declare private _observer: MutationObserver;

  init() {
    this._observer = new MutationObserver(this._onDomMutated);
    this._observer.observe(this as unknown as HTMLElement, {attributes: false, childList: true, subtree: true});
    this._scrollToSelected = this._scrollToSelected.bind(this);
  }
  connectedCallback() {
    super.connectedCallback();
    this.optionsMutated();
  }
  _onDomMutated() {
    this.throttle(this._scrollToSelected);
  }
  optionsMutated() {
    this.throttle(this._scrollToSelected);
  }

  _scrollToSelected() {
    if (this.scrollHeight <= this.clientHeight) return;

    const selected = this.options.scroll;

    debug: if (selected && typeof selected !== 'string') {
      console.warn('IoScroller: selected scroll option is not a string!');
    }

    if (selected && typeof selected === 'string') {
      const element = this.querySelector('#' + selected);
      if (element) {
        this.scrollTo({top: element.offsetTop, behavior: 'auto'});
      } else {
        this.scrollTo(0, 0);
      }
    }
  }
  dispose() {
    super.dispose();
    this._observer.disconnect();
  }
}
export const ioScroller = IoScroller.vConstructor;