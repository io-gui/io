import { Node } from '../nodes/Node.js'
import { IoElement } from '../elements/IoElement.js'

// TODO: test!!!
export class NodeArray<N extends Node> extends Array<N> {
  declare private proxy: typeof Proxy
  private _isInternalOperation = false

  static get [Symbol.species]() { return Array }

  constructor(public node: Node | IoElement, ...args: any[]) {
    super(...args)
    // TODO: Avoid creating empty NodeArrays in models!
    // TODO: Test thoroughly! Check initializations with items!
    // console.log('NodeArray constructor', args);
    this.itemMutated = this.itemMutated.bind(this)
    this.dispatchMutation = this.dispatchMutation.bind(this)

    debug: if (!(node as Node)._isNode && !(node as IoElement)._isIoElement) {
      console.error('NodeArray constructor called with non-node!')
    }

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this
    const proxy = new Proxy(this, {
      get(target: NodeArray<N>, property: string | symbol) {
        if (typeof property === 'symbol') {
          return target[property as any]
        }
        const index = Number(property)
        if (!isNaN(index) && index >= 0) {
          return target[index]
        }
        return target[property as any]
      },
      set(target: NodeArray<N>, property: string | symbol, value: any) {
        if (property === 'length') {
          if (!self._isInternalOperation) {
            const oldLength = target.length
            const newLength = Number(value)
            if (newLength < oldLength) {
              for (let i = newLength; i < oldLength; i++) {
                const item = target[i]
                if (item._isNode) {
                  item.removeEventListener('io-object-mutation', self.itemMutated)
                  item.removeParent(self.node as Node)
                }
              }
            } else if (newLength > oldLength) {
              console.warn('NodeArray: cannot extend array with empty slots')
              return true
            }
          }
          target[property] = value
          if (!self._isInternalOperation) self.dispatchMutation()
          return true
        }
        const index = Number(property)
        if (!isNaN(index) && index >= 0) {
          // TODO Prevent adding to index greater than length?
          const oldValue = target[index]
          if (oldValue !== undefined && oldValue._isNode && !self._isInternalOperation) {
            oldValue.removeEventListener('io-object-mutation', self.itemMutated)
            oldValue.removeParent(self.node as Node)
          }
          target[property as any] = value
          if (value._isNode && !self._isInternalOperation) {
            value.addEventListener('io-object-mutation', self.itemMutated)
            value.addParent(self.node)
          }
          if (!self._isInternalOperation) self.dispatchMutation()
          return true
        }
        target[property as any] = value
        return true
      }
    })
    Object.defineProperty(this, 'proxy', {value: proxy, enumerable: false, configurable: false})
    return proxy
  }
  // TODO: test!
  withInternalOperation<T>(operation: () => T): T {
    this._isInternalOperation = true
    try {
      return operation()
    } finally {
      this._isInternalOperation = false
    }
  }
  splice(start: number, deleteCount: number, ...items: N[]): N[] {
    return this.withInternalOperation(() => {
      for (let i = start; i < start + deleteCount; i++) {
        const item = this[i]
        if (item._isNode) {
          item.removeEventListener('io-object-mutation', this.itemMutated)
          item.removeParent(this.node as Node)
        }
      }
      const result = super.splice(start, deleteCount, ...items)
      for (let i = start; i < start + items.length; i++) {
        const item = this[i]
        if (item._isNode) {
          item.addEventListener('io-object-mutation', this.itemMutated)
          item.addParent(this.node as Node)
        }
      }
      if (deleteCount || items.length) this.dispatchMutation()
      return result
    })
  }
  push(...items: N[]): number {
    return this.withInternalOperation(() => {
      const result = super.push(...items)
      for (const item of items) {
        if (item._isNode) {
          item.addEventListener('io-object-mutation', this.itemMutated)
          item.addParent(this.node as Node)
        }
      }
      if (items.length) this.dispatchMutation()
      return result
    })
  }
  unshift(...items: N[]): number {
    return this.withInternalOperation(() => {
      const result = super.unshift(...items)
      for (const item of items) {
        if (item._isNode) {
          item.addEventListener('io-object-mutation', this.itemMutated)
          item.addParent(this.node as Node)
        }
      }
      if (items.length) this.dispatchMutation()
      return result
    })
  }
  pop(): N | undefined {
    return this.withInternalOperation(() => {
      const item = super.pop()
      if (item !== undefined && item._isNode) {
        item.removeEventListener('io-object-mutation', this.itemMutated)
        item.removeParent(this.node as Node)
      }
      if (item !== undefined) this.dispatchMutation()
      return item
    })
  }
  shift(): N | undefined {
    return this.withInternalOperation(() => {
      const item = super.shift()
      if (item !== undefined && item._isNode) {
        item.removeEventListener('io-object-mutation', this.itemMutated)
        item.removeParent(this.node as Node)
      }
      if (item !== undefined) this.dispatchMutation()
      return item
    })
  }
  reverse() {
    return this.withInternalOperation(() => {
      const result = super.reverse()
      if (result.length) this.dispatchMutation()
      return result
    })
  }
  sort(compareFn?: (a: N, b: N) => number) {
    return this.withInternalOperation(() => {
      const result = super.sort(compareFn)
      if (result.length) this.dispatchMutation()
      return result
    })
  }
  fill(value: N, start?: number, end?: number): this {
    return this.withInternalOperation(() => {
      const len = this.length
      const relativeStart = start ?? 0
      const relativeEnd = end ?? len

      const actualStart = relativeStart < 0
        ? Math.max(len + relativeStart, 0)
        : Math.min(relativeStart, len)
      const actualEnd = relativeEnd < 0
        ? Math.max(len + relativeEnd, 0)
        : Math.min(relativeEnd, len)

      for (let i = actualStart; i < actualEnd; i++) {
        const oldItem = this[i]
        if (oldItem !== undefined && oldItem._isNode) {
          oldItem.removeEventListener('io-object-mutation', this.itemMutated)
          oldItem.removeParent(this.node as Node)
        }
      }

      super.fill(value, actualStart, actualEnd)

      for (let i = actualStart; i < actualEnd; i++) {
        if (value._isNode) {
          value.addEventListener('io-object-mutation', this.itemMutated)
          value.addParent(this.node as Node)
        }
      }

      if (actualEnd > actualStart) this.dispatchMutation()
      return this
    })
  }
  copyWithin(target: number, start?: number, end?: number): this {
    return this.withInternalOperation(() => {
      const len = this.length
      const relativeTarget = target
      const relativeStart = start ?? 0
      const relativeEnd = end ?? len

      const actualTarget = relativeTarget < 0
        ? Math.max(len + relativeTarget, 0)
        : Math.min(relativeTarget, len)
      const actualStart = relativeStart < 0
        ? Math.max(len + relativeStart, 0)
        : Math.min(relativeStart, len)
      const actualEnd = relativeEnd < 0
        ? Math.max(len + relativeEnd, 0)
        : Math.min(relativeEnd, len)

      const count = Math.min(actualEnd - actualStart, len - actualTarget)
      if (count <= 0) return this

      for (let i = actualTarget; i < actualTarget + count; i++) {
        const oldItem = this[i]
        if (oldItem !== undefined && oldItem._isNode) {
          oldItem.removeEventListener('io-object-mutation', this.itemMutated)
          oldItem.removeParent(this.node as Node)
        }
      }

      super.copyWithin(actualTarget, actualStart, actualEnd)

      for (let i = actualTarget; i < actualTarget + count; i++) {
        const item = this[i]
        if (item._isNode) {
          item.addEventListener('io-object-mutation', this.itemMutated)
          item.addParent(this.node as Node)
        }
      }

      this.dispatchMutation()
      return this
    })
  }
  itemMutated(event: CustomEvent) {
    this.node.dispatch('io-object-mutation', {object: this.proxy}, false, window)
  }
  dispatchMutation() {
    this.node.dispatch('io-object-mutation', {object: this.proxy}, false, window)
  }
}