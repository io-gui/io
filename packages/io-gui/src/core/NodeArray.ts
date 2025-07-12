import { Node } from '../nodes/Node.js';
import { IoElement } from '../elements/IoElement.js';

// TODO: test!!!
export class NodeArray<N extends Node> extends Array<N> {
  declare private proxy: typeof Proxy;
  private _isInternalOperation = false;

  static get [Symbol.species]() { return Array; }

  constructor(public node: Node | IoElement, ...args: any[]) {
    super(...args);
    this.dispatchMutation = this.dispatchMutation.bind(this);
    this.dispatchMutationDebounced = this.dispatchMutationDebounced.bind(this);

    debug: if (!(node instanceof Node) && !(node instanceof IoElement)) {
      console.error('NodeArray constructor called with non-node!');
    }

    const self = this;
    const proxy = new Proxy(this, {
      set(target: NodeArray<N>, property: string | symbol, value: any) {
        if (property === 'length') {
          if (!self._isInternalOperation) {
            const oldLength = target.length;
            const newLength = Number(value);
            if (newLength < oldLength) {
              for (let i = newLength; i < oldLength; i++) {
                const item = target[i];
                if (item instanceof Node) {
                  item.removeEventListener('io-object-mutation', self.dispatchMutation);
                }
              }
            } else if (newLength > oldLength) {
              console.warn('NodeArray: cannot extend array with empty slots');
              return true;
            }
          }
          target[property as any] = value;
          if (!self._isInternalOperation) self.dispatchMutation();
          return true;
        }
        const index = Number(property);
        if (!isNaN(index) && index >= 0) {
          // TODO Prevent adding to index greater than length?
          const oldValue = target[index];
          if (oldValue instanceof Node && !self._isInternalOperation) {
            oldValue.removeEventListener('io-object-mutation', self.dispatchMutation);
          }
          target[property as any] = value;
          if (value instanceof Node && !self._isInternalOperation) {
            value.addEventListener('io-object-mutation', self.dispatchMutation);
          }
          if (!self._isInternalOperation) self.dispatchMutation();
          return true;
        }
        target[property as any] = value;
        // self.dispatchMutation();
        return true;
      }
    });
    Object.defineProperty(this, 'proxy', {value: proxy, enumerable: false, configurable: false});
    return proxy;
  }
  private withInternalOperation<T>(operation: () => T): T {
    this._isInternalOperation = true;
    try {
      return operation();
    } finally {
      this._isInternalOperation = false;
    }
  }
  splice(start: number, deleteCount: number, ...items: N[]): N[] {
    return this.withInternalOperation(() => {
      for (let i = start; i < start + deleteCount; i++) {
        const item = this[i];
        if (item instanceof Node) {
          item.removeEventListener('io-object-mutation', this.dispatchMutation);
        }
      }
      const result = super.splice(start, deleteCount, ...items);
      for (let i = start; i < start + items.length; i++) {
        const item = this[i];
        if (item instanceof Node) {
          item.addEventListener('io-object-mutation', this.dispatchMutation);
        }
      }
      this.dispatchMutation();
      return result;
    });
  }
  push(...items: N[]): number {
    return this.withInternalOperation(() => {
      const result = super.push(...items);
      for (const item of items) {
        if (item instanceof Node) {
          item.addEventListener('io-object-mutation', this.dispatchMutation);
        }
      }
      this.dispatchMutation();
      return result;
    });
  }
  unshift(...items: N[]): number {
    return this.withInternalOperation(() => {
      const result = super.unshift(...items);
      for (const item of items) {
        if (item instanceof Node) {
          item.addEventListener('io-object-mutation', this.dispatchMutation);
        }
      }
      this.dispatchMutation();
      return result;
    });
  }
  pop(): N | undefined {
    return this.withInternalOperation(() => {
      const item = super.pop();
      if (item instanceof Node) {
        item.removeEventListener('io-object-mutation', this.dispatchMutation);
      }
      this.dispatchMutation();
      return item;
    });
  }
  shift(): N | undefined {
    return this.withInternalOperation(() => {
      const item = super.shift();
      if (item instanceof Node) {
        item.removeEventListener('io-object-mutation', this.dispatchMutation);
      }
      this.dispatchMutation();
      return item;
    });
  }
  reverse() {
    return this.withInternalOperation(() => {
      const result = super.reverse();
      this.dispatchMutation();
      return result;
    });
  }
  sort(compareFn?: (a: N, b: N) => number) {
    return this.withInternalOperation(() => {
      const result = super.sort(compareFn);
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
  dispatchMutation() {
    this.node.debounce(this.dispatchMutationDebounced);
  }
  dispatchMutationDebounced() {
    this.node.dispatch('io-object-mutation', {object: this.proxy}, false, window);
  }
}