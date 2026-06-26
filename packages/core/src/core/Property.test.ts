import { describe, it, expect } from 'vitest'
import { Binding, ProtoProperty, PropertyInstance, ReactiveObject, Register, Observer, NodeArray, ReactiveElement, nextQueue, PropertyDefinitions } from '@io-gui/core'

class Object1 {
  constructor(init?: any) {
    if (init !== undefined) {
      this.prop = init
    }
  }
  prop = true
}

@Register
class TestNode extends ReactiveObject {
  static override get Properties(): PropertyDefinitions {
    return { label: 'default' }
  }
  declare label: string
  constructor(args?: any) {super(args)}
}

const dummy = new TestNode()

describe('Property', () => {
  describe('ProtoProperty', () => {
  it('Should initialize correct property definitions and values from loosely typed property definitions', () => {
    let propDef, prop
    // initialize with empty object as property definition
    propDef = new ProtoProperty({})
    prop = new PropertyInstance(dummy, propDef)

    expect(propDef).toEqual({})
    expect(prop).toEqual({
      value: undefined,
      type: undefined,
      binding: undefined,
      reflect: false,
      init: undefined,
      observer: {type: 'none', observing: false},
    })
    // initialize with null property definition
    propDef = new ProtoProperty(null)
    prop = new PropertyInstance(dummy, propDef)
    expect(propDef).toEqual({
      value: null
    })
    expect(prop).toEqual({
      value: null,
      type: undefined,
      binding: undefined,
      reflect: false,
      init: undefined,
      observer: {type: 'none', observing: false},
    })
    // initialize with undefined property definition
    propDef = new ProtoProperty(undefined)
    prop = new PropertyInstance(dummy, propDef)
    expect(propDef).toEqual({
      value: undefined
    })
    expect(prop).toEqual({
      value: undefined,
      type: undefined,
      binding: undefined,
      reflect: false,
      init: undefined,
      observer: {type: 'none', observing: false},
    })
    // initialize with Number property definition
    propDef = new ProtoProperty(Number)
    prop = new PropertyInstance(dummy, propDef)
    expect(propDef).toEqual({
      type: Number,
    })
    expect(prop).toEqual({
      value: 0,
      type: Number,
      binding: undefined,
      reflect: false,
      init: undefined,
      observer: {type: 'none', observing: false},
    })
    // initialize with type: Number property definition
    propDef = new ProtoProperty({type: Number})
    prop = new PropertyInstance(dummy, propDef)
    expect(propDef).toEqual({
      type: Number,
    })
    expect(prop).toEqual({
      value: 0,
      type: Number,
      binding: undefined,
      reflect: false,
      init: undefined,
      observer: {type: 'none', observing: false},
    })
    // initialize with number property definition
    propDef = new ProtoProperty(1)
    prop = new PropertyInstance(dummy, propDef)
    expect(propDef).toEqual({
      value: 1,
    })
    expect(prop).toEqual({
      value: 1,
      type: undefined,
      binding: undefined,
      reflect: false,
      init: undefined,
      observer: {type: 'none', observing: false},
    })
    // initialize with value: number property definition
    propDef = new ProtoProperty({value: 2})
    prop = new PropertyInstance(dummy, propDef)
    expect(propDef).toEqual({
      value: 2,
    })
    expect(prop).toEqual({
      value: 2,
      type: undefined,
      binding: undefined,
      reflect: false,
      init: undefined,
      observer: {type: 'none', observing: false},
    })
    // initialize with String property definition
    propDef = new ProtoProperty(String)
    prop = new PropertyInstance(dummy, propDef)
    expect(propDef).toEqual({
      type: String,
    })
    expect(prop).toEqual({
      value: '',
      type: String,
      binding: undefined,
      reflect: false,
      init: undefined,
      observer: {type: 'none', observing: false},
    })
    // initialize with type: String property definition
    propDef = new ProtoProperty({type: String})
    prop = new PropertyInstance(dummy, propDef)
    expect(propDef).toEqual({
      type: String
    })
    expect(prop).toEqual({
      value: '',
      type: String,
      binding: undefined,
      reflect: false,
      init: undefined,
      observer: {type: 'none', observing: false},
    })
    // initialize with string property definition
    propDef = new ProtoProperty('test')
    prop = new PropertyInstance(dummy, propDef)
    expect(propDef).toEqual({
      value: 'test'
    })
    expect(prop).toEqual({
      value: 'test',
      type: undefined,
      binding: undefined,
      reflect: false,
      init: undefined,
      observer: {type: 'none', observing: false},
    })
    // initialize with value: string property definition
    propDef = new ProtoProperty({value: 'test'})
    prop = new PropertyInstance(dummy, propDef)
    expect(propDef).toEqual({
      value: 'test'
    })
    expect(prop).toEqual({
      value: 'test',
      type: undefined,
      binding: undefined,
      reflect: false,
      init: undefined,
      observer: {type: 'none', observing: false},
    })
    // initialize with Boolean property definition
    propDef = new ProtoProperty(Boolean)
    prop = new PropertyInstance(dummy, propDef)
    expect(propDef).toEqual({
      type: Boolean
    })
    expect(prop).toEqual({
      value: false,
      type: Boolean,
      binding: undefined,
      reflect: false,
      init: undefined,
      observer: {type: 'none', observing: false},
    })
    // initialize with type: Boolean property definition
    propDef = new ProtoProperty({type: Boolean})
    prop = new PropertyInstance(dummy, propDef)
    expect(propDef).toEqual({
      type: Boolean
    })
    expect(prop).toEqual({
      value: false,
      type: Boolean,
      binding: undefined,
      reflect: false,
      init: undefined,
      observer: {type: 'none', observing: false},
    })
    // initialize with boolean property definition
    propDef = new ProtoProperty(true)
    prop = new PropertyInstance(dummy, propDef)
    expect(propDef).toEqual({
      value: true
    })
    expect(prop).toEqual({
      value: true,
      type: undefined,
      binding: undefined,
      reflect: false,
      init: undefined,
      observer: {type: 'none', observing: false},
    })
    // initialize with value: boolean property definition
    propDef = new ProtoProperty({value: true})
    prop = new PropertyInstance(dummy, propDef)
    expect(propDef).toEqual({
      value: true
    })
    expect(prop).toEqual({
      value: true,
      type: undefined,
      binding: undefined,
      reflect: false,
      init: undefined,
      observer: {type: 'none', observing: false},
    })
    // initialize with Object property definition
    propDef = new ProtoProperty(Object)
    prop = new PropertyInstance(dummy, propDef)
    expect(propDef).toEqual({
      type: Object,
    })
    expect(prop).toEqual({
      value: undefined,
      type: Object,
      binding: undefined,
      reflect: false,
      init: undefined,
      observer: {type: 'none', observing: false},
    })
    // initialize with type: Object property definition
    propDef = new ProtoProperty({type: Object})
    prop = new PropertyInstance(dummy, propDef)
    expect(propDef).toEqual({
      type: Object
    })
    expect(prop).toEqual({
      value: undefined,
      type: Object,
      binding: undefined,
      reflect: false,
      init: undefined,
      observer: {type: 'none', observing: false},
    })
    // initialize with type: Object property definition and init: null
    propDef = new ProtoProperty({type: Object, init: null})
    prop = new PropertyInstance(dummy, propDef)
    expect(propDef).toEqual({
      type: Object,
      init: null
    })
    expect(prop).toEqual({
      value: {},
      type: Object,
      binding: undefined,
      reflect: false,
      init: null,
      observer: {type: 'object', observing: true},
    })
    // initialize with object: value property definition
    const object = {prop: true}
    propDef = new ProtoProperty({value: object})
    prop = new PropertyInstance(dummy, propDef)
    expect(propDef).toEqual({
      value: {prop: true},
    })
    expect(prop).toEqual({
      value: {prop: true},
      type: undefined,
      binding: undefined,
      reflect: false,
      init: undefined,
      observer: {type: 'object', observing: true},
    })
    expect(propDef.value).toBe(object)
    expect(prop.value).toBe(object)
    // initialize with Array property definition
    propDef = new ProtoProperty(Array)
    prop = new PropertyInstance(dummy, propDef)
    expect(propDef).toEqual({
      type: Array
    })
    expect(prop).toEqual({
      value: undefined,
      type: Array,
      binding: undefined,
      reflect: false,
      init: undefined,
      observer: {type: 'none', observing: false},
    })
    // initialize with type: Array property definition
    propDef = new ProtoProperty({type: Array})
    prop = new PropertyInstance(dummy, propDef)
    expect(propDef).toEqual({
      type: Array
    })
    expect(prop).toEqual({
      value: undefined,
      type: Array,
      binding: undefined,
      reflect: false,
      init: undefined,
      observer: {type: 'none', observing: false},
    })
    // initialize with type: Array property definition and init: null
    propDef = new ProtoProperty({type: Array, init: null})
    prop = new PropertyInstance(dummy, propDef)
    expect(propDef).toEqual({
      type: Array,
      init: null
    })
    expect(prop).toEqual({
      value: [],
      type: Array,
      binding: undefined,
      reflect: false,
      init: null,
      observer: {type: 'object', observing: true},
    })
    // initialize with an object property definition with array value
    const array = [1, 2, 3]
    propDef = new ProtoProperty({value: array})
    prop = new PropertyInstance(dummy, propDef)
    expect(propDef).toEqual({
      value: [1, 2, 3],
    })
    expect(prop).toEqual({
      value: [1, 2, 3],
      type: undefined,
      binding: undefined,
      reflect: false,
      init: undefined,
      observer: {type: 'object', observing: true},
    })
    expect(propDef.value).toBe(array)
    expect(prop.value).toBe(array)
    // initialize with custom type: Object1 and no value initialization
    propDef = new ProtoProperty({type: Object1})
    prop = new PropertyInstance(dummy, propDef)
    expect(propDef).toEqual({
      type: Object1,
    })
    expect(prop).toEqual({
      value: undefined,
      type: Object1,
      binding: undefined,
      reflect: false,
      init: undefined,
      observer: {type: 'none', observing: false},
    })
    // initialize with custom Object1 property definition
    propDef = new ProtoProperty(Object1)
    prop = new PropertyInstance(dummy, propDef)
    expect(propDef).toEqual({
      type: Object1
    })
    expect(prop).toEqual({
      value: undefined,
      type: Object1,
      binding: undefined,
      reflect: false,
      init: undefined,
      observer: {type: 'none', observing: false},
    })
    // initialize with custom type: Object1 and init: 'test'
    propDef = new ProtoProperty({type: Object1, init: 'test'})
    prop = new PropertyInstance(dummy, propDef)
    expect(propDef).toEqual({
      type: Object1,
      init: 'test'
    })
    expect(prop).toEqual({
      value: new Object1('test'),
      type: Object1,
      binding: undefined,
      reflect: false,
      init: 'test',
      observer: {type: 'object', observing: true},
    })
    // initialize with custom Object1 property definition with initial argument being `this` node reference
    propDef = new ProtoProperty({type: Object1, init: 'this'})
    prop = new PropertyInstance(dummy, propDef)
    expect(propDef).toEqual({
      type: Object1,
      init: 'this',
    })
    expect(prop).toEqual({
      value: new Object1(dummy),
      type: Object1,
      binding: undefined,
      reflect: false,
      init: 'this',
      observer: {type: 'object', observing: true},
    })
    // initialize with custom Object1 property definition with initial argument being `this.[propName]` node property reference
    propDef = new ProtoProperty({type: Object1, init: 'this.label'})
    prop = new PropertyInstance(dummy, propDef)
    expect(propDef).toEqual({
      type: Object1,
      init: 'this.label'
    })
    expect(prop).toEqual({
      value: new Object1(dummy.label),
      type: Object1,
      binding: undefined,
      reflect: false,
      init: 'this.label',
      observer: {type: 'object', observing: true},
    })
    // initialize with an object property definition with custom object1 value property
    const object1 = new Object1()
    propDef = new ProtoProperty({value: object1})
    prop = new PropertyInstance(dummy, propDef)
    expect(propDef).toEqual({
      value: object1
    })
    expect(propDef.value).toBe(object1)
    expect(prop).toEqual({
      value: object1,
      type: undefined,
      binding: undefined,
      reflect: false,
      init: undefined,
      observer: {type: 'object', observing: true},
    })
    expect(prop.value).toBe(object1)
    expect(propDef.value).toBe(object1)
    expect(prop.value).toBe(object1)
    // initialize with an object property definition with custom Object1 type property
    propDef = new ProtoProperty({type: Object1})
    prop = new PropertyInstance(dummy, propDef)
    expect(propDef).toEqual({
      type: Object1
    })
    expect(prop).toEqual({
      value: undefined,
      type: Object1,
      binding: undefined,
      reflect: false,
      init: undefined,
      observer: {type: 'none', observing: false},
    })
    // initialize with non-default property definition
    propDef = new ProtoProperty({
      reflect: false,
      type: Object,
      init: true,
    })
    prop = new PropertyInstance(dummy, propDef)
    expect(propDef).toEqual({
      type: Object,
      reflect: false,
      init: true,
    })
    expect(prop).toEqual({
      value: new Object(true),
      type: Object,
      binding: undefined,
      reflect: false,
      init: true,
      observer: {type: 'object', observing: true},
    })
  })
  it('Should register property definitions from static Properties.', () => {
    @Register
    class TestClass extends ReactiveObject {
      static get Properties(): PropertyDefinitions {
        return {
          prop1: 'value1',
          prop2: { value: 'value2', type: String },
        }
      }
      declare prop1: string
      declare prop2: string
    }
    const node = new TestClass()
    expect(node.prop1).toBe('value1')
    expect(node.prop2).toBe('value2')
    node.dispose()
  })
  it('Should initialize properties with binding correctly', () => {
    let propDef, prop
    let binding = new Binding(new TestNode({label: 'lorem'}), 'label')

    propDef = new ProtoProperty(binding)
    prop = new PropertyInstance(dummy, propDef)

    expect(propDef).toEqual({
      value: 'lorem',
      binding: binding,
    })
    expect(prop).toEqual({
      value: 'lorem',
      type: undefined,
      binding: binding,
      reflect: false,
      init: undefined,
      observer: {type: 'none', observing: false},
    })

    binding = new Binding(new TestNode({label: 'lorem'}), 'label')

    propDef = new ProtoProperty({binding: binding, value: 'ipsum'})
    prop = new PropertyInstance(dummy, propDef)

    expect(propDef).toEqual({
      value: 'lorem',
      binding: binding,
    })
    expect(prop).toEqual({
      value: 'lorem',
      type: undefined,
      binding: binding,
      reflect: false,
      init: undefined,
      observer: {type: 'none', observing: false},
    })
  })
  it('Should assign property definitions correctly', () => {
    const binding = new Binding(new TestNode({label: 'lorem'}), 'label')
    let propDef1 = new ProtoProperty({})
    let propDef2 = new ProtoProperty({
      value: 'lorem',
      type: String,
      binding: binding,
      reflect: false,
      init: undefined,
    })
    propDef1.assign(propDef2)
    expect(propDef1).toEqual(propDef2)

    propDef1 = new ProtoProperty({})
    expect(propDef1).toEqual({})

    propDef2 = new ProtoProperty({
      value: 'lorem',
      type: String,
      binding: binding,
      reflect: true,
      init: true,
    })
    propDef2.assign(propDef1)
    expect(propDef2).toEqual({
      value: 'lorem',
      type: String,
      binding: binding,
      reflect: true,
      init: true,
    })

    propDef1 = new ProtoProperty({
      reflect: true,
      init: undefined,
    })
    propDef2 = new ProtoProperty({
      value: 'lorem',
      type: String,
      reflect: true
    })
    propDef2.assign(propDef1)
    expect(propDef2).toEqual({
      value: 'lorem',
      type: String,
      reflect: true,
      init: undefined
    })
  })
  })

  describe('Observer', () => {
    it('observes none type for primitives', () => {
      const node = new TestNode()
      const prop = node._properties.get('label')!
      expect(prop.observer.type).toBe('none')
      expect(prop.observer.observing).toBe(false)
      node.dispose()
    })

    it('observes object type for plain objects', () => {
      @Register
      class ObjectPropNode extends ReactiveObject {
        static get Properties() {
          return {data: {type: Object, init: null}}
        }
        declare data: Record<string, unknown>
      }

      const node = new ObjectPropNode()
      const prop = node._properties.get('data')!
      expect(prop.observer.type).toBe('object')
      expect(prop.observer.observing).toBe(true)
      expect(node._hasWindowMutationListener).toBe(true)
      node.dispose()
    })

    it('observes io type for ReactiveObject values', () => {
      @Register
      class IoPropNode extends ReactiveObject {
        static get Properties() {
          return {child: {type: TestNode, init: null}}
        }
        declare child: TestNode
      }

      const node = new IoPropNode()
      const child = new TestNode({label: 'child'})
      node.child = child
      const prop = node._properties.get('child')!
      expect(prop.observer.type).toBe('io')
      expect(prop.observer.observing).toBe(true)
      node.dispose()
      child.dispose()
    })

    it('observes nodearray type', () => {
      @Register
      class ArrayPropNode extends ReactiveObject {
        static get Properties() {
          return {items: {type: NodeArray, init: null}}
        }
        declare items: NodeArray<TestNode>
      }

      const node = new ArrayPropNode()
      const prop = node._properties.get('items')!
      expect(prop.observer.type).toBe('nodearray')
      expect(prop.observer.observing).toBe(true)
      expect(node._hasSelfMutationListener).toBe(true)
      node.dispose()
    })

    it('start and stop are idempotent', () => {
      const node = new TestNode()
      const observer = new Observer(node)
      const value = {x: 1}

      observer.start(value)
      observer.start(value)
      expect(observer.observing).toBe(true)

      observer.stop(value)
      observer.stop(value)
      expect(observer.observing).toBe(false)

      node.dispose()
    })
  })

  describe('PropertyInstance', () => {
    it('reflects to attribute on ReactiveElement', () => {
      @Register
      class ReflectElement extends ReactiveElement {
        static get Properties() {
          return {
            count: {type: Number, value: 0, reflect: true},
          }
        }
        declare count: number
      }

      const el = new ReflectElement()
      expect(el.getAttribute('count')).toBe('0')
      el.count = 5
      expect(el.getAttribute('count')).toBe('5')
      el.dispose()
    })

    it('setter dispatches change queue', async () => {
      @Register
      class QueueNode extends ReactiveObject {
        static get Properties() {
          return {value: 0}
        }
        declare value: number
        changes = 0
        valueChanged() {
          this.changes++
        }
      }

      const node = new QueueNode()
      node.value = 1
      await nextQueue()
      expect(node.changes).toBe(1)
      expect(node.value).toBe(1)
      node.dispose()
    })
  })
})
