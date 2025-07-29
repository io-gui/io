import { Node } from '../nodes/Node.js';
import { IoElement } from '../elements/IoElement.js';

export type SelectableNode = Node & {
  id: string;
  selected: boolean
};

// TODO: test!!!
export class NodeArray<N extends Node> extends Array<N> {
  declare private proxy: typeof Proxy;
  private _isInternalOperation = false;

  declare selected: string;

  static get [Symbol.species]() { return Array; }

  constructor(public node: Node | IoElement, ...args: any[]) {
    super(...args);
    this.itemMutated = this.itemMutated.bind(this);
    this.dispatchMutation = this.dispatchMutation.bind(this);

    debug: if (!(node._isNode) && !(node instanceof IoElement)) {
      console.error('NodeArray constructor called with non-node!');
    }

    const self = this;
    const proxy = new Proxy(this, {
      get(target: NodeArray<N>, property: string | symbol) {
        if (property === 'selected') {
          let selected = '';
          for (let i = 0; i < target.length; i++) {
            const item = target[i] as unknown as SelectableNode;
            if (item.selected && item.id) {
              selected = item.id;
              break;
            }
          }
          return selected;
        }
        if (typeof property === 'symbol') {
          return target[property as any];
        }
        const index = Number(property);
        if (!isNaN(index) && index >= 0) {
          return target[index];
        }
        return target[property as any];
      },
      set(target: NodeArray<N>, property: string | symbol, value: any) {
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
            } else if (newLength > oldLength) {
              console.warn('NodeArray: cannot extend array with empty slots');
              return true;
            }
          }
          target[property] = value;
          if (!self._isInternalOperation) self.dispatchMutation();
          return true;
        }
        if (property === 'selected') {
          for (let i = 0; i < target.length; i++) {
            const item = target[i] as unknown as SelectableNode;
            if (item.id === value) {
              item.selected = true;
            } else {
              item.selected = false;
            }
          }
          target[property] = value;
          if (!self._isInternalOperation) self.dispatchMutation();
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
          target[property as any] = value;
          if (value._isNode && !self._isInternalOperation) {
            value.addEventListener('io-object-mutation', self.itemMutated);
            value.addParent(self.node);
          }
          if (value.selected && value.id) {
            target.selected = value.id;
          }
          if (!self._isInternalOperation) self.dispatchMutation();
          return true;
        }
        target[property as any] = value;
        return true;
      }
    });
    Object.defineProperty(this, 'proxy', {value: proxy, enumerable: false, configurable: false});
    return proxy;
  }
  withInternalOperation<T>(operation: () => T, dispatch = true): T {
    this._isInternalOperation = true;
    try {
      return operation();
    } finally {
      this._isInternalOperation = false;
      if (dispatch) this.dispatchMutation();
    }
  }
  splice(start: number, deleteCount: number, ...items: N[]): N[] {
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
      return result;
    });
  }
  push(...items: N[]): number {
    return this.withInternalOperation(() => {
      const result = super.push(...items);
      for (const item of items) {
        if (item._isNode) {
          item.addEventListener('io-object-mutation', this.itemMutated);
          item.addParent(this.node);
        }
      }
      return result;
    });
  }
  unshift(...items: N[]): number {
    return this.withInternalOperation(() => {
      const result = super.unshift(...items);
      for (const item of items) {
        if (item._isNode) {
          item.addEventListener('io-object-mutation', this.itemMutated);
          item.addParent(this.node);
        }
      }
      return result;
    });
  }
  pop(): N | undefined {
    return this.withInternalOperation(() => {
      const item = super.pop();
      if (item !== undefined && item._isNode) {
        item.removeEventListener('io-object-mutation', this.itemMutated);
        item.removeParent(this.node);
      }
      return item;
    });
  }
  shift(): N | undefined {
    return this.withInternalOperation(() => {
      const item = super.shift();
      if (item !== undefined && item._isNode) {
        item.removeEventListener('io-object-mutation', this.itemMutated);
        item.removeParent(this.node);
      }
      return item;
    });
  }
  reverse() {
    return this.withInternalOperation(() => {
      const result = super.reverse();
      return result;
    });
  }
  sort(compareFn?: (a: N, b: N) => number) {
    return this.withInternalOperation(() => {
      const result = super.sort(compareFn);
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
  itemMutated(event: CustomEvent) {
    const item = event.detail.object as SelectableNode;
    if (event.detail.properties.includes('selected')) {
      this.node.dispatch('io-node-array-selected-changed', {node: this.proxy, item: item}, false);
    }
    this.node.dispatch('io-object-mutation', {object: this.proxy}, false, window);
  }
  dispatchMutation() {
    this.node.dispatch('io-object-mutation', {object: this.proxy}, false, window);
  }
}