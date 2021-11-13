import {RegisterIoElement} from '../../../srcj/components/io-element.js';
import {IoSelector} from './selector.js';
import './sidebar.js';

/*
 * Extends `IoSelector`. Implements `IoSidebar`.
 *
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
    :host > io-sidebar {
      flex: 0 0 auto;
      background-color: var(--io-background-color-dark);
      border: var(--io-border);
      border-width: 0 var(--io-border-width) 0 0;
    }
    :host[right] > io-sidebar {
      border-width: 0 0 0 var(--io-border-width);
    }
    :host[collapsed] > io-sidebar {
      flex: 0 0 auto;
      border-width: 0 0 var(--io-border-width) 0;
    }
    `;
  }
  static get Properties() {
    return {
      collapseWidth: 410,
      collapsed: {
        type: Boolean,
        reflect: 1,
      },
      right: {
        type: Boolean,
        reflect: 1,
      },
    };
  }
  onResized() {
    this.collapsed = this.getBoundingClientRect().width < this.collapseWidth;
  }
  collapsedChanged() { this.update(); }
  getSlotted() {
    return ['io-sidebar', {
      selected: this.bind('selected'),
      options: this.options,
      collapsed: this.collapsed,
    }];
  }
}

RegisterIoElement(IoSelectorSidebar);
