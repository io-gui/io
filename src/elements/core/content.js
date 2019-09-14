import {IoElement} from "../../io.js";

// TODO: test and documentation

export class IoContent extends IoElement {
	static get Style() {
		return /* css */`
		:host {
			@apply --io-content;
		}
		:host:not([expanded]) {
			display: none;
		}
		`;
	}
	static get Properties() {
		return {
			elements: {
				type: Array,
				observe: true,
			},
			expanded: {
				type: Boolean,
				reflect: 1,
			},
			cache: Boolean,
		};
	}
	changed() {
		// TODO: cache outside DOM and disconnect!
		if (this.expanded) {
			this.template([this.elements]);
		} else if (!this.cache) {
			this.template([null]);
		}
	}
}

IoContent.Register();
