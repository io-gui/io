import {IoItem} from "../core/item.js";
import {IoLayerSingleton as Layer} from "../core/layer.js";
import {IoMenuOptions} from "./menu-options.js";

// TODO: fix and improve keyboard navigation in all cases.

export class IoMenuItem extends IoItem {
	static get Style() {
		return /* css */`
		:host {
			display: flex;
			flex: 0 0 auto;
			flex-direction: row;
			padding: var(--io-spacing);
			border-radius: 0;
			background: none;
			border: var(--io-border-width) solid transparent;
			background-color: transparent;
			border-color: transparent;
		}
		:host > * {
			overflow: visible;
			pointer-events: none;
		}
		:host > :not(:empty) {
			padding: 0 var(--io-spacing);
		}
		:host > .io-menu-icon {}
		:host > .io-menu-label {
			flex: 1 1 auto;
			text-overflow: ellipsis;
		}
		:host > .io-menu-hint {
			opacity: 0.25;
		}
		:host[hasmore]:after {
			content: '▸';
		}
		:host[selected][direction="top"],
		:host[selected][direction="bottom"] {
			border-bottom-color: var(--io-color-link);
		}
		:host[selected][direction="right"],
		:host[selected][direction="left"] {
			border-left-color: var(--io-color-link);
		}
		`;
	}
	static get Properties() {
		return {
			option: {
				type: Object,
			},
			expanded: {
				value: false,
				reflect: 1,
			},
			direction: {
				value: 'bottom',
				reflect: 1,
			},
			$parent: HTMLElement,
			$options: HTMLElement,
			selectable: false,
			lazy: true,
		};
	}
	static get Listeners() {
		return {
			'click': 'preventDefault',
		};
	}
	preventDefault(event) {
		event.stopPropagation();
		event.preventDefault();
	}
	get _options() {
		return this._option.options;
	}
	get _option() {
		if (this.option && typeof this.option === 'object') {
			return this.option;
		} else {
			// TODO: reconsider using only object types.
			return {value: this.option};
		}
	}
	get _selectable() {
		return this.selectable && this._option.selectable !== false;
	}
	get _action() {
		return this._option.action;
	}
	get _value() {
		return this._option.value;
	}
	get _icon() {
		return this._option.icon || '';
	}
	get _label() {
		return this.label || this._option.label || String(this._option.value) || '';
	}
	get _hint() {
		return this._option.hint || '';
	}
	get _selected() {
		if (!this.selectable || this._option.selectable === false) return false;
		if (this._option.selected || this._option.value === this.value) {
			return true;
		}
		return !!this.filterObject(this._options || {}, (o) => { return o === this.value || o.value === this.value; });
	}
	get inlayer() {
		return this.$parent && this.$parent.inlayer;
	}
	connectedCallback() {
		super.connectedCallback();
		if (this.$options) Layer.appendChild(this.$options);
		if (!this.inlayer) Layer.addEventListener('pointermove', this._onLayerPointermove);
	}
	disconnectedCallback() {
		super.disconnectedCallback();
		if (this.$options && this.$options.inlayer) Layer.removeChild(this.$options);
		Layer.removeEventListener('pointermove', this._onLayerPointermove);
	}
	_onClick() {
		const selectable = this._value !== undefined && this._selectable;
		const actionable = typeof this._action === 'function';
		if (selectable || actionable) {
			if (selectable) this.set('value', this._value, true);
			if (actionable) this._action.apply(null, [this._value]);
			this.dispatchEvent('item-clicked', {value: this._value, action: this._action, selectable: this._selectable}, true);
			this.requestAnimationFrameOnce(this._collapse);
		} else if (!this.expanded && this._options) this.expanded = true;
	}
	_onItemClicked(event) {
		const item = event.composedPath()[0];
		const d = event.detail;
		if (item !== this) {
			event.stopImmediatePropagation();
			const selectable = d.value !== undefined && d.selectable;
			if (selectable) this.set('value', d.value);
			this.dispatchEvent('item-clicked', d, true);
		}
		if (this.expanded) this.requestAnimationFrameOnce(this._collapse);
	}
	_onPointerdown(event) {
		event.stopPropagation();
		event.preventDefault(); // Prevents focus
		this.setPointerCapture(event.pointerId);
		this.addEventListener('pointermove', this._onPointermove);
		this.addEventListener('pointerup', this._onPointerup);
		if (this.expanded || event.pointerType === 'mouse' || this.inlayer) {
			this.focus();
			if (this._options) this.expanded = true;
		}
		hovered = this;
		hoveredParent = this.parentElement;
		// TODO: Safari temp fix for event.movement = 0
		this._x = event.clientX;
		this._y = event.clientY;
	}
	_onPointermove(event) {
		event.stopPropagation();
		if (!this.expanded && event.pointerType === 'touch' && !this.inlayer) {
			return;
		}
		const clipped = !!this.$parent && !!this.$parent.style.height;
		if (event.pointerType === 'touch' && clipped) {
			return;
		}

		// TODO: Safari temp fix for event.movement = 0
		const movementX = event.clientX - this._x;
		const movementY = event.clientY - this._y;
		this._x = event.clientX;
		this._y = event.clientY;

		Layer.x = event.clientX;
		Layer.y = event.clientY;
		clearTimeout(this.__timeoutOpen);
		hovered = this._gethovered(event);
		if (hovered) {
			const v = Math.abs(movementY) - Math.abs(movementX);
			const h = hovered.parentElement.horizontal;
			if (hoveredParent !== hovered.parentElement) {
				hoveredParent = hovered.parentElement;
				this._expandHovered();
			} else if (h ? v < -0.5 : v > 0.5) {
				this._expandHovered();
			} else {
				this.__timeoutOpen = setTimeout(() => {
					this._expandHovered();
				}, 100);
			}
		}
	}
	_gethovered(event) {
		const items = getElementDescendants(getRootElement(this));
		for (let i = items.length; i--;) {
			if (isPointerAboveItem(event, items[i])) return items[i];
		}
	}
	_expandHovered() {
		if (hovered) {
			hovered.focus();
			if (hovered._options) {
				if (hovered.$options) {
					const descendants = getElementDescendants(hovered.$options);
					for (let i = descendants.length; i--;) {
						descendants[i].expanded = false;
					}
				}
				hovered.expanded = true;
			}
		}
	}
	_onLayerPointermove(event) {
		if (this.expanded) this._onPointermove(event);
	}
	_onPointerup(event, options) {
		event.stopPropagation();
		this.removeEventListener('pointermove', this._onPointermove);
		this.removeEventListener('pointerup', this._onPointerup);
		const item = this._gethovered(event);
		const nocollapse = options && options.nocollapse;
		if (item) {
			item.focus();
			item._onClick(event);
		} else {
			if (!nocollapse) {
				this.requestAnimationFrameOnce(this._collapseRoot);
			}
		}
	}
	_onKeydown(event) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			this._onClick(event);
			return;
		} else if (event.key === 'Escape') {
			event.preventDefault();
			this.requestAnimationFrameOnce(this._collapseRoot);
			return;
		}

		let command = '';
		if (this.direction === 'left' || this.direction === 'right') {
			if (event.key === 'ArrowUp') command = 'prev';
			if (event.key === 'ArrowRight') command = 'in';
			if (event.key === 'ArrowDown') command = 'next';
			if (event.key === 'ArrowLeft') command = 'out';
		} else {
			if (event.key === 'ArrowUp') command = 'out';
			if (event.key === 'ArrowRight') command = 'next';
			if (event.key === 'ArrowDown') command = 'in';
			if (event.key === 'ArrowLeft') command = 'prev';
		}
		if (this.inlayer && event.key === 'Tab') command = 'next';

		const siblings = this.$parent ? [...this.$parent.children] : [];
		const index = siblings.indexOf(this);
		if (command && (this.inlayer || this.expanded)) {
			event.preventDefault();
			switch (command) {
				case 'prev': {
					const prev = siblings[(index + siblings.length - 1) % (siblings.length)];
					this.expanded = false;
					if (prev) {
						if (prev._options) prev.expanded = true;
						prev.focus();
					}
					break;
				}
				case 'next': {
					const next = siblings[(index + 1) % (siblings.length)];
					this.expanded = false;
					if (next) {
						if (next._options) next.expanded = true;
						next.focus();
					}
					break;
				}
				case 'in':
					if (this.$options && this.$options.children.length) this.$options.children[0].focus();
					break;
				case 'out':
					this.expanded = false;
					if (this.$parent && this.$parent.$parent) {
						this.$parent.$parent.focus();
					}
					break;
				default:
					break;
			}
		} else {
			super._onKeydown(event);
		}
	}
	_collapse() {
		this.expanded = false;
	}
	_collapseRoot() {
		getRootElement(this).expanded = false;
	}
	expandedChanged() {
		if (this.expanded) {
			if (!this.$options) {
				this.$options = new IoMenuOptions({
					$parent: this,
					expanded: this.bind('expanded'),
					'on-item-clicked': this._onItemClicked,
				});
			}
			if (this.$options && this.$options.parentElement !== Layer) {
				Layer.appendChild(this.$options);
			}
			const items = getElementDescendants(getRootElement(this));
			const ancestors = getElementAncestors(this);
			for (let i = items.length; i--;) {
				if (ancestors.indexOf(items[i]) === -1) {
					items[i].expanded = false;
				}
			}
			if (this.$options) {
				const descendants = getElementDescendants(this.$options);
				for (let i = descendants.length; i--;) {
					descendants[i].expanded = false;
				}
			}
		} else {
			const descendants = getElementDescendants(this);
			for (let i = descendants.length; i--;) {
				descendants[i].expanded = false;
			}
		}
	}
	changed() {
		this.__properties.selected.value = this._selected;
		this.setAttribute('selected', this._selected);
		this.setAttribute('hasmore', !!this._options && this.direction === 'right');
		this.template([
			['span', {class: 'io-menu-icon'}, this._icon],
			['span', {class: 'io-menu-label'}, this._label],
			['span', {class: 'io-menu-hint'}, this._hint],
		]);
		if (this.$options && this.expanded) {
			this.$options.setProperties({
				value: this.value,
				options: this._options,
				selectable: this._selectable,
				position: this.direction,
			});
		}
	}
}

