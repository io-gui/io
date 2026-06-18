import { describe, it, expect } from 'vitest'
import { ReactiveNode, Register, ListenerDefinitions, EventDispatcher, IoElement, constructElement, releaseEventDispatcher } from '@io-gui/core'

const handlerFunction = (event: CustomEvent) => {
  (event.target as unknown as MockNode1).eventStack.push(`handlerFunction ${event.detail}`)
}

@Register
class MockNode1 extends ReactiveNode {
  eventStack: string[] = []
  static get Listeners(): ListenerDefinitions {
    return {
      'event1': 'event1Handler',
    }
  }
  event1Handler(event: CustomEvent) {
    this.eventStack.push(`event1Handler ${event.detail}`)
  }
}

@Register
class MockNode2 extends MockNode1 {
  eventStack: string[] = []
  static get Listeners(): ListenerDefinitions {
    return {
      'event2': ['event2Handler', {capture: true}],
    }
  }
  event2Handler(event: CustomEvent) {
    this.eventStack.push(`event2Handler ${event.detail}`)
  }
}

@Register
class MockNode3 extends MockNode2 {
  eventStack: string[] = []
  static get Listeners(): ListenerDefinitions {
    return {
      'event1': 'event3Handler',
      'event2': [handlerFunction, {passive: true}],
      'event3': handlerFunction
    }
  }
  event3Handler(event: CustomEvent) {
    this.eventStack.push(`event3Handler ${event.detail}`)
  }
}

class TestDiv extends HTMLElement {
  eventStack: string[] = []
  event1Handler(event: CustomEvent) {
    this.eventStack.push(`event1Handler ${event.detail}`)
  }
}
window.customElements.define('test-div', TestDiv)

