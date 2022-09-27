import {Binding, ProtoProperty, PropertyInstance, IoProperty, IoNode, RegisterIoNode, PropertyDeclarations, PropertyDecorators} from '../../iogui.js';

class Object1 {
  prop = true;
}

@RegisterIoNode
class TestIoNode extends IoNode {
  static get Properties(): PropertyDeclarations {
    return {
      label: ''
    };
  }
}

export default class {
  run() {
    describe('Property', () => {
      it('Should initialize correct property definitions and values from weakly typed property definitions', () => {
        let propDef, prop;
        // initialize with empty object as property definition
        propDef = new ProtoProperty({});
        prop = new PropertyInstance(propDef);

        chai.expect(propDef).to.be.eql({
          value: undefined,
          type: undefined,
          binding: undefined,
          reflect: undefined,
          notify: undefined,
          observe: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: undefined,
          type: undefined,
          binding: undefined,
          reflect: 'none',
          notify: true,
          observe: false,
        });
        // initialize with null property definition
        propDef = new ProtoProperty(null);
        prop = new PropertyInstance(propDef);
        chai.expect(propDef).to.be.eql({
          value: null,
          type: undefined,
          binding: undefined,
          reflect: undefined,
          notify: undefined,
          observe: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: null,
          type: undefined,
          binding: undefined,
          reflect: 'none',
          notify: true,
          observe: false,
        });
        // initialize with undefined property definition
        propDef = new ProtoProperty(undefined);
        prop = new PropertyInstance(propDef);
        chai.expect(propDef).to.be.eql({
          value: undefined,
          type: undefined,
          binding: undefined,
          reflect: undefined,
          notify: undefined,
          observe: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: undefined,
          type: undefined,
          binding: undefined,
          reflect: 'none',
          notify: true,
          observe: false,
        });
        // initialize with Number property definition
        propDef = new ProtoProperty(Number);
        prop = new PropertyInstance(propDef);
        chai.expect(propDef).to.be.eql({
          value: undefined,
          type: Number,
          binding: undefined,
          reflect: undefined,
          notify: undefined,
          observe: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: 0,
          type: Number,
          binding: undefined,
          reflect: 'none',
          notify: true,
          observe: false,
        });
        // initialize with type: Number property definition
        propDef = new ProtoProperty({type: Number});
        prop = new PropertyInstance(propDef);
        chai.expect(propDef).to.be.eql({
          value: undefined,
          type: Number,
          binding: undefined,
          reflect: undefined,
          notify: undefined,
          observe: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: 0,
          type: Number,
          binding: undefined,
          reflect: 'none',
          notify: true,
          observe: false,
        });
        // initialize with number property definition
        propDef = new ProtoProperty(1);
        prop = new PropertyInstance(propDef);
        chai.expect(propDef).to.be.eql({
          value: 1,
          type: Number,
          binding: undefined,
          reflect: undefined,
          notify: undefined,
          observe: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: 1,
          type: Number,
          binding: undefined,
          reflect: 'none',
          notify: true,
          observe: false,
        });
        // initialize with value: number property definition
        propDef = new ProtoProperty({value: 2});
        prop = new PropertyInstance(propDef);
        chai.expect(propDef).to.be.eql({
          value: 2,
          type: Number,
          binding: undefined,
          reflect: undefined,
          notify: undefined,
          observe: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: 2,
          type: Number,
          binding: undefined,
          reflect: 'none',
          notify: true,
          observe: false,
        });
        // initialize with String property definition
        propDef = new ProtoProperty(String);
        prop = new PropertyInstance(propDef);
        chai.expect(propDef).to.be.eql({
          value: undefined,
          type: String,
          binding: undefined,
          reflect: undefined,
          notify: undefined,
          observe: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: '',
          type: String,
          binding: undefined,
          reflect: 'none',
          notify: true,
          observe: false,
        });
        // initialize with type: String property definition
        propDef = new ProtoProperty({type: String});
        prop = new PropertyInstance(propDef);
        chai.expect(propDef).to.be.eql({
          value: undefined,
          type: String,
          binding: undefined,
          reflect: undefined,
          notify: undefined,
          observe: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: '',
          type: String,
          binding: undefined,
          reflect: 'none',
          notify: true,
          observe: false,
        });
        // initialize with string property definition
        propDef = new ProtoProperty('test');
        prop = new PropertyInstance(propDef);
        chai.expect(propDef).to.be.eql({
          value: 'test',
          type: String,
          binding: undefined,
          reflect: undefined,
          notify: undefined,
          observe: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: 'test',
          type: String,
          binding: undefined,
          reflect: 'none',
          notify: true,
          observe: false,
        });
        // initialize with value: string property definition
        propDef = new ProtoProperty({value: 'test'});
        prop = new PropertyInstance(propDef);
        chai.expect(propDef).to.be.eql({
          value: 'test',
          type: String,
          binding: undefined,
          reflect: undefined,
          notify: undefined,
          observe: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: 'test',
          type: String,
          binding: undefined,
          reflect: 'none',
          notify: true,
          observe: false,
        });
        // initialize with Boolean property definition
        propDef = new ProtoProperty(Boolean);
        prop = new PropertyInstance(propDef);
        chai.expect(propDef).to.be.eql({
          value: undefined,
          type: Boolean,
          binding: undefined,
          reflect: undefined,
          notify: undefined,
          observe: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: false,
          type: Boolean,
          binding: undefined,
          reflect: 'none',
          notify: true,
          observe: false,
        });
        // initialize with type: Boolean property definition
        propDef = new ProtoProperty({type: Boolean});
        prop = new PropertyInstance(propDef);
        chai.expect(propDef).to.be.eql({
          value: undefined,
          type: Boolean,
          binding: undefined,
          reflect: undefined,
          notify: undefined,
          observe: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: false,
          type: Boolean,
          binding: undefined,
          reflect: 'none',
          notify: true,
          observe: false,
        });
        // initialize with boolean property definition
        propDef = new ProtoProperty(true);
        prop = new PropertyInstance(propDef);
        chai.expect(propDef).to.be.eql({
          value: true,
          type: Boolean,
          binding: undefined,
          reflect: undefined,
          notify: undefined,
          observe: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: true,
          type: Boolean,
          binding: undefined,
          reflect: 'none',
          notify: true,
          observe: false,
        });
        // initialize with value: boolean property definition
        propDef = new ProtoProperty({value: true});
        prop = new PropertyInstance(propDef);
        chai.expect(propDef).to.be.eql({
          value: true,
          type: Boolean,
          binding: undefined,
          reflect: undefined,
          notify: undefined,
          observe: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: true,
          type: Boolean,
          binding: undefined,
          reflect: 'none',
          notify: true,
          observe: false,
        });
        // initialize with Object property definition
        propDef = new ProtoProperty(Object);
        prop = new PropertyInstance(propDef);
        chai.expect(propDef).to.be.eql({
          value: undefined,
          type: Object,
          binding: undefined,
          reflect: undefined,
          notify: undefined,
          observe: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: {},
          type: Object,
          binding: undefined,
          reflect: 'none',
          notify: true,
          observe: false,
        });
        // initialize with type: Object property definition
        propDef = new ProtoProperty({type: Object});
        prop = new PropertyInstance(propDef);
        chai.expect(propDef).to.be.eql({
          value: undefined,
          type: Object,
          binding: undefined,
          reflect: undefined,
          notify: undefined,
          observe: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: {},
          type: Object,
          binding: undefined,
          reflect: 'none',
          notify: true,
          observe: false,
        });
        const object = {prop: true};
        // initialize with object: value property definition
        propDef = new ProtoProperty({value: object});
        prop = new PropertyInstance(propDef);
        chai.expect(propDef).to.be.eql({
          value: {prop: true},
          type: Object,
          binding: undefined,
          reflect: undefined,
          notify: undefined,
          observe: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: {prop: true},
          type: Object,
          binding: undefined,
          reflect: 'none',
          notify: true,
          observe: false,
        });
        chai.expect(propDef.value).to.equal(object);
        chai.expect(prop.value).to.equal(object);
        // initialize with Array property definition
        propDef = new ProtoProperty(Array);
        prop = new PropertyInstance(propDef);
        chai.expect(propDef).to.be.eql({
          value: undefined,
          type: Array,
          binding: undefined,
          reflect: undefined,
          notify: undefined,
          observe: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: [],
          type: Array,
          binding: undefined,
          reflect: 'none',
          notify: true,
          observe: false,
        });
        // initialize with type: Array property definition
        propDef = new ProtoProperty({type: Array});
        prop = new PropertyInstance(propDef);
        chai.expect(propDef).to.be.eql({
          value: undefined,
          type: Array,
          binding: undefined,
          reflect: undefined,
          notify: undefined,
          observe: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: [],
          type: Array,
          binding: undefined,
          reflect: 'none',
          notify: true,
          observe: false,
        });
        // initialize with an object property definition with object value property
        const array = [1, 2, 3];
        propDef = new ProtoProperty({value: array});
        prop = new PropertyInstance(propDef);
        chai.expect(propDef).to.be.eql({
          value: [1, 2, 3],
          type: Array,
          binding: undefined,
          reflect: undefined,
          notify: undefined,
          observe: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: [1, 2, 3],
          type: Array,
          binding: undefined,
          reflect: 'none',
          notify: true,
          observe: false,
        });
        chai.expect(propDef.value).to.equal(array);
        chai.expect(prop.value).to.equal(array);
        // initialize with custom Object1 property definition
        propDef = new ProtoProperty(Object1);
        prop = new PropertyInstance(propDef);
        chai.expect(propDef).to.be.eql({
          value: undefined,
          type: Object1,
          binding: undefined,
          reflect: undefined,
          notify: undefined,
          observe: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: new Object1(),
          type: Object1,
          binding: undefined,
          reflect: 'none',
          notify: true,
          observe: false,
        });
        // initialize with an object property definition with custom object1 value property
        const object1 = new Object1();
        propDef = new ProtoProperty({value: object1});
        prop = new PropertyInstance(propDef);
        chai.expect(propDef).to.be.eql({
          value: object1,
          type: Object1,
          binding: undefined,
          reflect: undefined,
          notify: undefined,
          observe: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: new Object1(),
          type: Object1,
          binding: undefined,
          reflect: 'none',
          notify: true,
          observe: false,
        });
        chai.expect(propDef.value).to.equal(object1);
        chai.expect(prop.value).to.equal(object1);
        // initialize with an object property definition with custom Object1 type property
        propDef = new ProtoProperty({type: Object1});
        prop = new PropertyInstance(propDef);
        chai.expect(propDef).to.be.eql({
          value: undefined,
          type: Object1,
          binding: undefined,
          reflect: undefined,
          notify: undefined,
          observe: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: new Object1(),
          type: Object1,
          binding: undefined,
          reflect: 'none',
          notify: true,
          observe: false,
        });
        // initialize with non-default property definition
        propDef = new ProtoProperty({
          reflect: 'attr',
          notify: false,
          observe: true,
        });
        prop = new PropertyInstance(propDef);
        chai.expect(propDef).to.be.eql(prop).to.be.eql({
          value: undefined,
          type: undefined,
          binding: undefined,
          reflect: 'attr',
          notify: false,
          observe: true,
        });
      });
      it('Should register property declarations from decorators.', () => {
        class TestClass extends IoNode {
          @IoProperty('value1')
          declare prop1: string;
          @IoProperty({value: 'value2', type: String})
          declare prop2: string;
        }
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
        prop = new PropertyInstance(propDef);

        chai.expect(propDef).to.be.eql({
          value: 'lorem',
          type: String,
          binding: binding,
          reflect: undefined,
          notify: undefined,
          observe: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: 'lorem',
          type: String,
          binding: binding,
          reflect: 'none',
          notify: true,
          observe: false,
        });

        binding = new Binding(new TestIoNode({label: 'lorem'}), 'label');

        propDef = new ProtoProperty({binding: binding, value: 'ipsum'});
        prop = new PropertyInstance(propDef);

        chai.expect(propDef).to.be.eql({
          value: 'lorem',
          type: String,
          binding: binding,
          reflect: undefined,
          notify: undefined,
          observe: undefined,
        });
        chai.expect(prop).to.be.eql({
          value: 'lorem',
          type: String,
          binding: binding,
          reflect: 'none',
          notify: true,
          observe: false,
        });
      });
      it('Should assign property definitions correctly', () => {
        const binding = new Binding(new TestIoNode({label: 'lorem'}), 'label');
        let propDef1 = new ProtoProperty({});
        let propDef2 = new ProtoProperty({
          value: 'lorem',
          type: String,
          binding: binding,
          reflect: 'both',
          notify: false,
          observe: true,
        });
        propDef1.assign(propDef2);
        chai.expect(propDef1).to.be.eql(propDef2);

        propDef1 = new ProtoProperty({});
        propDef2 = new ProtoProperty({
          value: 'lorem',
          type: String,
          binding: binding,
          reflect: 'both',
          notify: false,
          observe: true,
        });
        propDef2.assign(propDef1);
        chai.expect(propDef1).to.be.eql({
          value: undefined,
          type: undefined,
          binding: undefined,
          reflect: undefined,
          notify: undefined,
          observe: undefined,
        });
        chai.expect(propDef2).to.be.eql({
          value: 'lorem',
          type: String,
          binding: binding,
          reflect: 'both',
          notify: false,
          observe: true,
        });

        propDef1 = new ProtoProperty({
          reflect: 'both',
          notify: true,
          observe: false,
        });
        propDef2 = new ProtoProperty({
          value: 'lorem',
          type: String,
          reflect: 'prop'
        });
        propDef2.assign(propDef1);
        chai.expect(propDef2).to.be.eql({
          value: 'lorem',
          binding: undefined,
          type: String,
          reflect: 'both',
          notify: true,
          observe: false
        });
      });
    });
  }
}