IoMenuItem.Register();

export function getElementDescendants(element) {
	const descendants = [];
	let items;
	// TODO: unhack
	if ('io-menu-item, io-option-menu'.search(element.localName) !== -1) {
		descendants.push(element);
		if (element.$options) {
			items = element.$options.querySelectorAll('io-menu-item, io-option-menu');
		}
	} else if (element.localName === 'io-context-menu') {
		if (element.$options) {
			items = element.$options.querySelectorAll('io-menu-item, io-option-menu');
		}
	} else {
		items = element.querySelectorAll('io-menu-item, io-option-menu');
	}
	for (let i = items.length; i--;) {
		descendants.push(items[i]);
		if (items[i].expanded) descendants.push(...getElementDescendants(items[i]));
	}
	return descendants;
}

function getElementAncestors(element) {
	let item = element;
	const ancestors = [element];
	while (item && item.$parent) {
		item = item.$parent;
		if (item) ancestors.push(item);
	}
	return ancestors;
}

function getRootElement(element) {
	let root = element;
	while (root && root.$parent) {
		root = root.$parent;
	}
	return root;
}

function isPointerAboveItem(event, element) {
	const r = element.getBoundingClientRect();
	const x = event.clientX;
	const y = event.clientY;
	if (['io-menu-item', 'io-option-menu'].indexOf(element.localName) !== -1) {
		if (!element.inlayer || element.parentElement.expanded) {
			const hovered = (
				r.top <= y &&
				r.bottom >= y &&
				r.left <= x &&
				r.right >= x
				);
			return hovered;
		}
	}
}

let hovered;
let hoveredParent;
