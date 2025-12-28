// TODO: test!!!
export class NodeArray extends Array {
    node;
    _isInternalOperation = false;
    static get [Symbol.species]() { return Array; }
    constructor(node, ...args) {
        super(...args);
        this.node = node;
        // TODO: Avoid creating empty NodeArrays in models!
        // TODO: Test thoroughly! Check initializations with items!
        // console.log('NodeArray constructor', args);
        this.itemMutated = this.itemMutated.bind(this);
        this.dispatchMutation = this.dispatchMutation.bind(this);
        debug: if (!node._isNode && !node._isIoElement) {
            console.error('NodeArray constructor called with non-node!');
        }
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        const proxy = new Proxy(this, {
            get(target, property) {
                if (typeof property === 'symbol') {
                    return target[property];
                }
                const index = Number(property);
                if (!isNaN(index) && index >= 0) {
                    return target[index];
                }
                return target[property];
            },
            set(target, property, value) {
                if (property === 'length') {
                    if (!self._isInternalOperation) {
                        const oldLength = target.length;
                        const newLength = Number(value);
                        if (newLength < oldLength) {
                            for (let i = newLength; i < oldLength; i++) {
                                const item = target[i];
                                if (item._isNode) {
                                    item.removeEventListener('io-object-mutation', self.itemMutated);
                                    item.removeParent(self.node);
                                }
                            }
                        }
                        else if (newLength > oldLength) {
                            console.warn('NodeArray: cannot extend array with empty slots');
                            return true;
                        }
                    }
                    target[property] = value;
                    if (!self._isInternalOperation)
                        self.dispatchMutation();
                    return true;
                }
                const index = Number(property);
                if (!isNaN(index) && index >= 0) {
                    // TODO Prevent adding to index greater than length?
                    const oldValue = target[index];
                    if (oldValue !== undefined && oldValue._isNode && !self._isInternalOperation) {
                        oldValue.removeEventListener('io-object-mutation', self.itemMutated);
                        oldValue.removeParent(self.node);
                    }
                    target[property] = value;
                    if (value._isNode && !self._isInternalOperation) {
                        value.addEventListener('io-object-mutation', self.itemMutated);
                        value.addParent(self.node);
                    }
                    if (!self._isInternalOperation)
                        self.dispatchMutation();
                    return true;
                }
                target[property] = value;
                return true;
            }
        });
        Object.defineProperty(this, 'proxy', { value: proxy, enumerable: false, configurable: false });
        return proxy;
    }
    // TODO: test!
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
                if (item._isNode) {
                    item.removeEventListener('io-object-mutation', this.itemMutated);
                    item.removeParent(this.node);
                }
            }
            const result = super.splice(start, deleteCount, ...items);
            for (let i = start; i < start + items.length; i++) {
                const item = this[i];
                if (item._isNode) {
                    item.addEventListener('io-object-mutation', this.itemMutated);
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
                if (item._isNode) {
                    item.addEventListener('io-object-mutation', this.itemMutated);
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
                if (item._isNode) {
                    item.addEventListener('io-object-mutation', this.itemMutated);
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
            if (item !== undefined && item._isNode) {
                item.removeEventListener('io-object-mutation', this.itemMutated);
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
            if (item !== undefined && item._isNode) {
                item.removeEventListener('io-object-mutation', this.itemMutated);
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
    fill() {
        console.warn('NodeArray: fill is not supported');
        return this;
    }
    copyWithin() {
        console.warn('NodeArray: copyWithin is not supported');
        return this;
    }
    itemMutated(event) {
        this.node.dispatch('io-object-mutation', { object: this.proxy }, false, window);
    }
    dispatchMutation() {
        this.node.dispatch('io-object-mutation', { object: this.proxy }, false, window);
    }
}
//# sourceMappingURL=NodeArray.js.map