// TODO: Improve tests.

/** Manager for `IoNode` event queue and change handle functions. */
export class NodeQueue extends Array {
	/**
	 * Creates queue manager for `IoNode`.
	 * @param {IoNode} node - Reference to the node/element itself.
	 */
	constructor(node) {
		super();
		Object.defineProperty(this, 'node', {value: node, configurable: true});
	}
	/**
	 * Add property change to the queue.
	 * @param {string} prop - Property name.
	 * @param {*} value Property value.
	 * @param {*} oldValue Old property value.
	 */
	queue(prop, value, oldValue) {
		const i = this.indexOf(prop);
		if (i === -1) {
			this.push(prop, {property: prop, value: value, oldValue: oldValue});
		} else {
			this[i + 1].value = value;
		}
	}
	/**
	 * Dispatch the queue.
	 */
	dispatch() {
		if (this._dispatchInProgress === true) return;
		this._dispatchInProgress = true;

		const node = this.node;
		let changed = false;

		while (this.length) {
			const j = this.length - 2;
			const prop = this[j];
			const detail = this[j + 1];
			const payload = {detail: detail};

			if (detail.value !== detail.oldValue) {
				changed = true;
				if (node[prop + 'Changed']) node[prop + 'Changed'](payload);
				if (node['propertyChanged']) node['propertyChanged'](payload);
				node.dispatchEvent(prop + '-changed', payload.detail);
			} else {
				if (typeof detail.value === 'object') {
					// if (node[prop + 'Mutated']) node[prop + 'Mutated'](payload);
					// node.dispatchEvent(prop + '-mutated', payload.detail);
				}
			}
			this.splice(j, 2);
		}

		// TODO: Evaluate performance and consider refactoring.
		if (changed) {
			// if (node.isIoNode && !node.isIoElement) {
			//	 node.dispatchEvent('object-mutated', {object: node}, false, window);
			// }
			node.applyCompose();
			node.changed();
			if (node.setAria) node.setAria();
		}
		this.length = 0;

		this._dispatchInProgress = false;
	}
	/**
	 * Remove queue items and the node reference.
	 * Use this when node is no longer needed.
	 */
	dispose() {
		this.length = 0;
		delete this.node;
	}
}
