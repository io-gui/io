import { describe, it, expect } from 'vitest'
import { ProtoChain, ReactiveObject, PropertyDefinitions, ListenerDefinitions, ReactiveElement, Register } from '@io-gui/core'

class Array1 extends Array {}
class Array2 extends Array1 {}
class Array3 extends Array2 {}

class Object1 {}
class Object2 extends Object1 {}
class Object3 extends Object2 {}

class HTMLElement1 extends HTMLElement {}
class HTMLElement2 extends HTMLElement1 {}
class HTMLElement3 extends HTMLElement2 {}

// TODO: Fix init field testing. Based on old implementation.

@Register
class Node1 extends ReactiveObject {
  static get Properties(): PropertyDefinitions {
    return {
      prop1: {
        init: false
      },
      prop2: { type: Object, init: null }
    }
  }

  static get Fields(): Record<string, any> {
    return {
      sprop1: 'foo'
    }
  }
}

@Register
class Node3 extends Node1 {
  static get Properties(): PropertyDefinitions {
    return {
      prop1: {
        init: true,
        reflect: true
      },
      prop2: { value: 'foo', reflect: false },
      prop3: { reflect: true },
    }
  }

  static get Fields(): Record<string, any> {
    return {
      sprop2: 'bar'
    }
  }
}

@Register
class Node4 extends Node1 {
  static get Properties(): PropertyDefinitions {
    return {
      prop1: { init: true },
      prop2: {},
    }
  }

  static get Fields(): Record<string, any> {
    return {
      sprop1: 'baz'
    }
  }
}

class ReactiveElement1 extends ReactiveElement {}

class MockNode1 {
  static get Properties(): PropertyDefinitions {
    return {
      prop1: {
        init: false
      }
    }
  }
  static get Listeners(): ListenerDefinitions {
    return {
      listener1: 'function1',
      listener2: '',
      listener3: ['_onFunction1', {capture: true}],
      listener4: () => {}
    }
  }
  static get Style() {
    return 'a'
  }
  mutated() {}
  function1() {}
  onFunction1() {}
  _onFunction1() {}
}

class MockNode2 extends MockNode1 {
  function2() {}
  onFunction2() {}
  _onFunction2() {}
  static get Properties(): PropertyDefinitions {
    return {
      prop1: {
        type: Object,
        init: null
      },
      prop2: {}
    }
  }
  static get Listeners(): ListenerDefinitions {
    return {
      listener1: '_onFunction2',
      listener2: ['function2', {capture: true, passive: true}],
      listener3: ['_onFunction1', {passive: true}]
    }
  }
  static get Style() {
    return 'b'
  }
}
class MockNode3 extends MockNode2 {}