describe('EventDispatcher', () => {
  it('Should initialize with correct values', () => {
    const node = new MockNode1()
    const eventDispatcher = new EventDispatcher(node)
    expect(eventDispatcher.node).toBe(node)
    expect(eventDispatcher.protoListeners).toEqual({event1:[[node.event1Handler]]})
    expect(eventDispatcher.propListeners).toEqual({})
    expect(eventDispatcher.addedListeners).toEqual({})
    expect(eventDispatcher.nodeIsEventTarget).toEqual(false)
  })
  it('Should initialize listeners from ProtoChain', () => {
    const node1 = new MockNode1()
    let eventDispatcher = new EventDispatcher(node1)
    expect(eventDispatcher.protoListeners).toEqual({
      event1:[[node1.event1Handler]],
    })
    const node2 = new MockNode2()
    eventDispatcher = new EventDispatcher(node2)
    expect(eventDispatcher.protoListeners).toEqual({
      event1:[[node1.event1Handler]],
      event2:[[node2.event2Handler, {capture:true}]]
    })
    const node3 = new MockNode3()
    eventDispatcher = new EventDispatcher(node3)
    expect(eventDispatcher.protoListeners).toEqual({
      event1:[[node3.event3Handler]],
      event2:[[handlerFunction, {passive: true}]],
      event3:[[handlerFunction]]
    })
  })
  it('Should use last proto listener when multiple definitions exist in ProtoChain', () => {
    @Register
    class MultiListenerNode extends ReactiveNode {
      eventStack: string[] = []
      static get Listeners(): ListenerDefinitions {
        return {
          'shared-event': 'firstHandler',
        }
      }
      firstHandler(event: CustomEvent) {
        this.eventStack.push(`first ${event.detail}`)
      }
    }
    @Register
    class MultiListenerChild extends MultiListenerNode {
      static get Listeners(): ListenerDefinitions {
        return {
          'shared-event': 'secondHandler',
        }
      }
      secondHandler(event: CustomEvent) {
        this.eventStack.push(`second ${event.detail}`)
      }
    }

    const node = new MultiListenerChild()
    const eventDispatcher = new EventDispatcher(node)
    expect(eventDispatcher.protoListeners['shared-event']).toEqual([[node.secondHandler]])

    eventDispatcher.dispatchEvent('shared-event', 1)
    expect(node.eventStack).toEqual(['second 1'])
  })
  it('Should applyPropListeners() correctly', () => {
    const node3 = new MockNode3()
    const eventDispatcher = new EventDispatcher(node3)
    const handler4 = () => {}
    const handler5 = () => {}
    eventDispatcher.applyPropListeners({'@event3': 'event3Handler', '@event4': handler4})
    expect(eventDispatcher.propListeners).toEqual({
      event3:[[node3.event3Handler]], event4:[[handler4]]
    })
    eventDispatcher.applyPropListeners({'@event5': ['event3Handler'], '@event6': [handler4]})
    expect(eventDispatcher.propListeners).toEqual({
      event5:[[node3.event3Handler]], event6:[[handler4]]
    })
    eventDispatcher.applyPropListeners({'@event7': [node3.event3Handler, {capture: true}], '@event8': [handler5, {capture: true}]})
    expect(eventDispatcher.propListeners).toEqual({
      event7:[[node3.event3Handler, {capture:true}]], event8:[[handler5, {capture:true}]]
    })
    eventDispatcher.applyPropListeners({})
    expect(eventDispatcher.propListeners).toEqual({})
  })
  it('Should add/remove listeners correctly', () => {
    const node2 = new MockNode2()
    const eventDispatcher = new EventDispatcher(node2)
    const listener1 = () => {}
    const listener2 = () => {}
    eventDispatcher.addEventListener('event1', listener1)
    eventDispatcher.addEventListener('event1', listener2, {capture: true})
    expect(eventDispatcher.addedListeners).toEqual({
      event1:[[listener1],[listener2, {capture:true}]]
    })
    eventDispatcher.removeEventListener('event1', listener1)
    expect(eventDispatcher.addedListeners).toEqual({
      event1:[[listener2, {capture:true}]]
    })
    eventDispatcher.removeEventListener('event1')
    expect(eventDispatcher.addedListeners).toEqual({})
  })
  it('Should not add listeners if already added', () => {
    const node2 = new MockNode2()
    const eventDispatcher = new EventDispatcher(node2)
    const listener1 = () => {}
    const listener2 = () => {}
    eventDispatcher.addEventListener('event1', listener1)
    eventDispatcher.addEventListener('event1', listener1)
    eventDispatcher.addEventListener('event1', listener2, {capture: true})
    expect(eventDispatcher.addedListeners).toEqual({
      event1:[[listener1],[listener2, {capture:true}]]
    })
  })
  it('Should remove correct listener', () => {
    const node2 = new MockNode2()
    const eventDispatcher = new EventDispatcher(node2)
    const listener1 = () => {}
    const listener2 = () => {}
    eventDispatcher.addEventListener('event1', listener1)
    eventDispatcher.addEventListener('event1', listener2, {capture: true})
    eventDispatcher.removeEventListener('event1', listener2)
    expect(eventDispatcher.addedListeners).toEqual({
      event1:[[listener1]]
    })
    eventDispatcher.removeEventListener('event1', listener1)
    expect(eventDispatcher.addedListeners).toEqual({})
  })
  it('Should dispatch added events with correct payloads', () => {
    const node3 = new MockNode3()
    const eventDispatcher = new EventDispatcher(node3)
    const handler4 = (event: CustomEvent) => {
      (event.target as unknown as MockNode3).eventStack.push(`handler4 ${event.detail}`)
    }
    const handler5 = (event: CustomEvent) => {
      (event.target as unknown as MockNode3).eventStack.push(`handler5 ${event.detail}`)
    }
    eventDispatcher.applyPropListeners({'@event3': 'event3Handler', '@event4': handler4})
    eventDispatcher.addEventListener('event5', handler5)
    eventDispatcher.dispatchEvent('event1', 1)
    eventDispatcher.dispatchEvent('event2', 2)
    eventDispatcher.dispatchEvent('event3', 3)
    eventDispatcher.dispatchEvent('event4', 4)
    eventDispatcher.dispatchEvent('event5', 5)
    expect(node3.eventStack).toEqual(['event3Handler 1', 'handlerFunction 2', 'handlerFunction 3', 'event3Handler 3', 'handler4 4', 'handler5 5'])

    node3.eventStack = []
    eventDispatcher.applyPropListeners({'@event4': handler4})
    eventDispatcher.removeEventListener('event5', handler5)
    eventDispatcher.dispatchEvent('event1', 1)
    eventDispatcher.dispatchEvent('event2', 2)
    eventDispatcher.dispatchEvent('event3', 3)
    eventDispatcher.dispatchEvent('event4', 4)
    eventDispatcher.dispatchEvent('event5', 5)
    expect(node3.eventStack).toEqual(['event3Handler 1', 'handlerFunction 2', 'handlerFunction 3', 'handler4 4'])
  })
  it('Should add/remove/dispatch events on HTML elements', () => {
    const element = document.createElement('test-div') as TestDiv
    const eventDispatcher = new EventDispatcher(element)
    const handler2 = (event: CustomEvent) => {
      (event.target as unknown as TestDiv).eventStack.push(`handler2 ${event.detail}`)
    }
    const handler3 = (event: CustomEvent) => {
      (event.target as unknown as TestDiv).eventStack.push(`handler3 ${event.detail}`)
    }
    eventDispatcher.applyPropListeners({'@event1': 'event1Handler', '@event2': handler2})
    eventDispatcher.addEventListener('event3', handler3)
    element.dispatchEvent(new CustomEvent('event1', {detail: 1}))
    element.dispatchEvent(new CustomEvent('event2', {detail: 2}))
    element.dispatchEvent(new CustomEvent('event3', {detail: 3}))
    expect(element.eventStack).toEqual(['event1Handler 1', 'handler2 2', 'handler3 3'])

    element.eventStack = []
    eventDispatcher.applyPropListeners({})
    eventDispatcher.removeEventListener('event3', handler3)
    element.dispatchEvent(new CustomEvent('event1', {detail: 1}))
    element.dispatchEvent(new CustomEvent('event2', {detail: 2}))
    element.dispatchEvent(new CustomEvent('event3', {detail: 3}))
    expect(element.eventStack).toEqual([])
  })
  it('Should bubble events if specified', () => {
    const element = document.createElement('test-div') as TestDiv
    element.id = 'element'
    const parentElement = document.createElement('test-div') as TestDiv
    parentElement.id = 'parentElement'
    parentElement.appendChild(element)
    const eventDispatcher = new EventDispatcher(element)
    const parentEventDispatcher = new EventDispatcher(parentElement)
    const handler2 = function(this: TestDiv, event: CustomEvent) {
      this.eventStack.push(`handler2 ${event.detail}`)
    }
    eventDispatcher.applyPropListeners({'@event1': 'event1Handler'})
    eventDispatcher.addEventListener('event2', handler2.bind(element))
    parentEventDispatcher.applyPropListeners({'@event1': 'event1Handler'})
    parentEventDispatcher.addEventListener('event2', handler2.bind(parentElement))

    eventDispatcher.dispatchEvent('event1', 1, false)
    eventDispatcher.dispatchEvent('event2', 2, false)
    expect(element.eventStack).toEqual(['event1Handler 1', 'handler2 2'])
    expect(parentElement.eventStack).toEqual([])

    element.eventStack = []
    parentElement.eventStack = []
    eventDispatcher.dispatchEvent('event1', 1, true)
    eventDispatcher.dispatchEvent('event2', 2, true)
    expect(element.eventStack).toEqual(['event1Handler 1', 'handler2 2'])
    expect(parentElement.eventStack).toEqual(['event1Handler 1', 'handler2 2'])
  })
  it('Should emit event from specified target', () => {
    const element = document.createElement('div')
    const eventDispatcher = new EventDispatcher(element)

    const element2 = document.createElement('test-div') as TestDiv
    const eventDispatcher2 = new EventDispatcher(element2)
    eventDispatcher2.applyPropListeners({'@event1': 'event1Handler'})

    let path: EventTarget[] | null = null
    let target: EventTarget | null = null
    eventDispatcher2.addEventListener('event1', (event: CustomEvent) => {
      path = event.composedPath()
      target = event.target
    })

    eventDispatcher.dispatchEvent('event1', 1, false, element2)
    expect(element2.eventStack).toEqual(['event1Handler 1'])
    expect(path).toEqual([element2])
    expect(target).toEqual(element2)
  })
  it('Should dispose correctly', () => {
    const node = new MockNode1()
    const eventDispatcher = new EventDispatcher(node)
    eventDispatcher.dispose()
    expect(eventDispatcher.node).toBe(undefined)
    expect(eventDispatcher.protoListeners).toBe(undefined)
    expect(eventDispatcher.propListeners).toBe(undefined)
    expect(eventDispatcher.addedListeners).toBe(undefined)
  })
  it('Should not dispatch bubbling events to disposed parents', () => {
    const parent = new MockNode1()
    const child = new MockNode1()
    child.addParent(parent)

    const parentHandler = (event: CustomEvent) => {
      parent.eventStack.push(`parentHandler ${event.detail}`)
    }
    const childHandler = (event: CustomEvent) => {
      child.eventStack.push(`childHandler ${event.detail}`)
    }

    parent._eventDispatcher.addEventListener('test-event', parentHandler)
    child._eventDispatcher.addEventListener('test-event', childHandler)

    // Dispatch bubbling event - parent should receive it
    child._eventDispatcher.dispatchEvent('test-event', 1, true)
    expect(child.eventStack).toEqual(['childHandler 1'])
    expect(parent.eventStack).toEqual(['parentHandler 1'])

    // Reset stacks
    child.eventStack = []
    parent.eventStack = []

    // Dispose the parent (simulates parent being removed from layout)
    parent.dispose()

    // Child should no longer reference disposed parent
    expect(child._parents.includes(parent)).toBe(false)

    // Dispatch bubbling event - should not error and should not reach disposed parent
    child._eventDispatcher.dispatchEvent('test-event', 2, true)
    expect(child.eventStack).toEqual(['childHandler 2'])
    // Parent should not have received event (disposed)
    expect(parent.eventStack).toEqual([])
  })
  it('Should handle complex parent-child disposal scenarios', () => {
    // Simulates IoSplit scenario: grandparent > parent > child
    // Parent gets disposed when child moves to drawer
    const grandparent = new MockNode1()
    const parent = new MockNode1()
    const child = new MockNode1()

    parent.addParent(grandparent)
    child.addParent(parent)

    const stacks = { grandparent: [] as string[], parent: [] as string[], child: [] as string[] }

    grandparent._eventDispatcher.addEventListener('bubble-event', () => {
      stacks.grandparent.push('received')
    })
    parent._eventDispatcher.addEventListener('bubble-event', () => {
      stacks.parent.push('received')
    })
    child._eventDispatcher.addEventListener('bubble-event', () => {
      stacks.child.push('received')
    })

    // Normal bubbling works
    child._eventDispatcher.dispatchEvent('bubble-event', null, true)
    expect(stacks).toEqual({ grandparent: ['received'], parent: ['received'], child: ['received'] })

    // Reset
    stacks.grandparent = []
    stacks.parent = []
    stacks.child = []

    // Dispose parent (middle of chain)
    parent.dispose()

    // Child dispatches - should reach child but skip disposed parent
    // Grandparent won't receive because parent (the link) is disposed
    child._eventDispatcher.dispatchEvent('bubble-event', null, true)
    expect(stacks.child).toEqual(['received'])
    expect(stacks.parent).toEqual([])  // Disposed
    expect(stacks.grandparent).toEqual([])  // Not reachable (parent link broken)
  })
  it('Should bubble events from ReactiveNode to IoElement parent (cross-border bubbling)', () => {
    // Create a ReactiveNode that will be a child
    @Register
    class ChildNode extends ReactiveNode {
      eventStack: string[] = []
      static get Listeners(): ListenerDefinitions {
        return {
          'cross-border-event': 'onCrossBorderEvent',
        }
      }
      onCrossBorderEvent(event: CustomEvent) {
        this.eventStack.push(`child ${event.detail}`)
      }
    }

    // Create an IoElement that owns the ReactiveNode as a property
    @Register
    class ParentElement extends IoElement {
      eventStack: string[] = []

      static get ReactiveProperties() {
        return {
          childNode: {type: ChildNode, init: null},
        }
      }
      declare childNode: ChildNode

      static get Listeners(): ListenerDefinitions {
        return {
          'cross-border-event': 'onCrossBorderEvent',
        }
      }
      onCrossBorderEvent(event: CustomEvent) {
        this.eventStack.push(`parent ${event.detail}`)
      }
    }

    const parent = new ParentElement()
    const child = new ChildNode()

    // Assign the child node to the parent element's property
    // This should call child.addParent(parent)
    parent.childNode = child

    // Verify the parent was added
    expect(child._parents.includes(parent)).toBe(true)

    // Dispatch a bubbling event from the child
    child.dispatch('cross-border-event', 'test-data', true)

    // The child should have received the event
    expect(child.eventStack).toEqual(['child test-data'])

    // The parent element should also have received the bubbling event
    expect(parent.eventStack).toEqual(['parent test-data'])

    // Clean up
    parent.dispose()
    child.dispose()
  })
  it('Should not dispatch duplicate bubbling events through shared ancestors', () => {
    const root = new MockNode1()
    const branchA = new MockNode1()
    const branchB = new MockNode1()
    const child = new MockNode1()

    branchA.addParent(root)
    branchB.addParent(root)
    child.addParent(branchA)
    child.addParent(branchB)

    let rootHits = 0
    root._eventDispatcher.addEventListener('dedupe-event', () => {
      rootHits++
    })

    child._eventDispatcher.dispatchEvent('dedupe-event', 1, true)
    expect(rootHits).toEqual(1)
  })
  it('Should avoid duplicate delivery when synthetic and DOM bubbling overlap', () => {
    @Register
    class OverlapChildNode extends ReactiveNode {}

    @Register
    class OverlapChildElement extends IoElement {
      static get ReactiveProperties() {
        return {
          childNode: {type: OverlapChildNode, init: null},
        }
      }
      declare childNode: OverlapChildNode
    }

    @Register
    class OverlapParentElement extends IoElement {
      static get ReactiveProperties() {
        return {
          childNode: {type: OverlapChildNode, init: null},
        }
      }
      declare childNode: OverlapChildNode
    }

    const parent = new OverlapParentElement()
    const childElement = new OverlapChildElement()
    const childNode = new OverlapChildNode()
    parent.appendChild(childElement as Node)

    parent.childNode = childNode
    childElement.childNode = childNode

    let parentHits = 0
    parent.addEventListener('overlap-event', () => {
      parentHits++
    })

    childNode.dispatch('overlap-event', undefined, true)
    expect(parentHits).toEqual(1)

    parent.dispose()
    childElement.dispose()
    childNode.dispose()
  })
  it('Should stop propagation when stopPropagation() is called', () => {
    const parent = new MockNode1()
    const child = new MockNode1()
    child.addParent(parent)

    parent._eventDispatcher.addEventListener('stop-event', () => {
      parent.eventStack.push('parent')
    })
    child._eventDispatcher.addEventListener('stop-event', (event) => {
      child.eventStack.push('child')
      event.stopPropagation()
    })

    child._eventDispatcher.dispatchEvent('stop-event', 1, true)
    expect(child.eventStack).toEqual(['child'])
    expect(parent.eventStack).toEqual([])
  })
  it('Should stop sibling listeners when stopImmediatePropagation() is called', () => {
    const node = new MockNode1()
    const eventDispatcher = new EventDispatcher(node)
    const first = () => { node.eventStack.push('first') }
    const second = () => { node.eventStack.push('second') }
    eventDispatcher.addEventListener('immediate-stop', first)
    eventDispatcher.addEventListener('immediate-stop', (event) => {
      node.eventStack.push('stopper')
      event.stopImmediatePropagation()
    })
    eventDispatcher.addEventListener('immediate-stop', second)

    eventDispatcher.dispatchEvent('immediate-stop', 1)
    expect(node.eventStack).toEqual(['first', 'stopper'])
  })
  it('Should populate IoSyntheticEvent.path when bubbling', () => {
    const root = new MockNode1()
    const parent = new MockNode1()
    const child = new MockNode1()
    parent.addParent(root)
    child.addParent(parent)

    let childPath: Array<ReactiveNode | IoElement> = []
    let parentPath: Array<ReactiveNode | IoElement> = []
    let rootPath: Array<ReactiveNode | IoElement> = []

    child._eventDispatcher.addEventListener('path-event', (event) => {
      childPath = [...event.path]
    })
    parent._eventDispatcher.addEventListener('path-event', (event) => {
      parentPath = [...event.path]
    })
    root._eventDispatcher.addEventListener('path-event', (event) => {
      rootPath = [...event.path]
    })

    child._eventDispatcher.dispatchEvent('path-event', 1, true)

    expect(childPath).toEqual([child])
    expect(parentPath).toEqual([child, parent])
    expect(rootPath).toEqual([child, parent, root])

    root.dispose()
    parent.dispose()
    child.dispose()
  })
  it('releaseEventDispatcher disposes native element listeners', () => {
    const element = constructElement({tag: 'div', props: {'@click': () => {}}}) as IoElement
    expect(element._eventDispatcher).toBeDefined()
    releaseEventDispatcher(element)
    expect(element._eventDispatcher).toBeUndefined()
  })
})
