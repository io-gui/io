import { Binding, ReactiveProtoProperty, ReactivePropertyInstance, ReactiveProperty, Node, Register, reactivePropertyDecorators } from 'io-core';

class Object1 {
  constructor(init?: any) {
    if (init !== undefined) {
      this.prop = init;
    }
  }
  prop = true;
}

@Register
class TestNode extends Node {
  @ReactiveProperty('default')
  declare label: string;
  constructor(args?: any) {super(args);}
}

const dummy = new TestNode();

export default class {
  run() {
    describe('ReactiveProperty', () => {
      it('Should initialize correct property definitions and values from loosely typed property definitions', () => {
        let propDef, prop;
        // initialize with empty object as property definition
        propDef = new ReactiveProtoProperty({});
        prop = new ReactivePropertyInstance(dummy, propDef);

        expect(propDef).to.be.eql({});
        expect(prop).to.be.eql({
          value: undefined,
          type: undefined,
          binding: undefined,
          reflect: false,
          init: undefined,
        });
        // initialize with null property definition
        propDef = new ReactiveProtoProperty(null);
        prop = new ReactivePropertyInstance(dummy, propDef);
        expect(propDef).to.be.eql({
          value: null
        });
        expect(prop).to.be.eql({
          value: null,
          type: undefined,
          binding: undefined,
          reflect: false,
          init: undefined,
        });
        // initialize with undefined property definition
        propDef = new ReactiveProtoProperty(undefined);
        prop = new ReactivePropertyInstance(dummy, propDef);
        expect(propDef).to.be.eql({
          value: undefined
        });
        expect(prop).to.be.eql({
          value: undefined,
          type: undefined,
          binding: undefined,
          reflect: false,
          init: undefined,
        });
        // initialize with Number property definition
        propDef = new ReactiveProtoProperty(Number);
        prop = new ReactivePropertyInstance(dummy, propDef);
        expect(propDef).to.be.eql({
          type: Number,
        });
        expect(prop).to.be.eql({
          value: 0,
          type: Number,
          binding: undefined,
          reflect: false,
          init: undefined,
        });
        // initialize with type: Number property definition
        propDef = new ReactiveProtoProperty({type: Number});
        prop = new ReactivePropertyInstance(dummy, propDef);
        expect(propDef).to.be.eql({
          type: Number,
        });
        expect(prop).to.be.eql({
          value: 0,
          type: Number,
          binding: undefined,
          reflect: false,
          init: undefined,
        });
        // initialize with number property definition
        propDef = new ReactiveProtoProperty(1);
        prop = new ReactivePropertyInstance(dummy, propDef);
        expect(propDef).to.be.eql({
          value: 1,
        });
        expect(prop).to.be.eql({
          value: 1,
          type: undefined,
          binding: undefined,
          reflect: false,
          init: undefined,
        });
        // initialize with value: number property definition
        propDef = new ReactiveProtoProperty({value: 2});
        prop = new ReactivePropertyInstance(dummy, propDef);
        expect(propDef).to.be.eql({
          value: 2,
        });
        expect(prop).to.be.eql({
          value: 2,
          type: undefined,
          binding: undefined,
          reflect: false,
          init: undefined,
        });
        // initialize with String property definition
        propDef = new ReactiveProtoProperty(String);
        prop = new ReactivePropertyInstance(dummy, propDef);
        expect(propDef).to.be.eql({
          type: String,
        });
        expect(prop).to.be.eql({
          value: '',
          type: String,
          binding: undefined,
          reflect: false,
          init: undefined,
        });
        // initialize with type: String property definition
        propDef = new ReactiveProtoProperty({type: String});
        prop = new ReactivePropertyInstance(dummy, propDef);
        expect(propDef).to.be.eql({
          type: String
        });
        expect(prop).to.be.eql({
          value: '',
          type: String,
          binding: undefined,
          reflect: false,
          init: undefined,
        });
        // initialize with string property definition
        propDef = new ReactiveProtoProperty('test');
        prop = new ReactivePropertyInstance(dummy, propDef);
        expect(propDef).to.be.eql({
          value: 'test'
        });
        expect(prop).to.be.eql({
          value: 'test',
          type: undefined,
          binding: undefined,
          reflect: false,
          init: undefined,
        });
        // initialize with value: string property definition
        propDef = new ReactiveProtoProperty({value: 'test'});
        prop = new ReactivePropertyInstance(dummy, propDef);
        expect(propDef).to.be.eql({
          value: 'test'
        });
        expect(prop).to.be.eql({
          value: 'test',
          type: undefined,
          binding: undefined,
          reflect: false,
          init: undefined,
        });
        // initialize with Boolean property definition
        propDef = new ReactiveProtoProperty(Boolean);
        prop = new ReactivePropertyInstance(dummy, propDef);
        expect(propDef).to.be.eql({
          type: Boolean
        });
        expect(prop).to.be.eql({
          value: false,
          type: Boolean,
          binding: undefined,
          reflect: false,
          init: undefined,
        });
        // initialize with type: Boolean property definition
        propDef = new ReactiveProtoProperty({type: Boolean});
        prop = new ReactivePropertyInstance(dummy, propDef);
        expect(propDef).to.be.eql({
          type: Boolean
        });
        expect(prop).to.be.eql({
          value: false,
          type: Boolean,
          binding: undefined,
          reflect: false,
          init: undefined,
        });
        // initialize with boolean property definition
        propDef = new ReactiveProtoProperty(true);
        prop = new ReactivePropertyInstance(dummy, propDef);
        expect(propDef).to.be.eql({
          value: true
        });
        expect(prop).to.be.eql({
          value: true,
          type: undefined,
          binding: undefined,
          reflect: false,
          init: undefined,
        });
        // initialize with value: boolean property definition
        propDef = new ReactiveProtoProperty({value: true});
        prop = new ReactivePropertyInstance(dummy, propDef);
        expect(propDef).to.be.eql({
          value: true
        });
        expect(prop).to.be.eql({
          value: true,
          type: undefined,
          binding: undefined,
          reflect: false,
          init: undefined,
        });
        // initialize with Object property definition
        propDef = new ReactiveProtoProperty(Object);
        prop = new ReactivePropertyInstance(dummy, propDef);
        expect(propDef).to.be.eql({
          type: Object,
        });
        expect(prop).to.be.eql({
          value: undefined,
          type: Object,
          binding: undefined,
          reflect: false,
          init: undefined,
        });
        // initialize with type: Object property definition
        propDef = new ReactiveProtoProperty({type: Object});
        prop = new ReactivePropertyInstance(dummy, propDef);
        expect(propDef).to.be.eql({
          type: Object
        });
        expect(prop).to.be.eql({
          value: undefined,
          type: Object,
          binding: undefined,
          reflect: false,
          init: undefined,
        });
        // initialize with type: Object property definition and init: null
        propDef = new ReactiveProtoProperty({type: Object, init: null});
        prop = new ReactivePropertyInstance(dummy, propDef);
        expect(propDef).to.be.eql({
          type: Object,
          init: null
        });
        expect(prop).to.be.eql({
          value: {},
          type: Object,
          binding: undefined,
          reflect: false,
          init: null,
        });
        // initialize with object: value property definition
        const object = {prop: true};
        propDef = new ReactiveProtoProperty({value: object});
        prop = new ReactivePropertyInstance(dummy, propDef);
        expect(propDef).to.be.eql({
          value: {prop: true},
        });
        expect(prop).to.be.eql({
          value: {prop: true},
          type: undefined,
          binding: undefined,
          reflect: false,
          init: undefined,
        });
        expect(propDef.value).to.equal(object);
        expect(prop.value).to.equal(object);
        // initialize with Array property definition
        propDef = new ReactiveProtoProperty(Array);
        prop = new ReactivePropertyInstance(dummy, propDef);
        expect(propDef).to.be.eql({
          type: Array
        });
        expect(prop).to.be.eql({
          value: undefined,
          type: Array,
          binding: undefined,
          reflect: false,
          init: undefined,
        });
        // initialize with type: Array property definition
        propDef = new ReactiveProtoProperty({type: Array});
        prop = new ReactivePropertyInstance(dummy, propDef);
        expect(propDef).to.be.eql({
          type: Array
        });
        expect(prop).to.be.eql({
          value: undefined,
          type: Array,
          binding: undefined,
          reflect: false,
          init: undefined,
        });
        // initialize with type: Array property definition and init: null
        propDef = new ReactiveProtoProperty({type: Array, init: null});
        prop = new ReactivePropertyInstance(dummy, propDef);
        expect(propDef).to.be.eql({
          type: Array,
          init: null
        });
        expect(prop).to.be.eql({
          value: [],
          type: Array,
          binding: undefined,
          reflect: false,
          init: null,
        });
        // initialize with an object property definition with array value
        const array = [1, 2, 3];
        propDef = new ReactiveProtoProperty({value: array});
        prop = new ReactivePropertyInstance(dummy, propDef);
        expect(propDef).to.be.eql({
          value: [1, 2, 3],
        });
        expect(prop).to.be.eql({
          value: [1, 2, 3],
          type: undefined,
          binding: undefined,
          reflect: false,
          init: undefined,
        });
        expect(propDef.value).to.equal(array);
        expect(prop.value).to.equal(array);
        // initialize with custom type: Object1 and no value initialization
        propDef = new ReactiveProtoProperty({type: Object1});
        prop = new ReactivePropertyInstance(dummy, propDef);
        expect(propDef).to.be.eql({
          type: Object1,
        });
        expect(prop).to.be.eql({
          value: undefined,
          type: Object1,
          binding: undefined,
          reflect: false,
          init: undefined,
        });
        // initialize with custom Object1 property definition
        propDef = new ReactiveProtoProperty(Object1);
        prop = new ReactivePropertyInstance(dummy, propDef);
        expect(propDef).to.be.eql({
          type: Object1
        });
        expect(prop).to.be.eql({
          value: undefined,
          type: Object1,
          binding: undefined,
          reflect: false,
          init: undefined,
        });
        // initialize with custom type: Object1 and init: 'test'
        propDef = new ReactiveProtoProperty({type: Object1, init: 'test'});
        prop = new ReactivePropertyInstance(dummy, propDef);
        expect(propDef).to.be.eql({
          type: Object1,
          init: 'test'
        });
        expect(prop).to.be.eql({
          value: new Object1('test'),
          type: Object1,
          binding: undefined,
          reflect: false,
          init: 'test',
        });
        // initialize with custom Object1 property definition with initial argument being `this` node reference
        propDef = new ReactiveProtoProperty({type: Object1, init: 'this'});
        prop = new ReactivePropertyInstance(dummy, propDef);
        expect(propDef).to.be.eql({
          type: Object1,
          init: 'this',
        });
        expect(prop).to.be.eql({
          value: new Object1(dummy),
          type: Object1,
          binding: undefined,
          reflect: false,
          init: 'this',
        });
        // initialize with custom Object1 property definition with initial argument being `this.[propName]` node property reference
        propDef = new ReactiveProtoProperty({type: Object1, init: 'this.label'});
        prop = new ReactivePropertyInstance(dummy, propDef);
        expect(propDef).to.be.eql({
          type: Object1,
          init: 'this.label'
        });
        expect(prop).to.be.eql({
          value: new Object1(dummy.label),
          type: Object1,
          binding: undefined,
          reflect: false,
          init: 'this.label',
        });
        // initialize with an object property definition with custom object1 value property
        const object1 = new Object1();
        propDef = new ReactiveProtoProperty({value: object1});
        prop = new ReactivePropertyInstance(dummy, propDef);
        expect(propDef).to.be.eql({
          value: object1
        });
        expect(propDef.value).to.be.equal(object1);
        expect(prop).to.be.eql({
          value: object1,
          type: undefined,
          binding: undefined,
          reflect: false,
          init: undefined,
        });
        expect(prop.value).to.be.equal(object1);
        expect(propDef.value).to.equal(object1);
        expect(prop.value).to.equal(object1);
        // initialize with an object property definition with custom Object1 type property
        propDef = new ReactiveProtoProperty({type: Object1});
        prop = new ReactivePropertyInstance(dummy, propDef);
        expect(propDef).to.be.eql({
          type: Object1
        });
        expect(prop).to.be.eql({
          value: undefined,
          type: Object1,
          binding: undefined,
          reflect: false,
          init: undefined,
        });
        // initialize with non-default property definition
        propDef = new ReactiveProtoProperty({
          reflect: false,
          type: Object,
          init: true,
        });
        prop = new ReactivePropertyInstance(dummy, propDef);
        expect(propDef).to.be.eql({
          type: Object,
          reflect: false,
          init: true,
        });
        expect(prop).to.be.eql({
          value: new Object(true),
          type: Object,
          binding: undefined,
          reflect: false,
          init: true,
        });
      });
      it('Should register property definitions from decorators.', () => {
        class TestClass extends Node {
          @ReactiveProperty('value1')
          declare prop1: string;
          @ReactiveProperty({value: 'value2', type: String})
          declare prop2: string;
        }
        Register(TestClass);
        const propertyDefs = reactivePropertyDecorators.get(TestClass);
        expect(propertyDefs).to.be.eql({
          prop1: 'value1',
          prop2: {value: 'value2', type: String}
        });
      });
      it('Should initialize properties with binding correctly', () => {
        let propDef, prop;
        let binding = new Binding(new TestNode({label: 'lorem'}), 'label');

        propDef = new ReactiveProtoProperty(binding);
        prop = new ReactivePropertyInstance(dummy, propDef);

        expect(propDef).to.be.eql({
          value: 'lorem',
          binding: binding,
        });
        expect(prop).to.be.eql({
          value: 'lorem',
          type: undefined,
          binding: binding,
          reflect: false,
          init: undefined,
        });

        binding = new Binding(new TestNode({label: 'lorem'}), 'label');

        propDef = new ReactiveProtoProperty({binding: binding, value: 'ipsum'});
        prop = new ReactivePropertyInstance(dummy, propDef);

        expect(propDef).to.be.eql({
          value: 'lorem',
          binding: binding,
        });
        expect(prop).to.be.eql({
          value: 'lorem',
          type: undefined,
          binding: binding,
          reflect: false,
          init: undefined,
        });
      });
      it('Should assign property definitions correctly', () => {
        const binding = new Binding(new TestNode({label: 'lorem'}), 'label');
        let propDef1 = new ReactiveProtoProperty({});
        let propDef2 = new ReactiveProtoProperty({
          value: 'lorem',
          type: String,
          binding: binding,
          reflect: false,
          init: undefined,
        });
        propDef1.assign(propDef2);
        expect(propDef1).to.be.eql(propDef2);

        propDef1 = new ReactiveProtoProperty({});
        expect(propDef1).to.be.eql({});

        propDef2 = new ReactiveProtoProperty({
          value: 'lorem',
          type: String,
          binding: binding,
          reflect: true,
          init: true,
        });
        propDef2.assign(propDef1);
        expect(propDef2).to.be.eql({
          value: 'lorem',
          type: String,
          binding: binding,
          reflect: true,
          init: true,
        });

        propDef1 = new ReactiveProtoProperty({
          reflect: true,
          init: undefined,
        });
        propDef2 = new ReactiveProtoProperty({
          value: 'lorem',
          type: String,
          reflect: true
        });
        propDef2.assign(propDef1);
        expect(propDef2).to.be.eql({
          value: 'lorem',
          type: String,
          reflect: true,
          init: undefined
        });
      });
    });
  }
}