describe('ProtoChain', () => {
  it('Should include an array of inherited class constructors', () => {
    let constructors = new ProtoChain(Array3).constructors
    expect(constructors).toEqual([Array3, Array2, Array1, Array])
    constructors = new ProtoChain(Object3).constructors
    expect(constructors).toEqual([Object3, Object2, Object1])
    constructors = new ProtoChain(HTMLElement3).constructors
    expect(constructors).toEqual([HTMLElement3, HTMLElement2, HTMLElement1])
    constructors = new ProtoChain(ReactiveObject).constructors
    expect(constructors).toEqual([ReactiveObject])
    constructors = new ProtoChain(Node1).constructors
    expect(constructors).toEqual([Node1, ReactiveObject])
    constructors = new ProtoChain(ReactiveElement1).constructors
    expect(constructors).toEqual([ReactiveElement1, ReactiveElement])
  })
  it('Should include properties declared in `static get Fields()` return oject', () => {
    const protoChain = new ProtoChain(Node1)
    expect(Object.keys(protoChain.fields)).toEqual(['sprop1'])
    expect(protoChain.fields).toEqual({
      sprop1: 'foo'
    })
  })
  it('Should include reactive properties declared in `static get Properties()` return oject', () => {
    let protoChain = new ProtoChain(MockNode1)
    expect(Object.keys(protoChain.properties)).toEqual(['prop1'])
    expect(protoChain.properties).toEqual({
      prop1:{init: false},
    })
    protoChain = new ProtoChain(MockNode2)
    expect(Object.keys(protoChain.properties)).toEqual(['prop1', 'prop2'])
    expect(protoChain.properties).toEqual({
      prop1:{type: Object, init: null},
      prop2:{},
    })
  })
  it('Should include properties from subclass static Fields', () => {
    const protoChain = new ProtoChain(Node3)
    expect(Object.keys(protoChain.fields)).toEqual(['sprop1', 'sprop2'])
    expect(protoChain.fields).toEqual({
      sprop1: 'foo',
      sprop2: 'bar'
    })
  })
  it('Should include reactive properties from static Properties', () => {
    let protoChain = new ProtoChain(Node1)
    expect(Object.keys(protoChain.properties)).toEqual(['prop1', 'prop2'])
    expect(protoChain.properties).toEqual({
      prop1:{init: false},
      prop2:{type: Object, init: null},
    })
    protoChain = new ProtoChain(Node3)
    expect(Object.keys(protoChain.properties)).toEqual(['prop1', 'prop2', 'prop3'])
    expect(protoChain.properties).toEqual({
      prop1:{reflect: true, init: true},
      prop2:{value: 'foo', init: null, type: Object, reflect: false},
      prop3:{reflect: true},
    })
  })
  it('Should not override subclass Fields with inherited static Fields', () => {
    const protoChain = new ProtoChain(Node4)
    expect(Object.keys(protoChain.fields)).toEqual(['sprop1'])
    expect(protoChain.fields).toEqual({
      sprop1: 'baz',
    })
  })
  it('Should not override subclass Properties with inherited static Properties', () => {
    const protoChain = new ProtoChain(Node4)
    expect(protoChain.properties).toEqual({
      prop1:{init: true},
      prop2:{type: Object, init: null},
    })
  })
  it('Should include listners declared in `static get Listeners()` return oject', () => {
    let protoChain = new ProtoChain(MockNode1)
    expect(Object.keys(protoChain.listeners)).toEqual(['listener1', 'listener3', 'listener4'])
    expect(protoChain.listeners['listener1']).toEqual([['function1']])
    expect(protoChain.listeners['listener3']).toEqual([['_onFunction1', {capture: true}]])
    expect(String(protoChain.listeners['listener4'])).toBe('() => {}')
    protoChain = new ProtoChain(MockNode2)
    expect(Object.keys(protoChain.listeners)).toEqual(['listener1', 'listener3', 'listener4', 'listener2'])
    expect(protoChain.listeners['listener1']).toEqual([['function1'], ['_onFunction2']])
    expect(protoChain.listeners['listener2']).toEqual([['function2', {capture: true, passive: true}]])
    expect(protoChain.listeners['listener3']).toEqual([['_onFunction1', {capture: true, passive: true}]])
    expect(String(protoChain.listeners['listener4'])).toBe('() => {}')
  })
  it('Should include style strings declared in `static get Style()` return string', () => {
    let protoChain = new ProtoChain(MockNode1)
    expect(protoChain.style).toBe('a')
    protoChain = new ProtoChain(MockNode2)
    expect(protoChain.style).toBe('a\nb')
    protoChain = new ProtoChain(MockNode3)
    expect(protoChain.style).toBe('a\nb')
  })
  it('Should include an array of handler names that start with "on[A-Z]" or "_on[A-Z]" for auto-binding', () => {
    let protoChain = new ProtoChain(Node1)
    expect(protoChain.handlers).toEqual(['mutated', 'onPropertyMutated'])
    protoChain = new ProtoChain(MockNode1)
    expect(protoChain.handlers).toEqual(['mutated', 'onFunction1', '_onFunction1'])
    protoChain = new ProtoChain(MockNode2)
    expect(protoChain.handlers).toEqual(['mutated', 'onFunction1', '_onFunction1', 'onFunction2', '_onFunction2'])
  })
  it('Should bind auto-binding functions with `.init(node)` function', () => {
    const protoChain = new ProtoChain(MockNode2)
    const node = new MockNode2()
    protoChain.init(node as unknown as ReactiveObject)
    expect(node.function1.name).toBe('function1')
    expect(node.onFunction1.name).toBe('bound onFunction1')
    expect(node._onFunction1.name).toBe('bound _onFunction1')
    expect(node.function2.name).toBe('function2')
    expect(node.onFunction2.name).toBe('bound onFunction2')
    expect(node._onFunction2.name).toBe('bound _onFunction2')
  })
  it('double Register does not re-init protochain', () => {
    @Register
    class FreshRegisterNode extends ReactiveObject {
      static get Properties() {
        return {value: 0}
      }
      declare value: number
    }

    const chain = FreshRegisterNode.prototype._protochain
    const node = new FreshRegisterNode()
    expect(node._protochain).toBe(chain)
    node.dispose()
  })
})
