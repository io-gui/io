import { RegisterIoElement, VDOMArray } from '../../core/element.js';
import { IoSelector } from './io-selector.js';
import { Property } from '../../core/internals/property.js';

/**
 * Element selector with selectable tabs.
 **/
@RegisterIoElement
export class IoSelectorTabs extends IoSelector {
  static get Style() {
    return /* css */`
      :host > io-menu-options {
        flex: 0 0 auto;
        align-self: stretch;
        border-radius: 0;
        padding: 0;
        border-width: 0 0 var(--ioBorderWidth) 0;
        min-height: calc(var(--ioFieldHeight) - var(--ioBorderWidth));
      }
      :host > io-menu-options > io-menu-item {
        border-radius: 0;
      }
    `;
  }

  @Property(Array)
  declare slotted: VDOMArray[];

  @Property(Infinity)
  declare depth: number;

  getTemplate(): any {
    return [
      ['io-menu-options', {
        role: 'navigation',
        horizontal: true,
        options: this.options,
        depth: this.depth,
        slotted: this.slotted,
      }],
      ['div', {id: 'content'}]
    ];
  }
}
