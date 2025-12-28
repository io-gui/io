import { describe, it, expect } from 'vitest'
import { ChangeQueue, Change, Node, Register } from '@io-gui/core'

@Register
class MockNode extends Node {
  eventStack: string[] = []
  changeStack: string[] = []
  prop1Changed(change: Change) {
    this.changeStack.push(`prop1Changed ${change.property} ${change.value} ${change.oldValue}`)
  }
  prop2Changed(change: Change) {
    this.changeStack.push(`prop2Changed ${change.property} ${change.value} ${change.oldValue}`)
  }
  dispatch(eventName: string, change?: Change) {
    if (change && change.property) {
      this.eventStack.push(`${eventName} ${change.property} ${change.value} ${change.oldValue}`)
    } else {
      this.eventStack.push(`${eventName}`)
    }
  }
  changed() {
    this.changeStack.push('changed')
  }
}

describe('ChangeQueue', () => {
  it('Should initialize with correct default values', () => {
    const node = new MockNode()
    const changeQueue = new ChangeQueue(node)
    expect(changeQueue.node).toBe(node)
    expect(JSON.stringify(changeQueue.changes)).toBe('[]')
    expect(changeQueue.changes.length).toBe(0)
    expect(changeQueue.dispatching).toBe(false)
  })
  it('Should keep track of changes correctly', () => {
    const node = new MockNode()
    const changeQueue = new ChangeQueue(node)
    changeQueue.queue('prop1', 1, 0)
    changeQueue.queue('prop1', 2, 1)
    expect(JSON.stringify(changeQueue.changes)).toBe('[{"property":"prop1","value":2,"oldValue":0}]')
    changeQueue.dispatch()
    expect(JSON.stringify(changeQueue.changes)).toBe('[]')
  })
  it('Should dispatch change events with correct payloads', () => {
    const node = new MockNode()
    const changeQueue = new ChangeQueue(node)
    changeQueue.queue('prop1', 1, 0)
    changeQueue.queue('prop1', 2, 1)
    changeQueue.dispatch()
    expect(JSON.stringify(node.eventStack)).toBe('["prop1-changed prop1 2 0","io-object-mutation"]')
  })
  it('Should invoke handler functions with correct payloads', () => {
    const node = new MockNode()
    const changeQueue = new ChangeQueue(node)
    changeQueue.queue('prop1', 1, 0)
    changeQueue.queue('prop1', 2, 1)
    changeQueue.dispatch()
    expect(JSON.stringify(node.changeStack)).toBe('["prop1Changed prop1 2 0","changed"]')
  })
  it('Should handle changes in first-in, first-out (FIFO) order', () => {
    const node = new MockNode()
    const changeQueue = new ChangeQueue(node)
    changeQueue.queue('prop1', 1, 0)
    changeQueue.queue('prop1', 3, 1)
    changeQueue.queue('prop2', 2, 0)
    changeQueue.dispatch()
    expect(JSON.stringify(node.changeStack)).toBe('["prop1Changed prop1 3 0","prop2Changed prop2 2 0","changed"]')
    expect(JSON.stringify(node.eventStack)).toBe('["prop1-changed prop1 3 0","prop2-changed prop2 2 0","io-object-mutation"]')
  })
  it('Setting new value to the same value as oldValue should not trigger change event', () => {
    const node = new MockNode()
    const changeQueue = new ChangeQueue(node)
    changeQueue.queue('prop1', 1, 0)
    expect(JSON.stringify(changeQueue.changes)).toBe('[{"property":"prop1","value":1,"oldValue":0}]')
    changeQueue.queue('prop1', 0, 1)
    expect(JSON.stringify(changeQueue.changes)).toBe('[]')
    changeQueue.dispatch()
    expect(JSON.stringify(node.changeStack)).toBe('[]')
    expect(JSON.stringify(node.eventStack)).toBe('[]')
  })
  it('Should skip dispatch if value is same as oldValue', () => {
    const node = new MockNode()
    const changeQueue = new ChangeQueue(node)
    changeQueue.queue('prop1', 0, 0)
    changeQueue.dispatch()
    expect(node.changeStack).toEqual([])
    expect(node.eventStack).toEqual([])
  })
  it('Should dispose correctly', () => {
    const node = new MockNode()
    const changeQueue = new ChangeQueue(node)
    changeQueue.dispose()
    expect(changeQueue.node).toBe(undefined)
    expect(changeQueue.changes).toBe(undefined)
  })
})
