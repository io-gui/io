import { describe, it, expect } from 'vitest'
import { Change, Binding, Node, Register, ReactivePropertyDefinitions, IoElement, ListenerDefinitions, nextQueue } from '@io-gui/core'

describe('Node', () => {
  it('Should have all core API functions defined', () => {
    const node = new Node()
    expect(typeof node.setProperty).toBe('function')
    expect(typeof node.applyProperties).toBe('function')
    expect(typeof node.setProperties).toBe('function')
    expect(typeof node.changed).toBe('function')
    expect(typeof node.queue).toBe('function')
    expect(typeof node.dispatchQueue).toBe('function')
    expect(typeof node.throttle).toBe('function')
    expect(typeof node.debounce).toBe('function')
    expect(typeof node.onPropertyMutated).toBe('function')
    expect(typeof node.bind).toBe('function')
    expect(typeof node.unbind).toBe('function')
    expect(typeof node.addEventListener).toBe('function')
    expect(typeof node.removeEventListener).toBe('function')
    expect(typeof node.dispatch).toBe('function')
    expect(typeof node.dispose).toBe('function')
    node.dispose()
  })
  it('Should register reactive property definitions with correct defaults', () => {
    @Register
    class TestNode extends Node {
      static get ReactiveProperties(): ReactivePropertyDefinitions {
        return {
          prop0: { type: String },
          prop1: { value: false },
          prop2: -1,
          prop3: Number,
          prop4: {type: Object, init: null},
          prop5: [0, 1, 2],
          prop6: { value: 'hello', type: String },
          prop7: { value: true, type: Boolean },
          prop8: { value: 1, type: Number },
          prop9: { type: Array, init: [1, 2, 3] },
          prop10: { type: Array, init: null },
        }
      }
    }

    const node = new TestNode() as any

    expect(node.prop0).toBe('')
    expect(node.prop1).toBe(false)
    expect(node.prop2).toBe(-1)
    expect(node.prop3).toBe(0)
    expect(node.prop4).toEqual({})
    expect(node.prop5).toEqual([0, 1, 2])
    expect(node.prop6).toBe('hello')
    expect(node.prop7).toBe(true)
    expect(node.prop8).toBe(1)
    expect(node.prop9).toEqual([1, 2, 3])
    expect(node.prop10).toEqual([])

    expect(node._reactiveProperties.get('prop0')).toEqual({
      value: '',
      type: String,
      binding: undefined,
      reflect: false,
      init: undefined,
      observer: {type: 'none', observing: false},
    })
    expect(node._reactiveProperties.get('prop1')).toEqual({
      value: false,
      type: undefined,
      binding: undefined,
      reflect: false,
      init: undefined,
      observer: {type: 'none', observing: false},
    })
    expect(node._reactiveProperties.get('prop2')).toEqual({
      value: -1,
      type: undefined,
      binding: undefined,
      reflect: false,
      init: undefined,
      observer: {type: 'none', observing: false},
    })
    expect(node._reactiveProperties.get('prop3')).toEqual({
      value: 0,
      type: Number,
      binding: undefined,
      reflect: false,
      init: undefined,
      observer: {type: 'none', observing: false},
    })
    expect(node._reactiveProperties.get('prop4')).toEqual({
      value: {},
      type: Object,
      binding: undefined,
      reflect: false,
      init: null,
      observer: {type: 'object', observing: true},
    })
    expect(node._reactiveProperties.get('prop5')).toEqual({
      value: [0, 1, 2],
      type: undefined,
      binding: undefined,
      reflect: false,
      init: undefined,
      observer: {type: 'none', observing: false},
    })
    expect(node._reactiveProperties.get('prop6')).toEqual({
      value: 'hello',
      type: String,
      binding: undefined,
      reflect: false,
      init: undefined,
      observer: {type: 'none', observing: false},
    })
    expect(node._reactiveProperties.get('prop7')).toEqual({
      value: true,
      type: Boolean,
      binding: undefined,
      reflect: false,
      init: undefined,
      observer: {type: 'none', observing: false},
    })
    expect(node._reactiveProperties.get('prop8')).toEqual({
      value: 1,
      type: Number,
      binding: undefined,
      reflect: false,
      init: undefined,
      observer: {type: 'none', observing: false},
    })
    expect(node._reactiveProperties.get('prop9')).toEqual({
      value: [1, 2, 3],
      type: Array,
      binding: undefined,
      reflect: false,
      init: [1, 2, 3],
      observer: {type: 'object', observing: true},
    })
    expect(node._reactiveProperties.get('prop10')).toEqual({
      value: [],
      type: Array,
      binding: undefined,
      reflect: false,
      init: null,
      observer: {type: 'object', observing: true},
    })
    node.dispose()
  })
  it('Should aggregate reactive property definitions from prototype chain', () => {
    @Register
    class Object1 extends Node {
      static get ReactiveProperties(): ReactivePropertyDefinitions {
        return {
          prop1: {
            value: 0
          },
          prop2: null,
          prop3: {
            value: 'test',
            type: String,
            reflect: true
          },
        }
      }
    }

    @Register
    class Object2 extends Object1 {
      static get ReactiveProperties(): ReactivePropertyDefinitions {
        return {
          prop1: {
            value: 'asd',
            init: false,
          },
          prop2: {
            init: true,
          },
          prop3: ''
        }
      }
    }

    const node1 = new Object1()
    const node2 = new Object2()

    const protoProps1 = node1._protochain.reactiveProperties
    const protoProps2 = node2._protochain.reactiveProperties

    expect(Array.from(node1._reactiveProperties.keys())).toEqual(['reactivity', 'prop1', 'prop2', 'prop3'])
    expect(Array.from(node2._reactiveProperties.keys())).toEqual(['reactivity', 'prop1', 'prop2', 'prop3'])

    expect(protoProps1.prop1.value).toBe(0)
    expect(node1._reactiveProperties.get('prop1')).toEqual({
      value: 0,
      type: undefined,
      binding: undefined,
      reflect: false,
      init: undefined,
      observer: {type: 'none', observing: false},
    })

    expect(protoProps2.prop1.value).toEqual('asd')
    expect(node2._reactiveProperties.get('prop1')).toEqual({
      value: 'asd',
      type: undefined,
      binding: undefined,
      reflect: false,
      init: false,
      observer: {type: 'none', observing: false},
    })
    expect(node2._reactiveProperties.get('prop2')).toEqual({
      value: null,
      type: undefined,
      binding: undefined,
      reflect: false,
      init: true,
      observer: {type: 'none', observing: false},
    })
    expect(node2._reactiveProperties.get('prop3')).toEqual({
      value: '',
      type: String,
      binding: undefined,
      reflect: true,
      init: undefined,
      observer: {type: 'none', observing: false},
    })
  })
  it('Should correctly register properties with bindings', () => {
    @Register
    class TestNode extends Node {
      static get ReactiveProperties(): any {
        return {
          label: ''
        }
      }
      constructor(args?: any) {super(args)}
    }

    const binding1 = new Binding(new TestNode({label: 'label1'}), 'label')
    const binding2 = new Binding(new TestNode({label: 'label2'}), 'label')
    const binding3 = new Binding(new TestNode({label: 'label3'}), 'label')

    @Register
    class Object1 extends Node {
      static get ReactiveProperties(): ReactivePropertyDefinitions {
        return {
          prop1: binding1,
        }
      }
    }

    @Register
    class Object2 extends Object1 {
      static get ReactiveProperties(): ReactivePropertyDefinitions {
        return {
          prop1: {
            binding: binding2
          },
          prop3: binding3
        }
      }
    }

    const node1 = new Object1()
    const node2 = new Object2()

    expect(node1._reactiveProperties.get('prop1')!.binding).toBe(binding1)
    expect(node2._reactiveProperties.get('prop1')!.binding).toBe(binding2)
    expect(node2._reactiveProperties.get('prop3')!.binding).toBe(binding3)

    expect((binding1).targets[0]).toBe(node1)
    expect((binding2).targets[0]).toBe(node2)
    expect((binding3).targets[0]).toBe(node2)

    expect(node1._reactiveProperties.get('prop1')!.value).toBe('label1')
    expect(node2._reactiveProperties.get('prop1')!.value).toBe('label2')
    expect(node2._reactiveProperties.get('prop3')!.value).toBe('label3')
  })
  it('Should correctly get/set properties', () => {
    @Register
    class TestNode extends Node {
      static get ReactiveProperties(): ReactivePropertyDefinitions {
        return {
          prop1: {
            value: 1
          },
        }
      }
    }

    const node = new TestNode() as any

    expect(node._reactiveProperties.get('prop1')!.value).toBe(1)
    expect(node.prop1).toBe(1)
    node.setProperty('prop1', 0)
    expect(node._reactiveProperties.get('prop1')!.value).toBe(0)
    expect(node.prop1).toBe(0)
  })
  it('Should correctly get/set bound properties', () => {

    @Register
    class TestNode extends Node {
      static get ReactiveProperties(): ReactivePropertyDefinitions {
        return {
          label: '',
        }
      }
      constructor(args?: any) {super(args)}
    }

    const binding1 = new Binding(new TestNode({label: 'label1'}), 'label')
    const binding2 = new Binding(new TestNode({label: 'label2'}), 'label')

    @Register
    class TestNode2 extends Node {
      static get ReactiveProperties(): ReactivePropertyDefinitions {
        return {
          prop1: binding1
        }
      }
    }

    const node = new TestNode2() as any

    expect(node._reactiveProperties.get('prop1')!.value).toBe('label1')
    expect(node.prop1).toBe('label1')

    expect(node._reactiveProperties.get('prop1')!.binding).toBe(binding1)
    expect((binding1).targets[0]).toBe(node)

    node.setProperty('prop1', binding2)
    expect(node._reactiveProperties.get('prop1')!.value).toBe('label2')
    expect(node.prop1).toBe('label2')

    expect((binding1).targets[0]).toBe(undefined)
    expect((binding2).targets[0]).toBe(node)
  })
  it('Should execute attribute reflection on IoElement', () => {
    @Register
    class TestElementReflection extends IoElement {
      static get ReactiveProperties(): ReactivePropertyDefinitions {
        return {
          label: {
            value: 'label1',
            reflect: true
          },
          label2: 'label2',
        }
      }
    }

    const element = new TestElementReflection() as any
    expect(element.getAttribute('label')).toBe('label1')
    expect(element.getAttribute('label2')).toBe(null)
    element.label = 'label2'
    expect(element.getAttribute('label')).toBe('label2')
    element.setProperty('label', 'label3')
    expect(element.getAttribute('label')).toBe('label3')
  })
  it('Should dispatch "[propName]-changed" events correctly', async () => {
    @Register
    class TestNode extends Node {
      static get ReactiveProperties(): ReactivePropertyDefinitions {
        return {
          propChangedEvents: {type: Array, init: null},
          prop: Number,
        }
      }
      declare propChangedEvents: Change[]
      static get Listeners(): ListenerDefinitions {
        return {
          'prop-changed': 'onPropChanged',
        }
      }
      constructor(args?: any) {super(args)}
      onPropChanged(event: CustomEvent) {
        this.propChangedEvents.push(event.detail)
      }
    }

    const node = new TestNode() as any
    expect(node.propChangedEvents).toEqual([])

    node.addEventListener('prop-changed', (() => {
      expect('This should not execute').toEqual(true)
    }))

    node.removeEventListener('prop-changed')

    node.addEventListener('prop-changed', (event: CustomEvent) => {
      const oldValue = event.detail.oldValue
      const value = event.detail.value
      expect(oldValue).toEqual(0)
      expect(value).toEqual(1)
    })

    node.prop = 1

    node.removeEventListener('prop-changed')

    node.addEventListener('prop-changed', () => {
      expect('This is actually not expected to happen!').toBe(true)
    })

    node.setProperty('prop', 2, true)

    node.removeEventListener('prop-changed')

    expect(node.propChangedEvents).toEqual([{
      oldValue: 0,
      property: 'prop',
      value: 1,
    }])

    await nextQueue()

    expect(node.propChangedEvents).toEqual([{
      oldValue: 0,
      property: 'prop',
      value: 1,
    },
    {
      oldValue: 1,
      property: 'prop',
      value: 2,
    }
  ])

    node.setProperty('prop', 3, true)
    node.prop = 4

    await nextQueue()

    expect(node.propChangedEvents).toEqual([{
      oldValue: 0,
      property: 'prop',
      value: 1,
    }, {
      oldValue: 1,
      property: 'prop',
      value: 2,
    }, {
      oldValue: 2,
      property: 'prop',
      value: 4,
    }])

    const node2 = new TestNode({
      prop: new Binding(node, 'prop'),
    })

    expect(node2.propChangedEvents).toEqual([{
      oldValue: 0,
      property: 'prop',
      value: 4,
    }])

    const node3 = new TestNode({
      prop: -1
    }) as any

    expect(node3.propChangedEvents).toEqual([{
      oldValue: 0,
      property: 'prop',
      value: -1,
    }])

    node3.propChangedEvents.length = 0
    node3.reactivity = 'debounced'
    node3.prop = 10

    expect(node3.propChangedEvents).toEqual([])

    await nextQueue()

    expect(node3.propChangedEvents).toEqual([{
      oldValue: -1,
      property: 'prop',
      value: 10,
    }])

    node3.propChangedEvents.length = 0
    node3.reactivity = 'none'
    node3.prop = 20

    expect(node3.propChangedEvents).toEqual([])

    await nextQueue()

    expect(node3.propChangedEvents).toEqual([])
  })
  it('Should execute throttle/debounce queue in FIFO order', async () => {
    const order: number[] = []
    const node = new Node()
    node.debounce(() => {
      order.push(1)
    })
    node.debounce(() => {
      order.push(2)
    })
    const throttleFuc = () => {
      order.push(0)
    }
    node.throttle(throttleFuc)
    node.throttle(throttleFuc)

    await nextQueue()
    expect(order).toEqual([1, 2, 0])
  })
  it('Should add/remove "io-object-mutation" event listeners to properties of Node type', async () => {
    @Register
    class TestNode extends Node {
      static get ReactiveProperties(): ReactivePropertyDefinitions {
        return {
          prop: Number,
        }
      }
      constructor(args?: any) {super(args)}
    }

    const subnode = new TestNode()
    const node = new TestNode({
      prop: subnode,
    }) as any

    expect(subnode._eventDispatcher.addedListeners['io-object-mutation'][0][0]).toBe(node.onPropertyMutated)

    node.prop = null

    expect(subnode._eventDispatcher.addedListeners['io-object-mutation']).toBe(undefined)

    const subnode2 = new TestNode()
    node.prop = subnode2

    expect(subnode2._eventDispatcher.addedListeners['io-object-mutation'][0][0]).toBe(node.onPropertyMutated)

    @Register
    class TestNode2 extends Node {
      static get ReactiveProperties(): ReactivePropertyDefinitions {
        return {
          prop: {type: TestNode, init: null},
        }
      }
    }

    const node2 = new TestNode2() as any
    const subnode3 = node2.prop

    expect(subnode3._eventDispatcher.addedListeners['io-object-mutation'][0][0]).toBe(node2.onPropertyMutated)

    node2.dispose()

    expect(subnode3._eventDispatcher.addedListeners['io-object-mutation']).toBe(undefined)

    const node3 = new TestNode2() as any
    const subnode4 = node3.prop

    node3.prop = null

    expect(subnode4._eventDispatcher.addedListeners['io-object-mutation']).toBe(undefined)

    const node4 = new TestNode2() as any
    const node5 = new TestNode2() as any
    const subnode5 = node4.prop
    const subnode6 = node5.prop

    node4.prop = new Binding(node5, 'prop')

    expect(subnode5._eventDispatcher.addedListeners['io-object-mutation']).toBe(undefined)
    expect(subnode6._eventDispatcher.addedListeners['io-object-mutation'][0][0]).toBe(node5.onPropertyMutated)
    expect(subnode6._eventDispatcher.addedListeners['io-object-mutation'][1][0]).toBe(node4.onPropertyMutated)

  })
  it('Should correctly invoke handler functions on property changes', async () => {
    @Register
    class TestNode extends Node {
      changedCounter = 0
      prop1Changes: Change[] = []
      prop2Changes: Change[] = []
      static get ReactiveProperties(): any {
        return {
          prop1: String,
          prop2: String,
        }
      }
      changed() {
        this.changedCounter++
      }
      prop1Changed(change: Change) {
        this.prop1Changes.push(change)
      }
      prop2Changed(change: Change) {
        this.prop2Changes.push(change)
      }
    }

    const node = new TestNode() as any

    expect(node.changedCounter).toBe(0)
    expect(node.prop1Changes).toEqual([])
    expect(node.prop2Changes).toEqual([])

    node.prop1 = 'one'
    expect(node.changedCounter).toBe(1)
    expect(node.prop1Changes).toEqual([{
      property: 'prop1',
      oldValue: '',
      value: 'one',
    }])
    expect(node.prop2Changes).toEqual([])
    node.prop1Changes.length = 0

    node.prop1 = 'two'
    node.prop2 = 'test'
    expect(node.changedCounter).toBe(3)
    expect(node.prop1Changes).toEqual([{
      property: 'prop1',
      oldValue: 'one',
      value: 'two',
    }])
    expect(node.prop2Changes).toEqual([{
      property: 'prop2',
      oldValue: '',
      value: 'test',
    }])
    node.prop1Changes.length = 0
    node.prop2Changes.length = 0

    node.setProperties({
      'prop1': 'three',
      'prop2': '',
    })
    expect(node.changedCounter).toBe(4)
    expect(node.prop1Changes).toEqual([{
      property: 'prop1',
      oldValue: 'two',
      value: 'three',
    }])
    expect(node.prop2Changes).toEqual([{
      property: 'prop2',
      oldValue: 'test',
      value: '',
    }])

    node.prop1Changes.length = 0
    node.prop2Changes.length = 0

    node.reactivity = 'debounced'

    node.setProperties({
      'prop1': 'four',
      'prop2': 'test2',
    })

    expect(node.prop1Changes).toEqual([])
    expect(node.prop2Changes).toEqual([])

    await nextQueue()

    expect(node.prop1Changes).toEqual([{
      property: 'prop1',
      oldValue: 'three',
      value: 'four',
    }])
    expect(node.prop2Changes).toEqual([{
      property: 'prop2',
      oldValue: '',
      value: 'test2',
    }])

    node.dispose()
  })
  it('Should invoke property mutation handler functions on mutation events', async () => {
    @Register
    class TestSubNode extends Node {
      static get ReactiveProperties(): any {
        return {
          a: {
            value: 0,
          },
        }
      }
    }

    @Register
    class TestNode extends Node {
      changedCounter = 0
      obj1MutatedCounter = 0
      obj2MutatedCounter = 0
      static get ReactiveProperties(): any {
        return {
          obj1: {
            type: TestSubNode, init: null,
          },
          obj2: {
            type: TestSubNode, init: null,
          },
        }
      }
      obj1Mutated() {
        this.obj1MutatedCounter++
      }
      obj2Mutated() {
        this.obj2MutatedCounter++
      }
    }

    const node = new TestNode() as any

    expect(node.changedCounter).toBe(0)
    expect(node.obj1MutatedCounter).toBe(0)

    node.obj1.a = 1

    await nextQueue()

    expect(node.obj1MutatedCounter).toBe(1)
    expect(node.obj2MutatedCounter).toBe(0)

    node.obj2.a = 1

    expect(node.obj2MutatedCounter).toBe(1)

    await nextQueue()

    node.obj1 = new TestNode()

    await nextQueue()

    expect(node.obj1MutatedCounter).toBe(1)

    node.obj1.obj1 = {a: 1}

    await nextQueue()

    expect(node.obj1MutatedCounter).toBe(2)

    node.dispose()
  })
  it('Should correctly bind properties using binding system', () => {
    @Register
    class TestNode extends Node {
      static get ReactiveProperties(): ReactivePropertyDefinitions {
        return {
          prop1: String,
          prop2: String,
        }
      }
      constructor(args?: any) {super(args)}
    }

    const node = new TestNode() as any

    const binding = node.bind('prop1')
    expect(binding).toBeInstanceOf(Binding)
    expect(binding.node).toBe(node)
    expect(binding.property).toBe('prop1')

    const boundNode1 = new TestNode({prop1: binding}) as any
    const boundNode2 = new TestNode({prop1: binding}) as any
    boundNode2.prop2 = binding

    expect(binding.targets[0]).toBe(boundNode1)
    expect(binding.targets[1]).toBe(boundNode2)
    expect(binding.targetProperties.get(boundNode1)![0]).toBe('prop1')
    expect(binding.targetProperties.get(boundNode1)![1]).toBe(undefined)
    expect(binding.targetProperties.get(boundNode2)![0]).toBe('prop1')
    expect(binding.targetProperties.get(boundNode2)![1]).toBe('prop2')

    node.prop1 = 'one'
    expect(boundNode1.prop1).toBe('one')
    expect(boundNode1.prop2).toBe('')
    expect(boundNode2.prop1).toBe('one')
    expect(boundNode2.prop2).toBe('one')

    boundNode1.prop1 = 'two'
    expect(node.prop1).toBe('two')
    expect(boundNode2.prop1).toBe('two')

    expect(binding.targets.length).toBe(2)

    boundNode1.dispose()
    expect(binding.targets.length).toBe(1)

    boundNode2.dispose()
    expect(binding.targets.length).toBe(0)

    node.dispose()
  })
  it('Should correctly handle multiple binding re-assignments in setProperties()', async () => {
    @Register
    class TestNode extends Node {
      static get ReactiveProperties(): ReactivePropertyDefinitions {
        return {
          prop1: 'subnode1',
          prop2: 'subnode2',
          prop3: 'subnode3',
        }
      }
      constructor(args?: any) {super(args)}
    }

    @Register
    class TestNodeTarget extends Node {
      static get ReactiveProperties(): ReactivePropertyDefinitions {
        return {
          subnode: {type: TestNode, init: null},
          prop1: 'target1',
          prop2: 'target2',
          prop3: 'target3',
        }
      }
      declare subnode: TestNode
      ready() {
        this.changed()
      }
      changed() {
        this.subnode.setProperties({
          prop1: this.bind('prop1'),
          prop2: this.bind('prop2'),
          prop3: this.bind('prop3'),
        })
      }
    }

    const targetNode = new TestNodeTarget() as any

    expect(targetNode.subnode.prop1).toBe(targetNode.prop1)
    expect(targetNode.prop1).toBe('target1')
    expect(targetNode.subnode.prop2).toBe(targetNode.prop2)
    expect(targetNode.prop2).toBe('target2')
    expect(targetNode.subnode.prop3).toBe(targetNode.prop3)
    expect(targetNode.prop3).toBe('target3')

    const sourceNode = new TestNode({
      prop1: 'source1',
      prop2: 'source2',
      prop3: 'source3',
    }) as any

    targetNode.setProperties({
      prop1: sourceNode.bind('prop1'),
      prop2: sourceNode.bind('prop2'),
      prop3: sourceNode.bind('prop3'),
    })

    expect(targetNode.subnode.prop1).toBe(sourceNode.prop1)
    expect(sourceNode.prop1).toBe(targetNode.prop1)
    expect(targetNode.prop1).toBe('source1')
    expect(targetNode.subnode.prop2).toBe(sourceNode.prop2)
    expect(sourceNode.prop2).toBe(targetNode.prop2)
    expect(targetNode.prop2).toBe('source2')
    expect(targetNode.subnode.prop3).toBe(sourceNode.prop3)
    expect(sourceNode.prop3).toBe(targetNode.prop3)
    expect(targetNode.prop3).toBe('source3')

    sourceNode.prop1 = 'test1'
    targetNode.prop2 = 'test2'
    targetNode.subnode.prop3 = 'test3'

    expect(targetNode.subnode.prop1).toBe(sourceNode.prop1)
    expect(sourceNode.prop1).toBe(targetNode.prop1)
    expect(targetNode.prop1).toBe('test1')
    expect(targetNode.subnode.prop2).toBe(sourceNode.prop2)
    expect(sourceNode.prop2).toBe(targetNode.prop2)
    expect(targetNode.prop2).toBe('test2')
    expect(targetNode.subnode.prop3).toBe(sourceNode.prop3)
    expect(sourceNode.prop3).toBe(targetNode.prop3)
    expect(targetNode.prop3).toBe('test3')

    targetNode.setProperties({
      prop1: 'final1',
      prop2: 'final2',
      prop3: 'final3',
    })

    expect(targetNode.subnode.prop1).toBe(sourceNode.prop1)
    expect(sourceNode.prop1).toBe(targetNode.prop1)
    expect(targetNode.prop1).toBe('final1')
    expect(targetNode.subnode.prop2).toBe(sourceNode.prop2)
    expect(sourceNode.prop2).toBe(targetNode.prop2)
    expect(targetNode.prop2).toBe('final2')
    expect(targetNode.subnode.prop3).toBe(sourceNode.prop3)
    expect(sourceNode.prop3).toBe(targetNode.prop3)
    expect(targetNode.prop3).toBe('final3')
  })
  it('Should correctly manage binding targets and target properties', () => {
    @Register
    class TestNode extends Node {
      static get ReactiveProperties(): ReactivePropertyDefinitions {
        return {
          prop1: String,
          prop2: String,
        }
      }
      constructor(args?: any) {super(args)}
    }

    const srcNode = new TestNode()
    const binding0 = new Binding(srcNode, 'prop1')
    const binding1 = new Binding(srcNode, 'prop2')

    const dstNode0 = new TestNode() as any
    dstNode0.prop1 = binding0
    dstNode0.prop2 = binding1

    const dstNode1 = new TestNode({prop1: binding0}) as any
    const dstNode3 = new TestNode({prop1: binding0, prop2: binding0}) as any

    expect(binding0.targets[0]).toBe(dstNode0)
    expect(binding0.targets[1]).toBe(dstNode1)
    expect(binding0.targets[2]).toBe(dstNode3)

    expect(binding0.targetProperties.get(dstNode0)).toEqual(['prop1'])
    expect(binding0.targetProperties.get(dstNode1)).toEqual(['prop1'])
    expect(binding0.targetProperties.get(dstNode3)).toEqual(['prop1', 'prop2'])

    dstNode0.dispose()
    dstNode1.unbind('prop1')
    dstNode3.unbind('prop1')

    expect(binding0.targetProperties.get(dstNode0)).toEqual([])
    expect(binding0.targetProperties.get(dstNode1)).toEqual([])
    expect(binding0.targetProperties.get(dstNode3)).toEqual(['prop2'])

    dstNode1.prop2 = binding0
    dstNode1.prop1 = binding0

    dstNode3.prop1 = binding0

    expect(binding0.targetProperties.get(dstNode1)).toEqual(['prop2', 'prop1'])
    expect(binding0.targetProperties.get(dstNode3)).toEqual(['prop2', 'prop1'])
  })
  it('Should return existing binding or create new one on bind()', () => {
    @Register
    class TestNode extends Node {
      static get ReactiveProperties(): ReactivePropertyDefinitions {
        return {
          prop1: String,
          prop2: String,
        }
      }
    }
    const node = new TestNode()
    const binding0 = node.bind('prop1')
    expect(binding0).toBe(node._bindings.get('prop1'))
    expect(binding0).toBe(node.bind('prop1'))
  })
  it('Should dispose bindings correctly', () => {
    @Register
    class TestNode extends Node {
      static get ReactiveProperties(): ReactivePropertyDefinitions {
        return {
          prop1: String,
          prop2: String,
        }
      }
    }
    const node1 = new TestNode()
    const binding0 = node1.bind('prop1')
    node1.unbind('prop1')
    expect(node1._bindings.get('prop1')).toBe(undefined)
    expect(binding0.node).toBe(undefined)

    const node2 = new TestNode()
    const binding1 = node2.bind('prop1')
    node2.dispose()
    expect(node2._bindings).toBe(undefined)
    expect(binding1.node).toBe(undefined)
    expect(binding1.property).toBe(undefined)
    expect(binding1.targets).toBe(undefined)
    expect(binding1.targetProperties).toBe(undefined)
  })
})
