import {Binding, ProtoProperty, PropertyInstance, Property, IoNode, Register, PropertyDeclarations, PropertyDecorators} from '../../iogui.js';

class Object1 {
  constructor(init?: any) {
    if (init !== undefined) {
      this.prop = init;
    }
  }
  prop = true;
}

@Register
class TestIoNode extends IoNode {
  static get Properties(): PropertyDeclarations {
    return {
      label: 'default'
    };
  }
}

const dummy = new TestIoNode();

export default class {
  run() {
    describe('Property', () => {
      it('Should initialize correct property definitions and values from loosely typed property definitions', () => {
        let propDef, prop;
        // initialize with empty object as property definition
        propDef = new ProtoProperty({});
        prop = new PropertyInstance(dummy, propDef);

        chai.expect(propDef).to.be.eql({
          value: undefined,
          type: undefined,
          binding: undefined,
          reflect: undefined,
          reactive: undefined,
          observe: undefined,
          init: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: undefined,
          type: undefined,
          binding: undefined,
          reflect: false,
          reactive: true,
          observe: false,
          init: undefined,
        });
        // initialize with null property definition
        propDef = new ProtoProperty(null);
        prop = new PropertyInstance(dummy, propDef);
        chai.expect(propDef).to.be.eql({
          value: null,
          type: undefined,
          binding: undefined,
          reflect: undefined,
          reactive: undefined,
          observe: undefined,
          init: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: null,
          type: undefined,
          binding: undefined,
          reflect: false,
          reactive: true,
          observe: false,
          init: undefined,
        });
        // initialize with undefined property definition
        propDef = new ProtoProperty(undefined);
        prop = new PropertyInstance(dummy, propDef);
        chai.expect(propDef).to.be.eql({
          value: undefined,
          type: undefined,
          binding: undefined,
          reflect: undefined,
          reactive: undefined,
          observe: undefined,
          init: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: undefined,
          type: undefined,
          binding: undefined,
          reflect: false,
          reactive: true,
          observe: false,
          init: undefined,
        });
        // initialize with Number property definition
        propDef = new ProtoProperty(Number);
        prop = new PropertyInstance(dummy, propDef);
        chai.expect(propDef).to.be.eql({
          value: undefined,
          type: Number,
          binding: undefined,
          reflect: undefined,
          reactive: undefined,
          observe: undefined,
          init: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: 0,
          type: Number,
          binding: undefined,
          reflect: false,
          reactive: true,
          observe: false,
          init: undefined,
        });
        // initialize with type: Number property definition
        propDef = new ProtoProperty({type: Number});
        prop = new PropertyInstance(dummy, propDef);
        chai.expect(propDef).to.be.eql({
          value: undefined,
          type: Number,
          binding: undefined,
          reflect: undefined,
          reactive: undefined,
          observe: undefined,
          init: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: 0,
          type: Number,
          binding: undefined,
          reflect: false,
          reactive: true,
          observe: false,
          init: undefined,
        });
        // initialize with number property definition
        propDef = new ProtoProperty(1);
        prop = new PropertyInstance(dummy, propDef);
        chai.expect(propDef).to.be.eql({
          value: 1,
          type: Number,
          binding: undefined,
          reflect: undefined,
          reactive: undefined,
          observe: undefined,
          init: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: 1,
          type: Number,
          binding: undefined,
          reflect: false,
          reactive: true,
          observe: false,
          init: undefined,
        });
        // initialize with value: number property definition
        propDef = new ProtoProperty({value: 2});
        prop = new PropertyInstance(dummy, propDef);
        chai.expect(propDef).to.be.eql({
          value: 2,
          type: Number,
          binding: undefined,
          reflect: undefined,
          reactive: undefined,
          observe: undefined,
          init: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: 2,
          type: Number,
          binding: undefined,
          reflect: false,
          reactive: true,
          observe: false,
          init: undefined,
        });
        // initialize with String property definition
        propDef = new ProtoProperty(String);
        prop = new PropertyInstance(dummy, propDef);
        chai.expect(propDef).to.be.eql({
          value: undefined,
          type: String,
          binding: undefined,
          reflect: undefined,
          reactive: undefined,
          observe: undefined,
          init: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: '',
          type: String,
          binding: undefined,
          reflect: false,
          reactive: true,
          observe: false,
          init: undefined,
        });
        // initialize with type: String property definition
        propDef = new ProtoProperty({type: String});
        prop = new PropertyInstance(dummy, propDef);
        chai.expect(propDef).to.be.eql({
          value: undefined,
          type: String,
          binding: undefined,
          reflect: undefined,
          reactive: undefined,
          observe: undefined,
          init: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: '',
          type: String,
          binding: undefined,
          reflect: false,
          reactive: true,
          observe: false,
          init: undefined,
        });
        // initialize with string property definition
        propDef = new ProtoProperty('test');
        prop = new PropertyInstance(dummy, propDef);
        chai.expect(propDef).to.be.eql({
          value: 'test',
          type: String,
          binding: undefined,
          reflect: undefined,
          reactive: undefined,
          observe: undefined,
          init: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: 'test',
          type: String,
          binding: undefined,
          reflect: false,
          reactive: true,
          observe: false,
          init: undefined,
        });
        // initialize with value: string property definition
        propDef = new ProtoProperty({value: 'test'});
        prop = new PropertyInstance(dummy, propDef);
        chai.expect(propDef).to.be.eql({
          value: 'test',
          type: String,
          binding: undefined,
          reflect: undefined,
          reactive: undefined,
          observe: undefined,
          init: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: 'test',
          type: String,
          binding: undefined,
          reflect: false,
          reactive: true,
          observe: false,
          init: undefined,
        });
        // initialize with Boolean property definition
        propDef = new ProtoProperty(Boolean);
        prop = new PropertyInstance(dummy, propDef);
        chai.expect(propDef).to.be.eql({
          value: undefined,
          type: Boolean,
          binding: undefined,
          reflect: undefined,
          reactive: undefined,
          observe: undefined,
          init: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: false,
          type: Boolean,
          binding: undefined,
          reflect: false,
          reactive: true,
          observe: false,
          init: undefined,
        });
        // initialize with type: Boolean property definition
        propDef = new ProtoProperty({type: Boolean});
        prop = new PropertyInstance(dummy, propDef);
        chai.expect(propDef).to.be.eql({
          value: undefined,
          type: Boolean,
          binding: undefined,
          reflect: undefined,
          reactive: undefined,
          observe: undefined,
          init: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: false,
          type: Boolean,
          binding: undefined,
          reflect: false,
          reactive: true,
          observe: false,
          init: undefined,
        });
        // initialize with boolean property definition
        propDef = new ProtoProperty(true);
        prop = new PropertyInstance(dummy, propDef);
        chai.expect(propDef).to.be.eql({
          value: true,
          type: Boolean,
          binding: undefined,
          reflect: undefined,
          reactive: undefined,
          observe: undefined,
          init: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: true,
          type: Boolean,
          binding: undefined,
          reflect: false,
          reactive: true,
          observe: false,
          init: undefined,
        });
        // initialize with value: boolean property definition
        propDef = new ProtoProperty({value: true});
        prop = new PropertyInstance(dummy, propDef);
        chai.expect(propDef).to.be.eql({
          value: true,
          type: Boolean,
          binding: undefined,
          reflect: undefined,
          reactive: undefined,
          observe: undefined,
          init: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: true,
          type: Boolean,
          binding: undefined,
          reflect: false,
          reactive: true,
          observe: false,
          init: undefined,
        });
        // initialize with Object property definition
        propDef = new ProtoProperty(Object);
        prop = new PropertyInstance(dummy, propDef);
        chai.expect(propDef).to.be.eql({
          value: undefined,
          type: Object,
          binding: undefined,
          reflect: undefined,
          reactive: undefined,
          observe: undefined,
          init: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: {},
          type: Object,
          binding: undefined,
          reflect: false,
          reactive: true,
          observe: false,
          init: undefined,
        });
        // initialize with type: Object property definition
        propDef = new ProtoProperty({type: Object});
        prop = new PropertyInstance(dummy, propDef);
        chai.expect(propDef).to.be.eql({
          value: undefined,
          type: Object,
          binding: undefined,
          reflect: undefined,
          reactive: undefined,
          observe: undefined,
          init: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: {},
          type: Object,
          binding: undefined,
          reflect: false,
          reactive: true,
          observe: false,
          init: undefined,
        });
        const object = {prop: true};
        // initialize with object: value property definition
        propDef = new ProtoProperty({value: object});
        prop = new PropertyInstance(dummy, propDef);
        chai.expect(propDef).to.be.eql({
          value: {prop: true},
          type: Object,
          binding: undefined,
          reflect: undefined,
          reactive: undefined,
          observe: undefined,
          init: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: {prop: true},
          type: Object,
          binding: undefined,
          reflect: false,
          reactive: true,
          observe: false,
          init: undefined,
        });
        chai.expect(propDef.value).to.equal(object);
        chai.expect(prop.value).to.equal(object);
        // initialize with Array property definition
        propDef = new ProtoProperty(Array);
        prop = new PropertyInstance(dummy, propDef);
        chai.expect(propDef).to.be.eql({
          value: undefined,
          type: Array,
          binding: undefined,
          reflect: undefined,
          reactive: undefined,
          observe: undefined,
          init: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: [],
          type: Array,
          binding: undefined,
          reflect: false,
          reactive: true,
          observe: false,
          init: undefined,
        });
        // initialize with type: Array property definition
        propDef = new ProtoProperty({type: Array});
        prop = new PropertyInstance(dummy, propDef);
        chai.expect(propDef).to.be.eql({
          value: undefined,
          type: Array,
          binding: undefined,
          reflect: undefined,
          reactive: undefined,
          observe: undefined,
          init: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: [],
          type: Array,
          binding: undefined,
          reflect: false,
          reactive: true,
          observe: false,
          init: undefined,
        });
        // initialize with an object property definition with object value property
        const array = [1, 2, 3];
        propDef = new ProtoProperty({value: array});
        prop = new PropertyInstance(dummy, propDef);
        chai.expect(propDef).to.be.eql({
          value: [1, 2, 3],
          type: Array,
          binding: undefined,
          reflect: undefined,
          reactive: undefined,
          observe: undefined,
          init: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: [1, 2, 3],
          type: Array,
          binding: undefined,
          reflect: false,
          reactive: true,
          observe: false,
          init: undefined,
        });
        chai.expect(propDef.value).to.equal(array);
        chai.expect(prop.value).to.equal(array);
        // initialize with custom Object1 property definition but without value initialization
        propDef = new ProtoProperty({type: Object1, init: null});
        prop = new PropertyInstance(dummy, propDef);
        chai.expect(propDef).to.be.eql({
          value: undefined,
          type: Object1,
          binding: undefined,
          reflect: undefined,
          reactive: undefined,
          observe: undefined,
          init: null,
        });
        chai.expect(prop).to.be.eql({
          value: undefined,
          type: Object1,
          binding: undefined,
          reflect: false,
          reactive: true,
          observe: false,
          init: null,
        });
        // initialize with custom Object1 property definition
        propDef = new ProtoProperty(Object1);
        prop = new PropertyInstance(dummy, propDef);
        chai.expect(propDef).to.be.eql({
          value: undefined,
          type: Object1,
          binding: undefined,
          reflect: undefined,
          reactive: undefined,
          observe: undefined,
          init: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: new Object1(),
          type: Object1,
          binding: undefined,
          reflect: false,
          reactive: true,
          observe: false,
          init: undefined,
        });
        // initialize with custom Object1 property definition with initial argument
        propDef = new ProtoProperty({type: Object1, init: 'test'});
        prop = new PropertyInstance(dummy, propDef);
        chai.expect(propDef).to.be.eql({
          value: undefined,
          type: Object1,
          binding: undefined,
          reflect: undefined,
          reactive: undefined,
          observe: undefined,
          init: 'test',
        });
        chai.expect(prop).to.be.eql({
          value: new Object1('test'),
          type: Object1,
          binding: undefined,
          reflect: false,
          reactive: true,
          observe: false,
          init: 'test',
        });
        // initialize with custom Object1 property definition with initial argument being `this` node reference
        propDef = new ProtoProperty({type: Object1, init: 'this'});
        prop = new PropertyInstance(dummy, propDef);
        chai.expect(propDef).to.be.eql({
          value: undefined,
          type: Object1,
          binding: undefined,
          reflect: undefined,
          reactive: undefined,
          observe: undefined,
          init: 'this',
        });
        chai.expect(prop).to.be.eql({
          value: new Object1(dummy),
          type: Object1,
          binding: undefined,
          reflect: false,
          reactive: true,
          observe: false,
          init: 'this',
        });
        // initialize with custom Object1 property definition with initial argument being `this.[propName]` node property reference
        propDef = new ProtoProperty({type: Object1, init: 'this.label'});
        prop = new PropertyInstance(dummy, propDef);
        chai.expect(propDef).to.be.eql({
          value: undefined,
          type: Object1,
          binding: undefined,
          reflect: undefined,
          reactive: undefined,
          observe: undefined,
          init: 'this.label',
        });
        chai.expect(prop).to.be.eql({
          value: new Object1(dummy.label),
          type: Object1,
          binding: undefined,
          reflect: false,
          reactive: true,
          observe: false,
          init: 'this.label',
        });
        // initialize with an object property definition with custom object1 value property
        const object1 = new Object1();
        propDef = new ProtoProperty({value: object1});
        prop = new PropertyInstance(dummy, propDef);
        chai.expect(propDef).to.be.eql({
          value: object1,
          type: Object1,
          binding: undefined,
          reflect: undefined,
          reactive: undefined,
          observe: undefined,
          init: undefined,
        });
        chai.expect(propDef.value).to.be.equal(object1);
        chai.expect(prop).to.be.eql({
          value: object1,
          type: Object1,
          binding: undefined,
          reflect: false,
          reactive: true,
          observe: false,
          init: undefined,
        });
        chai.expect(prop.value).to.be.equal(object1);
        chai.expect(propDef.value).to.equal(object1);
        chai.expect(prop.value).to.equal(object1);
        // initialize with an object property definition with custom Object1 type property
        propDef = new ProtoProperty({type: Object1});
        prop = new PropertyInstance(dummy, propDef);
        chai.expect(propDef).to.be.eql({
          value: undefined,
          type: Object1,
          binding: undefined,
          reflect: undefined,
          reactive: undefined,
          observe: undefined,
          init: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: new Object1(),
          // value: undefined,
          type: Object1,
          binding: undefined,
          reflect: false,
          reactive: true,
          observe: false,
          init: undefined,
        });
        // initialize with non-default property definition
        propDef = new ProtoProperty({
          reflect: true,
          reactive: false,
          observe: true,
          init: true,
        });
        prop = new PropertyInstance(dummy, propDef);
        chai.expect(propDef).to.be.eql(prop).to.be.eql({
          value: undefined,
          type: undefined,
          binding: undefined,
          reflect: true,
          reactive: false,
          observe: true,
          init: true,
        });
      });
      it('Should register property declarations from decorators.', () => {
        class TestClass extends IoNode {
          @Property('value1')
          declare prop1: string;
          @Property({value: 'value2', type: String})
          declare prop2: string;
        }
        Register(TestClass);
        const propertyDefs = PropertyDecorators.get(TestClass);
        chai.expect(propertyDefs).to.be.eql({
          prop1: 'value1',
          prop2: {value: 'value2', type: String}
        });
      });
      it('Should initialize properties with binding correctly', () => {
        let propDef, prop;
        let binding = new Binding(new TestIoNode({label: 'lorem'}), 'label');

        propDef = new ProtoProperty(binding);
        prop = new PropertyInstance(dummy, propDef);

        chai.expect(propDef).to.be.eql({
          value: 'lorem',
          type: String,
          binding: binding,
          reflect: undefined,
          reactive: undefined,
          observe: undefined,
          init: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: 'lorem',
          type: String,
          binding: binding,
          reflect: false,
          reactive: true,
          observe: false,
          init: undefined,
        });

        binding = new Binding(new TestIoNode({label: 'lorem'}), 'label');

        propDef = new ProtoProperty({binding: binding, value: 'ipsum'});
        prop = new PropertyInstance(dummy, propDef);

        chai.expect(propDef).to.be.eql({
          value: 'lorem',
          type: String,
          binding: binding,
          reflect: undefined,
          reactive: undefined,
          observe: undefined,
          init: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: 'lorem',
          type: String,
          binding: binding,
          reflect: false,
          reactive: true,
          observe: false,
          init: undefined,
        });
      });
      it('Should assign property definitions correctly', () => {
        const binding = new Binding(new TestIoNode({label: 'lorem'}), 'label');
        let propDef1 = new ProtoProperty({});
        let propDef2 = new ProtoProperty({
          value: 'lorem',
          type: String,
          binding: binding,
          reflect: true,
          reactive: false,
          observe: true,
          init: undefined,
        });
        propDef1.assign(propDef2);
        chai.expect(propDef1).to.be.eql(propDef2);

        propDef1 = new ProtoProperty({});
        propDef2 = new ProtoProperty({
          value: 'lorem',
          type: String,
          binding: binding,
          reflect: true,
          reactive: false,
          observe: true,
          init: true,
        });
        propDef2.assign(propDef1);
        chai.expect(propDef1).to.be.eql({
          value: undefined,
          type: undefined,
          binding: undefined,
          reflect: undefined,
          reactive: undefined,
          observe: undefined,
          init: undefined,
        });
        chai.expect(propDef2).to.be.eql({
          value: 'lorem',
          type: String,
          binding: binding,
          reflect: true,
          reactive: false,
          observe: true,
          init: true,
        });

        propDef1 = new ProtoProperty({
          reflect: true,
          reactive: true,
          observe: false,
          init: undefined,
        });
        propDef2 = new ProtoProperty({
          value: 'lorem',
          type: String,
          reflect: true
        });
        propDef2.assign(propDef1);
        chai.expect(propDef2).to.be.eql({
          value: 'lorem',
          binding: undefined,
          type: String,
          reflect: true,
          reactive: true,
          observe: false,
          init: undefined
        });
      });
    });
  }
}
