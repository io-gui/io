import {IoSelector} from "./selector.js";
import "./sidebar.js";

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
			flex: 0 0 8em;
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
			options: {
				type: Array,
				observe: true,
			},
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

IoSelectorSidebar.Register();
