import { NudgeDirection, ReactiveProperty, Register } from 'io-core';
import { ioIcon } from 'io-icons';
import { IoMenuItem } from './IoMenuItem.js';

@Register
export class IoMenuHamburger extends IoMenuItem {
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        flex-shrink: 0;
      }
      :host > * {
        pointer-events: none;
        text-overflow: ellipsis;
      }
    `;
  }

  @ReactiveProperty({value: 'down', reflect: true})
  declare direction: NudgeDirection;

  changed() {
    this.render([ioIcon({value: 'io:hamburger'})]);
  }
}
export const ioMenuHamburger = IoMenuHamburger.vConstructor;