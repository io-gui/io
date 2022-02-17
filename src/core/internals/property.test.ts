import {Binding, PropertyDefinition, Property, IoNode, RegisterIoNode, PropertiesDeclaration} from '../../iogui.js';

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
      it('Should initialize correct values from weakly typed property definition', () => {
        let protoProp, prop;
        // initialize with empty object as property definition
        protoProp = new PropertyDefinition({});
        prop = new Property(protoProp);
        chai.expect(protoProp).to.be.eql(prop).to.be.eql({
          value: undefined,
          type: undefined,
          binding: undefined,
          reflect:0,
          notify:true,
          observe:false,
          readonly:false,
          strict:false,
          enumerable:true
        });
        // initialize with null property definition
        protoProp = new PropertyDefinition(null);
        prop = new Property(protoProp);
        chai.expect(protoProp).to.be.eql(prop).to.be.eql({
          value: null,
          type: undefined,
          binding: undefined,
          reflect:0,
          notify:true,
          observe:false,
          readonly:false,
          strict:false,
          enumerable:true
        });
        // initialize with undefined property definition
        protoProp = new PropertyDefinition(undefined);
        prop = new Property(protoProp);
        chai.expect(protoProp).to.be.eql(prop).to.be.eql({
          value: undefined,
          type: undefined,
          binding: undefined,
          reflect:0,
          notify:true,
          observe:false,
          readonly:false,
          strict:false,
          enumerable:true
        });
        // initialize with Number property definition
        protoProp = new PropertyDefinition(Number);
        prop = new Property(protoProp);
        chai.expect(prop).to.be.eql(protoProp).to.be.eql({
          value: 0,
          type: Number,
          binding: undefined,
          reflect:0,
          notify:true,
          observe:false,
          readonly:false,
          strict:false,
          enumerable:true
        });
        // initialize with type:Number property definition
        protoProp = new PropertyDefinition({type: Number});
        prop = new Property(protoProp);
        chai.expect(prop).to.be.eql(protoProp).to.be.eql({
          value: 0,
          type: Number,
          binding: undefined,
          reflect:0,
          notify:true,
          observe:false,
          readonly:false,
          strict:false,
          enumerable:true
        });
        // initialize with number property definition
        protoProp = new PropertyDefinition(1);
        prop = new Property(protoProp);
        chai.expect(prop).to.be.eql(protoProp).to.be.eql({
          value: 1,
          type: Number,
          binding: undefined,
          reflect:0,
          notify:true,
          observe:false,
          readonly:false,
          strict:false,
          enumerable:true
        });
        // initialize with value:number property definition
        protoProp = new PropertyDefinition({value: 2});
        prop = new Property(protoProp);
        chai.expect(prop).to.be.eql(protoProp).to.be.eql({
          value: 2,
          type: Number,
          binding: undefined,
          reflect:0,
          notify:true,
          observe:false,
          readonly:false,
          strict:false,
          enumerable:true
        });
        // initialize with String property definition
        protoProp = new PropertyDefinition(String);
        prop = new Property(protoProp);
        chai.expect(prop).to.be.eql(protoProp).to.be.eql({
          value: '',
          type: String,
          binding: undefined,
          reflect:0,
          notify:true,
          observe:false,
          readonly:false,
          strict:false,
          enumerable:true
        });
        // initialize with type:String property definition
        protoProp = new PropertyDefinition({type: String});
        prop = new Property(protoProp);
        chai.expect(prop).to.be.eql(protoProp).to.be.eql({
          value: '',
          type: String,
          binding: undefined,
          reflect:0,
          notify:true,
          observe:false,
          readonly:false,
          strict:false,
          enumerable:true
        });
        // initialize with string property definition
        protoProp = new PropertyDefinition('test');
        prop = new Property(protoProp);
        chai.expect(prop).to.be.eql(protoProp).to.be.eql({
          value: 'test',
          type: String,
          binding: undefined,
          reflect:0,
          notify:true,
          observe:false,
          readonly:false,
          strict:false,
          enumerable:true
        });
        // initialize with value:string property definition
        protoProp = new PropertyDefinition({value:'test'});
        prop = new Property(protoProp);
        chai.expect(prop).to.be.eql(protoProp).to.be.eql({
          value: 'test',
          type: String,
          binding: undefined,
          reflect:0,
          notify:true,
          observe:false,
          readonly:false,
          strict:false,
          enumerable:true
        });
        // initialize with Boolean property definition
        protoProp = new PropertyDefinition(Boolean);
        prop = new Property(protoProp);
        chai.expect(prop).to.be.eql(protoProp).to.be.eql({
          value: false,
          type: Boolean,
          binding: undefined,
          reflect:0,
          notify:true,
          observe:false,
          readonly:false,
          strict:false,
          enumerable:true
        });
        // initialize with type:Boolean property definition
        protoProp = new PropertyDefinition({type: Boolean});
        prop = new Property(protoProp);
        chai.expect(prop).to.be.eql(protoProp).to.be.eql({
          value: false,
          type: Boolean,
          binding: undefined,
          reflect:0,
          notify:true,
          observe:false,
          readonly:false,
          strict:false,
          enumerable:true
        });
        // initialize with boolean property definition
        protoProp = new PropertyDefinition(true);
        prop = new Property(protoProp);
        chai.expect(prop).to.be.eql(protoProp).to.be.eql({
          value: true,
          type: Boolean,
          binding: undefined,
          reflect:0,
          notify:true,
          observe:false,
          readonly:false,
          strict:false,
          enumerable:true
        });
        // initialize with value:boolean property definition
        protoProp = new PropertyDefinition({value: true});
        prop = new Property(protoProp);
        chai.expect(prop).to.be.eql(protoProp).to.be.eql({
          value: true,
          type: Boolean,
          binding: undefined,
          reflect:0,
          notify:true,
          observe:false,
          readonly:false,
          strict:false,
          enumerable:true
        });
        // initialize with Object property definition
        protoProp = new PropertyDefinition(Object);
        prop = new Property(protoProp);
        chai.expect(prop).to.be.eql(protoProp).to.be.eql({
          value: {},
          type: Object,
          binding: undefined,
          reflect:0,
          notify:true,
          observe:false,
          readonly:false,
          strict:false,
          enumerable:true
        });
        // initialize with type:Object property definition
        protoProp = new PropertyDefinition({type: Object});
        prop = new Property(protoProp);
        chai.expect(prop).to.be.eql(protoProp).to.be.eql({
          value: {},
          type: Object,
          binding: undefined,
          reflect:0,
          notify:true,
          observe:false,
          readonly:false,
          strict:false,
          enumerable:true
        });
        // // initialize with object property definition
        // // This should not initialize with object value
        const object = {prop: true};
        // protoProp = new PropertyDefinition(object as any);
        // prop = new Property(protoProp);
        // chai.expect(prop).to.be.eql(protoProp).to.be.eql({
        //   value: {prop: true},
        //   type: Object,
        //   binding: undefined,
        //   reflect:0,
        //   notify:true,
        //   observe:false,
        //   readonly:false,
        //   strict:false,
        //   enumerable:true
        // });
        // chai.expect(protoProp.value).to.equal(object);
        // chai.expect(prop.value).not.to.equal(object);
        // initialize with object:value property definition
        protoProp = new PropertyDefinition({value: object});
        prop = new Property(protoProp);
        chai.expect(prop).to.be.eql(protoProp).to.be.eql({
          value: {prop: true},
          type: Object,
          binding: undefined,
          reflect:0,
          notify:true,
          observe:false,
          readonly:false,
          strict:false,
          enumerable:true
        });
        chai.expect(protoProp.value).to.equal(object);
        chai.expect(prop.value).not.to.equal(object);
        // initialize with Array property definition
        protoProp = new PropertyDefinition(Array);
        prop = new Property(protoProp);
        chai.expect(prop).to.be.eql(protoProp).to.be.eql({
          value: [],
          type: Array,
          binding: undefined,
          reflect:0,
          notify:true,
          observe:false,
          readonly:false,
          strict:false,
          enumerable:true
        });
        // initialize with type:Array property definition
        protoProp = new PropertyDefinition({type: Array});
        prop = new Property(protoProp);
        chai.expect(prop).to.be.eql(protoProp).to.be.eql({
          value: [],
          type: Array,
          binding: undefined,
          reflect:0,
          notify:true,
          observe:false,
          readonly:false,
          strict:false,
          enumerable:true
        });
        // initialize with custom Object1 property definition
        protoProp = new PropertyDefinition(Object1);
        prop = new Property(protoProp);
        chai.expect(prop).to.be.eql(protoProp).to.be.eql({
          value: new Object1(),
          type: Object1,
          binding: undefined,
          reflect:0,
          notify:true,
          observe:false,
          readonly:false,
          strict:false,
          enumerable:true
        });
        // initialize with an object property definition with object value property
        const array = [1, 2, 3];
        protoProp = new PropertyDefinition({value: array});
        prop = new Property(protoProp);
        chai.expect(prop).to.be.eql(protoProp).to.be.eql({
          value: [1, 2, 3],
          type: Array,
          binding: undefined,
          reflect:0,
          notify:true,
          observe:false,
          readonly:false,
          strict:false,
          enumerable:true
        });
        chai.expect(protoProp.value).to.equal(array);
        chai.expect(prop.value).not.to.equal(array);
        // initialize with an object property definition with custom object1 value property
        const object1 = new Object1();
        protoProp = new PropertyDefinition({value: object1});
        prop = new Property(protoProp);
        chai.expect(prop).to.be.eql(protoProp).to.be.eql({
          value: new Object1(),
          type: Object1,
          binding: undefined,
          reflect:0,
          notify:true,
          observe:false,
          readonly:false,
          strict:false,
          enumerable:true
        });
        chai.expect(protoProp.value).to.equal(object1);
        chai.expect(prop.value).not.to.equal(object1);
        // initialize with an object property definition with custom Object1 type property
        protoProp = new PropertyDefinition({type: Object1});
        prop = new Property(protoProp);
        chai.expect(prop).to.be.eql(protoProp).to.be.eql({
          value: {prop: true},
          type: Object1,
          binding: undefined,
          reflect:0,
          notify:true,
          observe:false,
          readonly:false,
          strict:false,
          enumerable:true
        });
        // initialize with non-default property definition
        protoProp = new PropertyDefinition({
          reflect: -1,
          notify:false,
          observe:true,
          readonly:true,
          strict:true,
          enumerable:false
        });
        prop = new Property(protoProp);
        chai.expect(protoProp).to.be.eql(prop).to.be.eql({
          value: undefined,
          type: undefined,
          binding: undefined,
          reflect:-1,
          notify:false,
          observe:true,
          readonly:true,
          strict:true,
          enumerable:false
        });
      });
      // it('Should initialize correct values from property definition', () => {
      // });
      it('Should initialize binding properly', () => {
        let protoProp, prop;
        let binding = new Binding(new TestIoNode({label: 'lorem'}), 'label');

        protoProp = new PropertyDefinition(binding);
        prop = new Property(protoProp);

        chai.expect(protoProp.binding).to.be.equal(prop.binding).to.be.equal(binding);
        chai.expect(protoProp.value).to.be.equal('lorem');
        chai.expect(prop.value).to.be.equal('lorem');

        const node = new TestIoNode({label: 'lorem'});
        binding = new Binding(node, 'label');

        protoProp = new PropertyDefinition({binding: binding, value: 'ipsum'});
        prop = new Property(protoProp);
        chai.expect(protoProp.binding).to.be.equal(prop.binding).to.be.equal(binding);
        chai.expect(protoProp.value).to.be.equal('ipsum');
        chai.expect(prop.value).to.be.equal('lorem');
      });
    });
  }
}
