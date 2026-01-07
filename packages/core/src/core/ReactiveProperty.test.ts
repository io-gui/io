import { describe, it, expect } from 'vitest'
import { Binding, ReactiveProtoProperty, ReactivePropertyInstance, ReactiveProperty, Node, Register, reactivePropertyDecorators } from '@io-gui/core'

class Object1 {
  constructor(init?: any) {
    if (init !== undefined) {
      this.prop = init
    }
  }
  prop = true
}

@Register
class TestNode extends Node {
  @ReactiveProperty('default')
  declare label: string
  constructor(args?: any) {super(args)}
}

const dummy = new TestNode()

describe('ReactiveProperty', () => {
  it('Should initialize correct property definitions and values from loosely typed property definitions', () => {
    let propDef, prop
    // initialize with empty object as property definition
    propDef = new ReactiveProtoProperty({})
    prop = new ReactivePropertyInstance(dummy, propDef)

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
    propDef = new ReactiveProtoProperty(null)
    prop = new ReactivePropertyInstance(dummy, propDef)
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
    propDef = new ReactiveProtoProperty(undefined)
    prop = new ReactivePropertyInstance(dummy, propDef)
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
    propDef = new ReactiveProtoProperty(Number)
    prop = new ReactivePropertyInstance(dummy, propDef)
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
    propDef = new ReactiveProtoProperty({type: Number})
    prop = new ReactivePropertyInstance(dummy, propDef)
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
    propDef = new ReactiveProtoProperty(1)
    prop = new ReactivePropertyInstance(dummy, propDef)
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
    propDef = new ReactiveProtoProperty({value: 2})
    prop = new ReactivePropertyInstance(dummy, propDef)
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
    propDef = new ReactiveProtoProperty(String)
    prop = new ReactivePropertyInstance(dummy, propDef)
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
    propDef = new ReactiveProtoProperty({type: String})
    prop = new ReactivePropertyInstance(dummy, propDef)
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
    propDef = new ReactiveProtoProperty('test')
    prop = new ReactivePropertyInstance(dummy, propDef)
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
    propDef = new ReactiveProtoProperty({value: 'test'})
    prop = new ReactivePropertyInstance(dummy, propDef)
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
    propDef = new ReactiveProtoProperty(Boolean)
    prop = new ReactivePropertyInstance(dummy, propDef)
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
    propDef = new ReactiveProtoProperty({type: Boolean})
    prop = new ReactivePropertyInstance(dummy, propDef)
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
    propDef = new ReactiveProtoProperty(true)
    prop = new ReactivePropertyInstance(dummy, propDef)
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
    propDef = new ReactiveProtoProperty({value: true})
    prop = new ReactivePropertyInstance(dummy, propDef)
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
    propDef = new ReactiveProtoProperty(Object)
    prop = new ReactivePropertyInstance(dummy, propDef)
    expect(propDef).toEqual({
      type: Object,
    })
    expect(prop).toEqual({
      value: undefined,
      type: Object,
      binding: undefined,
      reflect: false,
      init: undefined,
      observer: {type: 'object', observing: false},
    })
    // initialize with type: Object property definition
    propDef = new ReactiveProtoProperty({type: Object})
    prop = new ReactivePropertyInstance(dummy, propDef)
    expect(propDef).toEqual({
      type: Object
    })
    expect(prop).toEqual({
      value: undefined,
      type: Object,
      binding: undefined,
      reflect: false,
      init: undefined,
      observer: {type: 'object', observing: false},
    })
    // initialize with type: Object property definition and init: null
    propDef = new ReactiveProtoProperty({type: Object, init: null})
    prop = new ReactivePropertyInstance(dummy, propDef)
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
      observer: {type: 'object', observing: false},
    })
    // initialize with object: value property definition
    const object = {prop: true}
    propDef = new ReactiveProtoProperty({value: object})
    prop = new ReactivePropertyInstance(dummy, propDef)
    expect(propDef).toEqual({
      value: {prop: true},
    })
    expect(prop).toEqual({
      value: {prop: true},
      type: undefined,
      binding: undefined,
      reflect: false,
      init: undefined,
      observer: {type: 'none', observing: false},
    })
    expect(propDef.value).toBe(object)
    expect(prop.value).toBe(object)
    // initialize with Array property definition
    propDef = new ReactiveProtoProperty(Array)
    prop = new ReactivePropertyInstance(dummy, propDef)
    expect(propDef).toEqual({
      type: Array
    })
    expect(prop).toEqual({
      value: undefined,
      type: Array,
      binding: undefined,
      reflect: false,
      init: undefined,
      observer: {type: 'object', observing: false},
    })
    // initialize with type: Array property definition
    propDef = new ReactiveProtoProperty({type: Array})
    prop = new ReactivePropertyInstance(dummy, propDef)
    expect(propDef).toEqual({
      type: Array
    })
    expect(prop).toEqual({
      value: undefined,
      type: Array,
      binding: undefined,
      reflect: false,
      init: undefined,
      observer: {type: 'object', observing: false},
    })
    // initialize with type: Array property definition and init: null
    propDef = new ReactiveProtoProperty({type: Array, init: null})
    prop = new ReactivePropertyInstance(dummy, propDef)
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
      observer: {type: 'object', observing: false},
    })
    // initialize with an object property definition with array value
    const array = [1, 2, 3]
    propDef = new ReactiveProtoProperty({value: array})
    prop = new ReactivePropertyInstance(dummy, propDef)
    expect(propDef).toEqual({
      value: [1, 2, 3],
    })
    expect(prop).toEqual({
      value: [1, 2, 3],
      type: undefined,
      binding: undefined,
      reflect: false,
      init: undefined,
      observer: {type: 'none', observing: false},
    })
    expect(propDef.value).toBe(array)
    expect(prop.value).toBe(array)
    // initialize with custom type: Object1 and no value initialization
    propDef = new ReactiveProtoProperty({type: Object1})
    prop = new ReactivePropertyInstance(dummy, propDef)
    expect(propDef).toEqual({
      type: Object1,
    })
    expect(prop).toEqual({
      value: undefined,
      type: Object1,
      binding: undefined,
      reflect: false,
      init: undefined,
      observer: {type: 'object', observing: false},
    })
    // initialize with custom Object1 property definition
    propDef = new ReactiveProtoProperty(Object1)
    prop = new ReactivePropertyInstance(dummy, propDef)
    expect(propDef).toEqual({
      type: Object1
    })
    expect(prop).toEqual({
      value: undefined,
      type: Object1,
      binding: undefined,
      reflect: false,
      init: undefined,
      observer: {type: 'object', observing: false},
    })
    // initialize with custom type: Object1 and init: 'test'
    propDef = new ReactiveProtoProperty({type: Object1, init: 'test'})
    prop = new ReactivePropertyInstance(dummy, propDef)
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
      observer: {type: 'object', observing: false},
    })
    // initialize with custom Object1 property definition with initial argument being `this` node reference
    propDef = new ReactiveProtoProperty({type: Object1, init: 'this'})
    prop = new ReactivePropertyInstance(dummy, propDef)
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
      observer: {type: 'object', observing: false},
    })
    // initialize with custom Object1 property definition with initial argument being `this.[propName]` node property reference
    propDef = new ReactiveProtoProperty({type: Object1, init: 'this.label'})
    prop = new ReactivePropertyInstance(dummy, propDef)
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
      observer: {type: 'object', observing: false},
    })
    // initialize with an object property definition with custom object1 value property
    const object1 = new Object1()
    propDef = new ReactiveProtoProperty({value: object1})
    prop = new ReactivePropertyInstance(dummy, propDef)
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
      observer: {type: 'none', observing: false},
    })
    expect(prop.value).toBe(object1)
    expect(propDef.value).toBe(object1)
    expect(prop.value).toBe(object1)
    // initialize with an object property definition with custom Object1 type property
    propDef = new ReactiveProtoProperty({type: Object1})
    prop = new ReactivePropertyInstance(dummy, propDef)
    expect(propDef).toEqual({
      type: Object1
    })
    expect(prop).toEqual({
      value: undefined,
      type: Object1,
      binding: undefined,
      reflect: false,
      init: undefined,
      observer: {type: 'object', observing: false},
    })
    // initialize with non-default property definition
    propDef = new ReactiveProtoProperty({
      reflect: false,
      type: Object,
      init: true,
    })
    prop = new ReactivePropertyInstance(dummy, propDef)
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
      observer: {type: 'object', observing: false},
    })
  })
  it('Should register property definitions from decorators.', () => {
    class TestClass extends Node {
      @ReactiveProperty('value1')
      declare prop1: string
      @ReactiveProperty({value: 'value2', type: String})
      declare prop2: string
    }
    Register(TestClass)
    const propertyDefs = reactivePropertyDecorators.get(TestClass)
    expect(propertyDefs).toEqual({
      prop1: 'value1',
      prop2: {value: 'value2', type: String}
    })
  })
  it('Should initialize properties with binding correctly', () => {
    let propDef, prop
    let binding = new Binding(new TestNode({label: 'lorem'}), 'label')

    propDef = new ReactiveProtoProperty(binding)
    prop = new ReactivePropertyInstance(dummy, propDef)

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

    propDef = new ReactiveProtoProperty({binding: binding, value: 'ipsum'})
    prop = new ReactivePropertyInstance(dummy, propDef)

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
    let propDef1 = new ReactiveProtoProperty({})
    let propDef2 = new ReactiveProtoProperty({
      value: 'lorem',
      type: String,
      binding: binding,
      reflect: false,
      init: undefined,
    })
    propDef1.assign(propDef2)
    expect(propDef1).toEqual(propDef2)

    propDef1 = new ReactiveProtoProperty({})
    expect(propDef1).toEqual({})

    propDef2 = new ReactiveProtoProperty({
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

    propDef1 = new ReactiveProtoProperty({
      reflect: true,
      init: undefined,
    })
    propDef2 = new ReactiveProtoProperty({
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
