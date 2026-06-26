import { isReactiveNode } from './ReactiveCore.js';
/**
 * Reactive array of {@link ReactiveObject} items owned by a parent node or element.
 *
 * Use `NodeArray` as the type for reactive properties that hold collections of child
 * nodes (for example `MenuOption.options`). The constructor registers the owner as
 * an observer; mutating methods (`push`, `splice`, indexed assignment, etc.) wire
 * parent/child links and dispatch `io-mutation` on the owner so change
 * handlers like `optionsMutated()` run automatically.
 *
 * Items must be {@link ReactiveObject} instances. The returned value from the
 * constructor is a proxied array — always use that reference, not the raw instance.
 *
 * @example
 * ```ts
 * @Property({ type: NodeArray, init: null })
 * declare options: NodeArray<MenuOption>
 * ```
 */
export class NodeArray extends Array {
    node;
    _isInternalOperation = false;
    _observers = new Set();
    static get [Symbol.species]() { return Array; }
    /** @param node Owner that receives mutation events for this collection. */
    constructor(node, ...args) {
        super(...args);
        this.node = node;
        // TODO: Avoid creating empty NodeArrays in models!
        // TODO: Test thoroughly! Check initializations with items!
        this.itemMutated = this.itemMutated.bind(this);
        this.dispatchMutation = this.dispatchMutation.bind(this);
        // Owner is the primary observer
        this._observers.add(node);
        debug: if (!isReactiveNode(node)) {
            console.error('NodeArray constructor called with non-node!');
        }
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        const proxy = new Proxy(this, {
            get(target, property) {
                if (typeof property === 'symbol') {
                    return Reflect.get(target, property);
                }
                const index = Number(property);
                if (!isNaN(index) && index >= 0) {
                    return target[index];
                }
                return Reflect.get(target, property);
            },
            set(target, property, value) {
                if (property === 'length') {
                    const newLength = Number(value);
                    if (!self._isInternalOperation) {
                        const oldLength = target.length;
                        if (newLength < oldLength) {
                            for (let i = newLength; i < oldLength; i++) {
                                const item = target[i];
                                if (isReactiveNode(item)) {
                                    item.removeEventListener('io-mutation', self.itemMutated);
                                    item.removeParent(self.node);
                                }
                            }
                        }
                        else if (newLength > oldLength) {
                            console.warn('NodeArray: cannot extend array with empty slots');
                            return true;
                        }
                    }
                    target.length = newLength;
                    if (!self._isInternalOperation)
                        self.dispatchMutation();
                    return true;
                }
                const index = Number(property);
                if (!isNaN(index) && index >= 0) {
                    // TODO Prevent adding to index greater than length?
                    const oldValue = target[index];
                    if (isReactiveNode(oldValue) && !self._isInternalOperation) {
                        oldValue.removeEventListener('io-mutation', self.itemMutated);
                        oldValue.removeParent(self.node);
                    }
                    target[index] = value;
                    if (isReactiveNode(value) && !self._isInternalOperation) {
                        value.addEventListener('io-mutation', self.itemMutated);
                        value.addParent(self.node);
                    }
                    if (!self._isInternalOperation)
                        self.dispatchMutation();
                    return true;
                }
                Reflect.set(target, property, value);
                return true;
            }
        });
        Object.defineProperty(this, 'proxy', { value: proxy, enumerable: false, configurable: false });
        return proxy;
    }
    /** Run array mutations without dispatching `io-mutation` until complete. */
    withInternalOperation(operation) {
        this._isInternalOperation = true;
        try {
            return operation();
        }
        finally {
            this._isInternalOperation = false;
        }
    }
    splice(start, deleteCount, ...items) {
        return this.withInternalOperation(() => {
            for (let i = start; i < start + deleteCount; i++) {
                const item = this[i];
                if (isReactiveNode(item)) {
                    item.removeEventListener('io-mutation', this.itemMutated);
                    item.removeParent(this.node);
                }
            }
            const result = super.splice(start, deleteCount, ...items);
            for (let i = start; i < start + items.length; i++) {
                const item = this[i];
                if (isReactiveNode(item)) {
                    item.addEventListener('io-mutation', this.itemMutated);
                    item.addParent(this.node);
                }
            }
            if (deleteCount || items.length)
                this.dispatchMutation();
            return result;
        });
    }
    push(...items) {
        return this.withInternalOperation(() => {
            const result = super.push(...items);
            for (const item of items) {
                if (isReactiveNode(item)) {
                    item.addEventListener('io-mutation', this.itemMutated);
                    item.addParent(this.node);
                }
            }
            if (items.length)
                this.dispatchMutation();
            return result;
        });
    }
    unshift(...items) {
        return this.withInternalOperation(() => {
            const result = super.unshift(...items);
            for (const item of items) {
                if (isReactiveNode(item)) {
                    item.addEventListener('io-mutation', this.itemMutated);
                    item.addParent(this.node);
                }
            }
            if (items.length)
                this.dispatchMutation();
            return result;
        });
    }
    pop() {
        return this.withInternalOperation(() => {
            const item = super.pop();
            if (item !== undefined && isReactiveNode(item)) {
                item.removeEventListener('io-mutation', this.itemMutated);
                item.removeParent(this.node);
            }
            if (item !== undefined)
                this.dispatchMutation();
            return item;
        });
    }
    shift() {
        return this.withInternalOperation(() => {
            const item = super.shift();
            if (item !== undefined && isReactiveNode(item)) {
                item.removeEventListener('io-mutation', this.itemMutated);
                item.removeParent(this.node);
            }
            if (item !== undefined)
                this.dispatchMutation();
            return item;
        });
    }
    reverse() {
        return this.withInternalOperation(() => {
            const result = super.reverse();
            if (result.length)
                this.dispatchMutation();
            return result;
        });
    }
    sort(compareFn) {
        return this.withInternalOperation(() => {
            const result = super.sort(compareFn);
            if (result.length)
                this.dispatchMutation();
            return result;
        });
    }
    fill(value, start, end) {
        return this.withInternalOperation(() => {
            const len = this.length;
            const relativeStart = start ?? 0;
            const relativeEnd = end ?? len;
            const actualStart = relativeStart < 0
                ? Math.max(len + relativeStart, 0)
                : Math.min(relativeStart, len);
            const actualEnd = relativeEnd < 0
                ? Math.max(len + relativeEnd, 0)
                : Math.min(relativeEnd, len);
            for (let i = actualStart; i < actualEnd; i++) {
                const oldItem = this[i];
                if (oldItem !== undefined && isReactiveNode(oldItem)) {
                    oldItem.removeEventListener('io-mutation', this.itemMutated);
                    oldItem.removeParent(this.node);
                }
            }
            super.fill(value, actualStart, actualEnd);
            for (let i = actualStart; i < actualEnd; i++) {
                if (isReactiveNode(value)) {
                    value.addEventListener('io-mutation', this.itemMutated);
                    value.addParent(this.node);
                }
            }
            if (actualEnd > actualStart)
                this.dispatchMutation();
            return this;
        });
    }
    copyWithin(target, start, end) {
        return this.withInternalOperation(() => {
            const len = this.length;
            const relativeTarget = target;
            const relativeStart = start ?? 0;
            const relativeEnd = end ?? len;
            const actualTarget = relativeTarget < 0
                ? Math.max(len + relativeTarget, 0)
                : Math.min(relativeTarget, len);
            const actualStart = relativeStart < 0
                ? Math.max(len + relativeStart, 0)
                : Math.min(relativeStart, len);
            const actualEnd = relativeEnd < 0
                ? Math.max(len + relativeEnd, 0)
                : Math.min(relativeEnd, len);
            const count = Math.min(actualEnd - actualStart, len - actualTarget);
            if (count <= 0)
                return this;
            for (let i = actualTarget; i < actualTarget + count; i++) {
                const oldItem = this[i];
                if (oldItem !== undefined && isReactiveNode(oldItem)) {
                    oldItem.removeEventListener('io-mutation', this.itemMutated);
                    oldItem.removeParent(this.node);
                }
            }
            super.copyWithin(actualTarget, actualStart, actualEnd);
            for (let i = actualTarget; i < actualTarget + count; i++) {
                const item = this[i];
                if (isReactiveNode(item)) {
                    item.addEventListener('io-mutation', this.itemMutated);
                    item.addParent(this.node);
                }
            }
            this.dispatchMutation();
            return this;
        });
    }
    /** Register an additional node to receive mutation events from this array. */
    addObserver(node) {
        this._observers.add(node);
    }
    /** Stop delivering mutation events to a previously registered observer. */
    removeObserver(node) {
        this._observers.delete(node);
    }
    itemMutated(event) {
        for (const observer of this._observers) {
            observer.dispatch('io-mutation', { object: this.proxy, property: event.detail.index });
        }
    }
    dispatchMutation() {
        for (const observer of this._observers) {
            observer.dispatch('io-mutation', { object: this.proxy });
        }
    }
    /** Serialize each item via its own {@link ReactiveObject.toJSON}. */
    toJSON() {
        return this.map((item) => item.toJSON());
    }
    /** Hydrate each item from wire-format JSON via {@link ReactiveObject.applyJSON}. */
    applyJSON(json) {
        for (let i = 0; i < json.length; i++) {
            this[i].applyJSON(json[i]);
        }
    }
    dispose() {
        const nodes = [...this];
        for (const item of nodes) {
            if (isReactiveNode(item)) {
                item.removeEventListener('io-mutation', this.itemMutated);
                item.removeParent(this.node);
            }
        }
        this.withInternalOperation(() => {
            super.splice(0, this.length);
        });
        // TODO: Reconsider if nodes in NodeArray should be disposed automatically
        // for (const node of nodes) node.dispose()
        this._observers.clear();
    }
}
