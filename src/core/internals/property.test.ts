import {Binding, PropertyDefinition, Property, IoNode, RegisterIoNode, PropertiesDeclaration, assignPropertyDefinition} from '../../iogui.js';

class Object1 {
  prop = true;
}

class TestIoNode extends IoNode {
  static get Properties(): PropertiesDeclaration {
    return {
      label: ''
    };
  }
}
RegisterIoNode(TestIoNode);

export default class {
  run() {
    describe('Property', () => {
      it('Should initialize correct property definitions and values from weakly typed property definitions', () => {
        let propDef, prop;
        // initialize with empty object as property definition
        propDef = new PropertyDefinition({});
        prop = new Property(propDef);
        chai.expect(propDef).to.be.eql(prop).to.be.eql({
          value: undefined,
          type: undefined,
          binding: undefined,
          reflect: 0,
          notify: true,
          observe: false,
        });
        // initialize with null property definition
        propDef = new PropertyDefinition(null);
        prop = new Property(propDef);
        chai.expect(propDef).to.be.eql(prop).to.be.eql({
          value: null,
          type: undefined,
          binding: undefined,
          reflect: 0,
          notify: true,
          observe: false,
        });
        // initialize with undefined property definition
        propDef = new PropertyDefinition(undefined);
        prop = new Property(propDef);
        chai.expect(propDef).to.be.eql(prop).to.be.eql({
          value: undefined,
          type: undefined,
          binding: undefined,
          reflect: 0,
          notify: true,
          observe: false,
        });
        // initialize with Number property definition
        propDef = new PropertyDefinition(Number);
        prop = new Property(propDef);
        chai.expect(prop).to.be.eql(propDef).to.be.eql({
          value: 0,
          type: Number,
          binding: undefined,
          reflect: 0,
          notify: true,
          observe: false,
        });
        // initialize with type: Number property definition
        propDef = new PropertyDefinition({type: Number});
        prop = new Property(propDef);
        chai.expect(prop).to.be.eql(propDef).to.be.eql({
          value: 0,
          type: Number,
          binding: undefined,
          reflect: 0,
          notify: true,
          observe: false,
        });
        // initialize with number property definition
        propDef = new PropertyDefinition(1);
        prop = new Property(propDef);
        chai.expect(prop).to.be.eql(propDef).to.be.eql({
          value: 1,
          type: Number,
          binding: undefined,
          reflect: 0,
          notify: true,
          observe: false,
        });
        // initialize with value: number property definition
        propDef = new PropertyDefinition({value: 2});
        prop = new Property(propDef);
        chai.expect(prop).to.be.eql(propDef).to.be.eql({
          value: 2,
          type: Number,
          binding: undefined,
          reflect: 0,
          notify: true,
          observe: false,
        });
        // initialize with String property definition
        propDef = new PropertyDefinition(String);
        prop = new Property(propDef);
        chai.expect(prop).to.be.eql(propDef).to.be.eql({
          value: '',
          type: String,
          binding: undefined,
          reflect: 0,
          notify: true,
          observe: false,
        });
        // initialize with type: String property definition
        propDef = new PropertyDefinition({type: String});
        prop = new Property(propDef);
        chai.expect(prop).to.be.eql(propDef).to.be.eql({
          value: '',
          type: String,
          binding: undefined,
          reflect: 0,
          notify: true,
          observe: false,
        });
        // initialize with string property definition
        propDef = new PropertyDefinition('test');
        prop = new Property(propDef);
        chai.expect(prop).to.be.eql(propDef).to.be.eql({
          value: 'test',
          type: String,
          binding: undefined,
          reflect: 0,
          notify: true,
          observe: false,
        });
        // initialize with value: string property definition
        propDef = new PropertyDefinition({value: 'test'});
        prop = new Property(propDef);
        chai.expect(prop).to.be.eql(propDef).to.be.eql({
          value: 'test',
          type: String,
          binding: undefined,
          reflect: 0,
          notify: true,
          observe: false,
        });
        // initialize with Boolean property definition
        propDef = new PropertyDefinition(Boolean);
        prop = new Property(propDef);
        chai.expect(prop).to.be.eql(propDef).to.be.eql({
          value: false,
          type: Boolean,
          binding: undefined,
          reflect: 0,
          notify: true,
          observe: false,
        });
        // initialize with type: Boolean property definition
        propDef = new PropertyDefinition({type: Boolean});
        prop = new Property(propDef);
        chai.expect(prop).to.be.eql(propDef).to.be.eql({
          value: false,
          type: Boolean,
          binding: undefined,
          reflect: 0,
          notify: true,
          observe: false,
        });
        // initialize with boolean property definition
        propDef = new PropertyDefinition(true);
        prop = new Property(propDef);
        chai.expect(prop).to.be.eql(propDef).to.be.eql({
          value: true,
          type: Boolean,
          binding: undefined,
          reflect: 0,
          notify: true,
          observe: false,
        });
        // initialize with value: boolean property definition
        propDef = new PropertyDefinition({value: true});
        prop = new Property(propDef);
        chai.expect(prop).to.be.eql(propDef).to.be.eql({
          value: true,
          type: Boolean,
          binding: undefined,
          reflect: 0,
          notify: true,
          observe: false,
        });
        // initialize with Object property definition
        propDef = new PropertyDefinition(Object);
        prop = new Property(propDef);
        chai.expect(prop).to.be.eql(propDef).to.be.eql({
          value: {},
          type: Object,
          binding: undefined,
          reflect: 0,
          notify: true,
          observe: false,
        });
        // initialize with type: Object property definition
        propDef = new PropertyDefinition({type: Object});
        prop = new Property(propDef);
        chai.expect(prop).to.be.eql(propDef).to.be.eql({
          value: {},
          type: Object,
          binding: undefined,
          reflect: 0,
          notify: true,
          observe: false,
        });
        const object = {prop: true};
        // initialize with object: value property definition
        propDef = new PropertyDefinition({value: object});
        prop = new Property(propDef);
        chai.expect(prop).to.be.eql(propDef).to.be.eql({
          value: {prop: true},
          type: Object,
          binding: undefined,
          reflect: 0,
          notify: true,
          observe: false,
        });
        chai.expect(propDef.value).to.equal(object);
        chai.expect(prop.value).not.to.equal(object);
        // initialize with Array property definition
        propDef = new PropertyDefinition(Array);
        prop = new Property(propDef);
        chai.expect(prop).to.be.eql(propDef).to.be.eql({
          value: [],
          type: Array,
          binding: undefined,
          reflect: 0,
          notify: true,
          observe: false,
        });
        // initialize with type: Array property definition
        propDef = new PropertyDefinition({type: Array});
        prop = new Property(propDef);
        chai.expect(prop).to.be.eql(propDef).to.be.eql({
          value: [],
          type: Array,
          binding: undefined,
          reflect: 0,
          notify: true,
          observe: false,
        });
        // initialize with custom Object1 property definition
        propDef = new PropertyDefinition(Object1);
        prop = new Property(propDef);
        chai.expect(prop).to.be.eql(propDef).to.be.eql({
          value: new Object1(),
          type: Object1,
          binding: undefined,
          reflect: 0,
          notify: true,
          observe: false,
        });
        // initialize with an object property definition with object value property
        const array = [1, 2, 3];
        propDef = new PropertyDefinition({value: array});
        prop = new Property(propDef);
        chai.expect(prop).to.be.eql(propDef).to.be.eql({
          value: [1, 2, 3],
          type: Array,
          binding: undefined,
          reflect: 0,
          notify: true,
          observe: false,
        });
        chai.expect(propDef.value).to.equal(array);
        chai.expect(prop.value).not.to.equal(array);
        // initialize with an object property definition with custom object1 value property
        const object1 = new Object1();
        propDef = new PropertyDefinition({value: object1});
        prop = new Property(propDef);
        chai.expect(prop).to.be.eql(propDef).to.be.eql({
          value: new Object1(),
          type: Object1,
          binding: undefined,
          reflect: 0,
          notify: true,
          observe: false,
        });
        chai.expect(propDef.value).to.equal(object1);
        chai.expect(prop.value).not.to.equal(object1);
        // initialize with an object property definition with custom Object1 type property
        propDef = new PropertyDefinition({type: Object1});
        prop = new Property(propDef);
        chai.expect(prop).to.be.eql(propDef).to.be.eql({
          value: {prop: true},
          type: Object1,
          binding: undefined,
          reflect: 0,
          notify: true,
          observe: false,
        });
        // initialize with non-default property definition
        propDef = new PropertyDefinition({
          reflect: -1,
          notify: false,
          observe: true,
        });
        prop = new Property(propDef);
        chai.expect(propDef).to.be.eql(prop).to.be.eql({
          value: undefined,
          type: undefined,
          binding: undefined,
          reflect: -1,
          notify: false,
          observe: true,
        });
      });
      it('Should initialize properties with binding correctly', () => {
        let propDef, prop;
        let binding = new Binding(new TestIoNode({label: 'lorem'}), 'label');

        propDef = new PropertyDefinition(binding);
        prop = new Property(propDef);

        chai.expect(propDef).to.be.eql(prop).to.be.eql({
          value: 'lorem',
          type: String,
          binding: binding,
          reflect: 0,
          notify: true,
          observe: false,
        });

        binding = new Binding(new TestIoNode({label: 'lorem'}), 'label');

        propDef = new PropertyDefinition({binding: binding, value: 'ipsum'});
        prop = new Property(propDef);

        chai.expect(propDef).to.be.eql(prop).to.be.eql({
          value: 'lorem',
          type: String,
          binding: binding,
          reflect: 0,
          notify: true,
          observe: false,
        });
      });
      it('Should assign property definitions correctly', () => {
        const binding = new Binding(new TestIoNode({label: 'lorem'}), 'label');
        let propDef1 = new PropertyDefinition({});
        let propDef2 = new PropertyDefinition({
          value: 'lorem',
          type: String,
          binding: binding,
          reflect: 2,
          notify: false,
          observe: true,
        });
        assignPropertyDefinition(propDef1, propDef2);
        chai.expect(propDef1).to.be.eql(propDef2);

        propDef1 = new PropertyDefinition({});
        propDef2 = new PropertyDefinition({
          value: 'lorem',
          type: String,
          binding: binding,
          reflect: 2,
          notify: false,
          observe: true,
        });
        assignPropertyDefinition(propDef2, propDef1);
        chai.expect(propDef1).to.be.eql({
          value: undefined,
          type: undefined,
          binding: undefined,
          reflect: 0,
          notify: true,
          observe: false,
        });
        chai.expect(propDef2).to.be.eql({
          value: 'lorem',
          type: String,
          binding: binding,
          reflect: 2,
          notify: false,
          observe: true,
        });
      });
    });
  }
}
