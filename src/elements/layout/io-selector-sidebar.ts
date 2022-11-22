import { RegisterIoElement } from '../../core/element.js';
import {IoSelector} from './io-selector.js';
import './io-sidebar.js';

/**
 * Element selector with selectable sidebar interfce.
 *
 * <io-element-demo element="io-selector-sidebar"
 *     properties='{
 *         "elements": [
 *             ["div", {"name": "first"}, "First content"],
 *             ["div", {"name": "second"}, "Second content"],
 *             ["div", {"name": "third"}, "Third content"],
 *             ["div", {"name": "fourth"}, "Fourth content"]],
 *         "selected": "first",
 *         "cache": false,
 *         "options": [
 *             "first",
 *             "second",
 *             "third",
 *             "fourth"],
 *         "right": false,
 *         "collapseWidth": 410}'
 *     config='{"options": ["io-properties"]}'>
 * </io-element-demo>
 **/
@RegisterIoElement
export class IoSelectorSidebar extends IoSelector {
  static get Style() {
    return /* css */`
    :host {
      flex-direction: row;
    }
    :host[right] {
      flex-direction: row-reverse;
    }
    :host[collapsed] {
      flex-direction: column;
    }
    :host > io-menu-options {
      flex: 0 0 auto;
      background-color: var(--io-background-color-dark);
      border: var(--io-border);
      border-width: 0 var(--io-border-width) 0 0;
    }
    :host[right] > io-menu-options {
      border-width: 0 0 0 var(--io-border-width);
    }
    :host[collapsed] > io-menu-options {
      flex: 0 0 auto;
      border-width: 0 0 var(--io-border-width) 0;
    }
    `;
  }
  static get Properties(): any {
    return {
      collapseWidth: 410,
      collapsed: {
        type: Boolean,
        reflect: 'prop',
      },
      right: {
        type: Boolean,
        reflect: 'prop',
      },
    };
  }
  // onResized() {
  //   this.collapsed = this.getBoundingClientRect().width < this.collapseWidth;
  // }
  // collapsedChanged() { this.update(); }
  getSlotted() {
    // return ['io-sidebar', {
    //   selected: this.bind('selected'),
    //   options: this.options,
    //   collapsed: this.collapsed,
    // }];

    return ['io-menu-options', {
      role: 'navigation',
      // horizontal: true,
      // value: this.bind('selected'), // TODO: Does not exist
      options: this.options,
      // depth: this.depth,
      // slotted: this.slotted,
      // selectable: true, // TODO: Does not exist
    }];
  }
}
